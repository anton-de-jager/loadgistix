import { Component, Inject, OnDestroy, inject, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Subject, Subscription, takeUntil } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StarRatingColor, StarRatingComponent } from 'app/layout/common/star-rating/star-rating.component';
import { vehicle } from 'app/models/vehicle.model';
import { driver } from 'app/models/driver.model';
import { vehicleType } from 'app/models/vehicleType.model';
import { vehicleCategory } from 'app/models/vehicleCategory.model';
import { bid } from 'app/models/bid.model';
import { DialogReviewComponent } from '../dialog-review/dialog-review.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule, NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SortPipe } from 'app/pipes/sort.pipe';
import { SqlService } from 'app/services/sql.service';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VariableService } from 'app/services/variable.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { load } from 'app/models/load.model';
import { Guid } from 'guid-typescript';
import * as L from 'leaflet';
import { loadDestination } from 'app/models/loadDestination.model';
import { AddressLabelPipe } from 'app/pipes/address-label.pipe';
import { User } from 'app/core/user/user.types';

@Component({
    selector: 'dialog-bid',
    templateUrl: 'dialog-bid.component.html',
    standalone: true,
    imports: [MatIconModule, AddressLabelPipe, MatTooltipModule, MatSnackBarModule, MatTableModule, MatProgressSpinnerModule, MatDialogModule, MatListModule, MatDatepickerModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, CommonModule, NgClass, NgFor, NgForOf, NgIf, SortPipe, StarRatingComponent],
    providers: [SortPipe],
    encapsulation: ViewEncapsulation.None
})
export class DialogBidComponent implements OnDestroy, AfterViewInit {
    @ViewChild('target') private myScrollContainer: ElementRef;
    form!: FormGroup;
    formRating!: FormGroup;
    formErrors: any;
    formValid!: boolean;
    private _unsubscribeAll = new Subject<void>();
    formData: any;
    previewImage: string | null = null;
    readOnly: boolean = false;
    bidRow: any;
    minDate: Date = new Date();
    maxDate!: Date;
    dateToday = new Date();
    vehicleTypeList: vehicleType[] = [];
    showMap: boolean = false;
    mapReady: boolean = false;
    iLoaded = 0;
    private map!: L.Map;
    private tiles: L.TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
    private markers!: L.MarkerClusterGroup;
    mapsActive = false;
    loadDestinationItems: loadDestination[] = [];
    loadDestinationCurrent: loadDestination;

    scrollToElement(el): void {
        this.myScrollContainer.nativeElement.scroll({
            top: this.myScrollContainer.nativeElement.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }

    id: string | null = null;
    action: string | null = null;
    loading: boolean = false;

    starColor: StarRatingColor = StarRatingColor.accent;
    starColorP: StarRatingColor = StarRatingColor.primary;
    starColorW: StarRatingColor = StarRatingColor.warn;

    currentUser: User | null = null;

    constructor(
        private userService: UserService,
        private dialog: MatDialog,
        private sqlService: SqlService,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        public dialogRef: MatDialogRef<DialogBidComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private variableService: VariableService,
        private router: Router) {
        this.loadDestinationItems = data.loadDestinationItems;
        this.loadDestinationCurrent = data.loadDestinationCurrent;
        this.userService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
                this.initPage(this.data);
            }
        });

