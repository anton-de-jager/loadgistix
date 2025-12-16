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
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { driver } from 'app/models/driver.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddressLabelPipe } from 'app/pipes/address-label.pipe';
import {
    Subject,
    Subscription,
    debounceTime,
    fromEvent,
    takeUntil,
} from 'rxjs';
// import { SqliteService } from 'app/services/sqlite.service';
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
import { DialogDriverComponent } from 'app/dialogs/dialog-driver/dialog-driver.component';
// import { SignalRService } from 'app/services/signal-r.service';
import { DialogImageComponent } from 'app/dialogs/dialog-image/dialog-image.component';
import { licenceType } from 'app/models/licenceType.model';
import { pdp } from 'app/models/pdp.model';
import { SortPipe } from 'app/pipes/sort.pipe';
import { VariableService } from 'app/services/variable.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogAccountComponent } from 'app/dialogs/dialog-account/dialog-account.component';
import { SqlService } from 'app/services/sql.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { base64ToFile } from 'ngx-image-cropper';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';
import { SignalRService } from 'app/services/signal-r.service';
import { extractApiData } from 'app/services/api-response.helper';

@Component({
    selector: 'app-drivers',
    templateUrl: './drivers.component.html',
    styleUrls: ['./drivers.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatTableModule,
        MatProgressSpinnerModule,
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
        MatSnackBarModule,
        MatCheckboxModule,
        MatRippleModule,
        AsyncPipe,
        CurrencyPipe,
        SortPipe,
    ],
    providers: [],
})
export class DriversComponent implements OnInit, OnDestroy {
    loading: boolean = true;

    private _unsubscribeAll = new Subject<void>();
    imagesFolder = environment.apiImage;

    licenceTypeList: licenceType[] = [];
    pdpList: pdp[] = [];
    pdpGroupedList: GroupedItem[] = [];

