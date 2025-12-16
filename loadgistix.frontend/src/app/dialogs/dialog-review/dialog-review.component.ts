import { Component, Inject, OnDestroy, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { reviewDriver } from 'app/models/reviewDriver.model';
import { reviewLoad } from 'app/models/reviewLoad.model';
import { StarRatingColor, StarRatingComponent } from 'app/layout/common/star-rating/star-rating.component';
import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SortPipe } from 'app/pipes/sort.pipe';

@Component({
    selector: 'dialog-review',
    templateUrl: 'dialog-review.component.html',
    standalone: true,
    imports: [NgClass, NgFor, NgForOf, NgIf, MatIconModule, MatSelectModule, MatOptionModule,
        MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule, MatDatepickerModule,
        MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
        SortPipe, StarRatingComponent],
    providers: [StarRatingComponent]
})
export class DialogReviewComponent implements OnDestroy {
    form!: FormGroup;
    reviewType: string;
    reviewDriverRow!: reviewDriver;
    reviewLoadRow!: reviewLoad;
    starColor: StarRatingColor = StarRatingColor.accent;
    starColorP: StarRatingColor = StarRatingColor.primary;
    starColorW: StarRatingColor = StarRatingColor.warn;
    ratingPunctuality: number = 0;
    ratingVehicleDescription: number = 0;
    ratingLoadDescription: number = 0;
    ratingPayment: number = 0;
    ratingCondition: number = 0;
    ratingCare: number = 0;
    ratingAttitude: number = 0;

    constructor(
        public dialogRef: MatDialogRef<DialogReviewComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private sanitizer: DomSanitizer) {
        this.reviewType = data.reviewType;
    }
    ngOnDestroy(): void {
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.ratingVehicleDescription = this.form.controls['ratingVehicleDescription'].value;
        this.ratingLoadDescription = this.form.controls['ratingLoadDescription'].value;
        this.ratingPayment = this.form.controls['ratingPayment'].value;
        this.ratingCondition = this.form.controls['ratingCondition'].value;
        this.ratingCare = this.form.controls['ratingCare'].value;
        this.ratingAttitude = this.form.controls['ratingAttitude'].value;

        if (this.data.reviewType === 'Driver') {
            this.reviewDriverRow = this.data.item;
            this.form.controls['ratingPunctuality'].setValidators([Validators.min(1)]);
            this.form.controls['ratingVehicleDescription'].setValidators([Validators.min(1)]);
            this.form.controls['ratingCondition'].setValidators([Validators.min(1)]);
            this.form.controls['ratingAttitude'].setValidators([Validators.min(1)]);
        }
        if (this.data.reviewType === 'Load') {
            this.reviewLoadRow = this.data.item;
            this.form.controls['ratingPunctuality'].setValidators([Validators.min(1)]);
            this.form.controls['ratingLoadDescription'].setValidators([Validators.min(1)]);
            this.form.controls['ratingPayment'].setValidators([Validators.min(1)]);
            this.form.controls['ratingAttitude'].setValidators([Validators.min(1)]);
        }
        setTimeout(() => {
            this.form.controls['ratingPunctuality'].updateValueAndValidity();
            this.form.controls['ratingVehicleDescription'].updateValueAndValidity();
            this.form.controls['ratingLoadDescription'].updateValueAndValidity();
            this.form.controls['ratingPayment'].updateValueAndValidity();
            this.form.controls['ratingCondition'].updateValueAndValidity();
            this.form.controls['ratingCare'].updateValueAndValidity();
            this.form.controls['ratingAttitude'].updateValueAndValidity();
        }, 100);
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    onRatingChanged(item: string, event: number) {
        switch (this.reviewType) {
            case 'Driver':
                switch (item) {
                    case 'ratingPunctuality':
                        this.ratingPunctuality = event;
                        this.form.controls["ratingPunctuality"].setValue(event);
                        break;
                    case 'ratingVehicleDescription':
                        this.ratingVehicleDescription = event;
                        this.form.controls["ratingVehicleDescription"].setValue(event);
                        break;
                    case 'ratingCare':
                        this.ratingCare = event;
                        this.form.controls["ratingCare"].setValue(event);
                        break;
                    case 'ratingCondition':
                        this.ratingCondition = event;
                        this.form.controls["ratingCondition"].setValue(event);
                        break;
                    case 'ratingAttitude':
                        this.ratingAttitude = event;
                        this.form.controls["ratingAttitude"].setValue(event);
                        break;
                    default:
                        break;
                }
                break;
            case 'Load':
                switch (item) {
                    case 'ratingPunctuality':
                        this.ratingPunctuality = event;
                        this.form.controls["ratingPunctuality"].setValue(event);
                        break;
                    case 'ratingLoadDescription':
                        this.ratingLoadDescription = event;
                        this.form.controls["ratingLoadDescription"].setValue(event);
                        break;
                    case 'ratingPayment':
                        this.ratingPayment = event;
                        this.form.controls["ratingPayment"].setValue(event);
                        break;
                    case 'ratingCare':
                        this.ratingCare = event;
                        this.form.controls["ratingCare"].setValue(event);
                        break;
                    case 'ratingAttitude':
                        this.ratingAttitude = event;
                        this.form.controls["ratingAttitude"].setValue(event);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close(this.form.value);
    }
}
