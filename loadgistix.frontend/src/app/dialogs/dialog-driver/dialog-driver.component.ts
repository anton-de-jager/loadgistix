/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Component,
    Inject,
    OnDestroy, inject,
    ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { licenceType } from 'app/models/licenceType.model';
import { pdp } from 'app/models/pdp.model';
import { DialogImageUploadComponent } from '../dialog-image-upload/dialog-image-upload.component';

// import * as turf from '@turf/turf';
import { CommonModule, NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SortPipe } from 'app/pipes/sort.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { environment } from 'environments/environment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { SqlService } from 'app/services/sql.service';
import { Guid } from 'guid-typescript';

const optionsMap: any = {
    componentRestrictions: { country: 'za' },
    useLocale: true,
    maxResults: 1,
    apiKey: environment.apiKey
};
const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 25000,
    maximumAge: 0,
};

@Component({
    selector: 'dialog-driver',
    templateUrl: 'dialog-driver.component.html',
    standalone: true,
    imports: [MatIconModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule, MatDatepickerModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, CommonModule, NgClass, NgFor, NgForOf, NgIf, SortPipe, MatCardModule],
    providers: [SortPipe],
    encapsulation: ViewEncapsulation.None
})
export class DialogDriverComponent implements OnDestroy {
    mapsActive = false;
    timestamp: number = 0;
    form!: FormGroup;
    formErrors: any;
    formValid!: boolean;
    private _unsubscribeAll = new Subject<void>();
    previewImage: string | null = null;
    fileToUpload: string | null = null;
    avatarChanged = false;
    previewImagePdp: string | null = null;
    fileToUploadPdp: string | null = null;
    avatarChangedPdp = false;
    id: string | null = null;
    loadingSubmit: boolean = false;
    loading: boolean = false;
    imagesFolder = environment.apiImage;

    licenceTypeList: any[] = [];
    pdpList: any[] = [];

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogDriverComponent>,
        private _fuseConfirmationService: FuseConfirmationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private sqlService: SqlService,
    ) {
        this.timestamp = new Date().getTime();
        this.formErrors = data.formErrors;
        this.id = data.item ? (data.item.id ? data.item.id : data.item.id) : null;
        this._unsubscribeAll = new Subject();
    }
    ngOnDestroy(): void {
        this.loadingSubmit = false;
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;
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
                : this.avatarChanged ? this.fileToUpload : this.form.value.avatar ? this.imagesFolder + 'Drivers/' + this.form.value.id + this.form.value.avatar + '?t=' + this.timestamp : 'assets/images/no-image.png',
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(
            DialogImageUploadComponent,
            dialogConfig
        );

        dialogRef.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: string | null) => {
                if (result !== null) {
                    this.avatarChanged = true;
                    this.fileToUpload = result;
                    this.form.value.fileToUpload = result;
                }
            })
    }

    uploadImagePdp(event: Event) {
        event.preventDefault();
        const dialogConfig = new MatDialogConfig();

        dialogConfig.data = {
            title: 'Upload Image',
            message: 'Please select an image to upload',
            roundCropper: false,
            croppedImage: this.avatarChangedPdp
                ? this.form.value.fileToUploadPdp
                : this.avatarChangedPdp ? this.fileToUploadPdp : this.form.value.avatarPdp ? this.imagesFolder + 'Pdps/' + this.form.value.id + this.form.value.avatarPdp + '?t=' + this.timestamp : 'assets/images/no-image.png',
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(
            DialogImageUploadComponent,
            dialogConfig
        );

        dialogRef.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: string | null) => {
                if (result !== null) {
                    this.avatarChangedPdp = true;
                    this.fileToUploadPdp = result;
                }
            })
    }

    licenceTypeChanged() {
        if (this.form.value.licenceTypeId) {
            this.form.controls['licenceTypeCode'].setValue(
                this.getLicenceTypeCode(this.form.value.licenceTypeId)
            );
            this.form.controls['licenceTypeDescription'].setValue(
                this.getLicenceTypeDescription(this.form.value.licenceTypeId)
            );
        }
    }
    getLicenceTypeDescription(val: Guid): string {
        return this.data.licenceTypeList.find((x: licenceType) => x['id'] == val)
            .description;
    }
    getLicenceTypeCode(val: Guid): string {
        return this.data.licenceTypeList.find((x: licenceType) => x['id'] == val)
            .code;
    }


    pdpChanged() {
        // if (this.form.value.pdpId) {
        //     this.form.controls['pdpDescription'].setValue(
        //         this.getPdpDescription(this.form.value.pdpId)
        //     );
        // }
    }
    // getPdpDescription(val: Guid): string {
    //     return this.data.pdpList.find((x: pdp) => x['id'] == val)
    //         .description;
    // }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    };

    trackGroup(index: number, item: any): number {
        return item ? item.id : undefined;
    }

    trackPdpItem(index: number, item: any): number {
        return item ? item.id : undefined;
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
                    this.sqlService.deleteItem('drivers', id)
                        .pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
                            this.sqlService.delete('driver', id).pipe(takeUntil(this._unsubscribeAll)).subscribe(event => {
                                this.sqlService.delete('pdp', id).pipe(takeUntil(this._unsubscribeAll)).subscribe(event => {
                                    this.dialogRef.close(false);
                                })
                            })
                        });
                }
            })
    }
    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        // this.form.controls['dateOfBirth'].setValue(new Date(this.form.value.dateOfBirth));
        // this.form.controls['licenceExpiryDate'].setValue(new Date(this.form.value.licenceExpiryDate));
        // this.form.controls['pdpExpiryDate'].setValue(new Date(this.form.value.pdpExpiryDate));
        this.dialogRef.close({
            form: this.form.value,
            fileToUpload: this.fileToUpload,
            fileToUploadPdp: this.fileToUploadPdp,
        });
    }
}
