import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { DialogCameraComponent } from 'app/modules/admin/dialogs/dialog-camera/dialog-camera.component';
import { DialogTcComponent } from 'app/modules/admin/dialogs/dialog-tc/dialog-tc.component';
import { ApiService } from 'app/modules/admin/services/api.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignUpComponent implements OnInit {
    imagesFolder = environment.api + 'Images/';
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    yearlyBilling: boolean = false;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    previewImage: string = null;
    fileToUpload: any;

    /**
     * Constructor
     */
    constructor(
        private dialog: MatDialog,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private apiService: ApiService
    ) {
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
            company: [null, Validators.required],
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            phone: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            password: [null, Validators.required],
            avatar: [false],
            avatarChanged: [false],
            agreements: [null, Validators.requiredTrue],
            vehicles: [false],
            loads: [false],
            adverts: [false],
            directory: [false],
            cv: [false],
            job: [false],
            vehiclesQuantity: [0],
            loadsQuantity: [0],
            advertsQuantity: [0],
            directoryQuantity: [0],
            cvQuantity: [0],
            jobQuantity: [0]
        }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUp(this.signUpForm.value)
            .subscribe(
                (response) => {
                    if (response.id != '00000000-0000-0000-0000-000000000000') {
                        if (this.fileToUpload) {
                            this.uploadFile(this.fileToUpload, response.id + '.' + this.fileToUpload.name.split('.').pop()).then(x => {
                                this._router.navigateByUrl('/confirmation-required');
                            });
                        } else {
                            this._router.navigateByUrl('/confirmation-required');
                        }
                    } else {
                        // Re-enable the form
                        this.signUpForm.enable();

                        this.alert = {
                            type: 'error',
                            message: response.message
                        };

                        // Show the alert
                        this.showAlert = true;
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
                        message: 'Something went wrong, please try again.'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    tc() {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogTcComponent,
            dialogConfig);
    }

    getTotal() {
        return (this.signUpForm.controls['vehiclesQuantity'].value)
            + (this.signUpForm.controls['loadsQuantity'].value)
            + (this.signUpForm.controls['advertsQuantity'].value)
            + (this.signUpForm.controls['directoryQuantity'].value);
            //+ (this.signUpForm.controls['cvQuantity'].value);
    }

    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
        var size = (this.fileToUpload.size / (1024 * 1024)).toFixed(2);
        if (Number(size) > Number(0.25)) {
            this._snackBar.open('Error: Maximum FileSize is 200kB', null, { duration: 2000 });
            return false;
        } else {

            //Show image preview
            let reader = new FileReader();
            reader.onload = (event: any) => {
                //this.signUpForm.controls['avatar'].setValue(event.target.result);
                this.previewImage = event.target.result;
                this.signUpForm.controls['avatarChanged'].setValue(true);
            };
            reader.readAsDataURL(this.fileToUpload);
        }
    }

    initCamera() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        dialogConfig.width = "800px";

        const dialogRef = this.dialog.open(DialogCameraComponent,
            dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                //this.signUpForm.controls['avatar'].setValue(result._imageAsDataUrl);
                this.previewImage = result._imageAsDataUrl;
                this.signUpForm.controls['avatarChanged'].setValue(true);
            }
        });
    }

    timestamp(){
        return new Date().getTime();
    }

    uploadFile(fileToUpload, filename): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const formData = new FormData();
                formData.append('file', fileToUpload);
                this.apiService.upload('users', formData, filename).subscribe(event => {
                    if (event.type === HttpEventType.Response) {
                        resolve(true);
                    }
                })
            } catch (exception) {
                resolve(false);
            }
        });
        return promise;
    }
}
