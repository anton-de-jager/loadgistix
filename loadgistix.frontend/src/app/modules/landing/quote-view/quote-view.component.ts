import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SqlService } from 'app/services/sql.service';
import { Guid } from 'guid-typescript';

@Component({
    selector: 'quote-view',
    templateUrl: './quote-view.component.html',
    styleUrls: ['./quote-view.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        DecimalPipe
    ]
})
export class QuoteViewComponent implements OnInit {
    loading = true;
    quote: any = null;
    trucks: any[] = [];
    trailers: any[] = [];
    error: string | null = null;
    contactSending = false;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sqlService: SqlService,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadQuote(id);
        } else {
            this.error = 'No quote ID provided';
            this.loading = false;
        }
    }

    loadQuote(id: string): void {
        this.sqlService.getItem('quotes', Guid.parse(id)).subscribe({
            next: (result: any) => {
                if (result.result && result.data) {
                    this.quote = result.data;
                    this.loadVehicles(id);
                } else {
                    this.error = 'Quote not found';
                    this.loading = false;
                }
            },
            error: (err) => {
                console.error('Error loading quote:', err);
                this.error = 'Failed to load quote';
                this.loading = false;
            }
        });
    }

    loadVehicles(quoteId: string): void {
        // Load trucks - use the byQuote endpoint for proper filtering
        this.sqlService.getItemsByQuote('quoteTrucks', quoteId).subscribe({
            next: (result: any) => {
                if (result.result && Array.isArray(result.data)) {
                    this.trucks = result.data;
                } else {
                    this.trucks = [];
                }
            },
            error: (err) => {
                console.error('Error loading trucks:', err);
                this.trucks = [];
            }
        });

        // Load trailers - use the byQuote endpoint for proper filtering
        this.sqlService.getItemsByQuote('quoteTrailers', quoteId).subscribe({
            next: (result: any) => {
                if (result.result && Array.isArray(result.data)) {
                    this.trailers = result.data;
                } else {
                    this.trailers = [];
                }
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading trailers:', err);
                this.trailers = [];
                this.loading = false;
            }
        });
    }

    get referenceNumber(): string {
        if (!this.quote) return '';
        const date = new Date(this.quote.createdOn);
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const idPrefix = this.quote.id?.substring(0, 8)?.toUpperCase() || 'XXXXXXXX';
        return `LGX-${dateStr}-${idPrefix}`;
    }

    get totalAssetValue(): number {
        const truckTotal = this.trucks.reduce((sum, t) => sum + (t.value || 0), 0);
        const trailerTotal = this.trailers.reduce((sum, t) => sum + (t.value || 0), 0);
        return truckTotal + trailerTotal;
    }

    get monthlyPremium(): number {
        return (this.quote?.premium || 0) / 12;
    }

    get validUntil(): string {
        if (!this.quote?.createdOn) return '';
        const date = new Date(this.quote.createdOn);
        date.setDate(date.getDate() + 30);
        return date.toISOString().slice(0, 10);
    }

    contactMe(): void {
        this.contactSending = true;
        
        // Send contact request to API
        this.sqlService.sendContactRequest(this.quote.id).subscribe({
            next: (result: any) => {
                this.contactSending = false;
                if (result.result) {
                    this.snackBar.open('Contact request sent! We will be in touch shortly.', 'Close', {
                        duration: 5000,
                        panelClass: 'success-snackbar'
                    });
                } else {
                    this.snackBar.open('Failed to send request. Please try again.', 'Close', {
                        duration: 3000
                    });
                }
            },
            error: (err) => {
                this.contactSending = false;
                console.error('Error sending contact request:', err);
                this.snackBar.open('Failed to send request. Please try again.', 'Close', {
                    duration: 3000
                });
            }
        });
    }

    goHome(): void {
        this.router.navigate(['/home']);
    }
}

