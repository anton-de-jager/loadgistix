import { CommonModule, NgClass, NgIf } from '@angular/common';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { VariableService } from 'app/services/variable.service';
import { UserService } from 'app/core/user/user.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { extractApiData } from 'app/services/api-response.helper';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogImageUploadComponent } from 'app/dialogs/dialog-image-upload/dialog-image-upload.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';
import { SqlService } from 'app/services/sql.service';
import { base64ToFile } from 'ngx-image-cropper';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NgIf,
        NgClass,
    ],
})
export class ProfileComponent implements OnInit, OnDestroy {
    loading: boolean = true;
    profileForm: FormGroup;
    activeLink: number = 0;
    avatarChanged = false;
    previewImage: string | null = null;
    fileToUpload: string | null = null;
    showAdverts: boolean;
    currentUser: User | null = null;
    imagesFolder = environment.apiImage;
    timestamp: number = 0;

    private _unsubscribeAll = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private variableService: VariableService,
        private userService: UserService,
        private authService: AuthService,
        private sqlService: SqlService
    ) {
        this.timestamp = new Date().getTime();
        variableService.setPageSelected('My Profile');
        this.userService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
                this.initForm();
            }
        });
    }

    initPage() {
        this.initUser();
    }

    ngOnInit(): void {
        this.variableService.showAdverts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((showAdverts) => {
                this.showAdverts = showAdverts;
            });
    }
    async initUser() {
        // this.fireService
        //     .getItemsByUserTag('users', 'id')
        //     .subscribe((users) => {
        //         if (users.length > 0) {
        //             this.user = {
        //                 id: this.currentUser.id,
        //                 name: this.currentUser.name,
        //                 email: this.currentUser.email,
        //                 phoneNumber: this.currentUser.phoneNumber
        //                     ? this.currentUser.phoneNumber
        //                     : users[0].phoneNumber,
        //                 avatar: users[0].avatar,
        //             };
        //             setTimeout(() => {
        //                 this.initForm();
        //             }, 500);
        //         }
        //     });
        // // const userRef = doc(this.firestore, 'users', this.currentUser?.id);
        // // const userDoc = await getDoc(userRef);
        // // let firebaseUser = userDoc.data();

        // // this.user = {
        // //   id: this.currentUser.id,
        // //   name: this.currentUser.name,
        // //   email: this.currentUser.email,
        // //   phoneNumber: this.currentUser.phoneNumber ? this.currentUser.phoneNumber : firebaseUser.phoneNumber,
        // //   avatar: firebaseUser.avatar,
        // // };
        // // setTimeout(() => {
        // //   this.initForm();
        // // }, 500);
    }

    initForm() {
        this.profileForm = this.formBuilder.group({
            id: [this.currentUser.id],
            name: [this.currentUser.name, Validators.required],
            email: [this.currentUser.email, [Validators.required, Validators.email]],
            avatar: [this.currentUser.avatar],
            company: [this.currentUser.company],
            phoneNumber: [this.currentUser.phoneNumber],
            status: [this.currentUser.status],
            resetToken: [this.currentUser.resetToken],
            emailConfirmed: [this.currentUser.emailConfirmed],
            deviceId: [this.currentUser.deviceId],
            passwordHash: [''],
            token: [this.currentUser.token],
            lastLoggedIn: [this.currentUser.lastLoggedIn],
            avatarChanged: [false],
        });
        this.loading = false;
        this.timestamp = new Date().getTime();
    }

    uploadImage(event: Event) {
        event.preventDefault();
        const dialogConfig = new MatDialogConfig();

        dialogConfig.data = {
            folder: 'Users',
            title: 'Upload Image',
            message: 'Please select an image to upload',
            roundCropper: true,
            croppedImage: this.avatarChanged
                ? this.profileForm.value.fileToUpload
                : this.avatarChanged ? this.fileToUpload : this.profileForm.value.avatar ? this.imagesFolder + 'Users/' + this.profileForm.value.id + this.profileForm.value.avatar + '?t=' + this.timestamp : 'assets/images/no-image.png',
            savedImage: this.avatarChanged ? this.fileToUpload : this.profileForm.value.avatar ? (this.imagesFolder + 'Users/' + this.profileForm.value.id + this.profileForm.value.avatar + '?t=' + this.timestamp) : 'assets/images/no-image.png'
            // croppedImage: this.avatarChanged
            //     ? this.profileForm.value.fileToUpload
            //     : this.profileForm.value.avatar,
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(
            DialogImageUploadComponent,
            dialogConfig
        );

        this.loading = false;
        dialogRef
            .afterClosed()

            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: string | null) => {
                if (result !== null) {
                    this.avatarChanged = true;
                    this.fileToUpload = result;
                    this.profileForm.value.fileToUpload = result;
                    this.timestamp = new Date().getTime();
                }
            });
    }
    // uploadImage(event: Event) {
    //   event.preventDefault();
    //   const dialogConfig = new MatDialogConfig();

    //   dialogConfig.data = {
    //     title: 'Upload Image',
    //     message: 'Please select an image to upload',
    //     roundCropper: false,
    //     croppedImage: this.avatarChanged
    //       ? this.profileForm.value.fileToUpload
    //       : this.profileForm.value.avatar,
    //   };

    //   dialogConfig.autoFocus = true;
    //   dialogConfig.disableClose = true;
    //   dialogConfig.hasBackdrop = true;

    //   const dialogRef = this.dialog.open(
    //     DialogImageUploadComponent,
    //     dialogConfig
    //   );

    //   dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result: string | null) => {
    //     if (result !== null) {
    //       this.avatarChanged = true;
    //       this.fileToUpload = result;
    //     }
    //   })
    // }

    updateProfile(user, details): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.sqlService.updateItem('users', details).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                next: (apiResult: any) => {
                    resolve(apiResult);
                },
                error: (error) => {
                    console.log('error', error);
                    const errorMessage = error?.error?.message || error?.message || 'Failed to update profile';
                    this._snackBar.open('Error: ' + errorMessage, undefined, { duration: 5000 });
                    resolve(false);
                },
                complete: () => {
                    resolve(false);
                }
            })
        });
    }

    onSubmit() {
        if (this.profileForm.valid) {
            console.log('this.profileForm.value', this.profileForm.value);
            // Prepare user data with proper formatting
            const userData = {
                ...this.profileForm.value,
                resetToken: this.profileForm.value.resetToken || null, // Convert empty string to null
                lastLoggedIn: this.profileForm.value.lastLoggedIn || undefined, // Remove null values
            };
            
            // Remove undefined fields to avoid sending them
            Object.keys(userData).forEach(key => userData[key] === undefined && delete userData[key]);

            if (this.avatarChanged) {
                let file = base64ToFile(this.fileToUpload);
                this.uploadFile(file, this.currentUser.id).then(res => {
                    this.updateProfile(this.currentUser, {
                        ...userData,
                        avatar: '.jpg',
                    }).then(res2 => {
                        if (res2 && res2.data) {
                            const updatedUser = extractApiData(res2.data);
                            if (updatedUser) {
                                this.authService.updateUser(updatedUser);
                                this.variableService.showInfo(
                                    'Profile Updated',
                                    ' ',
                                    'Your profile has been updated successfully',
                                    false
                                );
                                this.timestamp = new Date().getTime();
                            }
                        }
                    });
                })
            } else {
                this.updateProfile(this.currentUser, userData).then(res2 => {
                    if (res2 && res2.data) {
                        const updatedUser = extractApiData(res2.data);
                        if (updatedUser) {
                            this.authService.updateUser(updatedUser);
                            this.variableService.showInfo(
                                'Profile Updated',
                                ' ',
                                'Your profile has been updated successfully',
                                false
                            );
                            this.timestamp = new Date().getTime();
                        }
                    }
                });
            }



            //});
            // this.updateUser(this.profileForm.value, this.fileToUpload).then(
            //     (res) => {
            //         this.variableService.showInfo(
            //             'Profile Updated',
            //             ' ',
            //             'Your profile has been updated successfully',
            //             false
            //         );
            //     }
            // );
        }
    }

    uploadFile(fileToUpload: any, filename: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                this.sqlService.upload('users', formData, filename).pipe(takeUntil(this._unsubscribeAll)).subscribe(event => {
                    if (event.type == 4) {
                        resolve(true);
                    }
                    this.timestamp = new Date().getTime();
                });
            } catch (exception) {
                resolve(false);
            }
        });
    }

    // async saveImage(path: string, id: string, file: any): Promise<string> {
    //     // /**
    //     //  * You can add random number in file.name to avoid overwrites,
    //     //  * or replace the file.name to a static string if you intend to overwrite
    //     //  */
    //     // // const fileRef = this.fireStorage.ref(collection).child(id);
    //     // const fileRef = ref(this.storage, path + '/' + id);

    //     // // Upload file in reference
    //     // if (!!file) {
    //     //     const result = await uploadString(
    //     //         fileRef,
    //     //         file.replace('data:image/jpeg;base64,', ''),
    //     //         'base64',
    //     //         {
    //     //             contentType: 'image/jpeg',
    //     //         }
    //     //     );
    //     //     const downloadURL = await getDownloadURL(result.ref);

    //     //     return downloadURL;
    //     // } else {
    //     //     return '';
    //     // }
    //     return '';
    // }

    async updateUser(item: any, avatar: string) {
        // let ref = doc(this.firestore, 'users', item.id);
        // if (avatar) {
        //     return updateProfile(this.currentUser,{
        //         name: item.name,
        //         avatar: avatar,
        //     });
        // } else {
        //     return updateProfile(this.currentUser, {
        //         name: item.name,
        //     });
        // // }
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.profileForm.controls[controlName].hasError(errorName);
    };

    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
