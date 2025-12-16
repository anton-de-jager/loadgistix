import {
    Component,
    ViewChild,
    OnDestroy, inject,
    OnInit,
    ViewEncapsulation,
    AfterViewInit,
    Input,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { SharedService } from 'app/services/shared.service';
import {
    AsyncPipe,
    CommonModule,
    CurrencyPipe,
    NgClass,
    NgFor,
    NgIf,
} from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet.markercluster';
import { load } from 'app/models/load.model';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { UserService } from 'app/core/user/user.service';
import { SqlService } from 'app/services/sql.service';
import { vehicle } from 'app/models/vehicle.model';
import { driver } from 'app/models/driver.model';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Guid } from 'guid-typescript';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogLoadComponent } from 'app/dialogs/dialog-load/dialog-load.component';
import { VariableService } from 'app/services/variable.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AddressLabelPipe } from 'app/pipes/address-label.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { FuseAlertComponent } from '@fuse/components/alert';
// import { SignalRService } from 'app/services/signal-r.service';
import { SortPipe } from 'app/pipes/sort.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from 'app/core/auth/auth.service';
import { loadDestination } from 'app/models/loadDestination.model';
import { User } from 'app/core/user/user.types';
import { SignalRService } from 'app/services/signal-r.service';
import { environment } from 'environments/environment';

