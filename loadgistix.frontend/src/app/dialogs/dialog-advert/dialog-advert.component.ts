import { Component, Inject, OnDestroy, OnInit, inject, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VariableService } from 'app/services/variable.service';
import { DialogImageUploadComponent } from '../dialog-image-upload/dialog-image-upload.component';
import { environment } from 'environments/environment';
import { SqlService } from 'app/services/sql.service';
import { CommonModule, NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SortPipe } from 'app/pipes/sort.pipe';
import L from 'leaflet';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NominatimService, NominatimResult } from 'app/services/nominatim.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
    selector: 'dialog-advert',
    templateUrl: 'dialog-advert.component.html',
    standalone: true,
    imports: [MatIconModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule, MatDatepickerModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatAutocompleteModule, CommonModule, NgClass, NgFor, NgForOf, NgIf, SortPipe],
    encapsulation: ViewEncapsulation.None
})
export class DialogAdvertComponent implements OnInit, OnDestroy, AfterViewInit {
    timestamp: number = 0;
    form!: FormGroup;
    formErrors: any;
    formValid!: boolean;
    formData: any;
    previewImage: string | null = null;
    fileToUpload: any;
    avatarChanged = false;
    id: string | null = null;
    imagesFolder = environment.apiImage;
    loading = false;
    loadingAddress: boolean = false;
    private _unsubscribeAll = new Subject<void>();
    addressSuggestions: NominatimResult[] = [];
    private searchSubject = new Subject<string>();
    private userInputPrefix: string = '';

    constructor(
        @Inject(MatDialog) private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogAdvertComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBar: MatSnackBar,
        private sqlService: SqlService,
        private _fuseConfirmationService: FuseConfirmationService,
        private variableService: VariableService,
        private nominatimService: NominatimService) {
        this.timestamp = new Date().getTime();
        this.formErrors = data.formErrors;
        this.formData = data;
        this.id = data.item ? data.item.id : null;
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
        setTimeout(() => {
            this.initAutocomplete();
        }, 100);
    }


    initAutocomplete() {
        this.nominatimService.createAutocompleteObservable(this.searchSubject, 'za')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(results => {
                this.addressSuggestions = results;
            });
    }

    onAddressInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        // Extract potential house number from the beginning of the input
        const houseNumberMatch = value.match(/^(\d+[a-zA-Z]?)\s+/);
        this.userInputPrefix = houseNumberMatch ? houseNumberMatch[1] : '';
        this.searchSubject.next(value);
    }

    onAddressSelected(event: any): void {
        const selectedResult = event.option.value as NominatimResult;
        if (selectedResult) {
            let formattedAddress = this.nominatimService.formatAddress(selectedResult);
            // Add the user's house number prefix if not already there
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

    getFormattedAddress(result: NominatimResult): string {
        let formatted = this.nominatimService.formatAddress(result);
        if (this.userInputPrefix && !formatted.startsWith(this.userInputPrefix)) {
            const hasHouseNumber = /^\d+[a-zA-Z]?\s/.test(formatted);
            if (!hasHouseNumber) {
                formatted = `${this.userInputPrefix} ${formatted}`;
            }
        }
        return formatted;
    }

    uploadImage(event: Event) {
        event.preventDefault();
        const dialogConfig = new MatDialogConfig();

        dialogConfig.data = {
            title: 'Upload Image',
            message: 'Please select an image to upload',
            roundCropper: false,
            croppedImage: this.avatarChanged
                ? this.form.value.fileToUpload
                : this.avatarChanged ? this.fileToUpload : this.form.value.avatar ? this.imagesFolder + 'Adverts/' + this.form.value.id + this.form.value.avatar + '?t=' + this.timestamp : 'assets/images/no-image.png',
            savedImage: this.avatarChanged ? this.fileToUpload : this.form.value.avatar ? (this.imagesFolder + 'Adverts/' + this.form.value.id + this.form.value.avatar + '?t=' + this.timestamp) : 'assets/images/no-image.png'
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(DialogImageUploadComponent,
            dialogConfig);

        dialogRef.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: string | null) => {
            if (result !== null) {
                this.avatarChanged = true;
                this.fileToUpload = result;
                this.form.value.fileToUpload = result;
            }
        });

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
                this.sqlService.deleteItem('adverts', id)
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            this.dialogRef.close({ form: null, fileToUpload: null });
                        }
                    },
                    error: (error) => {
                        console.log('error', error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                    },
                    complete: () => {
                    }
                });
            }
        });
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        setTimeout(() => {
            this.dialogRef.close({ form: this.form.value, fileToUpload: this.fileToUpload });
        }, 100);
    }

    check() {
        console.log(this.form.value);
        console.log(this.form);
    }
}
