import { CommonModule, NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { DialogDirectoryCategoryComponent } from 'app/dialogs/dialog-directoryCategory/dialog-directoryCategory.component';
import { directoryCategory } from 'app/models/directoryCategory.model';
// import { SignalRService } from 'app/services/signal-r.service';
import { SqlService } from 'app/services/sql.service';
import { VariableService } from 'app/services/variable.service';
import { environment } from 'environments/environment';
import { Guid } from 'guid-typescript';
import {
    Subject,
    Subscription,
    debounceTime,
    fromEvent,
    takeUntil,
} from 'rxjs';
import { SignalRService } from 'app/services/signal-r.service';

@Component({
    selector: 'lookups-directory-category',
    templateUrl: './directory-category.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        NgClass,
        NgIf,
        NgFor,
        NgForOf,
        MatProgressSpinnerModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class LookupsDirectoryCategoryComponent implements OnInit, OnDestroy {
    loading: boolean = true;


    private _unsubscribeAll = new Subject<void>();

    directoryCategoryList: directoryCategory[] = [];
    displayedColumns: string[] = ['description'];
    dataSource!: MatTableDataSource<directoryCategory>;
    form!: FormGroup;
    deleteForm!: FormGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    rowCount: number = Math.trunc(
        (window.innerHeight - (window.innerWidth >= 1280 ? 264 : 304)) / 40
    ); //300
    private destroy$ = new Subject<void>();
    iPaginator: number = 0;

    constructor(
        private sqlService: SqlService,
        private dialog: MatDialog,
        private signalRService: SignalRService,
        private _formBuilder: FormBuilder,

        private userService: UserService,
        private variableService: VariableService,
        private router: Router
    ) {
        variableService.setPageSelected('Lookups');
        fromEvent(window, 'resize')
            .pipe(debounceTime(200), takeUntil(this.destroy$))

            .subscribe(() => {
                this.iPaginator = 0;
                this.setPaginator(false);
            });

        // this.initSignalR();
        this.subscribeWebSocket();
    }

    subscribeWebSocket() {
        this.signalRService.startConnection('directoryCategory').then(startConnectionResult => {
            if (startConnectionResult) {
                this.signalRService.addDirectoryCategoryAddedListener();
                this.signalRService.addDirectoryCategoryUpdatedListener();
                this.signalRService.addDirectoryCategoryDeletedListener();

                this.signalRService.directoryCategoryAdded
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((directoryCategory: directoryCategory) => {
                        if (!this.directoryCategoryList.find(x => x.id == directoryCategory.id)) {
                            this.directoryCategoryList.push(directoryCategory);
                        }
                        this.dataSource = new MatTableDataSource(this.directoryCategoryList);
                        this.iPaginator = 0;
                        this.setPaginator(true);
                    });

                this.signalRService.directoryCategoryUpdated
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((directoryCategory: directoryCategory) => {
                        let i = this.directoryCategoryList.findIndex(x => x.id == directoryCategory.id);
                        if (i >= 0) {
                            this.directoryCategoryList[i] = directoryCategory;
                            this.dataSource = new MatTableDataSource(this.directoryCategoryList);
                            this.iPaginator = 0;
                            this.setPaginator(true);
                        }
                    });

                this.signalRService.directoryCategoryDeleted
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: any) => {
                        let i = this.directoryCategoryList.findIndex(x => x.id == id);
                        if (i >= 0) {
                            this.directoryCategoryList.splice(i, 1);
                            this.dataSource = new MatTableDataSource(this.directoryCategoryList);
                            this.iPaginator = 0;
                            this.setPaginator(true);
                        }
                    });
            }
        });
    }

    ngOnInit(): void {
        this.getDirectoryCategories();
    }

    getDirectoryCategories() {
        this.loading = true;

        this.sqlService
            .getItems('directoryCategories')

            .pipe(takeUntil(this._unsubscribeAll)).subscribe(apiResult => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.directoryCategoryList = apiResult.data;
                    this.dataSource = new MatTableDataSource(
                        this.directoryCategoryList
                    );
                    this.iPaginator = 0;
                    this.setPaginator(false);
                }
            });
    }

    // initSignalR() {
    //     this.signalRService.startConnection('directoryCategory').then(startConnectionResult => {
    //         if (startConnectionResult) {
    //             this.signalRService.addDirectoryCategoryAddedListener();
    //             this.signalRService.addDirectoryCategoryUpdatedListener();
    //             this.signalRService.addDirectoryCategoryDeletedListener();

    //             this.signalRService.directoryCategoryAdded

    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((directoryCategory: directoryCategory) => {
    //                     this.loading = true;

    //                     this.directoryCategoryList.push(directoryCategory);
    //                     this.dataSource = new MatTableDataSource(
    //                         this.directoryCategoryList
    //                     );
    //                     this.iPaginator = 0;
    //                     this.setPaginator(true);
    //                 });
    //             this.signalRService.directoryCategoryUpdated

    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((directoryCategory: directoryCategory) => {
    //                     this.loading = true;

    //                     const indexOfObject = this.directoryCategoryList.findIndex(
    //                         (object) => {
    //                             return object.id === directoryCategory.id;
    //                         }
    //                     );

    //                     if (indexOfObject !== -1) {
    //                         this.directoryCategoryList[indexOfObject] =
    //                             directoryCategory;
    //                         this.dataSource = new MatTableDataSource(
    //                             this.directoryCategoryList
    //                         );
    //                         this.iPaginator = 0;
    //                         this.setPaginator(true);
    //                     }
    //                 });
    //             this.signalRService.directoryCategoryDeleted

    //                 .pipe(takeUntil(this._unsubscribeAll)).subscribe((id: Guid) => {
    //                     this.loading = true;

    //                     const indexOfObject = this.directoryCategoryList.findIndex(
    //                         (object) => {
    //                             return object.id === id;
    //                         }
    //                     );

    //                     if (indexOfObject !== -1) {
    //                         this.directoryCategoryList.splice(indexOfObject, 1);
    //                         this.dataSource = new MatTableDataSource(
    //                             this.directoryCategoryList
    //                         );
    //                         this.iPaginator = 0;
    //                         this.setPaginator(true);
    //                     }
    //                 });
    //         } else {
    //             this.router.navigate(['/sign-out']);;
    //         }
    //     });
    // }

    setPaginator(fromSignalR: boolean) {
        this.iPaginator++;
        if (this.iPaginator < 5) {
            if (this.paginator) {
                this.paginator.pageSize = Math.trunc(
                    (window.innerHeight -
                        (window.innerWidth >= 1280 ? 264 : 304)) /
                    40
                );
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                if (!fromSignalR) {
                    if (this.paginator.pageIndex != 0) {
                        if (
                            this.paginator.pageIndex + 1 >
                            this.paginator.getNumberOfPages()
                        ) {
                            this.paginator.lastPage();
                        }
                    }
                }
                this.loading = false;

            } else {
                setTimeout(() => {
                    this.setPaginator(fromSignalR);
                }, 500);
            }
        } else {
            this.loading = false;

        }
    }

    initUpsertDirectoryCategory(row: any) {
        this.form = this._formBuilder.group({
            id: [row == null ? undefined : row.id ? row.id : row.id],
            description: [
                row == null ? null : row.description,
                Validators.required,
            ],
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: row,
            form: this.form,
            directoryCategoryList: this.directoryCategoryList,
            title: row == null ? 'Insert' : 'Update',
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(
            DialogDirectoryCategoryComponent,
            dialogConfig
        );

        this.loading = false;
        dialogRef
            .afterClosed()

            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
                if (result !== false) {
                    switch (result.action) {
                        case 'insert':
                            this.sqlService.createItem('directoryCategories', result.value).pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult) => {
                            });
                            break;
                        case 'update':
                            this.sqlService.updateItem('directoryCategories', result.value).pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult) => {
                            });
                            break;
                        case 'delete':
                            break;
                        default:
                            break;
                    }
                }
            });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.paginator) {
            if (this.paginator.pageIndex != 0) {
                if (
                    this.paginator.pageIndex + 1 >
                    this.paginator.getNumberOfPages()
                ) {
                    this.paginator.lastPage();
                }
            }
        }
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        // this.signalRService.endConnection();
    }
}
