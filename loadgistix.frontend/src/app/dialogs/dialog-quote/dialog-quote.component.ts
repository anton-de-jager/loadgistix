import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, Inject, OnDestroy, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SqlService } from 'app/services/sql.service';
import { VariableService } from 'app/services/variable.service';
import { Observable, Subject, Subscription, map, takeUntil } from 'rxjs';
import { MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { AsyncPipe } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { SortPipe } from 'app/pipes/sort.pipe';
import { MatSelectModule } from '@angular/material/select';
import { Guid } from 'guid-typescript';
import { extractApiData } from 'app/services/api-response.helper';

@Component({
    selector: 'dialog-quote',
    templateUrl: 'dialog-quote.component.html',
    styleUrls: ['./dialog-quote.component.scss'],
    standalone: true,
    imports: [NgClass, MatIconModule, MatSlideToggleModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule, MatDatepickerModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, MatStepperModule, AsyncPipe, SortPipe, NgForOf, MatSelectModule],
    encapsulation: ViewEncapsulation.None
})
export class DialogQuoteComponent implements OnDestroy {
    private _unsubscribeAll = new Subject<void>();
    loading: boolean = false;
    businessDescriptionList: any[] = [];
    ownedRentedList: any[] = [];

    formGroup1 = this._formBuilder.group({
        nameFirst: ['', Validators.required],
        nameLast: ['', Validators.required],
        email: ['', Validators.email],
        mobileNumber: ['', Validators.required],
    });
    formGroup2 = this._formBuilder.group({
        id: ['', Validators.required],
        company: ['', Validators.required],
        businessDescriptionId: ['', Validators.required],
        ownedRentedId: ['', Validators.required],
        status: ['', Validators.required],
    });
    formGroup3 = this._formBuilder.group({
        quoteId: ['', Validators.required],
        make: ['', Validators.required],
        model: ['', Validators.required],
        year: ['', Validators.required],
        value: ['', Validators.required],
        createdOn: ['', Validators.required],
    });
    formGroup4 = this._formBuilder.group({
        quoteId: ['', Validators.required],
        make: ['', Validators.required],
        model: ['', Validators.required],
        year: ['', Validators.required],
        value: ['', Validators.required],
        createdOn: ['', Validators.required],
    });
    stepperOrientation: Observable<StepperOrientation>;

    constructor(
        private _formBuilder: FormBuilder,
        breakpointObserver: BreakpointObserver,
        private sqlService: SqlService,
        private _snackBar: MatSnackBar,
        private router: Router,
        public dialogRef: MatDialogRef<DialogQuoteComponent>) {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

        this.getItems("businessDescriptions").then((items) => {
            this.businessDescriptionList = items;
        });
        this.getItems("ownedRenteds").then((items) => {
            this.ownedRentedList = items;
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {
    }

    getItems(items): Promise<any[]> {
        var promise = new Promise<any[]>((resolve) => {
            try {
                this.sqlService.getItems(items).pipe(takeUntil(this._unsubscribeAll)).subscribe({
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

    next(event){
        //console.log(event);
        switch (event.selectedIndex) {
            case 1:
                if(event.previouslySelectedIndex == 0){
                    this.sqlService.createItem('quotes', this.formGroup1.value).subscribe({
                        next: (apiResult: any) => {
                            // console.log(apiResult);
                            const newItem = extractApiData(apiResult.data);
                            if (newItem) {
                                this.formGroup2.controls['id'].setValue(newItem.id);
                                this.formGroup2.controls['status'].setValue(newItem.status);
                                this.formGroup3.controls['quoteId'].setValue(newItem.id);
                                this.formGroup4.controls['quoteId'].setValue(newItem.id);
                                this.formGroup3.controls['createdOn'].setValue(newItem.createdOn);
                                this.formGroup4.controls['createdOn'].setValue(newItem.createdOn);
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
                }
                break;
            case 2:
                if (event.previouslySelectedIndex == 1) {
                    this.sqlService.updateItem('quotes', this.formGroup2.value).subscribe({
                        next: (apiResult: any) => {
                            this.sqlService.updateItem('quotes', {...this.formGroup2.value, status: 'Sent'}).subscribe({
                                next: (apiResult: any) => {
                                    
                                },
                                error: (error) => {
                                    console.log('error', error);
                                    this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                                    this.loading = false;
        
                                },
                                complete: () => {
                                }
                            })
                        },
                        error: (error) => {
                            console.log('error', error);
                            this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                            this.loading = false;

                        },
                        complete: () => {
                        }
                    })
                }
                break;
            case 3:
                break;
            case 4:
                this.sqlService.sendQuoteRequest(this.formGroup2.value.id.toString()).subscribe(res => {

                });
                break;
            default:
                break;
        }
    }

    addTruck() {
        this.sqlService.createItem('quoteTrucks', this.formGroup3.value).subscribe({
            next: (apiResult: any) => {
                this.formGroup3.controls['make'].setValue('');
                this.formGroup3.controls['model'].setValue('');
                this.formGroup3.controls['year'].setValue('');
                this.formGroup3.controls['value'].setValue('');
                this.formGroup3.markAsUntouched();
            },
            error: (error) => {
                console.log('error', error);
                this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                this.loading = false;

            },
            complete: () => {
            }
        })
    }

    addTrailer() {
        this.sqlService.createItem('quoteTrailers', this.formGroup4.value).subscribe({
            next: (apiResult: any) => {
                this.formGroup4.controls['make'].setValue('');
                this.formGroup4.controls['model'].setValue('');
                this.formGroup4.controls['year'].setValue('');
                this.formGroup4.controls['value'].setValue('');
                this.formGroup4.markAsUntouched();
            },
            error: (error) => {
                console.log('error', error);
                this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                this.loading = false;

            },
            complete: () => {
            }
        })
    }

    onYesClick(): void {
        this.dialogRef.close(true);
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}
