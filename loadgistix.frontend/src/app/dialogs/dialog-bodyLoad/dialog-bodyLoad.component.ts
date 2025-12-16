import { NgClass, NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SqlService } from 'app/services/sql.service';
import { VariableService } from 'app/services/variable.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
    selector: 'dialog-bodyLoad',
    templateUrl: 'dialog-bodyLoad.component.html',
    standalone: true,
    imports: [NgClass, MatIconModule, MatSlideToggleModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule, MatDatepickerModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf],
    encapsulation: ViewEncapsulation.None
})
export class DialogBodyLoadComponent implements OnDestroy {
    private _unsubscribeAll = new Subject<void>();
    form!: FormGroup;
    formErrors: any;
    formValid!: boolean;
    formData: any;
    loading: boolean = false;
    id: string | null = null;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogBodyLoadComponent>,
        private _fuseConfirmationService: FuseConfirmationService,
        private sqlService: SqlService,
        private variableService: VariableService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
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
        this.onSelectLiquid();
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    onSelectLiquid(){
        if (this.form.controls['liquid'].value) {
            this.form.controls['kilograms'].clearValidators();
            this.form.controls['height'].clearValidators();
            this.form.controls['litres'].setValidators([Validators.required]);
            this.form.controls['volume'].setValidators([Validators.required]);
        } else {
            this.form.controls['kilograms'].setValidators([Validators.required]);
            this.form.controls['height'].setValidators([Validators.required]);
            this.form.controls['litres'].clearValidators();
            this.form.controls['volume'].clearValidators();
        }
        this.form.controls['kilograms'].updateValueAndValidity();
        this.form.controls['height'].updateValueAndValidity();
        this.form.controls['litres'].updateValueAndValidity();
        this.form.controls['volume'].updateValueAndValidity();
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

                this.sqlService.deleteItem('bodyLoads', id)
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
                    this.dialogRef.close({ action: 'delete', value: id });
                    this.loading = false;
                });
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
