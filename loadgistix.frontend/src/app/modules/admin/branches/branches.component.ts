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
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddressLabelPipe } from 'app/pipes/address-label.pipe';
import {
    Subject,
    Subscription,
    catchError,
    debounceTime,
    fromEvent,
    map,
    takeLast,
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
import { DialogBranchComponent } from 'app/dialogs/dialog-branch/dialog-branch.component';
// import { SignalRService } from 'app/services/signal-r.service';
import { branch } from 'app/models/branch.model';
import { SortPipe } from 'app/pipes/sort.pipe';
import { VariableService } from 'app/services/variable.service';
import { SqlService } from 'app/services/sql.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';
import { SignalRService } from 'app/services/signal-r.service';

@Component({
    selector: 'app-branches',
    templateUrl: './branches.component.html',
    styleUrls: ['./branches.component.scss'],
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
        SortPipe,
        MatSnackBarModule
    ],
    providers: [],
})
export class BranchesComponent implements OnInit, OnDestroy {
    loading: boolean = true;

    private _unsubscribeAll = new Subject<void>();

    branchList: branch[] = [];
    imagesFolder = environment.apiImage;

    branches: branch[];
    dataSource: MatTableDataSource<branch>;
    displayedColumns: string[] = [
        'description',
        'addressLabel',
        'phone'
    ];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    form!: FormGroup;

    rowCount: number = Math.trunc((window.innerHeight - 297) / 40 + 1);
    private destroy$ = new Subject<void>();
    iPaginator: number = 0;

    timestamp: number = 0;

    export = null;
    currentUser: User | null = null;

    showAdverts: boolean;

    constructor(
        @Inject(MatDialog) private dialog: MatDialog,
        private userService: UserService,
        private authService: AuthService,
        private variableService: VariableService,
        private _snackBar: MatSnackBar,
        private sqlService: SqlService,
        private _formBuilder: FormBuilder,
        private signalRService: SignalRService,
        private router: Router
    ) {
        this.timestamp = new Date().getTime();
        variableService.setPageSelected('My Branches');

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

        // if (!this.currentUser) {
        //     onAuthStateChanged(this.auth, (user) => {
        //         if (user) {
        //             this.initPage();
        //         }
        //     });
        // } else {
        //     this.initPage();
        // }
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


    // initSignalR() {
    //     this.signalRService.startConnection('branch').then(startConnectionResult => {
    //         if (startConnectionResult) {
    //             this.signalRService.addBranchAddedListener();
    //             this.signalRService.addBranchUpdatedListener();
    //             this.signalRService.addBranchDeletedListener();

    //             this.signalRService.branchAdded
    //                 .pipe(takeUntil(this._unsubscribeAll))
    //                 .subscribe((branch: branch) => {
    //                     console.log('branch', branch);
    //                     let i = this.branches.findIndex(x => x.id == branch.id);
    //                     if (i >= 0) {
    //                         this.branches[i] = branch;
    //                         this.dataSource = new MatTableDataSource(this.branches);
    //                         this.iPaginator = 0;
    //                         this.setPaginator();
    //                     } else {
    //                         this.branches.push(branch);
    //                         this.dataSource = new MatTableDataSource(this.branches);
    //                         this.iPaginator = 0;
    //                         this.setPaginator();
    //                     }
    //                 });

    //             this.signalRService.branchUpdated
    //                 .pipe(takeUntil(this._unsubscribeAll))
    //                 .subscribe((branch: branch) => {
    //                     console.log('branch', branch);
    //                     let i = this.branches.findIndex(x => x.id == branch.id);
    //                     if (i >= 0) {
    //                         this.branches[i] = branch;
    //                         this.dataSource = new MatTableDataSource(this.branches);
    //                         this.iPaginator = 0;
    //                         this.setPaginator();
    //                     }
    //                 });
    //             this.signalRService.branchDeleted
    //                 .pipe(takeUntil(this._unsubscribeAll))
    //                 .subscribe((id: Guid) => {
    //                     console.log('id', id);
    //                     let i = this.branches.findIndex(x => x.id == id);
    //                     if (i >= 0) {
    //                         this.branches.splice(
    //                             this.branches.findIndex(x => x.id == id)!,
    //                             1
    //                         );
    //                         this.dataSource = new MatTableDataSource(this.branches);
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
        this.getBranches();
        this.subscribeWebSocket();
        // this.initSignalR();
    }

