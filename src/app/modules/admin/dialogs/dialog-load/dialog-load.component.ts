import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { ApiService } from 'app/modules/admin/services/api.service';
import { DialogAddressComponent } from '../dialog-address/dialog-address.component';
import { DialogCameraComponent } from '../dialog-camera/dialog-camera.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { load } from '../../models/load.model';
import { Guid } from 'guid-typescript';
import { DialogBidComponent } from '../dialog-bid/dialog-bid.component';
import { vehicle } from '../../models/vehicle.model';
import { driver } from '../../models/driver.model';
import { StarRatingColor } from '../../controls/star-rating/star-rating.component';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { environment } from 'environments/environment';

@Component({
    selector: 'dialog-load',
    templateUrl: 'dialog-load.component.html'
})
export class DialogLoadComponent {
    imagesFolder = environment.api + 'Images/';
    form: FormGroup;
    formBid: FormGroup;
    formErrors: any;
    formValid: boolean;
    private _unsubscribeAll: Subject<any>;
    formData: any;
    previewImage: string = null;
    fileToUpload: any;
    readOnly: boolean = false;
    bidRow: load;
    vehicleList: vehicle[] = [];
    driverList: driver[] = [];
    loadCategoryList: any[] = [];
    loading: boolean = true;
    starColor: StarRatingColor = StarRatingColor.accent;
    starColorP: StarRatingColor = StarRatingColor.primary;
    starColorW: StarRatingColor = StarRatingColor.warn;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogLoadComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private apiService: ApiService,
        private _snackBar: MatSnackBar,
        private fuseSplashScreenService: FuseSplashScreenService) {
        if (data.readOnly == 1) {
            this.bidRow = data.item;
        }
        this.formErrors = data.formErrors;
        this.formData = data;
        this.readOnly = data.readOnly == 1 ? true : false;
        this.vehicleList = data.vehicleList;
        this.driverList = data.driverList;

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;
        
        //console.log(this.form.value);
        this.data.loadCategoryList.forEach(loadCategoryItem => {
            loadCategoryItem.loadTypeList = this.data.loadTypeList.filter(x => x.loadCategoryId == loadCategoryItem.id).sort((a,b) => a.description.localeCompare(b.description));
            this.loadCategoryList.push(loadCategoryItem);
        });

        setTimeout(() => {
            this.loadCategoryList = this.loadCategoryList.sort((a,b) => a.description.localeCompare(b.description));
            this.loadTypeChanged();
        }, 100);
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

    getAddress(control) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { label: 'Loadgistix', lat: 28.1045642, lon: -26.3296247 };
        if (control == 'originatingAddressLabel' && this.form.controls['originatingAddressLabel'].value) {
            dialogConfig.data.label = this.form.controls['originatingAddressLabel'].value;
            dialogConfig.data.lat = this.form.controls['originatingAddressLat'].value;
            dialogConfig.data.lon = this.form.controls['originatingAddressLon'].value;
        }
        if (control == 'destinationAddressLabel' && this.form.controls['destinationAddressLabel'].value) {
            dialogConfig.data.label = this.form.controls['destinationAddressLabel'].value;
            dialogConfig.data.lat = this.form.controls['destinationAddressLat'].value;
            dialogConfig.data.lon = this.form.controls['destinationAddressLon'].value;
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
                if (control == 'originatingAddressLabel') {
                    this.form.controls['originatingAddressLabel'].setValue(result.label);
                    this.form.controls['originatingAddressLat'].setValue(result.x);
                    this.form.controls['originatingAddressLon'].setValue(result.y);
                }
                if (control == 'destinationAddressLabel') {
                    this.form.controls['destinationAddressLabel'].setValue(result.label);
                    this.form.controls['destinationAddressLat'].setValue(result.x);
                    this.form.controls['destinationAddressLon'].setValue(result.y);
                }
            }
        });
    }

    loadTypeChanged() {
        if (this.getLoadTypeLiquid()) {
            this.form.controls["height"].clearValidators();
            this.form.controls["width"].clearValidators();
            this.form.controls["length"].clearValidators();
            this.form.controls["itemCount"].clearValidators();
            this.form.controls["volume"].setValidators([Validators.required]);
        } else {
            this.form.controls["height"].setValidators([Validators.required]);
            this.form.controls["width"].setValidators([Validators.required]);
            this.form.controls["length"].setValidators([Validators.required]);
            this.form.controls["itemCount"].setValidators([Validators.required]);
            this.form.controls["volume"].clearValidators();
        }
        setTimeout(() => {
            this.form.controls["height"].updateValueAndValidity();
            this.form.controls["width"].updateValueAndValidity();
            this.form.controls["length"].updateValueAndValidity();
            this.form.controls["itemCount"].updateValueAndValidity();
            this.form.controls["volume"].updateValueAndValidity();
        }, 100);
    }

    getLoadTypeLiquid(): string {
        return this.form.controls['loadTypeId'].value ? this.formData.loadTypeList.find(x => x.id === this.form.controls['loadTypeId'].value) ? this.formData.loadTypeList.find(x => x.id === this.form.controls['loadTypeId'].value).liquid : false : false;
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    initBid() {
        this.formBid = this._formBuilder.group({
            id: [Guid.create().toString()],
            userId: [this.bidRow == null ? localStorage.getItem('userId') : this.bidRow.userId],
            loadId: [this.bidRow == null ? null : this.bidRow.id, Validators.required],
            vehicleId: [null, Validators.required],
            driverId: [null, Validators.required],
            price: [this.bidRow == null ? null : this.bidRow.price, Validators.required],
            dateOut: [this.bidRow == null ? null : this.bidRow.dateOut, Validators.required],
            dateIn: [this.bidRow == null ? null : this.bidRow.dateIn, Validators.required],
            statusId: [this.bidRow == null ? 'B3B7D04D-64B7-4ED7-BFE1-CF06D2B4A8AB' : this.bidRow.statusId.toString()]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: this.bidRow,
            form: this.formBid,
            loadList: [this.bidRow],//this.loadList,
            vehicleList: this.vehicleList,
            driverList: this.driverList,
            title: 'Place a'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogBidComponent,
            dialogConfig);


        dialogRef.afterClosed().subscribe(result => {
            if (result !== false) {
                result.loadUserId = this.bidRow.userId;
                this.fuseSplashScreenService.show(); this.loading = true;
                this.apiService.post('bids', null, result).subscribe(r => {
                    this.fuseSplashScreenService.hide(); this.loading = false;
                    this.dialogRef.close(false);
                }, error => {
                    console.log(error);
                    this._snackBar.open('Error: ' + error, null, { duration: 2000 });
                    this.fuseSplashScreenService.hide(); this.loading = false;
                });
            }
        });
    }

    timestamp(){
        return new Date().getTime();
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close(this.form.value);
    }
}