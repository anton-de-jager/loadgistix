import {
    Component,
    Inject,
    OnDestroy, inject,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    MatDialogConfig,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import {
    debounceTime,
    first,
    fromEvent,
    Observable,
    Subject,
    Subscription,
    takeUntil,
} from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { StarRatingColor } from 'app/layout/common/star-rating/star-rating.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VariableService } from 'app/services/variable.service';
import { DialogBidComponent } from 'app/dialogs/dialog-bid/dialog-bid.component';

import { Guid } from 'guid-typescript';
import { load } from 'app/models/load.model';
import { bid } from 'app/models/bid.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    AsyncPipe,
    CommonModule,
    CurrencyPipe,
    NgClass,
    NgFor,
    NgForOf,
    NgIf,
} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'app/core/user/user.service';
import { driver } from 'app/models/driver.model';
import { vehicle } from 'app/models/vehicle.model';
import { SortPipe } from 'app/pipes/sort.pipe';
import { User } from 'app/core/user/user.types';
import { loadType } from 'app/models/loadType.model';
import { SqlService } from 'app/services/sql.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddressLabelPipe } from 'app/pipes/address-label.pipe';
// import { SignalRService } from 'app/services/signal-r.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { loadDestination } from 'app/models/loadDestination.model';
import { returnReason } from 'app/models/returnReason.model';
import { stockProblem } from 'app/models/stockProblem.model';
import { SignalRService } from 'app/services/signal-r.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'dialog-bid-list',
    templateUrl: 'dialog-bid-list.component.html',
    standalone: true,
    imports: [
        MatIconModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatDialogModule,
        MatDatepickerModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        CommonModule,
        NgClass,
        NgFor,
        NgForOf,
        NgIf,
        SortPipe,
        MatTableModule,
        MatSortModule,
        AddressLabelPipe,
        MatProgressBarModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatRippleModule,
        AsyncPipe,
        CurrencyPipe,
    ],
    providers: [SortPipe],
    encapsulation: ViewEncapsulation.None,
})
export class DialogBidListComponent implements OnDestroy {
    iPaginator: number = 0;

    user$!: Observable<User | null>;
    loading: boolean = true;
    loadId: string;
    form!: FormGroup;
    bidList: bid[] = [];
    loadList: load[] = [];
    loadTypeList: loadType[] = [];
    vehicleList: vehicle[] = [];
    driverList: driver[] = [];
    vehicleCategoryList: any[] = [];
    vehicleTypeList: any[] = [];
    returnReasonList: returnReason[] = [];
    stockProblemList: stockProblem[] = [];

    loadDestinationItems: loadDestination[] = [];
    loadDestinationCurrent: loadDestination;

    displayedColumns: string[];
    dataSource: MatTableDataSource<bid>;
    rowCount: number = Math.trunc((window.innerHeight - 297) / 40 + 1);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    starColor: StarRatingColor = StarRatingColor.accent;
    starColorP: StarRatingColor = StarRatingColor.primary;
    starColorW: StarRatingColor = StarRatingColor.warn;

    formErrors: any;
    formValid!: boolean;
    private _unsubscribeAll = new Subject<void>();
    formData: any;
    previewImage: string | null = null;
    readOnly: boolean = false;
    bidRow: load;
    private destroy$ = new Subject<void>();
    currentUser: User | null = null;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogBidListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        public signalRService: SignalRService,
        public variableService: VariableService,
        private userService: UserService,
        private sqlService: SqlService,