    subscribeWebSocket() {
        this.signalRService.startConnection('branch').then(startConnectionResult => {
            if (startConnectionResult) {
                this.signalRService.addBranchAddedListener();
                this.signalRService.addBranchUpdatedListener();
                this.signalRService.addBranchDeletedListener();

                this.signalRService.branchAdded
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((branch: branch) => {
                        if (!this.branches.find(x => x.id == branch.id)) {
                            this.branches.push(branch);
                        }
                        this.dataSource = new MatTableDataSource(this.branches);
                        this.iPaginator = 0;
                        this.setPaginator();
                    });

                this.signalRService.branchUpdated
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((branch: branch) => {
                        let i = this.branches.findIndex(x => x.id == branch.id);
                        if (i >= 0) {
                            this.branches[i] = branch;
                            this.dataSource = new MatTableDataSource(this.branches);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    });

                this.signalRService.branchDeleted
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: any) => {
                        let i = this.branches.findIndex(x => x.id == id);
                        if (i >= 0) {
                            this.branches.splice(i, 1);
                            this.dataSource = new MatTableDataSource(this.branches);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    });
            }
        });
    }

    getBranches() {
        this.loading = true;

        this.sqlService
            .getItems('branches')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.branches = apiResult.data;
                    this.dataSource = new MatTableDataSource(this.branches);
                    this.iPaginator = 0;
                    this.setResizeEvents();
                    this.setPaginator();
                }
            }, (error) => {
                console.log('error', error);
                this.branches = [];
                this.dataSource = new MatTableDataSource(this.branches);
                this.iPaginator = 0;
                this.setResizeEvents();
                this.setPaginator();
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
                this.sqlService.getItems('transactions')
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.data == "Unauthorised") {
                                this.router.navigate(['/sign-out']);;
                            } else {
                                if (apiResult.result == true) {
                                    resolve(apiResult.data);
                                } else {
                                    resolve([{ advert: 0, directory: 0, load: 0, tms: 0, branch: 0 }]);
                                }
                            }
                        },
                        error: (error) => {
                            console.log('error', error);
                            this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                            resolve([{ advert: 0, directory: 0, load: 0, tms: 0, branch: 0 }]);
                        },
                        complete: () => {
                        }
                    });
            } catch (exception) {
                resolve([{ advert: 0, directory: 0, load: 0, tms: 0, branch: 0 }]);
            }
        });
        return promise;
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
            description: [
                row == null ? null : row.description,
                Validators.required,
            ],
            addressLabel: [
                row == null ? null : row.addressLabel,
                Validators.required,
            ],
            addressLat: [
                row == null ? null : row.addressLat,
                Validators.required,
            ],
            addressLon: [
                row == null ? null : row.addressLon,
                Validators.required,
            ],
            email: [
                row == null ? null : row.email,
                Validators.required,
            ],
            phone: [
                row == null ? null : row.phone,
                Validators.required,
            ],
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.form,
            branchList: this.branchList,
            title: row == null ? 'Insert' : 'Update',
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(
            DialogBranchComponent,
            dialogConfig
        );

        this.loading = false;
        dialogRef
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result !== false) {
                    switch (result.action) {
                        case 'insert':
                            this.sqlService.createItem('branches', result.value)
                                .pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult) => {
                                    // this.branchList.push(apiResult.data);
                                    // this.dataSource = new MatTableDataSource(this.branchList);
                                    // this.iPaginator = 0;
                                    // this.setPaginator();
                                });
                            break;
                        case 'update':
                            this.sqlService.updateItem('branches', result.value)
                                .pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult) => {
                                    // this.branchList.find(x => x.id == result.value.id).description = apiResult.data.description;
                                    // this.branchList.find(x => x.id == result.value.id).addressLabel = apiResult.data.addressLabel;
                                    // this.branchList.find(x => x.id == result.value.id).addressLat = apiResult.data.addressLat;
                                    // this.branchList.find(x => x.id == result.value.id).addressLon = apiResult.data.addressLon;
                                    // this.dataSource = new MatTableDataSource(this.branchList);
                                    // this.iPaginator = 0;
                                    // this.setPaginator();
                                });
                            break;
                        case 'delete':
                            this.sqlService.deleteItem('branches', result.value)
                                .pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult) => {
                                    // this.branchList = this.branchList.filter(x => x.id != result.value.id);
                                    // this.dataSource = new MatTableDataSource(this.branchList);
                                    // this.iPaginator = 0;
                                    // this.setPaginator();
                                });
                            break;
                        default:
                            break;
                    }
                }
            });
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        // this.signalRService.endConnection();
    }
}