const iconDefault = L.icon({
    iconRetinaUrl: 'assets/images/marker-icon-2x.png',
    iconUrl: 'assets/images/marker-icon.png',
    shadowUrl: 'assets/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
    selector: 'app-loads-available',
    templateUrl: './loads-available.component.html',
    styleUrls: ['./loads-available.component.scss'],
    standalone: true,
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterLink,
        MatButtonModule,
        MatSidenavModule,
        LeafletModule,
        LeafletMarkerClusterModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        AddressLabelPipe,
        MatDividerModule,
        FuseAlertComponent,
        NgIf,
        MatProgressBarModule,
        FormsModule,
        ReactiveFormsModule,
        SortPipe,
        NgFor,
        NgClass,
        MatSlideToggleModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatRippleModule,
        AsyncPipe,
        CurrencyPipe,
        MatSnackBarModule,
        MatMenuModule,
    ],
})
export class LoadsAvailableComponent
    implements OnInit, AfterViewInit, OnDestroy {
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private subscriptionDrawer: Subscription;
    private map!: L.Map;
    private tiles!: L.TileLayer;
    lat: number = -26.330647;
    lon: number = 28.107455;
    // private markers!: L.LayerGroup;
    markersOrigin = {};
    markersDestination = {};
    polylines = {};
    markerData = [];
    polylineData = [];

    private markersLogo!: L.MarkerClusterGroup;
    markerClusterData: any[] = [];
    mapReady: boolean = false;
    signal = true;
    iLoaded = 0;
    loading: boolean = true;

    vehicleList: vehicle[] = [];
    driverList: driver[] = [];
    loadTypeList: driver[] = [];
    loadsAvailable: load[] = [];
    loads: load[] = [];

    quantity: number = 0;

    rangeItems: any[] = [
        { description: '10km', value: 10 },
        { description: '50km', value: 50 },
        { description: '100km', value: 100 },
        { description: '500km', value: 500 },
        { description: 'ALL', value: 100000 },
    ];
    input: string = '';
    range: number = 10;
    weight: number = 50;
    volumeCm: number = 50;
    volumeLt: number = 50;
    tabIndex: number = 0;
    rangeTargetOrigin: boolean = true;
    rangeTargetDestination: boolean = false;

    form!: FormGroup;

    showAdverts: boolean;
    currentUser: User | null = null;

    locationAvailable = false;
    private userLocationMarker: L.Marker | null = null;
    userLat: number | null = null;
    userLon: number | null = null;

    /**
     * Constructor
     */
    constructor(
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _formBuilder: FormBuilder,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private sharedService: SharedService,
        private variableService: VariableService,
        public signalRService: SignalRService,
        private sqlService: SqlService,
        private userService: UserService,
        private authService: AuthService,
        private router: Router
    ) {
        variableService.setPageSelected('Loads Available');
        this.userService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
                this.initPage();
            }
        });

        setTimeout(() => {
            if (!this.currentUser) {
                this.router.navigate(['/sign-out']);;
            }
        }, 2000);
    }

    initPage() {
        this.variableService.showAdverts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((showAdverts) => {
                this.showAdverts = showAdverts;
            });

        // this.initSignalR();
        this.subscribeWebSocket();

        this.iLoaded = 0;
        this.getSubscription();

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))

            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened if
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }
            });

        this.subscriptionDrawer = this.sharedService.event$

            .pipe(takeUntil(this._unsubscribeAll)).subscribe((event) => {
                if (event !== null) {
                    if (event.type == 'sidebar') {
                        this.drawerOpened = !this.drawerOpened;
                    }
                }
            });

        setTimeout(() => {
            this.mapReady = true;
            this.getCurrentLocation();
            this.getLoadTypes();
            this.getVehicles();
            this.getDrivers();
        }, 100);
    }

    subscribeWebSocket() {
        this.signalRService.startConnection('load').then(startConnectionResult => {
            if (startConnectionResult) {
                this.signalRService.addLoadAddedListener();
                this.signalRService.addLoadUpdatedListener();
                this.signalRService.addLoadDeletedListener();

                this.signalRService.loadAdded
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((load: load) => {
                        this.addMapItem(load);
                    });

                this.signalRService.loadUpdated
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((load: load) => {
                        let i = this.loadsAvailable.findIndex(x => x.id == load.id);
                        if (i >= 0) {
                            this.updateMapItem(i, load);
                        }
                    });

                this.signalRService.loadDeleted
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: any) => {
                        let i = this.loadsAvailable.findIndex(x => x.id == id);
                        if (i >= 0) {
                            this.deleteMapItem(i, id);
                        }
                    });
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    // initSignalR() {
    //     this.signalRService.startConnection('load').then(startConnectionResult => {
    //         if (startConnectionResult) {
    //             this.signalRService.addLoadAddedListener();
    //             this.signalRService.addLoadUpdatedListener();
    //             this.signalRService.addLoadDeletedListener();

    //             this.signalRService.loadAdded

    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((load: load) => {
    //                     this.addMapItem(load);
    //                 });
    //             this.signalRService.loadUpdated

    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((load: load) => {
    //                     let i = this.loadsAvailable.findIndex(x => x.id == load.id);
    //                     if (i >= 0) {
    //                         this.updateMapItem(i, load);
    //                     }
    //                 });
    //             this.signalRService.loadDeleted

    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: Guid) => {
    //                     let i = this.loadsAvailable.findIndex(x => x.id == id);
    //                     if (i >= 0) {
    //                         this.deleteMapItem(i, id);
    //                     }
    //                 });
    //         } else {
    //             this.router.navigate(['/sign-out']);;
    //         }
    //     });
    // }

    getTransactions(): Promise<any[]> {
        var promise = new Promise<any[]>((resolve) => {
            try {
                this.sqlService.getItems('transactions').pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.data == "Unauthorised") {
                            this.router.navigate(['/sign-out']);;
                        } else {
                            if (apiResult.result == true) {
                                resolve(apiResult.data);
                            } else {
                                resolve([{ advert: 0, directory: 0, load: 0, tms: 0, vehicle: 0 }]);
                            }
                        }
                    },
                    error: (error) => {
                        console.log('error', error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                        resolve([{ advert: 0, directory: 0, load: 0, tms: 0, vehicle: 0 }]);
                    },
                    complete: () => {
                    }
                });
            } catch (exception) {
                resolve([{ advert: 0, directory: 0, load: 0, tms: 0, vehicle: 0 }]);
            }
        });
        return promise;
    }

    getSubscription() {
        this.getTransactions().then(res => {
            if (res.length > 0) {
                this.quantity = (this.currentUser ? this.currentUser.email : '') == 'anton@madproducts.co.za' ? -1 : res[0].vehicle;
            }
        });
    }

    ngAfterViewInit(): void {

    }

    getLoadTypes() {
        this.sqlService
            .getItems('loadTypes')

            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.loadTypeList = apiResult.data;
                }
            });
    }
    getVehicles() {
        this.input = '';
        this.sqlService
            .getItems('vehicles')
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.vehicleList = apiResult.data;
                    this.vehicleList.forEach((vehicle) => {
                        this.input +=
                            (this.input == '' ? '' : '|') +
                            vehicle.id +
                            ',' +
                            vehicle.originatingAddressLat +
                            ',' +
                            vehicle.originatingAddressLon +
                            ',' +
                            vehicle.destinationAddressLat +
                            ',' +
                            vehicle.destinationAddressLon;
                    });
                    setTimeout(() => {
                        this.getLoads().then((getLoadsResult: load[]) => {
                            this.loads = getLoadsResult;
                            this.loadsAvailable = getLoadsResult;
                            this.getCurrentLocation();
                        });
                    }, 100);
                }
            });
    }
    getDrivers() {
        this.sqlService
            .getItems('drivers')
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.driverList = apiResult.data;
                }
            });
    }
    getLoads(): Promise<load[]> {
        var promise = new Promise<load[]>((resolve) => {
            try {
                this.variableService
                    .checkLocationPermissions(true)
                    .then((checkPermissionResult) => {
                        if (checkPermissionResult && this.currentUser) {
                            this.variableService.getPosition().then((res) => {
                                //     userId: this.currentUser.id,
                                //     input: this.input,
                                //     lat: res!.coords.latitude,
                                //     lon: res!.coords.longitude,
                                //     distance: this.range,
                                //     origin: this.rangeTargetOrigin,
                                //     destination:
                                //         this.rangeTargetDestination,
                                //     weight: this.weight ? this.weight : 0,
                                //     volumeCm: this.volumeCm
                                //         ? this.volumeCm
                                //         : this.volumeCm,
                                //     volumeLt: this.volumeLt
                                //         ? this.volumeLt
                                //         : 0,
                                // });
                                this.sqlService
                                    .getItemsTag(this.currentUser, 'loads', 'available', {
                                        userId: this.currentUser.id,
                                        input: this.input,
                                        lat: res!.coords.latitude,
                                        lon: res!.coords.longitude,
                                        distance: this.range,
                                        origin: this.rangeTargetOrigin,
                                        destination:
                                            this.rangeTargetDestination,
                                        weight: this.weight ? this.weight : 0,
                                        volumeCm: this.volumeCm
                                            ? this.volumeCm
                                            : this.volumeCm,
                                        volumeLt: this.volumeLt
                                            ? this.volumeLt
                                            : 0,
                                    })

                                    .pipe(takeUntil(this._unsubscribeAll)).subscribe({
                                        next: (apiResult: any) => {
                                            if (apiResult.data == "Unauthorised") {
                                                this.router.navigate(['/sign-out']);;
                                            } else {
                                                if (apiResult.result == true) {
                                                    resolve(apiResult.data);
                                                } else {
                                                    resolve([]);
                                                }
                                            }
                                        },
                                        error: (error) => {
                                            resolve([]);
                                        },
                                        complete: () => { },
                                    });
                            });
                        } else {
                            // this.fuseSplashScreenService.hide(); this.userService.setLoading('loads-available', false);
                            // this.variableService.showInfo('ERROR', 'Permission Error', 'Location needs to be enabled for this feature', false).then(showInfoResult => {
                            //     this.fuseSplashScreenService.show(); this.userService.setLoading('loads-available', true);
                            //     resolve([]);
                            // });
                            if (this.currentUser) {
                                this.sqlService
                                    .updateItemTag('loads', 'available', {
                                        userId: this.currentUser.id,
                                        input: this.input,
                                        lat: this.lat,
                                        lon: this.lon,
                                        distance: this.range,
                                        origin: this.rangeTargetOrigin,
                                        destination: this.rangeTargetDestination,
                                        weight: this.weight ? this.weight : 0,
                                        volumeCm: this.volumeCm
                                            ? this.volumeCm
                                            : this.volumeCm,
                                        volumeLt: this.volumeLt ? this.volumeLt : 0,
                                    })

                                    .pipe(takeUntil(this._unsubscribeAll)).subscribe({
                                        next: (apiResult: any) => {
                                            if (apiResult.result == true) {
                                                resolve(apiResult.data);
                                            } else {
                                                resolve([]);
                                            }
                                        },
                                        error: (error) => {
                                            resolve([]);
                                        },
                                        complete: () => { },
                                    });
                            }
                        }
                    });
            } catch (exception) {
                this.variableService
                    .showInfo(
                        'ERROR',
                        'Loads',
                        JSON.stringify(exception),
                        false
                    )
                    .then((showInfoResult) => {
                        resolve([]);
                    });
                //this._snackBar.open('Error: ' + JSON.stringify(exception), null, { duration: 2000 });
            }
        });
        return promise;
    }
    updateLoads() {
        this.loading = true;

        this.loadsAvailable = [];
        this.getLoads().then((getLoadsResult: load[]) => {
            this.loads = getLoadsResult;
            this.loadsAvailable = getLoadsResult;
            this.getCurrentLocation();
        });
    }


    getLoadDestinations(id: Guid): Promise<loadDestination[]> {
        var promise = new Promise<loadDestination[]>((resolve) => {
            try {
                if (id) {
                    this.sqlService.getItemsTag(this.currentUser, 'loadDestinations', 'id', { id: id }).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.data == "Unauthorised") {
                                this.router.navigate(['/sign-out']);;
                            } else {
                                if (apiResult.result == true) {
                                    resolve(apiResult.data);
                                } else {
                                    resolve([]);
                                }
                            }
                        },
                        error: (error) => {
                            console.log('error', error);
                            this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                            resolve([]);
                        },
                        complete: () => {
                        }
                    });
                } else {
                    resolve([]);
                }
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    async initUpsert(row: any, readOnly: number) {
        console.log('initUpsert', row, readOnly);
        if (
            this.quantity !== 0
        ) {
            readOnly = row.userId == this.currentUser.id ? 0 : readOnly;
            if (
                row.status == 'Open' ||
                row.status == 'Bid(s) Placed' ||
                row == null
            ) {
                this.getLoadDestinations(row ? row.id : null).then(loadDestinationItems => {
                    let loadDestinationCurrent = loadDestinationItems.filter(x => x.id == row.loadDestinationId) ? loadDestinationItems.filter(x => x.id == row.loadDestinationId)[0] : null;
                    this.form = this._formBuilder.group({
                        id: [row == null ? Guid.create().toString() : row.id],
                        loadId: [row == null ? Guid.create().toString() : row.id],
                        userId: [row == null ? this.currentUser.id : row.userId],
                        userDescription: [
                            row == null
                                ? this.currentUser.name
                                    ? this.currentUser.name
                                        ? this.currentUser.name
                                        : 'n/a'
                                    : 'n/a'
                                : row.userDescription,
                        ],
                        loadTypeId: [
                            row == null ? null : row.loadTypeId,
                            Validators.required,
                        ],
                        loadTypeDescription: [
                            row == null ? null : row.loadTypeDescription,
                            Validators.required,
                        ],
                        liquid: [row == null ? true : row.liquid],
                        description: [
                            row == null ? null : row.description,
                            Validators.required,
                        ],
                        note: [row == null ? null : row.note],
                        price: [row == null ? null : row.price, Validators.required],
                        itemCount: [
                            row == null ? null : row.itemCount,
                            Validators.required,
                        ],
                        weight: [row == null ? null : row.weight, Validators.required],
                        length: [row == null ? null : row.length, Validators.required],
                        width: [row == null ? null : row.width, Validators.required],
                        height: [row == null ? null : row.height, Validators.required],
                        volume: [row == null ? null : row.volume, Validators.required],
                        totalValue: [
                            row == null ? null : row.totalValue,
                            Validators.required,
                        ],
                        dateOut: [
                            row == null
                                ? null
                                : row.dateOut
                                    ? row.dateOut.seconds
                                        ? new Date(row.dateOut.seconds * 1000)
                                        : new Date(row.dateOut)
                                    : null,
                            Validators.required,
                        ],
                        dateIn: [
                            row == null
                                ? null
                                : row.dateIn
                                    ? row.dateIn.seconds
                                        ? new Date(row.dateIn.seconds * 1000)
                                        : new Date(row.dateIn)
                                    : null,
                            Validators.required,
                        ],
                        dateBidEnd: [
                            row == null
                                ? null
                                : row.dateBidEnd
                                    ? row.dateBidEnd.seconds
                                        ? new Date(row.dateBidEnd.seconds * 1000)
                                        : new Date(row.dateBidEnd)
                                    : null,
                            Validators.required,
                        ],
                        fridgeHours: [row == null ? null : row.fridgeHours],
                        kgsLoaded: [row == null ? null : row.kgsLoaded],
                        customerLoadedForm: [row == null ? null : row.customerLoadedForm],

                        bidCount: [row == null ? 0 : row.bidCount],
                        reviewAverageLoad: [row == null ? 0 : row.reviewAverageLoad],
                        reviewCountLoad: [row == null ? 0 : row.reviewCountLoad],
                        status: [row == null ? 'Open' : row.status],
                        statusLoad: [row == null ? 'Open' : row.statusLoad],
                        loadDestinationId: [row == null ? null : row.loadDestinationId],
                        pos: [loadDestinationCurrent == null ? 0 : loadDestinationCurrent.pos],
                        originatingAddressLabel: [
                            row == null ? null : row.originatingAddressLabel,
                            Validators.required,
                        ],
                        originatingAddressLat: [
                            row == null ? null : row.originatingAddressLat,
                            Validators.required,
                        ],
                        originatingAddressLon: [
                            row == null ? null : row.originatingAddressLon,
                            Validators.required,
                        ],
                        destinationAddressLabel: [
                            loadDestinationCurrent == null ? null : loadDestinationCurrent.destinationAddressLabel,
                            Validators.required,
                        ],
                        destinationAddressLat: [
                            loadDestinationCurrent == null ? null : loadDestinationCurrent.destinationAddressLat,
                            Validators.required,
                        ],
                        destinationAddressLon: [
                            loadDestinationCurrent == null ? null : loadDestinationCurrent.destinationAddressLon,
                            Validators.required,
                        ],
                        route: [row == null ? null : row.route],
                        meters: [row == null ? null : row.meters],
                        minutes: [row == null ? null : row.minutes],
                        odoStart: [loadDestinationCurrent == null ? null : loadDestinationCurrent.odoStart],
                        odoEnd: [loadDestinationCurrent == null ? null : loadDestinationCurrent.odoEnd],
                        deliveryNoteNumber: [loadDestinationCurrent == null ? null : loadDestinationCurrent.deliveryNoteNumber],
                        weighBridgeTicketNumber: [loadDestinationCurrent == null ? null : loadDestinationCurrent.weighBridgeTicketNumber],
                        returnDocumentNumber: [loadDestinationCurrent == null ? null : loadDestinationCurrent.returnDocumentNumber],
                        returnKgs: [loadDestinationCurrent == null ? null : loadDestinationCurrent.returnKgs],
                        returnReasonId: [loadDestinationCurrent == null ? null : loadDestinationCurrent.returnReasonId],
                        stockProblemId: [loadDestinationCurrent == null ? null : loadDestinationCurrent.stockProblemId],
                        returnPallets: [loadDestinationCurrent == null ? null : loadDestinationCurrent.returnPallets],
                        userIdLoaded: [loadDestinationCurrent == null ? null : loadDestinationCurrent.userIdLoaded],
                        userIdLoadedConfirmed: [loadDestinationCurrent == null ? null : loadDestinationCurrent.userIdLoadedConfirmed],
                        userIdDelivered: [loadDestinationCurrent == null ? null : loadDestinationCurrent.userIdDelivered],
                        userIdDeliveredConfirmed: [loadDestinationCurrent == null ? null : loadDestinationCurrent.userIdDeliveredConfirmed],
                    });

                    const dialogConfig = new MatDialogConfig();
                    dialogConfig.data = {
                        item: row,
                        form: this.form,
                        user: this.currentUser,
                        vehicleList: this.vehicleList,
                        driverList: this.driverList,
                        loadTypeList: this.loadTypeList,
                        loadId: row ? row.id : null,
                        loadDestinationId: row == null ? null : row.loadDestinationId,
                        loadDestinationItems: loadDestinationItems,
                        loadDestinationCurrent: loadDestinationCurrent,
                        originatingAddressLabel:
                            row == null ? null : row.originatingAddressLabel,
                        originatingAddressLat:
                            row == null ? null : row.originatingAddressLat,
                        originatingAddressLon:
                            row == null ? null : row.originatingAddressLon,
                        destinationAddressLabel:
                            row == null ? null : row.destinationAddressLabel,
                        destinationAddressLat:
                            row == null ? null : row.destinationAddressLat,
                        destinationAddressLon:
                            row == null ? null : row.destinationAddressLon,
                        title: readOnly
                            ? 'View'
                            : row == null
                                ? 'Insert'
                                : 'Update',
                        readOnly: readOnly,
                    };

                    dialogConfig.autoFocus = true;
                    dialogConfig.disableClose = true;
                    dialogConfig.hasBackdrop = true;

                    const dialogRef = this.dialog.open(
                        DialogLoadComponent,
                        dialogConfig
                    );

                    this.loading = false;
                    dialogRef
                        .afterClosed()

                        .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
                            if (result !== false) {
                                if (result.action == 'reload') {
                                    this.updateLoads();
                                } else {
                                    this.sqlService
                                        .updateItem('loads', { Load: result.form.value, LoadDestination: result.loadDestinationItems })

                                        .pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
                                            this.updateLoads();
                                        });
                                }
                            }
                        });
                });
            }
        } else {
            //this.showPaypal();
        }
    }

    async getCurrentLocation() {
        this.variableService
            .checkLocationPermissions(false)
            .then(async (permission) => {
                this.signal = permission;
                if (permission) {
                    this.locationAvailable = true;
                    this.variableService.getPosition().then((coordinates) => {
                        this.lat = coordinates!.coords.latitude;
                        this.lon = coordinates!.coords.longitude;
                        this.initMap();
                    });
                } else {
                    this.locationAvailable = false;
                    // this.variableService
                    //     .showInfo(
                    //         'ERROR',
                    //         'Permission Error',
                    //         'Location needs to be enabled for this feature',
                    //         true
                    //     )
                    //     .then((showInfoResult) => {
                    //         this.initMap();
                    //     });
                }
            });
    }

    requestPermission() {
        if (Capacitor.getPlatform() !== 'web') {
            this.variableService.requestPermission().then((location) => {
                if (location == 'granted') {
                    this.signal = true;
                }
            });
        }
    }

    addUserLocationMarker() {
        // Remove existing user location marker if it exists
        if (this.userLocationMarker && this.map) {
            this.map.removeLayer(this.userLocationMarker);
        }

        if (this.lat && this.lon && this.map) {
            // Create a custom icon for user location (blue pulsing dot) - LARGER SIZE
            const userLocationIcon = L.divIcon({
                className: 'user-location-marker',
                html: `
                    <div style="position: relative; width: 48px; height: 48px;">
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 48px;
                            height: 48px;
                            background-color: rgba(66, 133, 244, 0.3);
                            border-radius: 50%;
                            animation: pulse 2s ease-out infinite;
                        "></div>
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 28px;
                            height: 28px;
                            background-color: #4285F4;
                            border: 4px solid white;
                            border-radius: 50%;
                            box-shadow: 0 3px 8px rgba(0,0,0,0.4);
                        "></div>
                    </div>
                `,
                iconSize: [48, 48],
                iconAnchor: [24, 24],
            });

            this.userLocationMarker = L.marker(new L.LatLng(this.lat, this.lon), {
                icon: userLocationIcon,
                zIndexOffset: 1000, // Ensure it's on top
            });

            this.userLocationMarker.bindPopup('<strong>Your Location</strong><br><small>(May be approximate if using VPN)</small>');
            this.userLocationMarker.addTo(this.map);
        }
    }

    getIcon(str: string, status: string, bidCount: number) {
        let url: string = '';
        switch (status) {
            case 'Logo':
                url = 'assets/images/logo-square.png';
                break;
            case 'Open':
                url =
                    'assets/images/' +
                    str +
                    '-' +
                    (bidCount > 0 ? 'bids' : 'open') +
                    '.png';
                break;
            case 'Bid(s) Placed':
                url =
                    'assets/images/' +
                    str +
                    '-' +
                    (bidCount > 0 ? 'bids' : 'open') +
                    '.png';
                break;
            // case 'Bid(s) Placed': url = 'assets/images/' + str + '-bids.png'; break;
            case 'Accepted':
                url = 'assets/images/' + str + '-accepted.png';
                break;
            case 'Loaded':
                url = 'assets/images/' + str + '-loaded.png';
                break;
            case 'Loaded Confirmed':
                url = 'assets/images/' + str + '-loaded-confirmed.png';
                break;
            case 'Delivered':
                url = 'assets/images/' + str + '-delivered.png';
                break;
            case 'Delivered Confirmed':
                url = 'assets/images/' + str + '-delivered-confirmed.png';
                break;
            default:
                url = 'assets/images/' + str + '-open.png';
                break;
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
                shadowSize: [50, 50],
            });
        } else {
            if (str == 'destination') {
                return L.icon({
                    iconRetinaUrl: url,
                    iconUrl: url,
                    shadowUrl: '',
                    iconSize: [42, 50],
                    iconAnchor: [12, 50],
                    popupAnchor: [1, -34],
                    tooltipAnchor: [16, -28],
                    shadowSize: [50, 50],
                });
            } else {
                return L.icon({
                    iconRetinaUrl: url,
                    iconUrl: url,
                    shadowUrl: '',
                    iconSize: [200, 200],
                    iconAnchor: [12, 50],
                    popupAnchor: [1, -34],
                    tooltipAnchor: [16, -28],
                    shadowSize: [50, 50],
                });
            }
        }
    }
    getColor(status: string, bidCount: number) {
        switch (status) {
            case 'Open':
                return bidCount > 0 ? '#f8a407' : '#5db1de';
            case 'Bid(s) Placed':
                return bidCount > 0 ? '#f8a407' : '#5db1de';
            // case 'Bid(s) Placed': return '#f8a407';
            case 'Accepted':
                return '#00ff00';
            case 'Loaded':
                return '#fba7ed';
            case 'Loaded Confirmed':
                return '#ff05d5';
            case 'Delivered':
                return '#000000';
            case 'Delivered Confirmed':
                return '#b3b3b3';
            default:
                return '#5db1de';
        }
    }

    private async initMap(): Promise<void> {
        this.markersOrigin = {};
        this.markersDestination = {};
        this.polylines = {};
        this.markerData = [];
        this.polylineData = [];

        if (this.mapReady && this.iLoaded < 100) {
            if (this.map) {
                this.map.off();
                this.map.remove();
            }

            // this.tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            //     maxZoom: 18,
            //     minZoom: 3,
            //     attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
            // });
            this.tiles = L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    maxZoom: 18,
                    minZoom: 3,
                    attribution:
                        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }
            );
            const container = document.getElementById('map');
            if (container) {
                this.map = L.map('map', {
                    center: [this.lat!, this.lon],
                    maxZoom: 18,
                    zoom: 14,
                    layers: [this.tiles],
                });
                // this.markers = L.markerClusterGroup({ animateAddingMarkers: true, showCoverageOnHover: true, zoomToBoundsOnClick: true });
                // this.markers.on('clusterclick', function (a) {
                //     a.propagatedFrom.spiderfy();
                // });

                this.markersLogo = L.markerClusterGroup({
                    animateAddingMarkers: false,
                    showCoverageOnHover: false,
                    zoomToBoundsOnClick: false,
                });
                this.markersLogo.addLayer(
                    L.marker(new L.LatLng(-35, -20), {
                        icon: this.getIcon('logo', 'Logo', 0),
                    })
                );
                this.markersLogo.addLayer(
                    L.marker(new L.LatLng(-35, 40), {
                        icon: this.getIcon('logo', 'Logo', 0),
                    })
                );
                this.markersLogo.addTo(this.map);

                // Add user location marker
                if (this.lat && this.lon && this.locationAvailable) {
                    this.addUserLocationMarker();
                }

                var minlat = 200,
                    minlon = 200,
                    maxlat = -200,
                    maxlon = -200;
                let iLoad: number = 0;

                if (this.loadsAvailable.length == 0) {
                    this.loading = false;

                } else {
                    for (const loadItem of this.loadsAvailable) {
                        iLoad++;
                        let color = this.getColor(
                            loadItem.status,
                            loadItem.bidCount
                        );

                        this.markerData.push({
                            id: loadItem.id,
                            originating: L.marker(
                                new L.LatLng(
                                    loadItem.originatingAddressLat!,
                                    loadItem.originatingAddressLon!
                                ),
                                {
                                    icon: this.getIcon(
                                        'origin',
                                        loadItem.status,
                                        loadItem.bidCount
                                    ),
                                }
                            ).on('click', () => {
                                this.initUpsert(
                                    loadItem,
                                    loadItem.userId == this.currentUser.id ? 0 : 1
                                );
                            }),
                            destination: L.marker(
                                new L.LatLng(
                                    loadItem.destinationAddressLat!,
                                    loadItem.destinationAddressLon!
                                ),
                                {
                                    icon: this.getIcon(
                                        'destination',
                                        loadItem.status,
                                        loadItem.bidCount
                                    ),
                                }
                            ).on('click', () => {
                                this.initUpsert(
                                    loadItem,
                                    loadItem.userId == this.currentUser.id ? 0 : 1
                                );
                            }),
                        });
                        this.polylineData.push({
                            id: loadItem.id,
                            polyline: L.polyline(
                                JSON.parse(loadItem.route.replaceAll('"lat":', '').replaceAll('"lng":', '').replaceAll('{', '[').replaceAll('}', ']')!).map((coords: any) =>
                                    L.latLng(
                                        (coords as [number, number])[0],
                                        (coords as [number, number])[1]
                                    )
                                ),
                                { color: color, weight: 5 }
                            )
                                .on('mouseover', function (e) {
                                    e.target.setStyle({
                                        color: color,
                                        weight: 10,
                                    });
                                })
                                .on('mouseout', function (e) {
                                    e.target.setStyle({
                                        color: color,
                                        weight: 5,
                                    });
                                })
                                .on('click', () => {
                                    this.initUpsert(
                                        loadItem,
                                        loadItem.userId == this.currentUser.id ? 0 : 1
                                    );
                                }),
                        });

                        let markerOrigin =
                            this.markerData[
                                this.markerData.findIndex(
                                    x => x.id == loadItem.id
                                )
                            ].originating;
                        this.markersOrigin[
                            this.markerData.findIndex(x => x.id == loadItem.id)
                        ] = markerOrigin;

                        let markerDestination =
                            this.markerData[
                                this.markerData.findIndex(
                                    x => x.id == loadItem.id
                                )
                            ].destination;
                        this.markersDestination[
                            this.markerData.findIndex(x => x.id == loadItem.id)
                        ] = markerDestination;

                        let polyline =
                            this.polylineData[
                                this.polylineData.findIndex(
                                    x => x.id == loadItem.id
                                )
                            ].polyline;
                        this.polylines[
                            this.polylineData.findIndex(x => x.id == loadItem.id)
                        ] = polyline;

                        if (minlat > loadItem.originatingAddressLat!)
                            minlat = loadItem.originatingAddressLat!;
                        if (minlon > loadItem.originatingAddressLon!)
                            minlon = loadItem.originatingAddressLon!;
                        if (maxlat < loadItem.originatingAddressLat!)
                            maxlat = loadItem.originatingAddressLat!;
                        if (maxlon < loadItem.originatingAddressLon!)
                            maxlon = loadItem.originatingAddressLon!;

                        if (minlat > loadItem.destinationAddressLat!)
                            minlat = loadItem.destinationAddressLat!;
                        if (minlon > loadItem.destinationAddressLon!)
                            minlon = loadItem.destinationAddressLon!;
                        if (maxlat < loadItem.destinationAddressLat!)
                            maxlat = loadItem.destinationAddressLat!;
                        if (maxlon < loadItem.destinationAddressLon!)
                            maxlon = loadItem.destinationAddressLon!;

                        if (iLoad == this.loadsAvailable.length) {
                            setTimeout(async () => {
                                await this.delay(100);
                                this.map.fitBounds(L.latLngBounds(new L.LatLng(minlat, minlon), new L.LatLng(maxlat, maxlon)));
                                await this.delay(100);
                                this.map.zoomOut(1);

                                this.loadsAvailable.forEach((element) => {
                                    this.markersOrigin[
                                        this.markerData.findIndex(
                                            x => x.id == element.id
                                        )
                                    ].addTo(this.map);
                                });
                                await this.delay(1000);
                                this.loadsAvailable.forEach((element) => {
                                    this.polylines[
                                        this.polylineData.findIndex(
                                            x => x.id == element.id
                                        )
                                    ].addTo(this.map);
                                });
                                this.loadsAvailable.forEach((element) => {
                                    this.markersDestination[
                                        this.markerData.findIndex(
                                            x => x.id == element.id
                                        )
                                    ].addTo(this.map);
                                });
                                this.loading = false;
                            }, 100);
                        }
                    }
                }
            }
        } else {
            setTimeout(() => {
                this.iLoaded++;
                this.initMap();
            }, 500);
        }
    }

    addMapItem(item: load) {
        const container = document.getElementById('map');
        if (!container) {
            this.map = L.map('map', {
                center: [this.lat!, this.lon],
                maxZoom: 18,
                zoom: 14,
                layers: [this.tiles],
            });
        }
        let color = this.getColor(item.status, item.bidCount);

        this.markerData.push({
            id: item.id,
            originating: L.marker(
                new L.LatLng(
                    item.originatingAddressLat!,
                    item.originatingAddressLon!
                ),
                { icon: this.getIcon('origin', item.status, item.bidCount) }
            ).on('click', () => {
                this.initUpsert(item, item.userId == this.currentUser.id ? 0 : 1);
            }),
            destination: L.marker(
                new L.LatLng(
                    item.destinationAddressLat!,
                    item.destinationAddressLon!
                ),
                {
                    icon: this.getIcon(
                        'destination',
                        item.status,
                        item.bidCount
                    ),
                }
            ).on('click', () => {
                this.initUpsert(item, item.userId == this.currentUser.id ? 0 : 1);
            }),
        });
        this.polylineData.push({
            id: item.id,
            polyline: L.polyline(
                JSON.parse(item.route.replaceAll('"lat":', '').replaceAll('"lng":', '').replaceAll('{', '[').replaceAll('}', ']')!).map((coords: any) =>
                    L.latLng(
                        (coords as [number, number])[0],
                        (coords as [number, number])[1]
                    )
                ),
                { color: color, weight: 5 }
            )
                .on('mouseover', function (e) {
                    e.target.setStyle({
                        color: color,
                        weight: 10,
                    });
                })
                .on('mouseout', function (e) {
                    e.target.setStyle({
                        color: color,
                        weight: 5,
                    });
                })
                .on('click', () => {
                    this.initUpsert(item, item.userId == this.currentUser.id ? 0 : 1);
                }),
        });

        let markerOrigin =
            this.markerData[this.markerData.findIndex(x => x.id == item.id)]
                .originating;
        this.markersOrigin[this.markerData.findIndex(x => x.id == item.id)] =
            markerOrigin.addTo(this.map);

        let markerDestination =
            this.markerData[this.markerData.findIndex(x => x.id == item.id)]
                .destination;
        this.markersDestination[
            this.markerData.findIndex(x => x.id == item.id)
        ] = markerDestination.addTo(this.map);

        let polyline =
            this.polylineData[
                this.polylineData.findIndex(x => x.id == item.id)
            ].polyline;
        this.polylines[this.polylineData.findIndex(x => x.id == item.id)] =
            polyline.addTo(this.map);

        this.loadsAvailable.push(item);
    }
    updateMapItem(i: number, item: load) {
        if (this.map) {
            if (this.markersOrigin) { this.map.removeLayer(this.markersOrigin[i]); }
            if (this.markersDestination) { this.map.removeLayer(this.markersDestination[i]); }
            if (this.polylines) { this.map.removeLayer(this.polylines[i]); }

            let color = this.getColor(item.status, item.bidCount);

            this.polylines[i] = L.polyline(
                JSON.parse(item.route.replaceAll('"lat":', '').replaceAll('"lng":', '').replaceAll('{', '[').replaceAll('}', ']')!).map((coords: any) =>
                    L.latLng(
                        (coords as [number, number])[0],
                        (coords as [number, number])[1]
                    )
                ),
                { color: color, weight: 5 }
            )
                .on('mouseover', function (e) {
                    e.target.setStyle({
                        color: color,
                        weight: 10,
                    });
                })
                .on('mouseout', function (e) {
                    e.target.setStyle({
                        color: color,
                        weight: 5,
                    });
                })
                .on('click', () => {
                    this.initUpsert(item, item.userId == this.currentUser.id ? 0 : 1);
                })
                .addTo(this.map);
            this.markersOrigin[i] = L.marker(
                new L.LatLng(
                    item.originatingAddressLat!,
                    item.originatingAddressLon!
                ),
                { icon: this.getIcon('origin', item.status, item.bidCount) }
            )
                .on('click', () => {
                    this.initUpsert(item, item.userId == this.currentUser.id ? 0 : 1);
                })
                .addTo(this.map);
            this.markersDestination[i] = L.marker(
                new L.LatLng(
                    item.destinationAddressLat!,
                    item.destinationAddressLon!
                ),
                { icon: this.getIcon('destination', item.status, item.bidCount) }
            )
                .on('click', () => {
                    this.initUpsert(item, item.userId == this.currentUser.id ? 0 : 1);
                })
                .addTo(this.map);

            this.loadsAvailable[i] = item;
        }
    }
    deleteMapItem(i: number, id: Guid) {
        if (this.markersOrigin) {
            this.map.removeLayer(this.markersOrigin[i]);
            delete this.markersOrigin[this.markersOrigin[i]];
        }
        if (this.markersDestination) {
            this.map.removeLayer(this.markersDestination[i]);
            delete this.markersDestination[this.markersDestination[i]];
        }
        if (this.polylines) {
            this.map.removeLayer(this.polylines[i]);
            delete this.polylines[this.polylines[i]];
        }

        setTimeout(() => {
            this.loadsAvailable.splice(
                this.loadsAvailable.findIndex(x => x.id == id)!,
                1
            );
        }, 200);
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this.subscriptionDrawer.unsubscribe();
        // this.signalRService.endConnection();
        if (this.map) {
            this.map.off();
            this.map.remove();
            console.log('removing map');
            this.map = null;
        }
    }
}