    drivers: driver[];
    dataSource: MatTableDataSource<driver>;
    displayedColumns: string[] = [
        'avatar',
        'firstName',
        'lastName',
        'licenceTypeCode'
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
        private userService: UserService,
        private authService: AuthService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private sqlService: SqlService,
        private signalRService: SignalRService,
        private _formBuilder: FormBuilder,
        private variableService: VariableService,
        private router: Router
    ) {
        this.timestamp = new Date().getTime();
        variableService.setPageSelected('My Drivers');
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

    ngOnInit(): void {
        this.variableService.showAdverts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((showAdverts) => {
                this.showAdverts = showAdverts;
            });
    }


    // initSignalR() {
    //     this.signalRService.startConnection('driver').then(startConnectionResult => {
    //         if (startConnectionResult) {
    //             this.signalRService.addDriverAddedListener();
    //             this.signalRService.addDriverUpdatedListener();
    //             this.signalRService.addDriverDeletedListener();

    //             this.signalRService.driverAdded
    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((driver: driver) => {
    //                     this.drivers.push(driver);
    //                     this.dataSource = new MatTableDataSource(this.drivers);
    //                     this.iPaginator = 0;
    //                     this.setPaginator();
    //                 });

    //             this.signalRService.driverUpdated
    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((driver: driver) => {
    //                     let i = this.drivers.findIndex(x => x.id == driver.id);
    //                     if (i >= 0) {
    //                         this.drivers[i] = driver;
    //                         this.dataSource = new MatTableDataSource(this.drivers);
    //                         this.iPaginator = 0;
    //                         this.setPaginator();
    //                     }
    //                 });
    //             this.signalRService.driverDeleted

    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: Guid) => {
    //                     let i = this.drivers.findIndex(x => x.id == id);
    //                     if (i >= 0) {
    //                         this.drivers.splice(
    //                             this.drivers.findIndex(x => x.id == id)!,
    //                             1
    //                         );
    //                         this.dataSource = new MatTableDataSource(this.drivers);
    //                         this.iPaginator = 0;
    //                         this.setPaginator();
    //                     }
    //                 });
    //         } else {
    //             this.router.navigate(['/sign-out']);;
    //         }
    //     });
    // }

    initPage() {
        this.getSubscription();
        this.getLicenceTypes();
        this.getPdps();
        this.getDrivers();
        // this.initSignalR();
        this.subscribeWebSocket();

        fromEvent(window, 'resize')
            .pipe(debounceTime(200), takeUntil(this.destroy$))

            .subscribe(() => {
                this.iPaginator = 0;
                this.setPaginator();
            });
    }

    subscribeWebSocket() {
        this.signalRService.startConnection('driver').then(startConnectionResult => {
            if (startConnectionResult) {
                this.signalRService.addDriverAddedListener();
                this.signalRService.addDriverUpdatedListener();
                this.signalRService.addDriverDeletedListener();

                this.signalRService.driverAdded
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((driver: driver) => {
                        if (!this.drivers.find(x => x.id == driver.id)) {
                            this.drivers.push(driver);
                        }
                        this.dataSource = new MatTableDataSource(this.drivers);
                        this.iPaginator = 0;
                        this.setPaginator();
                    });

                this.signalRService.driverUpdated
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((driver: driver) => {
                        let i = this.drivers.findIndex(x => x.id == driver.id);
                        if (i >= 0) {
                            this.drivers[i] = driver;
                            this.dataSource = new MatTableDataSource(this.drivers);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    });

                this.signalRService.driverDeleted
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: any) => {
                        let i = this.drivers.findIndex(x => x.id == id);
                        if (i >= 0) {
                            this.drivers.splice(i, 1);
                            this.dataSource = new MatTableDataSource(this.drivers);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    });
            }
        });
    }

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
    getLicenceTypes() {
        this.sqlService
            .getItems('licenceTypes')
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.licenceTypeList = apiResult.data;
                }
            });
    }
    getPdps() {
        this.sqlService
            .getItems('pdps')
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.pdpList = apiResult.data;

                    this.pdpList.forEach((item) => {
                        const existingGroup = this.pdpGroupedList.find(
                            (group) => group.pdpGroupDescription === item.pdpGroupDescription
                        );

                        if (existingGroup) {
                            existingGroup.pdpItems.push({ id: item.id, description: item.description });
                        } else {
                            this.pdpGroupedList.push({
                                pdpGroupDescription: item.pdpGroupDescription,
                                pdpItems: [{ id: item.id, description: item.description }],
                            });
                        }
                    });
                }
            });
    }
    getDrivers() {
        this.loading = true;

        this.sqlService
            .getItems('drivers')
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.drivers = apiResult.data;
                    this.dataSource = new MatTableDataSource(this.drivers);
                    this.iPaginator = 0;
                    this.setPaginator();
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
                firstName: [
                    row == null ? null : row.firstName,
                    Validators.required,
                ],
                lastName: [
                    row == null ? null : row.lastName,
                    Validators.required,
                ],
                phone: [row == null ? null : row.phone, Validators.required],
                email: [row == null ? null : row.email, Validators.required],
                password: [row == null ? null : row.password],
                idNumber: [
                    row == null ? null : row.idNumber,
                    Validators.required,
                ],
                dateOfBirth: [
                    row == null
                        ? null
                        : new Date(row.dateOfBirth),
                    Validators.required,
                ],
                licenceTypeId: [
                    row == null ? null : row.licenceTypeId,
                    Validators.required,
                ],
                licenceTypeDescription: [
                    row == null ? null : row.licenceTypeDescription,
                    Validators.required,
                ],
                licenceTypeCode: [row == null ? null : row.licenceTypeCode],
                licenceExpiryDate: [
                    row == null
                        ? null
                        : new Date(row.licenceExpiryDate),
                    Validators.required,
                ],
                pdpId: [
                    row == null ? [] : row.pdpId.split(',')
                ],
                pdpExpiryDate: [
                    row == null
                        ? null
                        : row.pdpExpiryDate ? new Date(row.pdpExpiryDate) : null
                ],
                avatarChanged: [false],
                avatarChangedPdp: [false],
                fileToUpload: [null],
                fileToUploadPdp: [null],
                avatar: [row == null ? null : row.avatar],
                avatarPdp: [row == null ? null : row.avatarPdp],
                status: [row == null ? 'Active' : row.status],
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                licenceTypeList: this.licenceTypeList,
                pdpList: this.pdpList,
                pdpGroupedList: this.pdpGroupedList,
                title: row == null ? 'Insert' : 'Update',
            };

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;

            const dialogRef = this.dialog.open(
                DialogDriverComponent,
                dialogConfig
            );

            this.loading = false;
            dialogRef
                .afterClosed()

                .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
                    if (result !== false) {
                        result.form.pdpId = result.form.pdpId.toString();
                        if (row == null) {
                            this.sqlService
                                .createItem(
                                    'drivers',
                                    result.form
                                ).pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult) => {
                                    const newItem = extractApiData(apiResult.data);
                                    if (newItem) {
                                        if (result.fileToUpload) {
                                            let file = base64ToFile(result.fileToUpload);
                                            this.uploadFile(file, newItem.id, 'drivers').then(x => {
                                                const driver = this.drivers.find(x => x.id == newItem.id);
                                                if (driver) {
                                                    driver.avatar = '.jpg';
                                                    this.timestamp = new Date().getTime();
                                                }
                                            });
                                        }
                                        if (result.fileToUploadPdp) {
                                            let file = base64ToFile(result.fileToUploadPdp);
                                            this.uploadFilePdp(file, newItem.id, 'drivers').then(x => {
                                                const driver = this.drivers.find(x => x.id == newItem.id);
                                                if (driver) {
                                                    driver.avatarPdp = '.jpg';
                                                    this.timestamp = new Date().getTime();
                                                }
                                            });
                                        }
                                    } else {
                                        console.error('Driver creation failed: Invalid API response', apiResult);
                                        this._snackBar.open('Error: Driver creation failed', undefined, { duration: 3000 });
                                    }
                                });
                        } else {
                            this.sqlService
                                .updateItem(
                                    'drivers',
                                    result.form
                                ).pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult) => {
                                    const updatedItem = extractApiData(apiResult.data);
                                    if (updatedItem) {
                                        if (result.fileToUpload) {
                                            let file = base64ToFile(result.fileToUpload);
                                            this.uploadFile(file, updatedItem.id, 'drivers').then(x => {
                                                const driver = this.drivers.find(x => x.id == updatedItem.id);
                                                if (driver) {
                                                    driver.avatar = '.jpg';
                                                    this.timestamp = new Date().getTime();
                                                }
                                            });
                                        }
                                        if (result.fileToUploadPdp) {
                                            let file = base64ToFile(result.fileToUploadPdp);
                                            this.uploadFilePdp(file, updatedItem.id, 'drivers').then(x => {
                                                const driver = this.drivers.find(x => x.id == updatedItem.id);
                                                if (driver) {
                                                    driver.avatarPdp = '.jpg';
                                                    this.timestamp = new Date().getTime();
                                                }
                                            });
                                        }
                                    } else {
                                        console.error('Driver update failed: Invalid API response', apiResult);
                                        this._snackBar.open('Error: Driver update failed', undefined, { duration: 3000 });
                                    }
                                });
                        }
                    }
                });
        } else {
            this.showPaypal();
        }
    }

    uploadFile(fileToUpload: any, filename: string, model: string): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                this.sqlService.upload('drivers', formData, filename).pipe(takeUntil(this._unsubscribeAll)).subscribe(event => {
                    this.timestamp = new Date().getTime();
                    if (event.type == 4) {
                        resolve(true);
                    }
                })
            } catch (exception) {
                resolve(false);
            }
        });
        return promise;
    }

    uploadFilePdp(fileToUpload: any, filename: string, model: string): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                this.sqlService.uploadPdp('drivers', formData, filename).pipe(takeUntil(this._unsubscribeAll)).subscribe(event => {
                    this.timestamp = new Date().getTime();
                    if (event.type == 4) {
                        resolve(true);
                    }
                })
            } catch (exception) {
                resolve(false);
            }
        });
        return promise;
    }

    showPaypal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'drivers' };

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

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        // this.signalRService.endConnection();
    }
}

interface GroupedItem {
    pdpGroupDescription: string;
    pdpItems: { id: Guid; description: string }[];
}