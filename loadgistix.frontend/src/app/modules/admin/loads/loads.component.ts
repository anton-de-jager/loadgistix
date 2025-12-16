import {
    AsyncPipe,
    CommonModule,
    CurrencyPipe,
    NgClass,
    NgFor,
    NgIf,
} from '@angular/common';
import {
    Component,
    OnDestroy, inject,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { load } from 'app/models/load.model';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { SignalRService } from 'app/services/signal-r.service';
import { SqlService } from 'app/services/sql.service';
import {
    Observable,
    Subject,
    Subscription,
    debounceTime,
    fromEvent,
    takeUntil,
} from 'rxjs';
import { AddressLabelPipe } from 'app/pipes/address-label.pipe';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { DialogLoadComponent } from 'app/dialogs/dialog-load/dialog-load.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { loadType } from 'app/models/loadType.model';
import { VariableService } from 'app/services/variable.service';
import { DialogReviewComponent } from 'app/dialogs/dialog-review/dialog-review.component';
import { vehicle } from 'app/models/vehicle.model';
import { driver } from 'app/models/driver.model';
import { DialogBidListComponent } from 'app/dialogs/dialog-bid-list/dialog-bid-list.component';
import { DialogImageComponent } from 'app/dialogs/dialog-image/dialog-image.component';
import { DialogAccountComponent } from 'app/dialogs/dialog-account/dialog-account.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { stockProblem } from 'app/models/stockProblem.model';
import { returnReason } from 'app/models/returnReason.model';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { loadDestination } from 'app/models/loadDestination.model';
import { User } from 'app/core/user/user.types';
import { SignalRService } from 'app/services/signal-r.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-loads',
    templateUrl: './loads.component.html',
    styleUrls: ['./loads.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        AddressLabelPipe,
        NgIf,
        MatProgressBarModule,
        FormsModule,
        ReactiveFormsModule,
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
        MatProgressSpinnerModule,
    ],
})
export class LoadsComponent implements OnInit, OnDestroy {
    loading: boolean;

    private _unsubscribeAll = new Subject<void>();

    public loads: load[] = [];
    dataSource!: MatTableDataSource<load>;
    displayedColumns: string[];

    vehicleList: vehicle[] = [];
    driverList: driver[] = [];
    loadTypeList: loadType[] = [];
    returnReasonList: returnReason[] = [];
    stockProblemList: stockProblem[] = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    form!: FormGroup;

    showAdverts: boolean;

    rowCount: number = Math.trunc((window.innerHeight - 297) / 40 + 1);
    private destroy$ = new Subject<void>();
    iPaginator: number = 0;

    quantity: number = 0;
    currentUser: User | null = null;

    constructor(
        private dialog: MatDialog,
        public signalRService: SignalRService,
        public sqlService: SqlService,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private authService: AuthService,
        private variableService: VariableService,
        private router: Router
    ) {
        variableService.setPageSelected('My Loads');
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
        fromEvent(window, 'resize')
            .pipe(debounceTime(200), takeUntil(this.destroy$))

            .subscribe(() => {
                this.iPaginator = 0;
                this.setPaginator();
            });

        this.getSubscription();
        this.getVechicles();
        this.getDrivers();
        this.getLoadTypes();
        this.getStockProblems();
        this.getReturnReasons();
        this.getLoads();
        // this.initSignalR();
        this.subscribeWebSocket();
    }

    subscribeWebSocket() {
        this.signalRService.startConnection('load').then(startConnectionResult => {
            if (startConnectionResult) {
                this.signalRService.addLoadAddedListener();
                this.signalRService.addLoadUpdatedListener();
                this.signalRService.addLoadDeletedListener();

                this.signalRService.loadAdded
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((load: load) => {
                        console.log('SignalR: loadAdded', load);
                        if (!this.loads.find(x => x.id?.toString().toUpperCase() == load.id?.toString().toUpperCase())) {
                            this.loads.push(load);
                        }
                        this.dataSource = new MatTableDataSource(this.loads);
                        this.iPaginator = 0;
                        this.setPaginator();
                    });

                this.signalRService.loadUpdated
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((load: load) => {
                        console.log('SignalR: loadUpdated', load);
                        let i = this.loads.findIndex(x => x.id?.toString().toUpperCase() == load.id?.toString().toUpperCase());
                        if (i >= 0) {
                            this.loads[i] = load;
                            this.dataSource = new MatTableDataSource(this.loads);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    });

                this.signalRService.loadDeleted
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: any) => {
                        console.log('SignalR: loadDeleted', id);
                        let i = this.loads.findIndex(x => x.id?.toString().toUpperCase() == id?.toString().toUpperCase());
                        if (i >= 0) {
                            this.loads.splice(i, 1);
                            this.dataSource = new MatTableDataSource(this.loads);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    });
            }
        });
    }

