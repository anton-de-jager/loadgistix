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
    Inject,
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
import { vehicle } from 'app/models/vehicle.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddressLabelPipe } from 'app/pipes/address-label.pipe';
import {
    Subject,
    Subscription,
    debounceTime,
    fromEvent,
    takeUntil,
} from 'rxjs';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserService } from 'app/core/user/user.service';
import { DialogVehicleComponent } from 'app/dialogs/dialog-vehicle/dialog-vehicle.component';
// import { SignalRService } from 'app/services/signal-r.service';
import { DialogImageComponent } from 'app/dialogs/dialog-image/dialog-image.component';
import { branch } from 'app/models/branch.model';
import { vehicleCategory } from 'app/models/vehicleCategory.model';
import { vehicleType } from 'app/models/vehicleType.model';
import { SortPipe } from 'app/pipes/sort.pipe';
import { VariableService } from 'app/services/variable.service';
import { SqlService } from 'app/services/sql.service';
import { DialogAccountComponent } from 'app/dialogs/dialog-account/dialog-account.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { bodyType } from 'app/models/bodyType.model';
import { bodyLoad } from 'app/models/bodyLoad.model';
import { make } from 'app/models/make.model';
import { model } from 'app/models/model.model';
import { base64ToFile } from 'ngx-image-cropper';
import { environment } from 'environments/environment';
import { Guid } from 'guid-typescript';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';
import { SignalRService } from 'app/services/signal-r.service';
import { extractApiData } from 'app/services/api-response.helper';

@Component({
    selector: 'app-vehicles',
    templateUrl: './vehicles.component.html',
    styleUrls: ['./vehicles.component.scss'],
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
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        NgFor,
        NgClass,
        MatSlideToggleModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatRippleModule,
        MatProgressSpinnerModule,
        AsyncPipe,
        CurrencyPipe,
        MatSnackBarModule,
        SortPipe,
    ],
    providers: [],
})
export class VehiclesComponent implements OnInit, OnDestroy {
    loading: boolean = true;
    imagesFolder = environment.apiImage;


    private _unsubscribeAll = new Subject<void>();

    branchList: branch[] = [];
    vehicleCategoryList: vehicleCategory[] = [];
    vehicleTypeList: vehicleType[] = [];
    bodyTypeList: bodyType[] = [];
    bodyLoadList: bodyLoad[] = [];
    makeList: make[] = [];
    modelList: model[] = [];

    vehicles: vehicle[];
    dataSource: MatTableDataSource<vehicle>;
    displayedColumns: string[] = [
        'avatar',
        'vehicleId',
        'description',
        'vehicleCategoryDescription',
        'vehicleTypeDescription',
        'bodyTypeDescription',
        'bodyLoadDescription',
        'makeDescription',
        'modelDescription',
        'availableFrom',
        'availableTo',
    ];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    form!: FormGroup;

    rowCount: number = Math.trunc((window.innerHeight - 297) / 40 + 1);
    private destroy$ = new Subject<void>();
    iPaginator: number = 0;

    quantity: number = 0;
    timestamp: number = 0;

    export = null;

    showAdverts: boolean;
    currentUser: User | null = null;

    constructor(
        @Inject(MatDialog) private dialog: MatDialog,
        private variableService: VariableService,
        private _snackBar: MatSnackBar,
        private sqlService: SqlService,
        private userService: UserService,
        private authService: AuthService,
        private _formBuilder: FormBuilder,
        private signalRService: SignalRService,
        private router: Router
    ) {
        this.timestamp = new Date().getTime();
        variableService.setPageSelected('My Vehicles');
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

        setTimeout(() => {
            if (!this.currentUser) {
                this.router.navigate(['/sign-out']);;
            }
        }, 2000);
    }

    ngOnInit(): void {
        this.variableService.showAdverts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((showAdverts) => {
                this.showAdverts = showAdverts;
            });

        //
        // setTimeout(() => {
        //
        //     setTimeout(() => {
        //
        //         setTimeout(() => {
        //
        //             setTimeout(() => {
        //
        //             }, 1000);
        //         }, 1000);
        //     }, 1000);
        // }, 1000);
    }

    initPage() {
        this.getSubscription();
        this.getBranches();
        this.getVehicleCategories();
        this.getVehicleTypes();
        this.getBodyTypes();
        this.getBodyLoads();
        this.getMakes();
        this.getModels();
        this.getVehicles();
        // this.initSignalR();
        this.subscribeWebSocket();
    }