        this._unsubscribeAll = new Subject();
    }
    ngOnDestroy(): void {
        this.loading = false;

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        if (this.map) {
            this.map.off();
            this.map.remove();
        }
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    initPage(data) {
        this.getVehicleTypes();
        this.formErrors = data.formErrors;
        this.formData = data;
        this.formData.vehicleList = this.formData.vehicleList.filter(x => x.liquid == this.formData.liquid);
        this.bidRow = data.item;
        this.readOnly = data.readOnly == 1 ? true : false;
        this.showMap = data.readOnly == 1 ? true : false;
        if (this.showMap) {
            this.delay(100).then(res => {
                this.map = L.map('map-load');
            });
        }
        this.id = data.item ? data.item.id : null;
        this.action = data.action ? data.action : 'none';

        this.form = this.data.form;
        this.formValid = false;
    }


    ngAfterViewInit(): void {
        setTimeout(() => {
            this.mapReady = true;
            if (this.data.readOnly == 1) {
                this.bidRow = this.data.item;
                this.initMap(this.data.item);
            }
        }, 100);
    }

    getIcon(str: string, status: string, bidCount: number) {
        let url: string = '';
        switch (status) {
            case 'Open': url = 'assets/images/' + str + '-' + (bidCount > 0 ? 'bids' : 'open') + '.png'; break;
            case 'Bid(s) Placed': url = 'assets/images/' + str + '-bids.png'; break;
            case 'Accepted': url = 'assets/images/' + str + '-accepted.png'; break;
            case 'Loaded': url = 'assets/images/' + str + '-loaded.png'; break;
            case 'Loaded Confirmed': url = 'assets/images/' + str + '-loaded-confirmed.png'; break;
            case 'Delivered': url = 'assets/images/' + str + '-delivered.png'; break;
            case 'Delivered Confirmed': url = 'assets/images/' + str + '-delivered-confirmed.png'; break;
            default: url = 'assets/images/' + str + '-open.png'; break;
        }

        if (str == 'origin') {
            return L.icon({
                iconRetinaUrl: url,
                iconUrl: url,
                shadowUrl: '',
                iconSize: [50, 50],
                iconAnchor: [25, 50],
                popupAnchor: [1, -50],
                tooltipAnchor: [25, -34],
                shadowSize: [50, 50]
            });
        } else {
            return L.icon({
                iconRetinaUrl: url,
                iconUrl: url,
                shadowUrl: '',
                iconSize: [42, 50],
                iconAnchor: [12, 50],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                shadowSize: [50, 50]
            });
        }
    }
    getColor(status: string, bidCount: number) {
        switch (status) {
            case 'Open': return (bidCount > 0 ? '#f8a407' : '#5db1de');
            case 'Bid(s) Placed': return '#f8a407';
            case 'Accepted': return '#00ff00';
            case 'Loaded': return '#fba7ed';
            case 'Loaded Confirmed': return '#ff05d5';
            case 'Delivered': return '#000000';
            case 'Delivered Confirmed': return '#b3b3b3';
            default: return '#5db1de';
        }
    }

    private initMap(item: load): void {
        if (this.mapReady && this.iLoaded < 100 && this.readOnly) {
            if (this.map) {
                this.map.off();
                this.map.remove();
            }

            // this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //     maxZoom: 18,
            //     minZoom: 3,
            //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            // })
            this.map = L.map('map-load', {
                center: [item.originatingAddressLat!, item.originatingAddressLon],
                maxZoom: 18,
                zoom: 14,
                layers: [this.tiles]
            });
            this.markers = L.markerClusterGroup({ animateAddingMarkers: true, showCoverageOnHover: true, zoomToBoundsOnClick: true });

            const waypoints: L.LatLngExpression[] = JSON.parse(item.route.replaceAll('"lat":', '').replaceAll('"lng":', '').replaceAll('{', '[').replaceAll('}', ']')!);

            const points: L.LatLngExpression[] = waypoints.map((coords: any) => L.latLng((coords as [number, number])[0], (coords as [number, number])[1]));
            //polylines.push(L.polyline(points, { color: 'blue', weight: 5 }));
            L.polyline(points, { color: this.getColor(item.status, item.bidCount), weight: 5 }).addTo(this.map);

            var minlat = 200, minlon = 200, maxlat = -200, maxlon = -200;
            if (minlat > item.originatingAddressLat!) minlat = item.originatingAddressLat!;
            if (minlon > item.originatingAddressLon!) minlon = item.originatingAddressLon!;
            if (maxlat < item.originatingAddressLat!) maxlat = item.originatingAddressLat!;
            if (maxlon < item.originatingAddressLon!) maxlon = item.originatingAddressLon!;
            this.markers.addLayer(
                L.marker(new L.LatLng(item.originatingAddressLat!, item.originatingAddressLon!), { icon: this.getIcon('origin', item.status, item.bidCount) })
            );

            if (minlat > item.destinationAddressLat!) minlat = item.destinationAddressLat!;
            if (minlon > item.destinationAddressLon!) minlon = item.destinationAddressLon!;
            if (maxlat < item.destinationAddressLat!) maxlat = item.destinationAddressLat!;
            if (maxlon < item.destinationAddressLon!) maxlon = item.destinationAddressLon!;
            this.markers.addLayer(
                L.marker(new L.LatLng(item.destinationAddressLat!, item.destinationAddressLon!), { icon: this.getIcon('destination', item.status, item.bidCount) })
            );

            setTimeout(() => {
                this.map.fitBounds(L.latLngBounds(new L.LatLng(minlat, minlon), new L.LatLng(maxlat, maxlon)));
                setTimeout(() => {
                    this.map.zoomOut(1);
                    setTimeout(() => {
                        this.markers.addTo(this.map)
                    }, 100);
                }, 100);
            }, 100);
        } else {
            setTimeout(() => {
                this.iLoaded++;
                this.initMap(item);
            }, 500);
        }
    }

    getVehicleTypes() {
        this.sqlService.getItems('vehicleTypes')
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);
                } else {
                    this.vehicleTypeList = apiResult.data;
                }
            })
    }

    showForm() {
        //console.log(this.form);
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName] ? this.form.controls[controlName].hasError(errorName) : false;
    }

    vehicleChanged() {
        this.form.controls['vehicleDescription'].setValue(this.formData.vehicleList.find((x: vehicle) => x.id == this.form.value.vehicleId).description);
        this.form.controls['vehicleTypeId'].setValue(this.formData.vehicleList.find((x: vehicle) => x.id == this.form.value.vehicleId).vehicleTypeId);
        this.form.controls['vehicleTypeDescription'].setValue(this.formData.vehicleList.find((x: vehicle) => x.id == this.form.value.vehicleId).vehicleTypeDescription);
        setTimeout(() => {
            this.form.controls['vehicleCategoryId'].setValue(this.vehicleTypeList.find((x: vehicleType) => x.id == this.form.value.vehicleTypeId)!.vehicleCategoryId);
            this.form.controls['vehicleCategoryDescription'].setValue(this.vehicleTypeList.find((x: vehicleType) => x.id == this.form.value.vehicleTypeId)!.vehicleCategoryDescription);
        }, 100);
    }

    driverChanged() {
        this.form.controls['driverDescription'].setValue(this.formData.driverList.find((x: driver) => x.id == this.form.value.driverId).firstName + ' ' + this.formData.driverList.find((x: driver) => x.id == this.form.value.driverId).lastName);
    }

    testUpdate(status: string) {
        let row = this.form.value;
        row.status = status;
    }
    updateStatus(status: string) {
        let row = this.form.value;
        if (status === 'Delivered' || status === 'Delivered Confirmed') {
            this.initRating(row, 'Load', status);
        } else {
            this.loading = true;
            row.status = status;
            this.sqlService.updateItemTagPost('loads', 'status', { Load: { ...row, id: this.loadDestinationCurrent.loadId, status: status }, LoadDestination: [{ ...row, id: this.loadDestinationCurrent.id, loadId: this.loadDestinationCurrent.loadId, status: status }] })
                .pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            this.dialogRef.close({ action: 'reload' });
                        } else {
                            this.loading = false;

                            this._snackBar.open('Error: ' + apiResult.message, undefined, { duration: 2000 });
                        }
                    },
                    error: (error: string) => {
                        this.loading = false;

                        console.log('error', error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                    },
                    complete: () => {
                        //console.log('Done');
                    }
                })
        }
    }
    initRating(row: any, reviewType: string, status: string) {
        this.formRating = this._formBuilder.group({
            loadId: [row.loadId],
            userId: [row.userId],
            userDescription: [row.userDescription],
            ratingPunctuality: [0],
            ratingVehicleDescription: [0],
            ratingLoadDescription: [0],
            ratingCare: [0],
            ratingCondition: [0],
            ratingPayment: [0],
            ratingAttitude: [0],
            note: ['']
        });

        const dialogConfigRating = new MatDialogConfig();
        dialogConfigRating.data = {
            item: row,
            form: this.formRating,
            reviewType: reviewType,
            title: 'Add'
        }

        dialogConfigRating.autoFocus = true;
        dialogConfigRating.disableClose = true;
        dialogConfigRating.hasBackdrop = true;

        const dialogRef = this.dialog.open(DialogReviewComponent,
            dialogConfigRating);

        dialogRef.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(resultRating => {
                if (resultRating !== false) {
                    this.loading = true;

                    this.sqlService.createItem('reviewLoads', { loadId: this.loadDestinationCurrent.loadId, driverId: row.driverId, loadDestinationId: this.getCurrentLoadDestinationId(), ratingPunctuality: resultRating.ratingPunctuality, ratingLoadDescription: resultRating.ratingLoadDescription, ratingPayment: resultRating.ratingPayment, ratingCare: resultRating.ratingCare, ratingAttitude: resultRating.ratingAttitude, note: resultRating.note })
                        .pipe(takeUntil(this._unsubscribeAll)).subscribe(res => { })

                    row.status = status;
                    this.sqlService.updateItemTagPost('loads', 'status', { Load: { ...row, id: this.loadDestinationCurrent.loadId, status: status }, LoadDestination: [{ ...row, id: this.loadDestinationCurrent.id, loadId: this.loadDestinationCurrent.loadId, status: status }] })
                        .pipe(takeUntil(this._unsubscribeAll)).subscribe({
                            next: (apiResult: any) => {
                                if (apiResult.result == true) {
                                    this.dialogRef.close({ action: 'reload' });
                                } else {
                                    this.loading = false;

                                    this._snackBar.open('Error: ' + apiResult.message, undefined, { duration: 2000 });
                                }
                            },
                            error: (error: string) => {
                                this.loading = false;

                                console.log('error', error);
                                this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                            },
                            complete: () => {
                                //console.log('Done');
                            }
                        })
                }
            })
    }

    getCurrentDestinationString(): string {
        return this.loadDestinationCurrent ? this.loadDestinationCurrent.destinationAddressLabel : '';
    }

    getCurrentLoadDestinationId(): Guid {
        return this.loadDestinationCurrent ? this.loadDestinationCurrent.id : null;
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
                    this.sqlService.deleteItem('bids', id)
                        .pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
                            this.dialogRef.close({ action: 'reload' });
                        })
                }
            });
    }
    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        this.dialogRef.close({ action: 'submit', form: this.form.getRawValue() });
    }
    accept(): void {
        this.bidRow.status = 'Accepted';
        this.dialogRef.close({ action: 'accept', form: this.bidRow });
    }
    decline(): void {
        this.bidRow.status = 'Declined';
        this.dialogRef.close({ action: 'decline', form: this.bidRow });
    }
}
