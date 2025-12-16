import { NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { DialogImageUploadComponent } from 'app/dialogs/dialog-image-upload/dialog-image-upload.component';
import { SqlService } from 'app/services/sql.service';
import { environment } from 'environments/environment';
import { Guid } from 'guid-typescript';
import { base64ToFile } from 'ngx-image-cropper';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [RouterLink, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignUpComponent implements OnInit, OnDestroy {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    private _unsubscribeAll = new Subject<void>();

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;
    previewImage: string | null = null;
    fileToUpload: string | null = null;
    avatarChanged = false;
    timestamp: number = 0;
    imagesFolder = environment.apiImage;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private sqlService: SqlService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        @Inject(MatDialog) private dialog: MatDialog,
    ) {
        this.timestamp = new Date().getTime();
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
            id: [Guid.EMPTY, Validators.required],
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            avatar: [''],
            company: [''],
            agreements: ['', Validators.requiredTrue],
            resetToken: [Guid.EMPTY, Validators.required],
        });
    }


    uploadImage(event: Event) {
        event.preventDefault();
        const dialogConfig = new MatDialogConfig();

        dialogConfig.data = {
            title: 'Upload Image',
            message: 'Please select an image to upload',
            roundCropper: true,
            croppedImage: this.avatarChanged
                ? this.signUpForm.value.avatar
                : this.avatarChanged ? this.fileToUpload : this.signUpForm.value.avatar ? this.imagesFolder + 'user/' + this.signUpForm.value.id + this.signUpForm.value.avatar + '?t=' + this.timestamp : 'assets/images/no-image.png',
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(
            DialogImageUploadComponent,
            dialogConfig
        );

        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result: string | null) => {
            if (result !== null) {
                this.avatarChanged = true;
                this.fileToUpload = result;
                this.signUpForm.value.fileToUpload = result;
                this.signUpForm.controls['avatar'].setValue(result);
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        //console.log(this.signUpForm.invalid);
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        this.signUpForm.controls['avatar'].setValue(null);
        // Sign up
        this._authService.signUp(this.signUpForm.value)
            .subscribe(
                (apiResult) => {
                    const result = Array.isArray(apiResult) ? apiResult[0] : apiResult;
                    if (!result || result.message) {
                        // Re-enable the form
                        this.signUpForm.enable();

                        // Reset the form
                        this.signUpNgForm.resetForm();

                        // Set the alert
                        this.alert = {
                            type: 'error',
                            message: result?.message ?? 'An error occurred during sign up',
                        };

                        // Show the alert
                        this.showAlert = true;
                        this.signUpForm.controls['avatar'].setValue(this.signUpForm.value.fileToUpload);
                    } else {
                        if (this.avatarChanged) {
                            let file = base64ToFile(this.fileToUpload);
                            this.uploadFile(file, result.id).then(x => {
                                this._router.navigateByUrl('/sign-in');
                            });
                        } else {
                            this._router.navigateByUrl('/sign-in');
                        }
                    }
                },
                (response) => {
                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    this.signUpNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Something went wrong, please try again.',
                    };

                    // Show the alert
                    this.showAlert = true;
                    this.signUpForm.controls['avatar'].setValue(this.signUpForm.value.fileToUpload);
                },
            );
    }

    uploadFile(fileToUpload: any, filename: string): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                setTimeout(() => {
                    const formData = new FormData();
                    formData.append('file', fileToUpload);
                    this.sqlService.upload('users', formData, filename).pipe(takeUntil(this._unsubscribeAll)).subscribe(event => {
                        this.timestamp = new Date().getTime();
                        if (event.type == 4) {
                            resolve(true);
                        }
                    });
                }, 100);
            } catch (exception) {
                resolve(false);
            }
        });
        return promise;
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
