import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SortPipe } from 'app/pipes/sort.pipe';
import { SqlService } from 'app/services/sql.service';
import { VariableService } from 'app/services/variable.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
    selector: 'dialog-pdp',
    templateUrl: 'dialog-pdp.component.html',
    standalone: true,
    imports: [NgClass, NgIf, NgFor, NgForOf, MatSliderModule, MatSlideToggleModule, MatProgressSpinnerModule, MatIconModule, MatSelectModule, MatOptionModule, MatSnackBarModule, MatDialogModule, MatDatepickerModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, SortPipe],
    encapsulation: ViewEncapsulation.None
})
export class DialogPdpComponent implements OnDestroy {
    private _unsubscribeAll = new Subject<void>();
    form!: FormGroup;
    formErrors: any;
    formValid!: boolean;
    formData: any;
    loading: boolean = false;
    id: string | null = null;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogPdpComponent>,
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
    }

    getDescription(event, arrayName: string) {
        return this.data[arrayName].find(x => x['id'] == event.value)['description'];
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
        confirmation.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
            if (result === 'confirmed') {
                this.loading = true;

                this.sqlService.deleteItem('pdps', id).pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
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
