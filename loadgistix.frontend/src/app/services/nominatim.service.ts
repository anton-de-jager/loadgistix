import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, retry, delay } from 'rxjs/operators';

export interface NominatimResult {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    address?: {
        house_number?: string;
        road?: string;
        suburb?: string;
        city?: string;
        town?: string;
        county?: string;
        state?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class NominatimService {
    private readonly baseUrl = 'https://nominatim.openstreetmap.org';
    private requestCount = 0;
    private lastRequestTime = 0;
    private readonly minRequestInterval = 1000; // 1 second between requests (Nominatim policy)
    
    constructor(private http: HttpClient) {}

    /**
     * Throttle requests to respect Nominatim usage policy
     */
    private async throttleRequest(): Promise<void> {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.minRequestInterval) {
            const waitTime = this.minRequestInterval - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        this.lastRequestTime = Date.now();
        this.requestCount++;
    }

    /**
     * Search for addresses using Nominatim
     * @param query Search query
     * @param countryCode Optional country code (e.g., 'za' for South Africa)
     * @param limit Maximum number of results (default: 5)
     */
    search(query: string, countryCode: string = 'za', limit: number = 5): Observable<NominatimResult[]> {
        if (!query || query.length < 3) {
            return of([]);
        }

        // Throttle the request
        return new Observable(observer => {
            this.throttleRequest().then(() => {
                const params = {
                    format: 'json',
                    q: query,
                    countrycodes: countryCode,
                    limit: limit.toString(),
                    addressdetails: '1',
                    'accept-language': 'en'
                };

                const headers = new HttpHeaders({
                    'Accept': 'application/json'
                });

                this.http.get<NominatimResult[]>(`${this.baseUrl}/search`, { 
                    params,
                    headers
                }).pipe(
                    retry({
                        count: 2,
                        delay: 1000
                    }),
                    catchError(error => {
                        console.error('Nominatim search error:', error);
                        
                        // Provide user-friendly error message
                        if (error.status === 0) {
                            console.warn('⚠️ Unable to connect to address lookup service. Please check your internet connection or try again later.');
                        } else if (error.status === 429) {
                            console.warn('⚠️ Too many address lookup requests. Please wait a moment and try again.');
                        }
                        
                        return of([]);
                    })
                ).subscribe({
                    next: (results) => {
                        observer.next(results);
                        observer.complete();
                    },
                    error: (err) => {
                        observer.error(err);
                    }
                });
            });
        });
    }

    /**
     * Reverse geocode coordinates to address
     * @param lat Latitude
     * @param lon Longitude
     */
    reverse(lat: number, lon: number): Observable<NominatimResult | null> {
        const params = {
            format: 'json',
            lat: lat.toString(),
            lon: lon.toString(),
            addressdetails: '1',
            'accept-language': 'en'
        };

        return this.http.get<NominatimResult>(`${this.baseUrl}/reverse`, { 
            params
        }).pipe(
            catchError(error => {
                console.error('Nominatim reverse geocode error:', error);
                return of(null);
            })
        );
    }

    /**
     * Create a debounced search observable for autocomplete
     * @param searchTerms Subject that emits search queries
     * @param countryCode Optional country code
     */
    createAutocompleteObservable(searchTerms: Subject<string>, countryCode: string = 'za'): Observable<NominatimResult[]> {
        return searchTerms.pipe(
            debounceTime(500), // Wait 500ms after user stops typing (increased for rate limiting)
            distinctUntilChanged(), // Only if the search term changed
            switchMap(term => this.search(term, countryCode))
        );
    }

    /**
     * Format a Nominatim result into a user-friendly address string
     * This includes the house number if available, which is often missing from display_name
     * @param result Nominatim search result
     * @returns Formatted address string
     */
    formatAddress(result: NominatimResult): string {
        if (!result.address) {
            return result.display_name;
        }

        const addr = result.address;
        const parts: string[] = [];

        // Add house number and road
        if (addr.house_number && addr.road) {
            parts.push(`${addr.house_number} ${addr.road}`);
        } else if (addr.road) {
            parts.push(addr.road);
        }

        // Add suburb/neighborhood
        if (addr.suburb) {
            parts.push(addr.suburb);
        }

        // Add city or town
        if (addr.city) {
            parts.push(addr.city);
        } else if (addr.town) {
            parts.push(addr.town);
        }

        // Add postcode
        if (addr.postcode) {
            parts.push(addr.postcode);
        }

        // If we have parts, join them; otherwise fall back to display_name
        return parts.length > 0 ? parts.join(', ') : result.display_name;
    }
}
