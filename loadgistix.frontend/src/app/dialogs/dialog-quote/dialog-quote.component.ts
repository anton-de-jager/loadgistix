import { NgClass, NgForOf, NgIf, DecimalPipe } from '@angular/common';
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
    imports: [NgClass, MatIconModule, MatSlideToggleModule, MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule, MatDatepickerModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, MatStepperModule, AsyncPipe, SortPipe, NgForOf, MatSelectModule, DecimalPipe],
    encapsulation: ViewEncapsulation.None
})
export class DialogQuoteComponent implements OnDestroy {
    private _unsubscribeAll = new Subject<void>();
    loading: boolean = false;
    businessDescriptionList: any[] = [];
    ownedRentedList: any[] = [];
    truckList: any[] = [];
    trailerList: any[] = [];
    isCompleted: boolean = false;

    formGroup1 = this._formBuilder.group({
        nameFirst: ['', Validators.required],
        nameLast: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
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
                            this.router.navigate(['/sign-out']);
                            resolve([]);
                        } else if (apiResult.result == true && Array.isArray(apiResult.data)) {
                            resolve(apiResult.data);
                        } else {
                            console.warn(`API ${items} returned non-array:`, apiResult.data);
                            resolve([]);
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                        resolve([]);
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
                    console.log('Creating quote with:', this.formGroup1.value);
                    this.sqlService.createItem('quotes', this.formGroup1.value).subscribe({
                        next: (apiResult: any) => {
                            console.log('Quote created:', apiResult);
                            const newItem = extractApiData(apiResult.data);
                            console.log('Extracted new item:', newItem);
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
                    // Merge contact details with business details for the update
                    const quoteData = {
                        ...this.formGroup1.value,
                        ...this.formGroup2.value
                    };
                    console.log('Updating quote with:', quoteData);
                    this.sqlService.updateItem('quotes', quoteData).subscribe({
                        next: (apiResult: any) => {
                            console.log('Quote updated:', apiResult);
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
                // Mark as completed to prevent going back
                this.isCompleted = true;
                
                // Calculate premium using comprehensive rating system
                const premiumDetails = this.calculatePremium();
                
                console.log('Premium calculation details:', premiumDetails);
                
                // Update quote with premium and status before sending email
                const finalQuoteData = {
                    ...this.formGroup1.value,
                    ...this.formGroup2.value,
                    premium: premiumDetails.annualPremium,
                    status: 'Sent'
                };
                
                console.log('Final quote data:', finalQuoteData);
                
                this.sqlService.updateItem('quotes', finalQuoteData).subscribe({
                    next: (updateResult: any) => {
                        console.log('Final quote updated:', updateResult);
                        // Now send the quote request email
                        this.sqlService.sendQuoteRequest(this.formGroup2.value.id.toString()).subscribe({
                            next: (apiResult: any) => {
                                console.log('SendQuoteRequest result:', apiResult);
                            },
                            error: (error) => {
                                console.log('SendQuoteRequest error:', error);
                                this._snackBar.open('Error sending email: ' + error, undefined, { duration: 2000 });
                            }
                        });
                    },
                    error: (error) => {
                        console.log('Final update error:', error);
                        this._snackBar.open('Error updating quote: ' + error, undefined, { duration: 2000 });
                    }
                });
                break;
            default:
                break;
        }
    }

    addTruck() {
        this.sqlService.createItem('quoteTrucks', this.formGroup3.value).subscribe({
            next: (apiResult: any) => {
                const newTruck = extractApiData(apiResult.data);
                if (newTruck) {
                    this.truckList.push(newTruck);
                }
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

    removeTruck(index: number) {
        const truck = this.truckList[index];
        if (truck && truck.id) {
            this.sqlService.deleteItem('quoteTrucks', truck.id).subscribe({
                next: () => {
                    this.truckList.splice(index, 1);
                },
                error: (error) => {
                    console.log('error', error);
                    this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                }
            });
        } else {
            this.truckList.splice(index, 1);
        }
    }

    addTrailer() {
        this.sqlService.createItem('quoteTrailers', this.formGroup4.value).subscribe({
            next: (apiResult: any) => {
                const newTrailer = extractApiData(apiResult.data);
                if (newTrailer) {
                    this.trailerList.push(newTrailer);
                }
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

    removeTrailer(index: number) {
        const trailer = this.trailerList[index];
        if (trailer && trailer.id) {
            this.sqlService.deleteItem('quoteTrailers', trailer.id).subscribe({
                next: () => {
                    this.trailerList.splice(index, 1);
                },
                error: (error) => {
                    console.log('error', error);
                    this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                }
            });
        } else {
            this.trailerList.splice(index, 1);
        }
    }

    /**
     * COMPREHENSIVE PREMIUM CALCULATION ENGINE
     * =========================================
     * Calculates annual insurance premium based on multiple risk factors.
     * 
     * BUSINESS MODEL:
     * - Base Rate: 3.5% of asset value (industry standard for commercial vehicle insurance)
     * - Adjustments based on risk factors create profit margins of 15-25%
     * - Minimum premium ensures profitability on small policies
     * 
     * RATING FACTORS:
     * 1. Vehicle Age: Older vehicles = higher risk = higher premium
     * 2. Fleet Size: Larger fleets = volume discount (encourages bigger policies)
     * 3. Asset Type: Trucks are higher risk than trailers
     * 4. Ownership Status: Owned vs Rented affects liability
     * 5. Business Type: Some industries carry more risk
     */
    calculatePremium(): { 
        annualPremium: number; 
        monthlyPremium: number; 
        breakdown: any;
    } {
        const currentYear = new Date().getFullYear();
        
        // ======================
        // BASE RATES (% of value)
        // ======================
        const BASE_RATE_TRUCK = 0.045;   // 4.5% for trucks (higher risk, mechanical)
        const BASE_RATE_TRAILER = 0.025; // 2.5% for trailers (lower risk, no engine)
        const MINIMUM_ANNUAL_PREMIUM = 2500; // Minimum R2,500/year to cover admin costs
        const ADMIN_FEE = 350;           // Policy administration fee
        const SASRIA_RATE = 0.00025;     // SASRIA levy (0.025% - mandatory in SA)
        
        // ======================
        // VEHICLE AGE MULTIPLIERS
        // ======================
        // Newer vehicles: lower risk, better safety features
        // Older vehicles: more breakdowns, harder to get parts
        const getAgeMultiplier = (year: number): number => {
            const age = currentYear - year;
            if (age <= 2) return 0.90;   // 10% discount - new vehicle
            if (age <= 5) return 0.95;   // 5% discount - fairly new
            if (age <= 8) return 1.00;   // Standard rate
            if (age <= 12) return 1.15;  // 15% loading - aging vehicle
            if (age <= 15) return 1.30;  // 30% loading - old vehicle
            return 1.50;                  // 50% loading - very old (15+ years)
        };
        
        // ======================
        // FLEET SIZE DISCOUNT
        // ======================
        // Encourages larger policies, reduces per-policy admin cost ratio
        const totalVehicles = this.truckList.length + this.trailerList.length;
        let fleetDiscount = 1.0;
        if (totalVehicles >= 20) fleetDiscount = 0.80;      // 20% fleet discount
        else if (totalVehicles >= 10) fleetDiscount = 0.88; // 12% fleet discount
        else if (totalVehicles >= 5) fleetDiscount = 0.92;  // 8% fleet discount
        else if (totalVehicles >= 3) fleetDiscount = 0.95;  // 5% fleet discount
        
        // ======================
        // OWNERSHIP MULTIPLIER
        // ======================
        // Rented vehicles: operator may be less careful, shared liability
        const ownedRentedId = this.formGroup2.value.ownedRentedId;
        const selectedOwnedRented = this.ownedRentedList.find(o => o.id === ownedRentedId);
        const isRented = selectedOwnedRented?.description?.toLowerCase().includes('rent');
        const ownershipMultiplier = isRented ? 1.15 : 1.0; // 15% loading for rentals
        
        // ======================
        // BUSINESS TYPE MULTIPLIER
        // ======================
        // Higher risk industries pay more
        const businessDescriptionId = this.formGroup2.value.businessDescriptionId;
        const selectedBusiness = this.businessDescriptionList.find(b => b.id === businessDescriptionId);
        const businessDesc = (selectedBusiness?.description || '').toLowerCase();
        
        let businessMultiplier = 1.0;
        // High-risk industries
        if (businessDesc.includes('hazmat') || businessDesc.includes('chemical') || businessDesc.includes('fuel')) {
            businessMultiplier = 1.35; // 35% loading
        } else if (businessDesc.includes('mining') || businessDesc.includes('construction')) {
            businessMultiplier = 1.25; // 25% loading
        } else if (businessDesc.includes('long haul') || businessDesc.includes('cross border')) {
            businessMultiplier = 1.20; // 20% loading
        } else if (businessDesc.includes('refrigerated') || businessDesc.includes('cold chain')) {
            businessMultiplier = 1.15; // 15% loading
        } else if (businessDesc.includes('local') || businessDesc.includes('distribution')) {
            businessMultiplier = 0.95; // 5% discount - lower risk
        }
        
        // ======================
        // CALCULATE TRUCK PREMIUMS
        // ======================
        let truckPremiumTotal = 0;
        const truckBreakdown: any[] = [];
        
        for (const truck of this.truckList) {
            const value = truck.value || 0;
            const year = truck.year || currentYear;
            const ageMultiplier = getAgeMultiplier(year);
            
            const basePremium = value * BASE_RATE_TRUCK;
            const adjustedPremium = basePremium * ageMultiplier * ownershipMultiplier * businessMultiplier * fleetDiscount;
            const sasria = value * SASRIA_RATE;
            
            truckPremiumTotal += adjustedPremium + sasria;
            
            truckBreakdown.push({
                description: `${truck.make} ${truck.model} (${truck.year})`,
                value: value,
                basePremium: basePremium,
                ageMultiplier: ageMultiplier,
                adjustedPremium: adjustedPremium,
                sasria: sasria,
                total: adjustedPremium + sasria
            });
        }
        
        // ======================
        // CALCULATE TRAILER PREMIUMS
        // ======================
        let trailerPremiumTotal = 0;
        const trailerBreakdown: any[] = [];
        
        for (const trailer of this.trailerList) {
            const value = trailer.value || 0;
            const year = trailer.year || currentYear;
            const ageMultiplier = getAgeMultiplier(year);
            
            const basePremium = value * BASE_RATE_TRAILER;
            const adjustedPremium = basePremium * ageMultiplier * ownershipMultiplier * businessMultiplier * fleetDiscount;
            const sasria = value * SASRIA_RATE;
            
            trailerPremiumTotal += adjustedPremium + sasria;
            
            trailerBreakdown.push({
                description: `${trailer.make} ${trailer.model} (${trailer.year})`,
                value: value,
                basePremium: basePremium,
                ageMultiplier: ageMultiplier,
                adjustedPremium: adjustedPremium,
                sasria: sasria,
                total: adjustedPremium + sasria
            });
        }
        
        // ======================
        // TOTALS & FINAL PREMIUM
        // ======================
        const totalAssetValue = this.truckList.reduce((sum, t) => sum + (t.value || 0), 0) 
                              + this.trailerList.reduce((sum, t) => sum + (t.value || 0), 0);
        
        const subtotal = truckPremiumTotal + trailerPremiumTotal;
        const withAdminFee = subtotal + ADMIN_FEE;
        
        // Apply minimum premium
        const annualPremium = Math.max(withAdminFee, MINIMUM_ANNUAL_PREMIUM);
        const monthlyPremium = annualPremium / 12;
        
        // Effective rate for transparency
        const effectiveRate = totalAssetValue > 0 ? (annualPremium / totalAssetValue) * 100 : 0;
        
        return {
            annualPremium: Math.round(annualPremium * 100) / 100,
            monthlyPremium: Math.round(monthlyPremium * 100) / 100,
            breakdown: {
                totalAssetValue,
                trucks: {
                    count: this.truckList.length,
                    totalValue: this.truckList.reduce((sum, t) => sum + (t.value || 0), 0),
                    premium: truckPremiumTotal,
                    items: truckBreakdown
                },
                trailers: {
                    count: this.trailerList.length,
                    totalValue: this.trailerList.reduce((sum, t) => sum + (t.value || 0), 0),
                    premium: trailerPremiumTotal,
                    items: trailerBreakdown
                },
                adjustments: {
                    fleetDiscount: `${((1 - fleetDiscount) * 100).toFixed(0)}%`,
                    ownershipLoading: isRented ? '15%' : '0%',
                    businessLoading: `${((businessMultiplier - 1) * 100).toFixed(0)}%`
                },
                fees: {
                    adminFee: ADMIN_FEE,
                    sasriaTotal: totalAssetValue * SASRIA_RATE
                },
                subtotal,
                effectiveRate: `${effectiveRate.toFixed(2)}%`,
                minimumApplied: withAdminFee < MINIMUM_ANNUAL_PREMIUM
            }
        };
    }

    onYesClick(): void {
        this.dialogRef.close(true);
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}