    ngOnInit() {
        this.variableService.showAdverts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((showAdverts) => {
                this.showAdverts = showAdverts;
            });
    }

    // initSignalR() {
    //     this.signalRService.startConnection('load').then(startConnectionResult => {
    //         if (startConnectionResult) {
    //             this.signalRService.addLoadAddedListener();
    //             this.signalRService.addLoadUpdatedListener();
    //             this.signalRService.addLoadDeletedListener();

    //             this.signalRService.loadAdded
    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((load: load) => {
    //                     if (!this.loads.find(x => x.id == load.id)) {
    //                         this.loads.push(load);
    //                     }
    //                     this.dataSource = new MatTableDataSource(this.loads);
    //                     //this.dataSource = new MatTableDataSource(this.loads);
    //                     this.iPaginator = 0;
    //                     this.setPaginator();
    //                 });

    //             this.signalRService.loadUpdated
    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((load: load) => {
    //                     let i = this.loads.findIndex(x => x.id == load.id);
    //                     if (i >= 0) {
    //                         this.loads[i] = load;
    //                         this.dataSource = new MatTableDataSource(this.loads);
    //                         //this.dataSource = new MatTableDataSource(this.loads);
    //                         this.iPaginator = 0;
    //                         this.setPaginator();
    //                     }
    //                 });
    //             this.signalRService.loadDeleted

    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: Guid) => {
    //                     let i = this.loads.findIndex(x => x.id == id);
    //                     if (i >= 0) {
    //                         this.loads.splice(
    //                             this.loads.findIndex(x => x.id == id)!,
    //                             1
    //                         );
    //                         this.dataSource = new MatTableDataSource(this.loads);
    //                         //this.dataSource = new MatTableDataSource(this.loads);
    //                         this.iPaginator = 0;
    //                         this.setPaginator();
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
                this.quantity = (this.currentUser ? this.currentUser.email : '') == 'anton@madproducts.co.za' ? -1 : res[0].load;
            }
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getVechicles() {
        this.sqlService.getItems('vehicles').pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);;
            } else {
                this.vehicleList = apiResult.data;
            }
        });
    }
    getDrivers() {
        this.sqlService.getItems('drivers').pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);;
            } else {
                this.driverList = apiResult.data;
            }
        });
    }
    getLoadTypes() {
        this.sqlService.getItems('loadTypes').pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);;
            } else {
                this.loadTypeList = apiResult.data;
            }
        });
    }
    getReturnReasons() {
        this.sqlService.getItems('returnReasons').pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);;
            } else {
                this.returnReasonList = apiResult.data;
            }
        });
    }
    getStockProblems() {
        this.sqlService.getItems('stockProblems').pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);;
            } else {
                this.stockProblemList = apiResult.data;
            }
        });
    }
    getLoads() {
        this.loading = true;

        this.sqlService
            .getItems('loads')
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.loads = apiResult.data;
                    this.dataSource = new MatTableDataSource(this.loads);
                    //this.dataSource = new MatTableDataSource(this.loads);
                    this.iPaginator = 0;
                    this.setPaginator();
                }
            });
    }

    setPaginator() {
        this.iPaginator++;
        if (this.iPaginator < 5) {
            if (this.paginator) {
                this.displayedColumns =
                    window.innerWidth > 1000
                        ? [
                            'bidCount',
                            'description',
                            'originatingAddressLabel',
                            'destinationAddressLabel',
                            'dateOut',
                            'weight',
                            'status',
                        ]
                        : [
                            'bidCount',
                            'description',
                            'originatingAddressLabel',
                            'dateOut',
                            'status',
                        ];
                this.paginator.pageSize = Math.trunc(
                    (window.innerHeight - 297) / 40
                );
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                if (this.paginator.pageIndex != 0) {
                    if (
                        this.paginator.pageIndex + 1 >
                        this.paginator.getNumberOfPages()
                    ) {
                        this.paginator.lastPage();
                    }
                }
                this.loading = false;

            } else {
                setTimeout(() => {
                    this.setPaginator();
                }, 500);
            }
        } else {
            this.loading = false;

        }
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

    async initUpsert(row: any) {
        if ((this.dataSource.data.length < this.quantity) || (this.dataSource.data.length == this.quantity && row !== null) || (this.quantity === -1)) {
            this.loading = true;

            let loadBeforeStr: string = JSON.stringify(row);
            let loadBeforeObj: load = JSON.parse(loadBeforeStr) as load;


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
                        row == null ? null : row.dateIn,
                        Validators.required
                    ],
                    // dateIn: [
                    //     row == null
                    //         ? null
                    //         : row.dateIn
                    //             ? row.dateIn.seconds
                    //                 ? new Date(row.dateIn.seconds * 1000)
                    //                 : new Date(row.dateIn)
                    //             : null,
                    //     Validators.required,
                    // ],
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

                if (row == null) {
                    //this.fillDummyData();
                }

                const dialogConfig = new MatDialogConfig();
                dialogConfig.data = {
                    item: row,
                    form: this.form,
                    loadId: row ? row.id : null,
                    loadDestinationId: row == null ? null : row.loadDestinationId,
                    loadDestinationItems: loadDestinationItems,
                    loadDestinationCurrent: loadDestinationCurrent,
                    user: this.currentUser,
                    readOnly: row
                        ? row.status !== 'Open' && row.status !== 'Bid(s) Placed'
                        : false,
                    loadTypeList: this.loadTypeList,
                    returnReasonList: this.returnReasonList,
                    stockProblemList: this.stockProblemList,
                    title: row == null ? 'Insert' : 'Update',
                };

                dialogConfig.autoFocus = true;
                dialogConfig.disableClose = true;
                dialogConfig.hasBackdrop = true;

                if (row == null) {
                    const dialogRef = this.dialog.open(
                        DialogLoadComponent,
                        dialogConfig
                    );
                    this.loading = false;
                    dialogRef
                        .afterClosed()

                        .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
                            if (result !== false) {
                                Object.keys(result.form.controls).forEach(key => {
                                    if (key.includes('destinationAddressLabel')) {
                                        result.form.removeControl(key);
                                    }
                                    if (key.includes('destinationAddressLat')) {
                                        result.form.removeControl(key);
                                    }
                                    if (key.includes('destinationAddressLon')) {
                                        result.form.removeControl(key);
                                    }
                                });
                                result.form.addControl('destinationAddressLabel', this._formBuilder.control('test'));
                                result.form.addControl('destinationAddressLat', this._formBuilder.control(1));
                                result.form.addControl('destinationAddressLon', this._formBuilder.control(1));

                                setTimeout(() => {
                                    this.sqlService
                                        .createItem('loads', { Load: result.form.value, LoadDestination: result.loadDestinationItems })

                                        .pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
                                            // this.getLoads();
                                        });
                                }, 100);
                            }
                        });
                } else {
                    if (row.status == 'Open' || row.status == 'Bid(s) Placed') {
                        const dialogRef = this.dialog.open(
                            DialogLoadComponent,
                            dialogConfig
                        );
                        this.loading = false;
                        dialogRef
                            .afterClosed()

                            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
                                //console.log('result', result);
                                if (result !== false) {
                                    //console.log('update');
                                    if (result.action) {
                                        if (result.action == 'delete') {
                                            if (result.value) {
                                                let iDelete = this.loads.findIndex(x => x.id == result.value);
                                                if (iDelete >= 0) {
                                                    this.loads.splice(this.loads.findIndex(x => x.id == result.value)!, 1);
                                                    this.dataSource = new MatTableDataSource(this.loads);
                                                    this.iPaginator = 0;
                                                    this.setPaginator();
                                                }
                                            }
                                        }
                                    } else {
                                        //console.log('update');
                                        Object.keys(result.form.controls).forEach(key => {
                                            if (key.includes('destinationAddressLabel')) {
                                                result.form.removeControl(key);
                                            }
                                            if (key.includes('destinationAddressLat')) {
                                                result.form.removeControl(key);
                                            }
                                            if (key.includes('destinationAddressLon')) {
                                                result.form.removeControl(key);
                                            }
                                        });
                                        result.form.addControl('destinationAddressLabel', this._formBuilder.control('test'));
                                        result.form.addControl('destinationAddressLat', this._formBuilder.control(1));
                                        result.form.addControl('destinationAddressLon', this._formBuilder.control(1));

                                        setTimeout(() => {
                                            this.sqlService
                                                .updateItem('loads', { Load: result.form.value, LoadDestination: result.loadDestinationItems })

                                                .pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
                                                    this.getLoads();
                                                });
                                        }, 100);
                                    }
                                }
                            });
                    } else {
                        this.sqlService
                            .getItemsTagId('loads', 'route', row.id)

                            .pipe(takeUntil(this._unsubscribeAll)).subscribe((route) => {
                                if (route.data == "Unauthorised") {
                                    this.router.navigate(['/sign-out']);;
                                } else {
                                    dialogConfig.data.item.route = route.data;
                                    dialogConfig.data.form.controls['route'].setValue(
                                        route.data
                                    );

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

                                                } else {
                                                    Object.keys(result.form.controls).forEach(key => {
                                                        if (key.includes('destinationAddressLabel')) {
                                                            result.form.removeControl(key);
                                                        }
                                                        if (key.includes('destinationAddressLat')) {
                                                            result.form.removeControl(key);
                                                        }
                                                        if (key.includes('destinationAddressLon')) {
                                                            result.form.removeControl(key);
                                                        }
                                                    });
                                                    result.form.addControl('destinationAddressLabel', this._formBuilder.control('test'));
                                                    result.form.addControl('destinationAddressLat', this._formBuilder.control(1));
                                                    result.form.addControl('destinationAddressLon', this._formBuilder.control(1));

                                                    setTimeout(() => {
                                                        this.sqlService
                                                            .updateItem('loads', { Load: result.form.value, LoadDestination: result.loadDestinationItems })

                                                            .pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {
                                                                //this.getLoads();
                                                            });
                                                    }, 100);
                                                }
                                            }
                                        });
                                }
                            });
                    }
                }
            });
        } else {
            this.showPaypal();
            this.loading = false;

        }
    }

    showPaypal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'loads' };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(
            DialogAccountComponent,
            dialogConfig
        );

        // dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
        // });
    }

    // fillDummyData() {
    //     // this.form.controls["id"].setValue(null);
    //     // this.form.controls["userId"].setValue('hEOuWdTtyIZr6iHo5mXVhFYaNkw2');
    //     // this.form.controls["userDescription"].setValue('Anton de Jager');
    //     this.form.controls['loadTypeId'].setValue('0r781qQoK7lbREnRJ40m');
    //     this.form.controls['loadTypeDescription'].setValue('TBeef Fresh - Hanging');
    //     this.form.controls['liquid'].setValue(false);
    //     this.form.controls['description'].setValue('1');
    //     this.form.controls['note'].setValue('1');
    //     this.form.controls['price'].setValue(1);
    //     this.form.controls['bidCount'].setValue(1);
    //     this.form.controls['originatingAddressLabel'].setValue('Alberton');
    //     this.form.controls['originatingAddressLat'].setValue(-26);
    //     this.form.controls['originatingAddressLon'].setValue(26);
    //     this.form.controls['destinationAddressLabel'].setValue('Pretoria');
    //     this.form.controls['destinationAddressLat'].setValue(-27);
    //     this.form.controls['destinationAddressLon'].setValue(26);
    //     this.form.controls['route'].setValue(null);
    //     this.form.controls['meters'].setValue(1);
    //     this.form.controls['minutes'].setValue(1);
    //     this.form.controls['itemCount'].setValue(1);
    //     this.form.controls['weight'].setValue(1);
    //     this.form.controls['length'].setValue(1);
    //     this.form.controls['width'].setValue(1);
    //     this.form.controls['height'].setValue(1);
    //     this.form.controls['volume'].setValue(1);
    //     this.form.controls['totalValue'].setValue(1);
    //     this.form.controls['dateOut'].setValue(new Date('2023-12-01'));
    //     this.form.controls['dateIn'].setValue(new Date('2023-12-10'));
    //     this.form.controls['dateBidEnd'].setValue(new Date('2023-12-01'));
    //     this.form.controls['status'].setValue('Open');
    //     // this.loadTypeList = [{

    //     // }]
    // }

    viewBids(row: any) {
        this.form = this._formBuilder.group({
            userId: [row == null ? this.currentUser.id : row.userId],
            userDescription: [
                row == null
                    ? this.currentUser == null
                        ? 'n/a'
                        : this.currentUser.name
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
            liquid: [row == null ? null : row.liquid, Validators.required],
            description: [
                row == null ? null : row.description,
                Validators.required,
            ],
            note: [row == null ? null : row.note, Validators.required],
            price: [row == null ? null : row.price, Validators.required],
            loadDestinationId: [row == null ? null : row.loadDestinationId],
            originatingAddressLabel: [
                row == null ? null : row.originatingAddressLabel,
            ],
            originatingAddressLat: [
                row == null ? null : row.originatingAddressLat,
            ],
            originatingAddressLon: [
                row == null ? null : row.originatingAddressLon,
            ],
            destinationAddressLabel: [
                row == null ? null : row.destinationAddressLabel,
            ],
            destinationAddressLat: [
                row == null ? null : row.destinationAddressLat,
            ],
            destinationAddressLon: [
                row == null ? null : row.destinationAddressLon,
            ],
            route: [row == null ? null : row.route],
            meters: [row == null ? null : row.meters],
            minutes: [row == null ? null : row.minutes],
            itemCount: [
                row == null ? null : row.itemCount,
                Validators.required,
            ],
            weight: [row == null ? null : row.weight, Validators.required],
            length: [row == null ? null : row.length, Validators.required],
            width: [row == null ? null : row.width, Validators.required],
            height: [row == null ? null : row.height, Validators.required],
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
                row == null ? null : row.dateIn,
                Validators.required
            ],
            // dateIn: [
            //     row == null
            //         ? null
            //         : row.dateIn
            //             ? row.dateIn.seconds
            //                 ? new Date(row.dateIn.seconds * 1000)
            //                 : new Date(row.dateIn)
            //             : null,
            //     Validators.required,
            // ],
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
            avatar: [row == null ? null : row.avatar],
            avatarChanged: [false],
            status: [row == null ? 'Open' : row.status],
            statusLoad: [row == null ? 'Open' : row.statusLoad],
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            loadId: row.id,
            user: this.currentUser,
            item: row,
            form: this.form,
            loadList: this.loads,
            vehicleList: this.vehicleList,
            driverList: this.driverList,
            loadDestinationId: [row == null ? null : row.loadDestinationId],
            originatingAddressLabel: [
                row == null ? null : row.originatingAddressLabel,
            ],
            originatingAddressLat: [
                row == null ? null : row.originatingAddressLat,
            ],
            originatingAddressLon: [
                row == null ? null : row.originatingAddressLon,
            ],
            destinationAddressLabel: [
                row == null ? null : row.destinationAddressLabel,
            ],
            destinationAddressLat: [
                row == null ? null : row.destinationAddressLat,
            ],
            destinationAddressLon: [
                row == null ? null : row.destinationAddressLon,
            ],
            title: 'View',
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(
            DialogBidListComponent,
            dialogConfig
        );

        this.loading = false;
        dialogRef
            .afterClosed()

            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
                if (result && (result.action === 'accept' || result.action === 'decline')) {
                    this.getLoads();
                }
            });
    }

    getColor(status: string, bidCount: number) {
        switch (status) {
            case 'Open':
                return bidCount > 0 ? '#f8a40765' : '#5db1de65';
            case 'Bid(s) Placed':
                return bidCount > 0 ? '#f8a40765' : '#5db1de65';
            // case 'Bid(s) Placed': return '#f8a40765';
            case 'Accepted':
                return '#00ff0065';
            case 'Loaded':
                return '#fba7ed65';
            case 'Loaded Confirmed':
                return '#ff05d565';
            case 'Delivered':
                return '#00000065';
            case 'Delivered Confirmed':
                return '#b3b3b365';
            default:
                return '#5db1de65';
        }
    }

    getAddressSubstring(str: string, char: string) {
        let arr = str ? (str.split(char) ? str.split(char) : '') : '';
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }

    viewImage(avatar: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            avatar: avatar,
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        this.dialog.open(DialogImageComponent, dialogConfig);
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        // this.signalRService.endConnection();
    }
}
