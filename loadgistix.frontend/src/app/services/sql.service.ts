/* eslint-disable max-len */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, defer, firstValueFrom, from, of, switchMap, map } from 'rxjs';
import { environment } from 'environments/environment';
import { Guid } from 'guid-typescript';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { GuidHelper } from './guid.helper';

@Injectable({
    providedIn: 'root',
})
export class SqlService {
    baseUrl = environment.apiDotNet;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private http: HttpClient
    ) { }

    /**
     * Normalizes all GUID fields in the API response to uppercase
     * @param response The API response object
     * @returns The response with normalized GUIDs
     */
    private normalizeApiResponse(response: any): any {
        if (!response) return response;
        
        // Normalize the entire response object
        const normalized = { ...response };
        
        // If response has a data property, normalize it
        if (normalized.data) {
            if (Array.isArray(normalized.data)) {
                normalized.data = GuidHelper.normalizeArray(normalized.data);
            } else {
                normalized.data = GuidHelper.normalizeObject(normalized.data);
            }
        }
        
        // Normalize any id fields at the root level
        if (normalized.id && typeof normalized.id === 'string') {
            normalized.id = normalized.id.toUpperCase();
        }
        
        return normalized;
    }

    getItems(table: string): Observable<any> {
        try {
            return this.http.get(`${this.baseUrl}${table}`).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getItemsTag(user: User, table: string, tag: string, item: any): Observable<any> {
        if (user || (table == 'directories' && tag == 'distance') || (table == 'adverts' && tag == 'available')) {
            return this.http.post(`${this.baseUrl}` + table + '/' + tag, item).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } else {
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getItemsTagSingle(table: string, tag: string, item: string): Observable<any> {
        try {
            return this.http.post(`${this.baseUrl}` + table + '/' + tag + '/' + item, item).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getItemsTags(table: string, tag1: string, id: Guid): Observable<any> {
        try {
            return this.http.post(
                `${this.baseUrl}` + table + '/' + tag1 + '/' + id,
                { directoryCategoryId: tag1, startIndex: id }
            ).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }
    getItemsTags2(table: string, tag1: string, id: Guid): Observable<any> {
        try {
            return this.http.post(`${this.baseUrl}` + table, {
                directoryCategoryId: tag1,
                startIndex: id,
            }).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getItemsTagId(table: string, tag: string, id: Guid): Observable<any> {
        try {
            return this.http.get(
                `${this.baseUrl}` + table + '/' + tag + '/' + id.toString()
            ).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getItem(table: string, id: Guid): Observable<any> {
        try {
            return this.http.get(`${this.baseUrl}` + table + '/' + id).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    createItem(table: string, data: any): Observable<any> {
        //if (table == 'dashboards') {
        return this.http.post(`${this.baseUrl}` + table, data).pipe(
            map(response => this.normalizeApiResponse(response))
        );
        // } else {
        //     const result = { data: [] };
        //     const observableResult: Observable<any> = of(result);
        //     return observableResult;
        // }
    }

    updateItem(table: string, data: any): Observable<any> {
        try {
            return this.http.put(`${this.baseUrl}` + table, data).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    createLoad(table: string, data: any): Observable<any> {
        try {
            return this.http.post(`${this.baseUrl}` + table, data).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    updateLoad(table: string, data: any): Observable<any> {
        try {
            return this.http.put(`${this.baseUrl}` + table, data).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    updateItemTag(table: string, tag: string, data: any): Observable<any> {
        try {
            return this.http.put(`${this.baseUrl}` + table + '/' + tag, data).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    updateItemTagPost(table: string, tag: string, data: any): Observable<any> {
        try {
            return this.http.post(`${this.baseUrl}` + table + '/' + tag, data).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    updateItemTagIdPost(
        table: string,
        tag: string,
        data: any
    ): Observable<any> {
        try {
            return this.http.post(
                `${this.baseUrl}` + table + '/' + tag + '/' + data.id,
                data
            ).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getDirectories(categoryId: Guid, startIndex: number) {
        try {
            return this.http.post(
                environment.apiDotNet +
                'directories/category/' +
                categoryId +
                '/' +
                startIndex,
                {
                    directoryCategoryId: categoryId,
                    startIndex: startIndex,
                }
            ).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }
    getDirectoriesByDistance(lat: number, lon: number, distance: number) {
        try {
            return this.http.post(
                environment.apiDotNet +
                'directories/distance',
                {
                    lat: lat,
                    lon: lon,
                    distance: distance
                }
            ).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }
    deleteItem(table: string, id: Guid): Observable<any> {
        try {
            return this.http.post(
                `${this.baseUrl}` + table + '/delete/' + id,
                id
            ).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }
   /*
    upload(model: string, formData: any, filename: string) {
        try {
            return this.http.post(
                environment.api + 'uploadImage/' + model + '/' + filename, formData);
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }
    */
    delete(model: string, filename: string) {
        try {
            return this.http.post(
                environment.apiDotNet + 'deleteImage/' + model + '/' + filename, null).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }
    /*
    uploadPdp(model: string, formData: any, filename: string) {
        try {
            return this.http.post(
                environment.api + 'uploadImage/' + model + '/' + filename, formData);
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }
    */
    upload(model: string, formData: any, filename: string) {
        try {
            // Construct the upload URL: e.g., https://localhost:44368/api/vehicles/uploadImage/{id}
            const uploadUrl = environment.apiImage.replace('/Images/', '/api/') + model + '/uploadImage/' + filename;
            return this.http.post(
                uploadUrl,
                formData,
                {
                    reportProgress: true,
                    observe: 'events',
                }
            );
        } catch (error) {
            console.error('Upload error:', error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    uploadPdp(model: string, formData: any, filename: string) {
        try {
            return this.http.post(
                environment.apiImage.replace('/Images', '/api') + model + '/uploadImagePdp/' + filename,
                formData,
                {
                    reportProgress: true,
                    observe: 'events',
                }
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    deleteUserData(currentUser: User): Observable<any> {
        try {
            return this.http.post(
                `${this.baseUrl}` + 'users' + '/delete-data/' + currentUser.id,
                currentUser.id
            ).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    deleteUser(currentUser: User): Observable<any> {
        try {
            return this.http.post(
                `${this.baseUrl}` + 'users' + '/deleteUser',
                currentUser.id
            ).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    sendQuoteRequest(id: string): Observable<any> {
        try {
            return this.http.get(
                `${environment.apiDotNet}` + 'quotes' + '/SendQuoteRequest/' + id
            ).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    sendContactRequest(quoteId: string): Observable<any> {
        try {
            return this.http.get(
                `${environment.apiDotNet}quotes/SendContactRequest/${quoteId}`
            ).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { result: false };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getItemsByField(table: string, field: string, value: string): Observable<any> {
        try {
            return this.http.get(
                `${environment.apiDotNet}${table}?${field}=${value}`
            ).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }

    getItemsByQuote(table: string, quoteId: string): Observable<any> {
        try {
            return this.http.get(
                `${environment.apiDotNet}${table}/byQuote/${quoteId}`
            ).pipe(
                map(response => this.normalizeApiResponse(response))
            );
        } catch (error) {
            console.error(error);
            const result = { data: [] };
            const observableResult: Observable<any> = of(result);
            return observableResult;
        }
    }
}
