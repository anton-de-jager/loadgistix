import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { vehicle } from 'app/models/vehicle.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, Subject, Subscription, debounceTime, fromEvent, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { StarRatingColor } from 'app/layout/common/star-rating/star-rating.component';
import { DialogBidComponent } from 'app/dialogs/dialog-bid/dialog-bid.component';
import { DialogReviewComponent } from 'app/dialogs/dialog-review/dialog-review.component';
import { bid } from 'app/models/bid.model';
import { driver } from 'app/models/driver.model';
import { load } from 'app/models/load.model';
import { loadType } from 'app/models/loadType.model';
import { vehicleCategory } from 'app/models/vehicleCategory.model';
import { vehicleType } from 'app/models/vehicleType.model';
import { VariableService } from 'app/services/variable.service';
import { Guid } from 'guid-typescript';
import { SqlService } from 'app/services/sql.service';
// import { SignalRService } from 'app/services/signal-r.service';
import { DialogAccountComponent } from 'app/dialogs/dialog-account/dialog-account.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { returnReason } from 'app/models/returnReason.model';
import { stockProblem } from 'app/models/stockProblem.model';
import { loadDestination } from 'app/models/loadDestination.model';
import { User } from 'app/core/user/user.types';
import { SignalRService } from 'app/services/signal-r.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-bids',
    templateUrl: './bids.component.html',
    styleUrls: ['./bids.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MatTableModule, MatSnackBarModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule]
})
export class BidsComponent implements OnInit, OnDestroy {
    iPaginator: number = 0;
    loading: boolean = true;

    form!: FormGroup;
    formLoad!: FormGroup;
    loadList: load[] = [];
    loadTypeList: loadType[] = [];
    vehicleList: vehicle[] = [];
    vehicleCategoryList: vehicleCategory[] = [];
    vehicleTypeList: vehicleType[] = [];
    driverList: driver[] = [];
    bidList: bid[] = [];
    returnReasonList: returnReason[] = [];
    stockProblemList: stockProblem[] = [];

    private _unsubscribeAll = new Subject<void>();

    displayedColumns: string[];
    dataSource!: MatTableDataSource<bid>;
    rowCount: number = Math.trunc(((window.innerHeight - 297) / 40) + 1);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    starColor: StarRatingColor = StarRatingColor.accent;
    starColorP: StarRatingColor = StarRatingColor.primary;
    starColorW: StarRatingColor = StarRatingColor.warn;

    deleteform!: FormGroup;
    currentUser: User | null = null;

    private destroy$ = new Subject<void>();