        private router: Router
    ) {
        console.log('DialogBidListComponent', data);
        this.loadDestinationItems = data.loadDestinationItems;
        this.loadDestinationCurrent = data.loadDestinationCurrent;
        this.displayedColumns = [
            'loadDescription',
            'driverDescription',
            'reviewAverageDriver',
            'vehicleDescription',
            'price',
            'status',
            'cud'
        ];

        this.loadId = data.loadId;
        this.loadList = data.loadList;
        this.loadTypeList = data.loadTypeList;
        this.vehicleList = data.vehicleList;
        this.driverList = data.driverList;
        this.vehicleCategoryList = data.vehicleCategoryList;
        this.vehicleTypeList = data.vehicleTypeList;
        this.formErrors = data.formErrors;
        this.formData = data;
        this.bidRow = data.item;
        setTimeout(() => {
            this.readOnly = data.readOnly == 1 ? true : false;
        }, 100);
        this.dataSource = new MatTableDataSource();

        fromEvent(window, 'resize')
            .pipe(debounceTime(200), takeUntil(this.destroy$))

            .subscribe(() => {
                this.iPaginator = 0;
                this.setPaginator();
            });

        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.userService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
                this.getBids();
                this.getStockProblems();
                this.getReturnReasons();
                // this.initSignalR();
                this.subscribeWebSocket();
            }
        });
    }

    subscribeWebSocket() {
        this.signalRService.startConnection('bid').then(startConnectionResult => {
            if (startConnectionResult) {
                this.signalRService.addBidAddedListener();
                this.signalRService.addBidUpdatedListener();
                this.signalRService.addBidDeletedListener();

                this.signalRService.bidAdded
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((bid: bid) => {
                        if (!this.bidList.find(x => x.id == bid.id)) {
                            this.bidList.push(bid);
                        }
                        this.dataSource = new MatTableDataSource(this.bidList);
                        this.iPaginator = 0;
                        this.setPaginator();
                    });

                this.signalRService.bidUpdated
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((bid: bid) => {
                        let i = this.bidList.findIndex(x => x.id == bid.id);
                        if (i >= 0) {
                            this.bidList[i] = bid;
                            this.dataSource = new MatTableDataSource(this.bidList);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    });

                this.signalRService.bidDeleted
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: any) => {
                        let i = this.bidList.findIndex(x => x.id == id);
                        if (i >= 0) {
                            this.bidList.splice(i, 1);
                            this.dataSource = new MatTableDataSource(this.bidList);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    });
            }
        });
    }

    // initSignalR() {
    //     this.signalRService.startConnection('bid').then(startConnectionResult => {
    //         if (startConnectionResult) {
    //             this.signalRService.addBidAddedListener();
    //             this.signalRService.addBidUpdatedListener();
    //             this.signalRService.addBidDeletedListener();

    //             this.signalRService.bidAdded


    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((bid: bid) => {
    //                     this.bidList.push(bid);
    //                     this.dataSource = new MatTableDataSource(this.bidList);
    //                     this.iPaginator = 0;
    //                     this.setPaginator();
    //                 });
    //             this.signalRService.bidUpdated


    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((bid: bid) => {
    //                     let i = this.bidList.findIndex(x => x.id == bid.id);
    //                     if (i >= 0) {
    //                         this.bidList[i] = bid;
    //                         this.dataSource = new MatTableDataSource(this.bidList);
    //                         this.iPaginator = 0;
    //                         this.setPaginator();
    //                     }
    //                 });
    //             this.signalRService.bidDeleted


    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: Guid) => {
    //                     let i = this.bidList.findIndex(x => x.id == id);
    //                     if (i >= 0) {
    //                         this.bidList.splice(
    //                             this.bidList.findIndex(x => x.id == id)!,
    //                             1
    //                         );
    //                         this.dataSource = new MatTableDataSource(this.bidList);
    //                         this.iPaginator = 0;
    //                         this.setPaginator();
    //                     }
    //                 });
    //         } else {
    //             this.router.navigate(['/sign-out']);;
    //         }
    //     });
    // }

    setPaginator() {
        this.iPaginator++;
        if (this.iPaginator < 5) {
            if (this.paginator) {
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
    getReturnReasons() {
        this.sqlService.getItems('returnReasons').pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);
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
    getBids() {
        this.sqlService
            .getItemsTag(this.currentUser, 'bids', 'load', { id: this.loadId })


            .pipe(takeUntil(this._unsubscribeAll)).subscribe((bidList) => {
                if (bidList.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.bidList = bidList.data;
                    this.dataSource = new MatTableDataSource(this.bidList);
                    this.iPaginator = 0;
                    this.setPaginator();
                    this.loading = false;
                }
            });
    }


    getCurrentDestinationString(): string {
        return this.loadDestinationCurrent ? this.loadDestinationCurrent.destinationAddressLabel : '';
    }

    getCurrentLoadDestinationId(): Guid {
        return this.loadDestinationCurrent ? this.loadDestinationCurrent.id : null;
    }

    getLoadDestinations(): Promise<loadDestination[]> {
        var promise = new Promise<loadDestination[]>((resolve) => {
            try {
                if (this.data.item) {
                    this.sqlService.getItemsTag(this.currentUser, 'loadDestinations', 'id', { id: this.data.item.loadId }).pipe(takeUntil(this._unsubscribeAll)).subscribe({
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

    initUpsert(row: any, readOnly: number) {
        console.log('initUpsert', row, readOnly);
        this.getLoadDestinations().then(data => {
            setTimeout(() => {
                let loadDestination = data.filter(x => x.id == row.loadDestinationId) ? data.filter(x => x.id == row.loadDestinationId)[0] : null;
                this.form = this._formBuilder.group({
                    id: [row.id],
                    userId: [row.userId],
                    userDescription: [row.userDescription],
                    loadId: [
                        { value: row.loadId, disabled: readOnly == 1 },
                        Validators.required,
                    ],
                    loadDescription: [{ value: row.loadDescription }],
                    vehicleId: [
                        { value: row.vehicleId, disabled: readOnly == 1 },
                        Validators.required,
                    ],
                    vehicleDescription: [{ value: row.vehicleDescription }],
                    vehicleCategoryId: [{ value: row.vehicleCategoryId }],
                    vehicleCategoryDescription: [
                        { value: row.vehicleCategoryDescription },
                    ],
                    vehicleTypeId: [{ value: row.vehicleTypeId }],
                    vehicleTypeDescription: [{ value: row.vehicleTypeDescription }],
                    driverId: [
                        { value: row.driverId, disabled: readOnly == 1 },
                        Validators.required,
                    ],
                    driverDescription: [{ value: row.driverDescription }],
                    price: [
                        { value: row.price, disabled: readOnly == 1 },
                        Validators.required,
                    ],
                    dateOut: [
                        {
                            value: row.dateOut
                                ? row.dateOut.seconds
                                    ? new Date(row.dateOut.seconds * 1000)
                                    : new Date(row.dateOut)
                                : null,
                            disabled: readOnly == 1,
                        },
                        Validators.required,
                    ],
                    dateIn: [
                        {
                            value: row.dateIn
                                ? row.dateIn.seconds
                                    ? new Date(row.dateIn.seconds * 1000)
                                    : new Date(row.dateIn)
                                : null,
                            disabled: readOnly == 1,
                        },
                        Validators.required,
                    ],
                    status: [row ? row.status : 'Open'],
                    statusLoad: [row?.statusLoad || this.getLoadStatus(row?.loadId) || 'Open'],
                    reviewAverageDriver: [row.reviewAverageDriver],
                    reviewCountDriver: [row.reviewCountDriver],



                    dateBidEnd: [
                        row == null
                            ? null
                            : row.dateBidEnd,
                        Validators.required,
                    ],
                    fridgeHours: [row == null ? null : row.fridgeHours],
                    kgsLoaded: [row == null ? null : row.kgsLoaded],
                    customerLoadedForm: [row == null ? null : row.customerLoadedForm],

                    bidCount: [row == null ? 0 : row.bidCount],
                    reviewAverageLoad: [row == null ? 0 : row.reviewAverageLoad],
                    reviewCountLoad: [row == null ? 0 : row.reviewCountLoad],
                    loadDestinationId: [row == null ? null : row.loadDestinationId],
                    pos: [loadDestination == null ? 0 : loadDestination.pos],
                    originatingAddressLabel: [
                        loadDestination == null ? null : loadDestination.originatingAddressLabel,
                        Validators.required,
                    ],
                    originatingAddressLat: [
                        loadDestination == null ? null : loadDestination.originatingAddressLat,
                        Validators.required,
                    ],
                    originatingAddressLon: [
                        loadDestination == null ? null : loadDestination.originatingAddressLon,
                        Validators.required,
                    ],
                    destinationAddressLabel: [
                        loadDestination == null ? null : loadDestination.destinationAddressLabel,
                        Validators.required,
                    ],
                    destinationAddressLat: [
                        loadDestination == null ? null : loadDestination.destinationAddressLat,
                        Validators.required,
                    ],
                    destinationAddressLon: [
                        loadDestination == null ? null : loadDestination.destinationAddressLon,
                        Validators.required,
                    ],
                    route: [row == null ? null : row.route],
                    meters: [row == null ? null : row.meters],
                    minutes: [row == null ? null : row.minutes],
                    odoStart: [loadDestination == null ? null : loadDestination.odoStart],
                    odoEnd: [loadDestination == null ? null : loadDestination.odoEnd],
                    deliveryNoteNumber: [loadDestination == null ? null : loadDestination.deliveryNoteNumber],
                    weighBridgeTicketNumber: [loadDestination == null ? null : loadDestination.weighBridgeTicketNumber],
                    returnDocumentNumber: [loadDestination == null ? null : loadDestination.returnDocumentNumber],
                    returnKgs: [loadDestination == null ? null : loadDestination.returnKgs],
                    returnReasonId: [loadDestination == null ? null : loadDestination.returnReasonId],
                    stockProblemId: [loadDestination == null ? null : loadDestination.stockProblemId],
                    returnPallets: [loadDestination == null ? null : loadDestination.returnPallets],
                    userIdLoaded: [loadDestination == null ? null : loadDestination.userIdLoaded],
                    userIdLoadedConfirmed: [loadDestination == null ? null : loadDestination.userIdLoadedConfirmed],
                    userIdDelivered: [loadDestination == null ? null : loadDestination.userIdDelivered],
                    userIdDeliveredConfirmed: [loadDestination == null ? null : loadDestination.userIdDeliveredConfirmed],
                });
                const dialogConfig = new MatDialogConfig();
                dialogConfig.data = {
                    item: row,
                    user: this.currentUser,
                    form: this.form,
                    loadList: this.loadList,
                    loadTypeList: this.loadTypeList,
                    vehicleList: this.vehicleList,
                    vehicleCategoryList: this.vehicleCategoryList,
                    vehicleTypeList: this.vehicleTypeList,
                    loadDestinationItems: row ? this.loadList.filter(x => x.id == row.id) : [],
                    driverList: this.driverList,
                    returnReasonList: this.returnReasonList,
                    stockProblemList: this.stockProblemList,
                    title: readOnly ? 'View' : 'Update',
                    readOnly: readOnly,
                };

                dialogConfig.autoFocus = true;
                dialogConfig.disableClose = true;
                dialogConfig.hasBackdrop = true;

                const dialogRef = this.dialog.open(DialogBidComponent, dialogConfig);

                this.loading = false;
                dialogRef
                    .afterClosed()
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
                        if (result !== false) {
                            this.loading = true;

                            if (readOnly == 1) {
                                this.sqlService
                                    .updateItemTagPost(
                                        'bids',
                                        result.action,
                                        result.form
                                    )


                                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
                                        this.loading = false;
                                        if (result.action == 'accept' || result.action == 'decline') {
                                            this.dialogRef.close({ action: result.action, data: apiResult });
                                        }
                                    });
                            } else {
                                if (row == null) {
                                    if (result.action == 'submit') {
                                        this.sqlService
                                            .createItem('bids', result.form)


                                            .pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
                                                this.loading = false;

                                            });
                                    } else {
                                        this.loading = false;

                                        result;
                                    }
                                } else {
                                    if (result.action == 'submit') {
                                        this.sqlService
                                            .updateItem('bids', result.form)


                                            .pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
                                                this.loading = false;

                                            });
                                    } else {
                                        this.loading = false;

                                    }
                                }
                            }
                        } else {
                        }
                    });
            }, 100);
        });
    }

    initDelete(id: Guid) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Item',
            message:
                'Are you sure you want to delete this item? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });
        this.loading = false;
        confirmation
            .afterClosed()


            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
                if (result === 'confirmed') {
                    this.sqlService.deleteItem('bids', id)
                        .pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {

                        });
                }
            });
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    };

    getAddressSubstring(str: string, char: string) {
        let arr = str.split(char);
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }

    getLoadStatus(loadId: string): string | null {
        if (!loadId || !this.loadList) return null;
        const load = this.loadList.find(l => l.id?.toString().toUpperCase() === loadId?.toString().toUpperCase());
        return load?.status || null;
    }

    onRatingChanged(rating: number) { }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        // this.signalRService.endConnection();

        this.loading = false;

    }
}
