import { NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NominatimService, NominatimResult } from 'app/services/nominatim.service';
import { VariableService } from 'app/services/variable.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
    selector: 'dialog-branch',
    templateUrl: 'dialog-branch.component.html',
    standalone: true,
    imports: [NgClass, NgFor, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule, MatDatepickerModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, NgIf],
    encapsulation: ViewEncapsulation.None
})
export class DialogBranchComponent implements OnInit, OnDestroy, AfterViewInit {
    private _unsubscribeAll = new Subject<void>();
    form!: FormGroup;
    formErrors: any;
    formValid!: boolean;
    formData: any;
    loading: boolean = false;
    id: string | null = null;
    addressSuggestions: NominatimResult[] = [];
    private searchSubject = new Subject<string>();
    private userInputPrefix: string = ''; // Store any house number/prefix from user input

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogBranchComponent>,
        private _fuseConfirmationService: FuseConfirmationService,
        private variableService: VariableService,
        private nominatimService: NominatimService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.formErrors = data.formErrors;
        this.formData = data;
        this.id = data.item ? data.item.id ? data.item.id : data.item.uid : null;
        // consle.log(this.id);
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;
    }

    ngAfterViewInit(): void {
        // Initialize Nominatim autocomplete after view is ready
        setTimeout(() => {
            this.initAutocomplete();
        }, 100);
    }

    initAutocomplete() {
        // Subscribe to search subject with debouncing
        this.nominatimService.createAutocompleteObservable(this.searchSubject, 'za')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(results => {
                // Debug: Log the results to see what data we're getting
                console.log('Nominatim results:', results);
                if (results.length > 0) {
                    console.log('First result address:', results[0].address);
                }
                this.addressSuggestions = results;
            });
    }

    onAddressInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        
        // Extract potential house number from the beginning of the input
        // Pattern: optional number/letter combo at start (e.g., "7b", "123", "12A")
        const houseNumberMatch = value.match(/^(\d+[a-zA-Z]?)\s+/);
        if (houseNumberMatch) {
            this.userInputPrefix = houseNumberMatch[1];
        } else {
            this.userInputPrefix = '';
        }
        
        this.searchSubject.next(value);
    }

    onAddressSelected(event: any): void {
        // Get the selected result from the autocomplete
        const selectedResult = event.option.value as NominatimResult;
        if (selectedResult) {
            // Use the formatted address with house number prefix
            let formattedAddress = this.nominatimService.formatAddress(selectedResult);
            
            // Add the user's house number prefix if it's not already there
            if (this.userInputPrefix && !formattedAddress.startsWith(this.userInputPrefix)) {
                const hasHouseNumber = /^\d+[a-zA-Z]?\s/.test(formattedAddress);
                if (!hasHouseNumber) {
                    formattedAddress = `${this.userInputPrefix} ${formattedAddress}`;
                }
            }
            
            this.form.controls['addressLabel'].setValue(formattedAddress);
            this.form.controls['addressLat'].setValue(parseFloat(selectedResult.lat));
            this.form.controls['addressLon'].setValue(parseFloat(selectedResult.lon));
            this.addressSuggestions = [];
        }
    }

    /**
     * Get formatted address for display in autocomplete
     * Includes user's input prefix (house number) if not already in the result
     */
    getFormattedAddress(result: NominatimResult): string {
        let formatted = this.nominatimService.formatAddress(result);
        
        // If we have a user input prefix (house number) and it's not already in the formatted address
        if (this.userInputPrefix && !formatted.startsWith(this.userInputPrefix)) {
            // Check if the formatted address already has a house number at the start
            const hasHouseNumber = /^\d+[a-zA-Z]?\s/.test(formatted);
            if (!hasHouseNumber) {
                formatted = `${this.userInputPrefix} ${formatted}`;
            }
        }
        
        return formatted;
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    onDeleteClick(): void {
        this.initDelete(this.id);
    }
    async initDelete(id: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Item',
            message: 'Are you sure you want to delete this item? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });
        confirmation.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
                if (result === 'confirmed') {
                    this.loading = true;

                    this.dialogRef.close({ action: 'delete', value: id });
                    this.loading = false;
                }
            })
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close({ action: this.id ? 'update' : 'insert', value: this.form.value });
    }
}