    subscribeWebSocket() {
        this.signalRService.startConnection('vehicle').then(startConnectionResult => {
            if (startConnectionResult) {
                this.signalRService.addVehicleAddedListener();
                this.signalRService.addVehicleUpdatedListener();
                this.signalRService.addVehicleDeletedListener();

                this.signalRService.vehicleAdded
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((vehicle: vehicle) => {
                        if (!this.vehicles.find(x => x.id == vehicle.id)) {
                            this.vehicles.push(vehicle);
                        }
                        this.dataSource = new MatTableDataSource(this.vehicles);
                        this.iPaginator = 0;
                        this.setPaginator();
                    });

                this.signalRService.vehicleUpdated
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((vehicle: vehicle) => {
                        let i = this.vehicles.findIndex(x => x.id == vehicle.id);
                        if (i >= 0) {
                            this.vehicles[i] = vehicle;
                            this.dataSource = new MatTableDataSource(this.vehicles);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    });

                this.signalRService.vehicleDeleted
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: any) => {
                        let i = this.vehicles.findIndex(x => x.id == id);
                        if (i >= 0) {
                            this.vehicles.splice(i, 1);
                            this.dataSource = new MatTableDataSource(this.vehicles);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    });
            }
        });
    }

    // initSignalR() {
    //     this.signalRService.startConnection('vehicle').then(startConnectionResult => {
    //         if (startConnectionResult) {
    //             this.signalRService.addVehicleAddedListener();
    //             this.signalRService.addVehicleUpdatedListener();
    //             this.signalRService.addVehicleDeletedListener();

