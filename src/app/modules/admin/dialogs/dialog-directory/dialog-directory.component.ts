import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { ApiService } from 'app/modules/admin/services/api.service';
import { DialogCameraComponent } from '../dialog-camera/dialog-camera.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogAddressComponent } from '../dialog-address/dialog-address.component';
import { environment } from 'environments/environment';

@Component({
    selector: 'dialog-directory',
    templateUrl: 'dialog-directory.component.html'
})
export class DialogDirectoryComponent {
    timestamp: number = 0;
    imagesFolder = environment.api + 'Images/';
    form: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;
    previewImage: string = null;
    fileToUpload: any;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogDirectoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBar: MatSnackBar,
        private apiService: ApiService,
        private sanitizer: DomSanitizer) {
        this.timestamp = new Date().getTime();
        this.formErrors = data.formErrors;
        this.formData = data;

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;
        //this.previewImage = this.form.controls['avatar'].value;
    }

    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
        this.form.controls['fileToUpload'].setValue(this.fileToUpload);
        var size = (this.fileToUpload.size / (1024 * 1024)).toFixed(2);
        if (Number(size) > Number(0.25)) {
            this._snackBar.open('Error: Maximum FileSize is 200kB', null, { duration: 2000 });
            return false;
        } else {

            //Show image preview
            let reader = new FileReader();
            reader.onload = (event: any) => {
                this.previewImage = event.target.result;
            };
            reader.readAsDataURL(this.fileToUpload);
        }
    }

    initCamera() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogCameraComponent,
            dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.form.controls['avatar'].setValue(result._imageAsDataUrl);
                this.previewImage = result._imageAsDataUrl;
                this.form.controls['avatarChanged'].setValue(true);
            }
        });
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    getAddress() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { label: 'Loadgistix', lat: 28.1045642, lon: -26.3296247 };
        if (this.form.controls['addressLabel'].value) {
            dialogConfig.data.label = this.form.controls['addressLabel'].value;
            dialogConfig.data.lat = this.form.controls['addressLat'].value;
            dialogConfig.data.lon = this.form.controls['addressLon'].value;
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogAddressComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.form.controls['addressLabel'].setValue(result.label);
                this.form.controls['addressLat'].setValue(result.lat);
                this.form.controls['addressLon'].setValue(result.lon);
            }
        });
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close(this.form.value);
    }
}