    showAdverts: boolean;

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        public variableService: VariableService,
        private route: ActivatedRoute,
        public signalRService: SignalRService,
        private sqlService: SqlService,
        private router: Router
    ) {
        variableService.setPageSelected('My Bids');
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
            .pipe(
                debounceTime(200),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.iPaginator = 0;
                this.setPaginator();
            })

        this.displayedColumns = ['loadDescription', 'vehicleDescription', 'driverDescription', 'price', 'statusLoad'];

        this.getVehicles();
        this.getVehicleCategories();
        this.getVehicleTypes();
        this.getDrivers();
        this.getReturnReasons();
        this.getStockProblems();
        this.getBids();
        // this.initSignalR();
        this.subscribeWebSocket();
    }

    subscribeWebSocket() {
        this.signalRService.startConnection('bid').then(startConnectionResult => {
            if (startConnectionResult) {
                this.signalRService.addBidAddedListener();
                this.signalRService.addBidUpdatedListener();
                this.signalRService.addBidDeletedListener();

                this.signalRService.bidAdded
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((bid: bid) => {
                        console.log('SignalR: bidAdded', bid);
                        if (!this.bidList.find(x => x.id?.toString().toUpperCase() == bid.id?.toString().toUpperCase())) {
                            this.bidList.push(bid);
                        }
                        this.dataSource = new MatTableDataSource(this.bidList);
                        this.iPaginator = 0;
                        this.setPaginator();
                    });

                this.signalRService.bidUpdated
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((bid: bid) => {
                        console.log('SignalR: bidUpdated', bid);
                        let i = this.bidList.findIndex(x => x.id?.toString().toUpperCase() == bid.id?.toString().toUpperCase());
                        if (i >= 0) {
                            this.bidList[i] = bid;
                            this.dataSource = new MatTableDataSource(this.bidList);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    });

                this.signalRService.bidDeleted
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: any) => {
                        console.log('SignalR: bidDeleted', id);
                        let i = this.bidList.findIndex(x => x.id?.toString().toUpperCase() == id?.toString().toUpperCase());
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

    ngOnInit(): void {
        this.variableService.showAdverts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((showAdverts) => {
                this.showAdverts = showAdverts;
            });
    }

    // initSignalR() {
    //     this.signalRService.startConnection('bid').then(startConnectionResult => {
    //         if (startConnectionResult) {
    //             this.signalRService.addBidAddedListener();
    //             this.signalRService.addBidUpdatedListener();
    //             this.signalRService.addBidDeletedListener();

    //             this.signalRService.bidAdded.pipe(takeUntil(this._unsubscribeAll)).subscribe((bid: bid) => {
    //                 this.bidList.push(bid);
    //                 this.dataSource = new MatTableDataSource(this.bidList);
    //                 this.iPaginator = 0;
    //                 this.setPaginator();
    //             })
    //             this.signalRService.bidUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((bid: bid) => {
    //                 let i = this.bidList.findIndex(x => x.id == bid.id);
    //                 if (i >= 0) {
    //                     this.bidList[i] = bid;
    //                     this.dataSource = new MatTableDataSource(this.bidList);
    //                     this.iPaginator = 0;
    //                     this.setPaginator();
    //                 }
    //             })
    //             this.signalRService.bidDeleted.pipe(takeUntil(this._unsubscribeAll)).subscribe((id: Guid) => {
    //                 let i = this.bidList.findIndex(x => x.id == id);
    //                 if (i >= 0) {
    //                     this.bidList.splice(this.bidList.findIndex(x => x.id == id)!, 1);
    //                     this.dataSource = new MatTableDataSource(this.bidList);
    //                     this.iPaginator = 0;
    //                     this.setPaginator();
    //                 }
    //             });
    //         } else {
    //             this.router.navigate(['/sign-out']);;
    //         }
    //     });
    // }

    setPaginator() {
        this.iPaginator++;
        if (this.iPaginator < 5) {
            if (this.paginator) {
                this.paginator.pageSize = Math.trunc((window.innerHeight - 297) / 40);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                if (this.paginator.pageIndex != 0) {
                    if ((this.paginator.pageIndex + 1) > this.paginator.getNumberOfPages()) {
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

    getBids() {
        this.sqlService.getItems('bids').pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);;
            } else {
                this.bidList = apiResult.data;
                this.dataSource = new MatTableDataSource(this.bidList);
                this.iPaginator = 0;
                this.setPaginator();
                this.loading = false;
            }
        })
    }
    getLoadTypes() {
        this.sqlService.getItems('loadTypes').pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);;
            } else {
                this.loadTypeList = apiResult.data;
                this.loading = false;
            }
        })
    }
    getVehicles() {
        this.sqlService.getItems('vehicles').pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);;
            } else {
                this.vehicleList = apiResult.data;
            }
        })
    }
    getVehicleCategories() {
        this.sqlService.getItems('vehicleCategories').pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);;
            } else {
                this.vehicleCategoryList = apiResult.data;
            }
        })
    }
    getVehicleTypes() {
        this.sqlService.getItems('vehicleTypes').pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);;
            } else {
                this.vehicleTypeList = apiResult.data;
            }
        })
    }
    getDrivers() {
        this.sqlService.getItems('drivers').pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
            if (apiResult.data == "Unauthorised") {
                this.router.navigate(['/sign-out']);;
            } else {
                this.driverList = apiResult.data;
            }
        })
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

    getDescription(document: string, id: Guid): string {
        switch (document) {
            case 'drivers':
                return this.driverList!.find(x => x.id === id)?.firstName! + ' ' + this.driverList!.find(x => x.id === id)?.lastName!;
            case 'vehicles':
                return this.vehicleList!.find(x => x.id === id)?.description!;
            case 'vehicleCategories':
                return this.vehicleCategoryList!.find(x => x.id === id)?.description!;
            case 'vehicleTypes':
                return this.vehicleTypeList!.find(x => x.id === id)?.description!;
            case 'loads':
                return this.loadList!.find(x => x.id === id)?.description!;
            case 'loadTypes':
                return this.loadTypeList!.find(x => x.id === id)?.description!;
            default: return '';
        }
    }

    showPaypal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'bids' };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(DialogAccountComponent,
            dialogConfig);


        // dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
        // });
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

    initUpsert(row: any, readOnly: number) {
        console.log('initUpsert', row, readOnly);
        this.getLoadDestinations(row.loadId).then(loadDestinationItems => {
            let loadDestinationCurrent = loadDestinationItems.filter(x => x.id == row.loadDestinationId) ? loadDestinationItems.filter(x => x.id == row.loadDestinationId)[0] : null;
            this.form = this._formBuilder.group({
                id: [row.id],
                userId: [row.userId],
                userDescription: [row.userDescription],
                loadId: [
                    { value: row.loadId, disabled: readOnly == 1 },
                    Validators.required,
                ],
                loadDescription: [row.loadDescription],
                vehicleId: [
                    { value: row.vehicleId, disabled: readOnly == 1 },
                    Validators.required,
                ],
                vehicleDescription: [row.vehicleDescription],
                vehicleCategoryId: [row.vehicleCategoryId],
                vehicleCategoryDescription: [row.vehicleCategoryDescription],
                vehicleTypeId: [row.vehicleTypeId],
                vehicleTypeDescription: [row.vehicleTypeDescription],
                driverId: [
                    { value: row.driverId, disabled: readOnly == 1 },
                    Validators.required,
                ],
                driverDescription: [row.driverDescription],
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
                statusLoad: [row ? row.statusLoad : 'Open'],
                reviewAverageDriver: [row.reviewAverageDriver],
                reviewCountDriver: [row.reviewCountDriver],



                dateBidEnd: [
                    row == null
                        ? null
                        : row.dateBidEnd,
                ],
                fridgeHours: [row == null ? null : row.fridgeHours],
                kgsLoaded: [row == null ? null : row.kgsLoaded],
                customerLoadedForm: [row == null ? null : row.customerLoadedForm],

                bidCount: [row == null ? 0 : row.bidCount],
                reviewAverageLoad: [row == null ? 0 : row.reviewAverageLoad],
                reviewCountLoad: [row == null ? 0 : row.reviewCountLoad],
                loadDestinationId: [row == null ? null : row.loadDestinationId],
                pos: [loadDestinationCurrent ? loadDestinationCurrent.pos : 0],
                originatingAddressLabel: [
                    loadDestinationCurrent?.originatingAddressLabel || row?.originatingAddressLabel || null,
                    Validators.required,
                ],
                originatingAddressLat: [
                    loadDestinationCurrent?.originatingAddressLat || row?.originatingAddressLat || null,
                    Validators.required,
                ],
                originatingAddressLon: [
                    loadDestinationCurrent?.originatingAddressLon || row?.originatingAddressLon || null,
                    Validators.required,
                ],
                destinationAddressLabel: [
                    loadDestinationCurrent?.destinationAddressLabel || row?.destinationAddressLabel || null,
                    Validators.required,
                ],
                destinationAddressLat: [
                    loadDestinationCurrent?.destinationAddressLat || row?.destinationAddressLat || null,
                    Validators.required,
                ],
                destinationAddressLon: [
                    loadDestinationCurrent?.destinationAddressLon || row?.destinationAddressLon || null,
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

            // Get liquid property from the load associated with this bid
            const associatedLoad = this.loadList.find(l => l.id == row?.loadId);
            
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                user: this.currentUser,
                form: this.form,
                formLoad: this.formLoad,
                load: load,
                loadList: this.loadList,
                vehicleList: this.vehicleList,
                driverList: this.driverList,
                returnReasonList: this.returnReasonList,
                stockProblemList: this.stockProblemList,
                loadId: row ? row.loadId : null,
                loadDestinationId: row == null ? null : row.loadDestinationId,
                loadDestinationCurrent: loadDestinationCurrent,
                loadDestinationItems: loadDestinationItems,
                liquid: associatedLoad ? associatedLoad.liquid : false,
                title: readOnly ? 'View' : row == null ? 'Insert' : 'Update',
                readOnly: readOnly
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;

            const dialogRef = this.dialog.open(DialogBidComponent,
                dialogConfig);

            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result !== false) {
                    this.loading = true;

                    if (result.action == 'reload') {
                        //this.getBids();
                    } else {
                        result.userId = this.currentUser.id;
                        result.userDescription = this.currentUser.name;
                        if (row == null) {
                            this.sqlService.createItem('bids', result.form).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => { })
                        } else {
                            this.sqlService.updateItem('bids', result.form).pipe(takeUntil(this._unsubscribeAll)).subscribe(res => { })
                        }
                    }
                }
            });
        });

    }
    async initDelete(id: any, avatar: string) {
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

                this.sqlService.deleteItem('bids', id).pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
                    // this.bidList.splice(this.bidList.findIndex(item => item.id === id), 1);
                    // this.dataSource = new MatTableDataSource(this.bidList);
                    // this.iPaginator = 0;
                    // this.setPaginator();
                    this.loading = false;

                })
            }
        });
    }

    getColor(status: string, bidCount: number) {
        switch (status) {
            case 'Open': return (bidCount > 0 ? '#f8a40765' : '#5db1de65');
            case 'Bid(s) Placed': return (bidCount > 0 ? '#f8a40765' : '#5db1de65');
            // case 'Bid(s) Placed': return '#f8a40765';
            case 'Accepted': return '#00ff0065';
            case 'Loaded': return '#fba7ed65';
            case 'Loaded Confirmed': return '#ff05d565';
            case 'Delivered': return '#00000065';
            case 'Delivered Confirmed': return '#b3b3b365';
            default: return '#5db1de65';
        }
    }

    getAddressSubstring(str: string, char: string) {
        let arr = str ? (str.split(char) ? str.split(char) : '') : '';
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }

    onRatingChanged(rating: number) {
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        // this.signalRService.endConnection();

        this.loading = false;

    }
}
