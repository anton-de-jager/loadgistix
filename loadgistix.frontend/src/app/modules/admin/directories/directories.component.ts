import { AfterViewInit, Component, Inject, OnDestroy, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CommonModule, NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { SortPipe } from 'app/pipes/sort.pipe';
import { environment } from 'environments/environment';
import L from 'leaflet';
import { Subject, takeUntil } from 'rxjs';
import { SqlService } from 'app/services/sql.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { VariableService } from 'app/services/variable.service';
import { DialogImageUploadComponent } from 'app/dialogs/dialog-image-upload/dialog-image-upload.component';
import { Guid } from 'guid-typescript';
import { directoryCategory } from 'app/models/directoryCategory.model';
import { directory } from 'app/models/directory.model';
import { DialogAccountComponent } from 'app/dialogs/dialog-account/dialog-account.component';
import { Preferences } from '@capacitor/preferences';
import { DialogImageComponent } from 'app/dialogs/dialog-image/dialog-image.component';
import { base64ToFile } from 'ngx-image-cropper';
import { NominatimService, NominatimResult } from 'app/services/nominatim.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';
import { extractApiData } from 'app/services/api-response.helper';

const iconDefault = L.icon({
    iconRetinaUrl: 'assets/images/marker-icon-2x.png',
    iconUrl: 'assets/images/marker-icon.png',
    shadowUrl: 'assets/images/marker-shadow.png',
    iconSize: [200, 200],
    iconAnchor: [12, 50],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [50, 50]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
    selector: 'directories',
    templateUrl: './directories.component.html',
    styleUrls: ['./directories.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [MatIconModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule, MatDatepickerModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, CommonModule, NgClass, NgFor, NgForOf, NgIf, SortPipe, MatAutocompleteModule]
})
export class DirectoriesComponent implements OnDestroy, AfterViewInit {
    mapsActive = false;
    timestamp: number = 0;
    form!: FormGroup;
    formErrors: any;
    formValid!: boolean;
    private _unsubscribeAll = new Subject<void>();
    previewImage: string | null = null;
    fileToUpload: any;
    freeListing: boolean = false;
    avatarChanged = false;
    loading = false;
    imagesFolder = environment.apiImage;
    id: string | null = null;
    loadingAddress: boolean = false;

    directoryCategoryList: directoryCategory[] = [];
    directoryList: directory[] = [];

    private destroy$ = new Subject<void>();
    currentUser: User | null = null;

    quantity!: number;//Number(localStorage.getItem('directoryQuantity')!.toString() == '-1' ? 1 : localStorage.getItem('directoryQuantity'));

    showAdverts: boolean;

    // Nominatim autocomplete
    addressSuggestions: NominatimResult[] = [];
    private searchSubject = new Subject<string>();

    constructor(
        @Inject(MatDialog) private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private sqlService: SqlService,
        private userService: UserService,
        private authService: AuthService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private variableService: VariableService,
        private nominatimService: NominatimService,
        private router: Router) {
        this.timestamp = new Date().getTime();
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

        this.getDirectoryCategories().then(getDirectoryCategoriesResult => {
            this.directoryCategoryList = getDirectoryCategoriesResult;
        });
        this.getDirectories().then(getDirectoriesResult => {
            this.directoryList = getDirectoriesResult;

            this.form = this._formBuilder.group({
                id: [this.directoryList.length === 0 ? Guid.create().toString() : this.directoryList[0].id],
                userId: [this.directoryList.length === 0 ? this.currentUser.id : this.directoryList[0].userId],
                userDescription: [this.directoryList.length === 0 ? (this.currentUser == null ? 'n/a' : this.currentUser.name) : this.directoryList[0].userDescription],
                directoryCategoryId: [this.directoryList.length === 0 ? null : this.directoryList[0].directoryCategoryId, Validators.required],
                directoryCategoryDescription: [this.directoryList.length === 0 ? null : this.directoryList[0].directoryCategoryDescription],
                companyName: [this.directoryList.length === 0 ? null : this.directoryList[0].companyName, Validators.required],
                description: [this.directoryList.length === 0 ? null : this.directoryList[0].description, Validators.required],
                email: [this.directoryList.length === 0 ? null : this.directoryList[0].email, Validators.required],
                phone: [this.directoryList.length === 0 ? null : this.directoryList[0].phone, Validators.required],
                website: [this.directoryList.length === 0 ? null : this.directoryList[0].website, Validators.required],
                instagram: [this.directoryList.length === 0 ? null : this.directoryList[0].instagram],
                facebook: [this.directoryList.length === 0 ? null : this.directoryList[0].facebook],
                twitter: [this.directoryList.length === 0 ? null : this.directoryList[0].twitter],
                addressLat: [this.directoryList.length === 0 ? null : this.directoryList[0].addressLat, Validators.required],
                addressLon: [this.directoryList.length === 0 ? null : this.directoryList[0].addressLon, Validators.required],
                addressLabel: [this.directoryList.length === 0 ? null : this.directoryList[0].addressLabel, Validators.required],
                avatar: [this.directoryList.length === 0 ? null : this.directoryList[0].avatar],
                avatarChanged: [false],
                fileToUpload: [null],
                status: [this.directoryList.length === 0 ? 'Active' : this.directoryList[0].status]
            });

            this.getSubscription().then(x => {
                this.loading = false;
            });
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

    getSubscription(): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                this.getTransactions().then(res => {
                    if (res.length > 0) {
                        this.quantity = res[0].directory;
                        if (this.quantity <= 0) {
                            this.form.disable();
                            this.showPaypal();
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    } else {
                        resolve(false);
                    }
                });
            } catch (exception) {
                resolve(false);
            }
        });
        return promise;
    }

    showPaypal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { page: 'directories' };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        this.dialog.open(DialogAccountComponent,
            dialogConfig);
    }

    getDirectories(): Promise<directory[]> {
        var promise = new Promise<directory[]>((resolve) => {
            try {
                this.sqlService.getItems('directories').pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.data == "Unauthorised") {
                            this.router.navigate(['/sign-out']);;
                        } else {
                            if (apiResult.result == true) {
                                resolve(apiResult.data);
                            }
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                    },
                    complete: () => {
                    }
                })
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    getDirectoryCategories(): Promise<directoryCategory[]> {
        var promise = new Promise<directoryCategory[]>((resolve) => {
            try {
                this.sqlService.getItems('directoryCategories').pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.data == "Unauthorised") {
                            this.router.navigate(['/sign-out']);;
                        } else {
                            if (apiResult.result == true) {
                                resolve(apiResult.data);
                            }
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                    },
                    complete: () => {
                    }
                })
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    uploadFile(fileToUpload: any, filename: string): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                this.sqlService.upload('directories', formData, filename).pipe(takeUntil(this._unsubscribeAll)).subscribe(event => {
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

    getAddressSubstring(str: string, char: string) {
        let arr = str ? (str.split(char) ? str.split(char) : '') : '';
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
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








    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {
    }


    ngAfterViewInit(): void {
        setTimeout(() => {
            this.initAutocomplete();
        }, 1000);
    }

    initAutocomplete() {
        // Initialize Nominatim autocomplete
        this.nominatimService.createAutocompleteObservable(this.searchSubject, 'za')
            .pipe(takeUntil(this.destroy$))
            .subscribe(results => {
                this.addressSuggestions = results;
            });
    }

    onAddressInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.searchSubject.next(inputElement.value);
    }

    onAddressSelected(displayName: string): void {
        const result = this.addressSuggestions.find(s => s.display_name === displayName);
        if (result) {
            this.form.controls['addressLabel'].setValue(result.display_name);
            this.form.controls['addressLat'].setValue(parseFloat(result.lat));
            this.form.controls['addressLon'].setValue(parseFloat(result.lon));
            this.addressSuggestions = [];
        }
    }

    uploadImage(event: Event) {
        event.preventDefault();
        const dialogConfig = new MatDialogConfig();

        dialogConfig.data = {
            title: 'Upload Image',
            message: 'Please select an image to upload',
            roundCropper: false,
            croppedImage: this.avatarChanged
                ? this.form.value.fileToUpload
                : this.avatarChanged ? this.fileToUpload : this.form.value.avatar ? this.imagesFolder + 'Directories/' + this.form.value.id + this.form.value.avatar + '?t=' + this.timestamp : 'assets/images/no-image.png',
            savedImage: this.avatarChanged ? this.fileToUpload : this.form.value.avatar ? (this.imagesFolder + 'Directories/' + this.form.value.id + this.form.value.avatar + '?t=' + this.timestamp) : 'assets/images/no-image.png'
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';

        const dialogRef = this.dialog.open(DialogImageUploadComponent,
            dialogConfig);

        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result: string | null) => {
            if (result !== null) {
                this.avatarChanged = true;
                this.fileToUpload = result;
                this.form.value.fileToUpload = result;
            }
        });

    }

    changeDirectoryCategory() {
        if (this.form.value.directoryCategoryId) {
            this.form.controls['directoryCategoryDescription'].setValue(this.getDirectoryCategoryDescription(this.form.value.directoryCategoryId));
        }
    }

    getDirectoryCategoryDescription(val: Guid): string {
        return this.directoryCategoryList.find((x: directoryCategory) => x['id'] == val).description;
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    }

    async save() {
        if (this.directoryList.length <= this.quantity || this.quantity === -1 || (this.directoryList.length == this.quantity && this.directoryList[0] !== null)) {
            this.loading = true;
            if (this.directoryList.length === 0) {
                this.sqlService.createItem('directories', this.form.value).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        const newItem = extractApiData(apiResult.data);
                        if (newItem && apiResult.id != '00000000-0000-0000-0000-000000000000' && this.fileToUpload) {
                            let file = base64ToFile(this.fileToUpload);
                            this.uploadFile(file, newItem.id).then(x => {
                                const existingItem = this.directoryList.find(x => x.id == newItem.id);
                                if (existingItem) {
                                    existingItem.avatar = '.jpg';
                                    this.timestamp = new Date().getTime();
                                }
                                this.loading = false;
                            });
                        } else {
                            // this.directoryList.push(apiResult.data);
                            this.loading = false;
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                        this.loading = false;
                    },
                    complete: () => {
                    }
                })
            } else {
                this.sqlService.updateItem('directories', this.form.value).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            const updatedItem = extractApiData(apiResult.data);
                            if (updatedItem && apiResult.id != '00000000-0000-0000-0000-000000000000' && this.fileToUpload) {
                                let file = base64ToFile(this.fileToUpload);
                                this.uploadFile(file, updatedItem.id).then(x => {
                                    const existingItem = this.directoryList.find(x => x.id == updatedItem.id);
                                    if (existingItem) {
                                        existingItem.avatar = '.jpg';
                                        this.timestamp = new Date().getTime();
                                    }
                                    this.loading = false;
                                });
                            } else {
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
                        console.log(error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                    },
                    complete: () => {
                    }
                })
            }
        } else {
            this.showPaypal();
        }
    }
}


// import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatSort, MatSortModule } from '@angular/material/sort';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';

// import { directory } from 'app/models/directory.model';
// import { directoryCategory } from 'app/models/directoryCategory.model';

// import { Observable, Subject, debounceTime, first, fromEvent, takeUntil } from 'rxjs';
// import { DialogDirectoryComponent } from 'app/dialogs/dialog-directory/dialog-directory.component';
// import { VariableService } from 'app/services/variable.service';

// import { HttpEventType } from '@angular/common/http';
// import { Subscription } from 'rxjs';
// import { DialogImageComponent } from 'app/dialogs/dialog-image/dialog-image.component';
// import { Guid } from 'guid-typescript';
// import { DialogAccountComponent } from 'app/dialogs/dialog-account/dialog-account.component';
// import { base64ToFile } from 'ngx-image-cropper';
// import { environment } from 'environments/environment';
// import { SqlService } from 'app/services/sql.service';
// import { CommonModule, NgClass } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { Preferences } from '@capacitor/preferences';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { FuseConfirmationService } from '@fuse/services/confirmation';


// @Component({
//     selector: 'directories',
//     templateUrl: './directories.component.html',
//     styleUrls: ['./directories.component.scss'],
//     standalone: true,
//     encapsulation: ViewEncapsulation.None,
//     imports: [CommonModule, MatProgressSpinnerModule, NgClass, MatTableModule, MatSnackBarModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule]
// })
// export class DirectoriesComponent implements OnInit, OnDestroy {
//     iPaginator: number = 0;

//     private _unsubscribeAll = new Subject<void>();
//     loading: boolean = true;

//     timestamp: number = 0;
//     form!: FormGroup;
//     directoryCategoryList: directoryCategory[] = [];
//     directoryList: directory[] = [];
// imagesFolder = environment.apiImage;

//     displayedColumns: string[];
//     dataSource!: MatTableDataSource<directory>;
//     rowCount: number = Math.trunc(((window.innerHeight - 330) / 40) + 1);
//     @ViewChild(MatPaginator) paginator: MatPaginator;
//     @ViewChild(MatSort) sort: MatSort;
//     private destroy$ = new Subject<void>();

//     deleteform!: FormGroup;
//     quantity!: number;//Number(localStorage.getItem('directoryQuantity')!.toString() == '-1' ? 1 : localStorage.getItem('directoryQuantity'));

//     showAdverts: boolean;

//     constructor(
//         private dialog: MatDialog,
//         private _formBuilder: FormBuilder,
//         private _snackBar: MatSnackBar,
//         private _fuseConfirmationService: FuseConfirmationService,
//         public variableService: VariableService,
//         private sqlService: SqlService,
//         public auth: Auth
//     ) {
//         this.timestamp = new Date().getTime();
//         if (!this.currentUser) {
//             this.auth.onAuthStateChanged((user) => {
//                 this.initPage();
//             });
//         } else {
//             this.initPage();
//         }

//     }

//     initPage() {
//         this.variableService.showAdverts$
//             .pipe(takeUntil(this._unsubscribeAll))
//             .subscribe((showAdverts) => {
//                 this.showAdverts = showAdverts;
//             });

//         this.getSubscription();

//         this.dataSource = new MatTableDataSource;

//         fromEvent(window, 'resize')
//             .pipe(
//                 debounceTime(200),
//                 takeUntil(this.destroy$)
//             )
//             .subscribe(() => {
//                 this.rowCount = Math.trunc(((window.innerHeight - 330) / 40) + 1);
//                 if (this.paginator) {
//                     this.paginator.pageSize = Math.trunc(((window.innerHeight - 330) / 40) + 1);
//                     this.dataSource = new MatTableDataSource(this.directoryList);
//                     this.iPaginator = 0;
//                     this.setPaginator();
//                 } else {
//                     setTimeout(() => {
//                         if (this.paginator) {
//                             this.paginator.pageSize = Math.trunc(((window.innerHeight - 330) / 40) + 1);
//                             this.dataSource = new MatTableDataSource(this.directoryList);
//                             this.iPaginator = 0;
//                             this.setPaginator();
//                         }
//                     }, 1000);
//                 }
//             });

//         this.displayedColumns = ['avatar', 'companyName', 'directoryCategoryDescription', 'status'];

//         this.getDirectoryCategories().then(getDirectoryCategoriesResult => {
//             this.directoryCategoryList = getDirectoryCategoriesResult;
//         });
//         this.getDirectories().then(getDirectoriesResult => {
//             this.directoryList = getDirectoriesResult;
//             this.dataSource = new MatTableDataSource(this.directoryList);
//             this.iPaginator = 0;
//             this.setPaginator();
//             this.loading = false;

//         });

//         setTimeout(() => {
//             this.loading = false;

//         }, 10000);
//     }

//     ngOnInit(): void {

//     }


//     setPaginator() {
//         this.iPaginator++;
//         if (this.iPaginator < 5) {
//             if (this.paginator) {
//                 this.dataSource.paginator = this.paginator;
//                 this.dataSource.sort = this.sort;
//                 this.paginator.firstPage();
//             } else {
//                 setTimeout(() => {
//                     this.setPaginator();
//                 }, 500);
//             }
//         }
//     }

//     getSubscription() {
//         this.sqlService.getItems('transactions').pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
//             if (res.data.length > 0) {
//                 this.quantity = (this.currentUser ? this.currentUser.email : '') == 'anton@madproducts.co.za' ? -1 : res.data[0].directory;
//             }
//         })
//     }

//     showPaypal() {

//         const dialogConfig = new MatDialogConfig();
//         dialogConfig.data = { page: 'directories' };

//         dialogConfig.autoFocus = true;
//         dialogConfig.disableClose = true;
//         dialogConfig.hasBackdrop = true;

//         this.dialog.open(DialogAccountComponent,
//             dialogConfig);
//     }

//     getDirectories(): Promise<directory[]> {
//         var promise = new Promise<directory[]>((resolve) => {
//             try {
//                 this.sqlService.getItems('directories').pipe(takeUntil(this._unsubscribeAll)).subscribe({
//                     next: (apiResult: any) => {
//                         if (apiResult.result == true) {
//                             resolve(apiResult.data);
//                         }
//                     },
//                     error: (error) => {
//                         this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
//                     },
//                     complete: () => {
//                     }
//                 })
//             } catch (exception) {
//                 resolve([]);
//             }
//         });
//         return promise;
//     }

//     getDirectoryCategories(): Promise<directoryCategory[]> {
//         var promise = new Promise<directoryCategory[]>((resolve) => {
//             try {
//                 this.sqlService.getItems('directoryCategories').pipe(takeUntil(this._unsubscribeAll)).subscribe({
//                     next: (apiResult: any) => {
//                         if (apiResult.result == true) {
//                             resolve(apiResult.data);
//                         }
//                     },
//                     error: (error) => {
//                         this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
//                     },
//                     complete: () => {
//                     }
//                 })
//             } catch (exception) {
//                 resolve([]);
//             }
//         });
//         return promise;
//     }

//     async initUpsert(row: directory | null) {
//         if ((this.currentUser.email == 'anton@madproducts.co.za' || this.currentUser.email == 'admin@loadgistix.com' || this.directoryList.length < this.quantity || this.quantity === -1 || (this.directoryList.length == this.quantity && row !== null)) {
//             this.form = this._formBuilder.group({
//                 id: [this.directoryList.length === 0 ? Guid.create().toString() : row.id],
//                 userId: [this.directoryList.length === 0 ? this.currentUser.id : row.userId],
//                 userDescription: [this.directoryList.length === 0 ? (this.currentUser == null ? 'n/a' : this.currentUser.name) : row.userDescription],
//                 directoryCategoryId: [this.directoryList.length === 0 ? null : row.directoryCategoryId, Validators.required],
//                 directoryCategoryDescription: [this.directoryList.length === 0 ? null : row.directoryCategoryDescription],
//                 companyName: [this.directoryList.length === 0 ? null : row.companyName, Validators.required],
//                 description: [this.directoryList.length === 0 ? null : row.description, Validators.required],
//                 email: [this.directoryList.length === 0 ? null : row.email, Validators.required],
//                 phone: [this.directoryList.length === 0 ? null : row.phone, Validators.required],
//                 website: [this.directoryList.length === 0 ? null : row.website, Validators.required],
//                 instagram: [this.directoryList.length === 0 ? null : row.instagram],
//                 facebook: [this.directoryList.length === 0 ? null : row.facebook],
//                 twitter: [this.directoryList.length === 0 ? null : row.twitter],
//                 addressLat: [this.directoryList.length === 0 ? null : row.addressLat, Validators.required],
//                 addressLon: [this.directoryList.length === 0 ? null : row.addressLon, Validators.required],
//                 addressLabel: [this.directoryList.length === 0 ? null : row.addressLabel, Validators.required],
//                 avatar: [this.directoryList.length === 0 ? null : row.avatar],
//                 avatarChanged: [false],
//                 fileToUpload: [null],
//                 status: [this.directoryList.length === 0 ? 'Active' : row.status]
//             });

//             const dialogConfig = new MatDialogConfig();
//             dialogConfig.data = {
//                 item: row,
//                 form: this.form,
//                 directoryCategoryList: this.directoryCategoryList,
//                 title: this.directoryList.length === 0 ? 'Insert' : 'Update'
//             }

//             dialogConfig.autoFocus = true;
//             dialogConfig.disableClose = true;
//             dialogConfig.hasBackdrop = true;

//             const dialogRef = this.dialog.open(DialogDirectoryComponent,
//                 dialogConfig);

//             dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
//                 if (result !== false) {
//                     this.loading = true;

//                     if (this.directoryList.length === 0) {
//                         this.sqlService.createItem('directories', result.form).subscribe({
//                             next: (apiResult: any) => {
//                                 if (apiResult.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
//                                     let file = base64ToFile(result.fileToUpload);
//                                     this.uploadFile(file, extractApiData(apiResult.data).id).then(x => {
//                                         apiResult.data.avatar = '.jpg';
//                                         this.directoryList.push(apiResult.data);
//                                         this.dataSource = new MatTableDataSource(this.directoryList);
//                                         this.iPaginator = 0;
//                                         this.setPaginator();
//                                         this.timestamp = new Date().getTime();
//                                         this.loading = false;

//                                     });
//                                 } else {
//                                     this.directoryList.push(apiResult.data);
//                                     this.dataSource = new MatTableDataSource(this.directoryList);
//                                     this.iPaginator = 0;
//                                     this.setPaginator();
//                                     this.loading = false;

//                                 }
//                             },
//                             error: (error) => {
//                                 this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
//                                 this.loading = false;

//                             },
//                             complete: () => {
//                             }
//                         })
//                     } else {
//                         if (result.form == null && result.fileToUpload == null) {
//                             this.sqlService.deleteItem('directories', row.id).pipe(takeUntil(this._unsubscribeAll)).subscribe({
//                                 next: (apiResult: any) => {
//                                     this.directoryList.splice(this.directoryList.findIndex(x => x.id == row.id)!, 1);
//                                     this.dataSource = new MatTableDataSource(this.directoryList);
//                                     this.iPaginator = 0;
//                                     this.setPaginator();
//                                     this.timestamp = new Date().getTime();
//                                     this.loading = false;

//                                 },
//                                 error: (error) => {
//                                     this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
//                                 },
//                                 complete: () => {
//                                 }
//                             })
//                         } else {
//                             this.sqlService.updateItem('directories', result.form).pipe(takeUntil(this._unsubscribeAll)).subscribe({
//                                 next: (apiResult: any) => {
//                                     if (apiResult.result == true) {
//                                         if (apiResult.id != '00000000-0000-0000-0000-000000000000' && result.fileToUpload) {
//                                             let file = base64ToFile(result.fileToUpload);
//                                             this.uploadFile(file, extractApiData(apiResult.data).id).then(x => {
//                                                 apiResult.data.avatar = '.jpg';
//                                                 let objIndex = this.directoryList.findIndex(x => x.id === row.id);
//                                                 this.directoryList[objIndex] = apiResult.data;
//                                                 this.dataSource = new MatTableDataSource(this.directoryList);
//                                                 this.iPaginator = 0;
//                                                 this.setPaginator();
//                                                 this.timestamp = new Date().getTime();
//                                                 this.loading = false;

//                                             });
//                                         } else {
//                                             let objIndex = this.directoryList.findIndex(x => x.id === row.id);
//                                             this.directoryList[objIndex] = apiResult.data;
//                                             this.dataSource = new MatTableDataSource(this.directoryList);
//                                             this.iPaginator = 0;
//                                             this.setPaginator();
//                                             this.loading = false;

//                                         }
//                                     } else {
//                                         if (apiResult.message == 'Expired') {
//                                             this.loading = false;

//                                         } else {
//                                             this._snackBar.open('Error: ' + apiResult.message, undefined, { duration: 2000 });
//                                             this.loading = false;

//                                         }
//                                     }
//                                 },
//                                 error: (error) => {
//                                     this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
//                                 },
//                                 complete: () => {
//                                 }
//                             })
//                         }
//                     }
//                 }
//             })
//         } else {
//             this.showPaypal();
//         }
//     }
//     async initDelete(id: Guid) {
//         const confirmation = this._fuseConfirmationService.open({
//             title: 'Delete Item',
//             message: 'Are you sure you want to delete this item? This action cannot be undone!',
//             actions: {
//                 confirm: {
//                     label: 'Delete',
//                 },
//             },
//         });
//         confirmation.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
//             if (result === 'confirmed') {
//                 this.sqlService.deleteItem('directories', id).pipe(takeUntil(this._unsubscribeAll)).subscribe({
//                     next: (apiResult: any) => {
//                         if (apiResult.result == true) {
//                             this.directoryList.splice(this.directoryList.findIndex(item => item.id === apiResult.id), 1);
//                             this.dataSource = new MatTableDataSource(this.directoryList);
//                             this.iPaginator = 0;
//                             this.setPaginator();
//                         }
//                     },
//                     error: (error) => {
//                         this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
//                     },
//                     complete: () => {
//                     }
//                 })
//             }
//         });
//     }

//     uploadFile(fileToUpload: any, filename: string): Promise<boolean> {
//         var promise = new Promise<boolean>((resolve) => {
//             try {
//                 const formData = new FormData();
//                 formData.append('file', fileToUpload);
//                 this.sqlService.upload('directories', formData, filename).pipe(takeUntil(this._unsubscribeAll)).subscribe(event => {
//                     this.timestamp = new Date().getTime();
//                     resolve(true);
//                 })
//             } catch (exception) {
//                 resolve(false);
//             }
//         });
//         return promise;
//     }

//     getAddressSubstring(str: string, char: string) {
//         let arr = str ? (str.split(char) ? str.split(char) : '') : '';
//         return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
//     }

//     viewImage(avatar: string) {
//         const dialogConfig = new MatDialogConfig();
//         dialogConfig.data = {
//             avatar: avatar
//         }

//         dialogConfig.autoFocus = true;
//         dialogConfig.disableClose = true;
//         dialogConfig.hasBackdrop = true;
//         dialogConfig.ariaLabel = 'fffff';

//         this.dialog.open(DialogImageComponent,
//             dialogConfig);
//     }

//     ngOnDestroy() {
//         this._unsubscribeAll.next();
//         this._unsubscribeAll.complete();
//         this.loading = false;

//     }

//     save(){

//     }
// }