    //             this.signalRService.vehicleAdded
    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((vehicles: vehicle) => {
    //                     this.vehicles.push(vehicles);
    //                     this.dataSource = new MatTableDataSource(this.vehicles);
    //                     this.iPaginator = 0;
    //                     this.setPaginator();
    //                 });

    //             this.signalRService.vehicleUpdated
    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((vehicle: vehicle) => {
    //                     let i = this.vehicles.findIndex(x => x.id == vehicle.id);
    //                     if (i >= 0) {
    //                         this.vehicles[i] = vehicle;
    //                         this.dataSource = new MatTableDataSource(this.vehicles);
    //                         this.iPaginator = 0;
    //                         this.setPaginator();
    //                     }
    //                 });
    //             this.signalRService.vehicleDeleted

    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: Guid) => {
    //                     let i = this.vehicles.findIndex(x => x.id == id);
    //                     if (i >= 0) {
    //                         this.vehicles.splice(
    //                             this.vehicles.findIndex(x => x.id == id)!,
    //                             1
    //                         );
    //                         this.dataSource = new MatTableDataSource(this.vehicles);
    //                         this.iPaginator = 0;
    //                         this.setPaginator();
    //                     }
    //                 });
    //         } else {
    //             this.router.navigate(['/sign-out']);;
    //         }
    //     });
    // }

    getBranches() {
        this.sqlService
            .getItems('branches')

            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.branchList = apiResult.data;
                }
            });
    }

    getVehicleCategories() {
        this.sqlService
            .getItems('vehicleCategories')

            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.vehicleCategoryList = apiResult.data;
                }
            });
    }
    getVehicleTypes() {
        this.sqlService
            .getItems('vehicleTypes')
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.vehicleTypeList = apiResult.data;
                }
            });
        // this.vehicleTypeList = [
        //     { id: '1', description: 'Liquids' },
        //     { id: '2', description: 'Bulk Powders' },
        //     { id: '3', description: 'General Goods' }
        // ]
    }
    getBodyTypes() {
        this.sqlService
            .getItems('bodyTypes')

            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.bodyTypeList = apiResult.data;
                }
            });
    }
    getBodyLoads() {
        this.sqlService
            .getItems('bodyLoads')

            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.bodyLoadList = apiResult.data;
                }
            });
    }
    getMakes() {
        this.sqlService
            .getItems('makes')

            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.makeList = apiResult.data;
                }
            });
    }
    getModels() {
        this.sqlService
            .getItems('models')

            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.modelList = apiResult.data;
                }
            });
    }
    getVehicles() {
        this.loading = true;

        this.sqlService
            .getItems('vehicles')

            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.vehicles = apiResult.data;
                    this.dataSource = new MatTableDataSource(this.vehicles);
                    this.iPaginator = 0;
                    this.setResizeEvents();
                    this.setPaginator();
                }
            });
    }

    setResizeEvents() {
        fromEvent(window, 'resize')
            .pipe(debounceTime(200), takeUntil(this.destroy$))

            .subscribe(() => {
                this.iPaginator = 0;
                this.setPaginator();
            });
    }

    getTransactions(): Promise<any[]> {
        var promise = new Promise<any[]>((resolve) => {
            try {
                this.sqlService.getItems('transactions').pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.data.result == "Unauthorised") {
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
                console.log('exception', exception);
                resolve([{ advert: 0, directory: 0, load: 0, tms: 0, vehicle: 0 }]);
            }
        });
        return promise;
    }

    getSubscription() {
        this.getTransactions().then(res => {
            console.log(res);
            if (res.length > 0) {
                this.quantity = (this.currentUser ? this.currentUser.email : '') == 'anton@madproducts.co.za' ? -1 : res[0].vehicle;
                console.log(this.quantity);
            }
        });
    }

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

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    async initUpsert(row: any) {
        console.log(this.dataSource.data.length);
        console.log(this.quantity);

        if ((this.dataSource.data.length < this.quantity) || (this.dataSource.data.length == this.quantity && row !== null) || (this.quantity === -1)) {
            this.form = this._formBuilder.group({
                id: [row == null ? undefined : row.id ? row.id : row.id],
                userId: [row == null ? this.currentUser.id : row.userId],
                userDescription: [
                    row == null
                        ? this.currentUser == null
                            ? 'n/a'
                            : this.currentUser.name
                        : row.userDescription,
                ],
                branchId: [row == null ? null : row.branchId,
                Validators.required],
                vehicleId: [
                    row == null ? null : row.vehicleId,
                ],
                branchDescription: [
                    row == null ? null : row.branchDescription,
                ],
                vehicleCategoryId: [row == null ? null : row.vehicleCategoryId,
                Validators.required],
                vehicleCategoryDescription: [
                    row == null ? null : row.vehicleCategoryDescription,
                ],
                makeId: [row == null ? null : row.makeId,
                Validators.required],
                makeDescription: [
                    row == null ? null : row.makeDescription,
                ],
                modelId: [row == null ? null : row.modelId,
                Validators.required],
                modelDescription: [
                    row == null ? null : row.modelDescription,
                ],
                vehicleTypeId: [
                    row == null ? null : row.vehicleTypeId,
                    Validators.required,
                ],
                vehicleTypeDescription: [
                    row == null ? null : row.vehicleTypeDescription,
                ],
                bodyTypeId: [
                    row == null ? null : row.bodyTypeId,
                    Validators.required,
                ],
                bodyTypeDescription: [
                    row == null ? null : row.bodyTypeDescription,
                ],
                bodyLoadId: [
                    row == null ? null : row.bodyLoadId,
                    Validators.required,
                ],
                bodyLoadDescription: [
                    row == null ? null : row.bodyLoadDescription,
                ],
                description: [
                    row == null ? null : row.description,
                    Validators.required,
                ],
                liquid: [
                    row == null ? null : row.liquid
                ],
                registrationNumber: [
                    row == null ? null : row.registrationNumber,
                    Validators.required,
                ],
                maxLoadWeight: [
                    row == null ? null : row.maxLoadWeight,
                    Validators.required,
                ],
                maxLoadHeight: [
                    row == null ? null : row.maxLoadHeight,
                    Validators.required,
                ],
                maxLoadWidth: [
                    row == null ? null : row.maxLoadWidth,
                    Validators.required,
                ],
                maxLoadLength: [
                    row == null ? null : row.maxLoadLength,
                    Validators.required,
                ],
                maxLoadVolume: [
                    row == null ? null : row.maxLoadVolume,
                    Validators.required,
                ],
                availableCapacity: [
                    row == null ? null : row.availableCapacity,
                    Validators.required,
                ],
                availableFrom: [
                    row == null
                        ? null
                        : row.availableFrom
                            ? row.availableFrom.seconds
                                ? new Date(row.availableFrom.seconds * 1000)
                                : new Date(row.availableFrom)
                            : null,
                    Validators.required,
                ],
                availableTo: [
                    row == null
                        ? null
                        : row.availableTo
                            ? row.availableTo.seconds
                                ? new Date(row.availableTo.seconds * 1000)
                                : new Date(row.availableTo)
                            : null,
                    Validators.required,
                ],
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
                    row == null ? null : row.destinationAddressLabel,
                ],
                destinationAddressLat: [
                    row == null ? null : row.destinationAddressLat,
                ],
                destinationAddressLon: [
                    row == null ? null : row.destinationAddressLon,
                ],
                avatar: [row == null ? null : row.avatar],
                status: [row == null ? 'Active' : row.status],
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                branchList: this.branchList,
                vehicleCategoryList: this.vehicleCategoryList,
                vehicleTypeList: this.vehicleTypeList,
                bodyTypeList: this.bodyTypeList,
                bodyLoadList: this.bodyLoadList,
                makeList: this.makeList,
                modelList: this.modelList,
                title: row == null ? 'Insert' : 'Update',
            };

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;

            const dialogRef = this.dialog.open(
                DialogVehicleComponent,
                dialogConfig
            );

            this.loading = false;
            dialogRef
                .afterClosed()
                .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
                    if (result !== false) {
                        if (row == null) {
                            this.sqlService
                                .createItem(
                                    'vehicles',
                                    result.form
                                ).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                                    next: (apiResult) => {
                                        const newItem = extractApiData(apiResult.data);
                                        if (newItem && result.fileToUpload) {
                                            let file = base64ToFile(result.fileToUpload);
                                            this.uploadFile(file, newItem.id).then(x => {
                                                const existingItem = this.vehicles.find(x => x.id == newItem.id);
                                                if (existingItem) {
                                                    existingItem.avatar = '.jpg';
                                                    this.timestamp = new Date().getTime();
                                                }
                                            });
                                        }
                                    },
                                    error: (error) => {
                                        console.error('Error creating vehicle:', error);
                                        this._snackBar.open('Failed to create vehicle. Please try again.', undefined, { duration: 3000 });
                                    }
                                });
                        } else {
                            this.sqlService
                                .updateItem(
                                    'vehicles',
                                    result.form
                                ).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                                    next: (apiResult) => {
                                        const updatedItem = extractApiData(apiResult.data);
                                        if (updatedItem && result.fileToUpload) {
                                            let file = base64ToFile(result.fileToUpload);
                                            this.uploadFile(file, updatedItem.id).then(x => {
                                                const existingItem = this.vehicles.find(x => x.id == updatedItem.id);
                                                if (existingItem) {
                                                    existingItem.avatar = '.jpg';
                                                    this.timestamp = new Date().getTime();
                                                }
                                            });
                                        }
                                    },
                                    error: (error) => {
                                        console.error('Error updating vehicle:', error);
                                        this._snackBar.open('Failed to update vehicle. Please try again.', undefined, { duration: 3000 });
                                    }
                                });
                        }
                    }
                });
        } else {
            this.showPaypal();
        }
    }



    uploadFile(fileToUpload: any, filename: string): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                this.sqlService.upload('vehicles', formData, filename).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (event: any) => {
                        if (event.type == 4) {
                            resolve(true);
                        }
                    },
                    error: (error) => {
                        console.error('Vehicle image upload error:', error);
                        this._snackBar.open('Failed to upload image. Please try again.', undefined, { duration: 3000 });
                        resolve(false);
                    }
                });
            } catch (exception) {
                console.error('Vehicle image upload exception:', exception);
                resolve(false);
            }
        });
        return promise;
    }

    showPaypal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'vehicles' };

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

    // loadProducts() {
    //   this.sqliteService.getProductList().pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
    //     this.products = res.values;
    //   });
    // }

    // // Mode is either "partial" or "full"
    // async createExport(mode) {
    //   const dataExport = await this.sqliteService.getDatabaseExport(mode);
    //   this.export = dataExport.export;
    // }

    // async addProduct() {
    //   await this.sqliteService.addDummyProduct(this.newProduct);
    //   this.newProduct = '';
    //   this.loadProducts();
    // }

    // async deleteProduct(product) {
    //   await this.sqliteService.deleteProduct(product.uid);
    //   this.products = this.products.filter(p => p != product);
    // }

    // // For testing..
    // deleteDatabase() {
    //   this.sqliteService.deleteDatabase();
    // }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        // this.signalRService.endConnection();
    }
}
