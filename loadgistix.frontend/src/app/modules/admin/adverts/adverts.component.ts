import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { advert } from 'app/models/advert.model';
import { Observable, Subject, debounceTime, first, fromEvent, takeUntil } from 'rxjs';
import { VariableService } from 'app/services/variable.service';
import { ActivatedRoute, Router } from '@angular/router';
import { base64ToFile } from 'ngx-image-cropper';
import { Subscription } from 'rxjs';
import { DialogImageComponent } from 'app/dialogs/dialog-image/dialog-image.component';
import { DialogAccountComponent } from 'app/dialogs/dialog-account/dialog-account.component';
import { environment } from 'environments/environment';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DialogAdvertComponent } from 'app/dialogs/dialog-advert/dialog-advert.component';
import { SqlService } from 'app/services/sql.service';
import { Preferences } from '@capacitor/preferences';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';
import { extractApiData } from 'app/services/api-response.helper';


const MAX_SIZE: number = 1048576;

@Component({
    selector: 'app-adverts',
    templateUrl: './adverts.component.html',
    styleUrls: ['./adverts.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MatSnackBarModule, MatProgressSpinnerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule]
})
export class AdvertsComponent implements OnInit, OnDestroy {
    timestamp: number = 0;
    iPaginator: number = 0;
    private _unsubscribeAll = new Subject<void>();
    loading: boolean = true;
    imagesFolder = environment.apiImage;

    form!: FormGroup;
    advertList: advert[] = [];
    currentUser: User | null = null;

    displayedColumns: string[];
    dataSource!: MatTableDataSource<advert>;
    rowCount: number = Math.trunc(((window.innerHeight - 330) / 40) + 1);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    theFile: any = null;
    messages: string[] = [];

    deleteform!: FormGroup;

    quantity: number = 0;//Number(localStorage.getItem('advertsQuantity'));

    private destroy$ = new Subject<void>();

    showAdverts: boolean;

    constructor(
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private sqlService: SqlService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.timestamp = new Date().getTime();
        variableService.setPageSelected('My Adverts');
        this.userService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
                this.initPage();
            }
        });


    }

    initPage() {
        this.getSubscription();

        this.dataSource = new MatTableDataSource;

        fromEvent(window, 'resize')
            .pipe(
                debounceTime(200),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.rowCount = Math.trunc(((window.innerHeight - 330) / 40) + 1);
                if (this.paginator) {
                    this.paginator.pageSize = Math.trunc(((window.innerHeight - 330) / 40) + 1);
                    this.dataSource = new MatTableDataSource(this.advertList);
                    this.iPaginator = 0;
                    this.setPaginator();
                } else {
                    setTimeout(() => {
                        if (this.paginator) {
                            this.paginator.pageSize = Math.trunc(((window.innerHeight - 330) / 40) + 1);
                            this.dataSource = new MatTableDataSource(this.advertList);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    }, 1000);
                }
            });

        this.timestamp = new Date().getTime();
        this.displayedColumns = ['avatar', 'title', 'status'];

        this.getAdverts().then(advertList => {
            this.advertList = advertList;
            this.dataSource = new MatTableDataSource(this.advertList);
            this.iPaginator = 0;
            this.setPaginator();
            this.loading = false;

        })

        setTimeout(() => {
            this.loading = false;

        }, 10000);
    }

    ngOnInit(): void {
        this.variableService.showAdverts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((showAdverts) => {
                this.showAdverts = showAdverts;
            });
        // this.route.queryParams.subscribe(params => {
        //     if (params['action'] == 'return') {
        //     }
        // });

    }


    setPaginator() {
        this.iPaginator++;
        if (this.iPaginator < 5) {
            if (this.paginator) {
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.paginator.firstPage();
            } else {
                setTimeout(() => {
                    this.setPaginator();
                }, 500);
            }
        }
    }

    getTransactions(): Promise<any[]> {
        var promise = new Promise<any[]>((resolve) => {
            try {
                this.sqlService.getItems('transactions').pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            if (apiResult.data == "Unauthorised") {
                                this.router.navigate(['/sign-out']);;
                            } else {
                                resolve(apiResult.data);
                            }
                        } else {
                            resolve([{ advert: 0, directory: 0, load: 0, tms: 0, vehicle: 0 }]);
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
                this.quantity = (this.currentUser ? this.currentUser.email : '') == 'anton@madproducts.co.za' ? -1 : res[0].advert;
            }
        })
    }

    getAdverts(): Promise<advert[]> {
        var promise = new Promise<advert[]>((resolve) => {
            try {
                this.sqlService.getItems('adverts').pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            if (apiResult.data == "Unauthorised") {
                                this.router.navigate(['/sign-out']);;
                            } else {
                                resolve(apiResult.data);
                            }
                        }
                    },
                    error: (error) => {
                        console.log('error', error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                    },
                    complete: () => {
                    }
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }
    // getAdverts() {
    //     this.subscriptionAdverts = this.advertService.getAdverts().pipe(takeUntil(this._unsubscribeAll)).subscribe(advertList => {
    //         this.advertList = advertList;
    //         this.dataSource = new MatTableDataSource(this.advertList);
    //         this.iPaginator = 0;
    //         this.setPaginator();
    //         this.loading = false;
    //

    //     });
    // }

    showPaypal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'adverts' };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        this.dialog.open(DialogAccountComponent,
            dialogConfig);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    async initUpsert(row: any) {
        if ((this.dataSource.data.length < this.quantity) || (this.dataSource.data.length == this.quantity && row !== null) || (this.quantity === -1)) {
            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth();
            var day = d.getDate();
            var c = new Date(year + 1, month, day);

            this.form = this._formBuilder.group({
                id: [row == null ? undefined : row.id ? row.id : row.id],
                userId: [row == null ? this.currentUser.id : row.userId],
                userDescription: [row == null ? (this.currentUser == null ? 'n/a' : this.currentUser.name) : row.userDescription],
                dateExpiry: [row == null ? null : row.dateExpiry],
                title: [row == null ? null : row.title, [Validators.required, Validators.maxLength(30)]],
                subTitle: [row == null ? null : row.subTitle, [Validators.required, Validators.maxLength(50)]],
                content: [row == null ? null : row.content, [Validators.required, Validators.maxLength(200)]],
                phone: [row == null ? null : row.phone, [Validators.required, Validators.maxLength(15)]],
                email: [row == null ? null : row.email, [Validators.required, Validators.maxLength(200)]],
                website: [row == null ? null : row.website, [Validators.required, Validators.maxLength(200)]],
                addressLabel: [row == null ? null : row.addressLabel, Validators.required],
                addressLat: [row == null ? null : row.addressLat, Validators.required],
                addressLon: [row == null ? null : row.addressLon, Validators.required],
                avatar: [row == null ? null : row.avatar],
                avatarChanged: [false],
                fileToUpload: [null],
                status: [row == null ? 'Active' : row.status]
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: row,
                form: this.form,
                title: row == null ? 'Insert' : 'Update'
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;

            const dialogRef = this.dialog.open(DialogAdvertComponent,
                dialogConfig);

            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result !== false) {
                    this.loading = true;

                    if (row == null) {
                        this.sqlService.createItem('adverts', result.form).subscribe({
                            next: (apiResult: any) => {
                                const newItem = extractApiData(apiResult.data);
                                if (!newItem) {
                                    this.loading = false;
                                    return;
                                }
                                
                                if (newItem.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
                                    let file = base64ToFile(result.fileToUpload);
                                    this.uploadFile(file, newItem.id).then(x => {
                                        this.advertList.push(newItem);
                                        this.dataSource = new MatTableDataSource(this.advertList);
                                        this.iPaginator = 0;
                                        this.setPaginator();
                                        const addedItem = this.advertList.find(x => x.id == newItem.id);
                                        if (addedItem) {
                                            addedItem.avatar = '.jpg';
                                            this.timestamp = new Date().getTime();
                                        }
                                        this.loading = false;
                                    });
                                } else {
                                    this.advertList.push(newItem);
                                    this.dataSource = new MatTableDataSource(this.advertList);
                                    this.iPaginator = 0;
                                    this.setPaginator();
                                    this.loading = false;
                                }
                            },
                            error: (error) => {
                                console.log('error', error);
                                this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                                this.loading = false;
                            },
                            complete: () => {
                            }
                        })
                    } else {
                        if (result.form == null && result.fileToUpload == null) {
                            this.sqlService.deleteItem('adverts', row.id).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                                next: (apiResult: any) => {
                                    this.advertList.splice(this.advertList.findIndex(x => x.id == row.id)!, 1);
                                    this.dataSource = new MatTableDataSource(this.advertList);
                                    this.iPaginator = 0;
                                    this.setPaginator();
                                    this.timestamp = new Date().getTime();
                                    this.loading = false;

                                },
                                error: (error) => {
                                    console.log('error', error);
                                    this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                                },
                                complete: () => {
                                }
                            })
                        } else {
                            this.sqlService.updateItem('adverts', result.form).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                                next: (apiResult: any) => {
                                    if (apiResult.result == true) {
                                        const updatedItem = extractApiData(apiResult.data);
                                        if (updatedItem && updatedItem.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
                                            let file = base64ToFile(result.fileToUpload);
                                            this.uploadFile(file, updatedItem.id).then(x => {
                                                let objIndex = this.advertList.findIndex(x => x.id === row.id);
                                                this.advertList[objIndex] = updatedItem;
                                                this.dataSource = new MatTableDataSource(this.advertList);
                                                this.iPaginator = 0;
                                                this.setPaginator();
                                                const existingItem = this.advertList.find(x => x.id == updatedItem.id);
                                                if (existingItem) {
                                                    existingItem.avatar = '.jpg';
                                                    this.timestamp = new Date().getTime();
                                                }
                                                this.loading = false;

                                            });
                                        } else if (updatedItem) {
                                            let objIndex = this.advertList.findIndex(x => x.id === row.id);
                                            this.advertList[objIndex] = updatedItem;
                                            this.dataSource = new MatTableDataSource(this.advertList);
                                            this.iPaginator = 0;
                                            this.setPaginator();
                                            this.loading = false;

                                        }
                                    } else {
                                        if (apiResult.message == 'Expired') {
                                            this.loading = false;

                                        } else {
                                            this._snackBar.open('Error: ' + apiResult.message, undefined, { duration: 2000 });
                                            this.loading = false;

                                        }
                                    }
                                },
                                error: (error) => {
                                    console.log('error', error);
                                    this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                                },
                                complete: () => {
                                }
                            })
                        }
                    }
                }
            })
        } else {
            this.showPaypal();
        }
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

                this.sqlService.deleteItem('adverts', id).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            this.advertList.splice(this.advertList.findIndex(item => item.id === apiResult.id), 1);
                            this.dataSource = new MatTableDataSource(this.advertList);
                            this.iPaginator = 0;
                            this.setPaginator();
                        }
                    },
                    error: (error) => {
                        console.log('error', error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                    },
                    complete: () => {
                    }
                })
            }
        });
    }

    uploadFile(fileToUpload: any, filename: string): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                this.sqlService.upload('adverts', formData, filename).pipe(takeUntil(this._unsubscribeAll)).subscribe(event => {
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

    viewImage(avatar: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            avatar: avatar
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';

        this.dialog.open(DialogImageComponent,
            dialogConfig);
    }

    getAddressSubstring(str: string, char: string) {
        let arr = str ? (str.split(char) ? str.split(char) : '') : '';
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.loading = false;

    }
}
