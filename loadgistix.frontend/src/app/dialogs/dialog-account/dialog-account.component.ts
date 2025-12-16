import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { VariableService } from 'app/services/variable.service';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { SqlService } from 'app/services/sql.service';
import { Browser } from '@capacitor/browser';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Capacitor } from '@capacitor/core';
import { PaystackOptions, Angular4PaystackModule } from 'angular4-paystack';
import { PaystackService } from 'app/services/paystack.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';
import { SubscriptionComponent } from 'app/layout/common/subscription/subscription.component';
import { PayfastComponent } from 'app/layout/common/payfast/payfast.component';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';

@Component({
    selector: 'dialog-account',
    templateUrl: './dialog-account.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./dialog-account.component.scss'],
    standalone: true,
    imports: [CommonModule, Angular4PaystackModule, MatProgressSpinnerModule, MatDialogModule, MatIconModule, MatListModule, MatSlideToggleModule, MatTableModule, MatCardModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatSnackBarModule, SubscriptionComponent, PayfastComponent]
})
export class DialogAccountComponent implements OnInit, OnDestroy {
    title = '';
    reference = '';
    options: PaystackOptions;
    public key: string = environment.paystack_key;
    free: boolean = false;
    plans = [];
    voucher = '';
    currentUser: User | null = null;

    private _unsubscribeAll = new Subject<void>();
    loading: boolean = true;
    public fromPage: string = 'branches';

    // plans!: any[];
    myData: any;
    selectedBusinessDirectory = false;
    selectedAdvert = false;
    selectedTms = false;
    selectedVehicle1 = false;
    selectedVehicle5 = false;
    selectedVehicle10 = false;
    selectedVehicle11 = false;
    selectedLoad5 = false;
    selectedLoad10 = false;
    selectedLoad11 = false;
    pricing =
        {
            Advert: [
                { quantity: 1, usd: 11, zar: 195 }
            ],
            Tms: [
                { quantity: 1, usd: 11, zar: 195 }
            ],
            BusinessDirectory: [
                { quantity: 1, usd: 6, zar: 110 }
            ],
            Vehicle: [
                { quantity: 1, usd: 9, zar: 159 },
                { quantity: 5, usd: 34, zar: 600 },
                { quantity: 10, usd: 55, zar: 975 },
                { quantity: 11, usd: 127, zar: 2250 }
            ],
            Load: [
                { quantity: 5, usd: 17, zar: 300 },
                { quantity: 10, usd: 28, zar: 495 },
                { quantity: 11, usd: 82, zar: 1450 }
            ]
        };
    usd = 0;
    zar = 0;
    zarOriginal = -1;
    isDialog = true;

    inputArrays = [
        [
            { 'code': 'v1', 'description': '1 Vehicle', 'amount': 159 },
            { 'code': 'v5', 'description': 'Up To 5 Vehicles', 'amount': 600 },
            { 'code': 'v10', 'description': 'Up To 10 Vehicles', 'amount': 975 },
            { 'code': 'v11', 'description': 'Unlimited Vehicles', 'amount': 2250 }
        ],
        [
            { 'code': 'l5', 'description': 'Up To 5 Loads', 'amount': 300 },
            { 'code': 'l10', 'description': 'Up To 10 Loads', 'amount': 495 },
            { 'code': 'l11', 'description': 'Unlimited Loads', 'amount': 1450 }
        ],
        [
            { 'code': 'd1', 'description': 'Business Directory', 'amount': 110 }
        ],
        [
            { 'code': 'a1', 'description': 'Premium Advert Listing', 'amount': 195 }
        ],
        [
            { 'code': 't1', 'description': 'Transport Mangement System', 'amount': 195 }
        ]
    ]

    amount: number;
    itemName: string;
    itemDescription: string;
    recurringAmount: number;

    generateCombinations(inputArrays) {
        let combinations = [];
        const max = inputArrays.length - 1;

        function helper(arr, i) {
            if (i === max) {
                arr.sort((a, b) => a.code.localeCompare(b.code));

                const planCode = arr.map(x => x.code).join('');
                const planName = arr.map(x => x.description).join(' + ');
                const amount = arr.reduce((acc, x) => acc + x.amount, 0);

                combinations.push({
                    planCode,
                    planName,
                    amount,
                });
            } else {
                helper(arr, i + 1);

                for (let j = 0, len = inputArrays[i].length; j < len; j++) {
                    let a = arr.slice(0);
                    a.push(inputArrays[i][j]);
                    helper(a, i + 1);
                }
            }
        }

        helper([], 0);
        return combinations;
    }

    getSelection(codeVehicle: string, codeLoad: string, codeAdvert: string, codeDirectory: string, codeTMS: string) {
        let planCode = codeAdvert + codeDirectory + codeLoad + codeTMS + codeVehicle;

        let allCombinations = this.generateCombinations(this.inputArrays);

        return allCombinations.find(x => x.planCode == planCode);
    }

    /**
     * Constructor
     */
    constructor(
        public userService: UserService,
        private _snackBar: MatSnackBar,
        private variableService: VariableService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<DialogAccountComponent>,
        private sqlService: SqlService,
        private paystackService: PaystackService,
        private route: ActivatedRoute,
        private router: Router,
        private fuseSplashScreenService: FuseSplashScreenService
    ) {
        this.fromPage = data.page;
        //console.log('this.fromPage', this.fromPage);
        this.isDialog = route.snapshot.routeConfig?.path != 'account';
        this.userService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
                this.getPlans();
            }
        });
        //this.updatePlans();
        //
        // this.addPlans();
    }
    getPlans() {
        this.paystackService.getPlans(this.free)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(async res => {
                this.plans = res.data;
            }, error => {
                console.log(JSON.stringify(error));
            });
    }
    ngOnDestroy(): void {
        this.loading = false;
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // async initPlans() {
    //     this.addPlanInit('Premium Advert Listing (a1)', 19500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory (a1d1)', 30500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Up To 10 Loads (a1d1l10)', 80000); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Up To 10 Loads + 1 Vehicle (a1d1l10v1)', 95900); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Up To 10 Loads + Up To 10 Vehicles (a1d1l10v10)', 177500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Up To 10 Loads + Unlimited Vehicles (a1d1l10v11)', 305000); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Up To 10 Loads + Up To 5 Vehicles (a1d1l10v5)', 140000); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Unlimited Loads (a1d1l11)', 175500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Unlimited Loads + 1 Vehicle (a1d1l11v1)', 191400); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Unlimited Loads + Up To 10 Vehicles (a1d1l11v10)', 273000); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Unlimited Loads + Unlimited Vehicles (a1d1l11v11)', 400500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Unlimited Loads + Up To 5 Vehicles (a1d1l11v5)', 235500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Up To 5 Loads (a1d1l5)', 60500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Up To 5 Loads + 1 Vehicle (a1d1l5v1)', 76400); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Up To 5 Loads + Up To 10 Vehicles (a1d1l5v10)', 158000); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Up To 5 Loads + Unlimited Vehicles (a1d1l5v11)', 285500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Up To 5 Loads + Up To 5 Vehicles (a1d1l5v5)', 120500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + 1 Vehicle (a1d1v1)', 46400); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Up To 10 Vehicles (a1d1v10)', 128000); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Unlimited Vehicles (a1d1v11)', 255500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Business Directory + Up To 5 Vehicles (a1d1v5)', 90500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Up To 10 Loads (a1l10)', 69000); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Up To 10 Loads + 1 Vehicle (a1l10v1)', 84900); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Up To 10 Loads + Up To 10 Vehicles (a1l10v10)', 166500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Up To 10 Loads + Unlimited Vehicles (a1l10v11)', 294000); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Up To 10 Loads + Up To 5 Vehicles (a1l10v5)', 129000); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Unlimited Loads (a1l11)', 164500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Unlimited Loads + 1 Vehicle (a1l11v1)', 180400); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Unlimited Loads + Up To 10 Vehicles (a1l11v10)', 262000); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Unlimited Loads + Unlimited Vehicles (a1l11v11)', 389500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Unlimited Loads + Up To 5 Vehicles (a1l11v5)', 224500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Up To 5 Loads (a1l5)', 49500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Up To 5 Loads + 1 Vehicle (a1l5v1)', 65400); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Up To 5 Loads + Up To 10 Vehicles (a1l5v10)', 147000); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Up To 5 Loads + Unlimited Vehicles (a1l5v11)', 274500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Up To 5 Loads + Up To 5 Vehicles (a1l5v5)', 109500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + 1 Vehicle (a1v1)', 35400); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Up To 10 Vehicles (a1v10)', 117000); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Unlimited Vehicles (a1v11)', 244500); await this.delay(1000);
    //     this.addPlanInit('Premium Advert Listing + Up To 5 Vehicles (a1v5)', 79500); await this.delay(1000);
    //     this.addPlanInit('Business Directory (d1)', 11000); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Up To 10 Loads (d1l10)', 60500); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Up To 10 Loads + 1 Vehicle (d1l10v1)', 76400); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Up To 10 Loads + Up To 10 Vehicles (d1l10v10)', 158000); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Up To 10 Loads + Unlimited Vehicles (d1l10v11)', 285500); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Up To 10 Loads + Up To 5 Vehicles (d1l10v5)', 120500); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Unlimited Loads (d1l11)', 156000); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Unlimited Loads + 1 Vehicle (d1l11v1)', 171900); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Unlimited Loads + Up To 10 Vehicles (d1l11v10)', 253500); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Unlimited Loads + Unlimited Vehicles (d1l11v11)', 381000); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Unlimited Loads + Up To 5 Vehicles (d1l11v5)', 216000); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Up To 5 Loads (d1l5)', 41000); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Up To 5 Loads + 1 Vehicle (d1l5v1)', 56900); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Up To 5 Loads + Up To 10 Vehicles (d1l5v10)', 138500); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Up To 5 Loads + Unlimited Vehicles (d1l5v11)', 266000); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Up To 5 Loads + Up To 5 Vehicles (d1l5v5)', 101000); await this.delay(1000);
    //     this.addPlanInit('Business Directory + 1 Vehicle (d1v1)', 26900); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Up To 10 Vehicles (d1v10)', 108500); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Unlimited Vehicles (d1v11)', 236000); await this.delay(1000);
    //     this.addPlanInit('Business Directory + Up To 5 Vehicles (d1v5)', 71000); await this.delay(1000);
    //     this.addPlanInit('Up To 10 Loads (l10)', 49500); await this.delay(1000);
    //     this.addPlanInit('Up To 10 Loads + 1 Vehicle (l10v1)', 65400); await this.delay(1000);
    //     this.addPlanInit('Up To 10 Loads + Up To 10 Vehicles (l10v10)', 147000); await this.delay(1000);
    //     this.addPlanInit('Up To 10 Loads + Unlimited Vehicles (l10v11)', 274500); await this.delay(1000);
    //     this.addPlanInit('Up To 10 Loads + Up To 5 Vehicles (l10v5)', 109500); await this.delay(1000);
    //     this.addPlanInit('Unlimited Loads (l11)', 145000); await this.delay(1000);
    //     this.addPlanInit('Unlimited Loads + 1 Vehicle (l11v1)', 160900); await this.delay(1000);
    //     this.addPlanInit('Unlimited Loads + Up To 10 Vehicles (l11v10)', 242500); await this.delay(1000);
    //     this.addPlanInit('Unlimited Loads + Unlimited Vehicles (l11v11)', 370000); await this.delay(1000);
    //     this.addPlanInit('Unlimited Loads + Up To 5 Vehicles (l11v5)', 205000); await this.delay(1000);
    //     this.addPlanInit('Up To 5 Loads (l5)', 30000); await this.delay(1000);
    //     this.addPlanInit('Up To 5 Loads + 1 Vehicle (l5v1)', 45900); await this.delay(1000);
    //     this.addPlanInit('Up To 5 Loads + Up To 10 Vehicles (l5v10)', 127500); await this.delay(1000);
    //     this.addPlanInit('Up To 5 Loads + Unlimited Vehicles (l5v11)', 255000); await this.delay(1000);
    //     this.addPlanInit('Up To 5 Loads + Up To 5 Vehicles (l5v5)', 90000); await this.delay(1000);
    //     this.addPlanInit('1 Vehicle (v1)', 15900); await this.delay(1000);
    //     this.addPlanInit('Up To 10 Vehicles (v10)', 97500); await this.delay(1000);
    //     this.addPlanInit('Unlimited Vehicles (v11)', 225000); await this.delay(1000);
    //     this.addPlanInit('Up To 5 Vehicles (v5)', 60000); await this.delay(1000);
    // }

    updatePlans() {
        let allCombinations = this.generateCombinations(this.inputArrays);

        this.paystackService.getPlans(this.free)
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(plans => {
                plans.data.forEach(plan => {
                    this.paystackService.updatePlan(plan.plan_code, JSON.stringify({ 'amount': plan.amount.toString() + '00' }), this.free)
                        .pipe(takeUntil(this._unsubscribeAll)).subscribe(res => { });
                });
                // allCombinations.forEach(combination => {
                //     if (combination.planCode != '') {
                //         if (plans.data.find(plan => plan.name.indexOf('(' + combination.planCode + ')') < 0)) {
                //             this.addPlan(combination);
                //         }
                //     }
                // });
            });
    }
    addPlanInit(name: string, amount: number) {
        let parm = JSON.stringify({
            'name': name,
            'interval': 'monthly',
            'amount': amount
        })
        if (name != '') {
            this.paystackService.addPlan(parm, this.free)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe(async res => { });
        }
    }
    addPlans() {
        let result = this.generateCombinations(this.inputArrays);
        result.forEach(element => {

            let parm = JSON.stringify({
                'name': element.planName + ' (' + element.planCode + ')',
                'interval': 'monthly',
                'amount': element.amount
            })
            if (element.planName != '') {
                this.paystackService.addPlan(parm, this.free)
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe(async res => {
                        await this.delay(1000);
                    });
            }
        });
    }
    async addPlan(element: any) {
        let parm = JSON.stringify({
            'name': element.planName + ' (' + element.planCode + ')',
            'interval': 'monthly',
            'amount': element.amount
        })
        if (element.planName != '') {
            this.paystackService.addPlan(parm, this.free)
                .pipe(takeUntil(this._unsubscribeAll)).subscribe(async res => {
                    await this.delay(1000);
                });
        }
    }
    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getOptions() {
        let code = this.getCode();
        if (code != '') {

            this.amount = this.free ? 0 : this.generateCombinations(this.inputArrays).find(x => x.planCode == this.getCode()).amount;
            this.itemName = this.generateCombinations(this.inputArrays).find(x => x.planCode == code).planName;
            this.itemDescription = this.generateCombinations(this.inputArrays).find(x => x.planCode == code).planName;
            this.recurringAmount = this.free ? 5 : this.generateCombinations(this.inputArrays).find(x => x.planCode == code).amount;

            let item = this.plans.length > 0 ? this.plans.find(x => x.name.indexOf('(' + code + ')') >= 0) : null;
            return item ? {
                plan: item.plan_code,
                amount: item.amount,
                currency: 'ZAR',
                email: this.currentUser.email,
                metadata: { userId: this.currentUser.id },
                ref: `${Math.ceil(Math.random() * 10e10)}`
            } : null;
        } else {
            this.amount = null;
            this.itemName = null;
            this.itemDescription = null;
            this.recurringAmount = null;

            return null;
        }
    }

    paymentInit() {
        //console.log('Payment initialized', this.options);
    }

    submitFree() {
        this.fuseSplashScreenService.show();
        let data = {
            advert: encodeURIComponent(this.getQuantity('advert').toString()).replace(/%20/g, '+'),
            tms: encodeURIComponent(this.getQuantity('tms').toString()).replace(/%20/g, '+'),
            directory: encodeURIComponent(this.getQuantity('directory').toString()).replace(/%20/g, '+'),
            vehicle: encodeURIComponent(this.getQuantity('vehicle').toString()).replace(/%20/g, '+'),
            load: encodeURIComponent(this.getQuantity('load').toString()).replace(/%20/g, '+'),
        }
        this.sqlService.createItem('transactions', data).subscribe(res => {
            this.title = 'Payment successfull';
            this.dialogRef.close(false);
            this._snackBar.open('Success', undefined, { duration: 2000 });
            setTimeout(() => {
                this.router.navigate(['/sign-out']);
            }, 1000);
        });
    }

    paymentDone(ref: any) {
        this.title = 'Payment successfull';
        this.router.navigate(['/sign-out']);;
        this.dialogRef.close(false);
    }

    paymentCancel() {
        console.log('payment failed');
    }

    ngOnInit(): void {
        this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
        this.route.queryParams
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(params => {
                if (params['action'] == 'return') {
                    //getsubscription
                }
            });

        this.getSubscription();

        // setTimeout(() => {
        //     this.loading = false;
        // }, 10000);
    }

    getVoucher(voucher) {
        this.sqlService.getItemsTag(this.currentUser, 'axels', 'voucher', { description: voucher })
            .pipe(takeUntil(this._unsubscribeAll)).subscribe({
                next: (apiResult: any) => {
                    if (apiResult.result == true) {
                        if (apiResult.data == "Unauthorised") {
                            this._snackBar.open('Error', undefined, { duration: 2000 });
                            this.router.navigate(['/sign-out']);;
                        } else {
                            let code = this.getCode();
                            this.free = true;
                            this.amount = this.free ? 0 : 0;//this.generateCombinations(this.inputArrays).find(x => x.planCode == this.getCode()).amount;
                            this.itemName = this.generateCombinations(this.inputArrays).find(x => x.planCode == code).planName;
                            this.itemDescription = this.generateCombinations(this.inputArrays).find(x => x.planCode == code).planName;
                            this.recurringAmount = this.free ? 5 : this.generateCombinations(this.inputArrays).find(x => x.planCode == code).amount;

                            // this.key = apiResult.data ? (apiResult.data.toUpperCase() == environment.paystack_id.toUpperCase() ? environment.paystack_key_test : environment.paystack_key) : environment.paystack_key;
                            // this.options.key = apiResult.data ? (apiResult.data.toUpperCase() == environment.paystack_id.toUpperCase() ? environment.paystack_key_test : environment.paystack_key) : environment.paystack_key;
                            // this.getPlans();
                        }
                    } else {
                        let code = this.getCode();
                        this.free = false;
                        this.amount = this.free ? 0 : 0;//this.generateCombinations(this.inputArrays).find(x => x.planCode == this.getCode()).amount;
                        this.itemName = this.generateCombinations(this.inputArrays).find(x => x.planCode == code).planName;
                        this.itemDescription = this.generateCombinations(this.inputArrays).find(x => x.planCode == code).planName;
                        this.recurringAmount = this.free ? 5 : this.generateCombinations(this.inputArrays).find(x => x.planCode == code).amount;

                        // this.key = environment.paystack_key;
                        // this.options.key = environment.paystack_key;
                        // this.getPlans();
                    }
                },
                error: (error) => {
                    let code = this.getCode();
                    this.free = false;
                    this.amount = this.free ? 0 : 0;//this.generateCombinations(this.inputArrays).find(x => x.planCode == this.getCode()).amount;
                    this.itemName = this.generateCombinations(this.inputArrays).find(x => x.planCode == code).planName;
                    this.itemDescription = this.generateCombinations(this.inputArrays).find(x => x.planCode == code).planName;
                    this.recurringAmount = this.free ? 5 : this.generateCombinations(this.inputArrays).find(x => x.planCode == code).amount;

                    console.log('error', error);
                    this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                    this.getPlans();
                },
                complete: () => {
                }
            });
    }

    getTransactions(): Promise<any[]> {
        var promise = new Promise<any[]>((resolve) => {
            try {
                this.sqlService.getItems('transactions')
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.result == true) {
                                if (apiResult.data == "Unauthorised") {
                                    this._snackBar.open('Error', undefined, { duration: 2000 });
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
                this.selectedBusinessDirectory = res[0].directory > 0;
                this.selectedAdvert = res[0].advert > 0;
                this.selectedTms = res[0].tms > 0;
                this.selectedVehicle1 = res[0].vehicle == 1;
                this.selectedVehicle5 = res[0].vehicle == 5;
                this.selectedVehicle10 = res[0].vehicle == 10;
                this.selectedVehicle11 = res[0].vehicle == 11;
                this.selectedLoad5 = res[0].load == 5;
                this.selectedLoad10 = res[0].load == 10;
                this.selectedLoad11 = res[0].load == 11;
            }

            setTimeout(() => {
                this.usd = this.getUSD();
                this.zar = this.getZAR();
                if (this.zarOriginal == -1) {
                    let cR = this.zar.toString() + '*_';
                    this.zarOriginal = Number(cR.replace('*_', ''));
                }
                this.loading = false;
            }, 100);
        })
    }

    getCode() {
        return ''
            + (this.selectedAdvert ? 'a1' : '')
            + (this.selectedBusinessDirectory ? 'd1' : '')
            + (this.selectedLoad5 ? 'l5' : '')
            + (this.selectedLoad10 ? 'l10' : '')
            + (this.selectedLoad11 ? 'l11' : '')
            + (this.selectedTms ? 't1' : '')
            + (this.selectedVehicle1 ? 'v1' : '')
            + (this.selectedVehicle5 ? 'v5' : '')
            + (this.selectedVehicle10 ? 'v10' : '')
            + (this.selectedVehicle11 ? 'v11' : '');
    }

    onSelectCardBusinessDirectory() {
        this.selectedBusinessDirectory = !this.selectedBusinessDirectory;
        this.usd = this.getUSD();
        this.zar = this.getZAR();
        setTimeout(() => {
            this.options = this.getOptions();
        }, 100);
    }

    onSelectCardAdvert() {
        this.selectedAdvert = !this.selectedAdvert;
        this.usd = this.getUSD();
        this.zar = this.getZAR();
        setTimeout(() => {
            this.options = this.getOptions();
        }, 100);
    }

    onSelectCardTms() {
        this.selectedTms = !this.selectedTms;
        this.usd = this.getUSD();
        this.zar = this.getZAR();
        setTimeout(() => {
            this.options = this.getOptions();
        }, 100);
    }

    onSelectCardVehicle(index: any) {
        //this.payPalConfig = null;
        switch (index) {
            case 1:
                this.selectedVehicle1 = !this.selectedVehicle1;
                this.selectedVehicle5 = false;
                this.selectedVehicle10 = false;
                this.selectedVehicle11 = false;
                //if(this.selectedVehicle1){this.payPalConfig = this.initConfig(1);}
                break;
            case 5:
                this.selectedVehicle5 = !this.selectedVehicle5;
                this.selectedVehicle1 = false;
                this.selectedVehicle10 = false;
                this.selectedVehicle11 = false;
                //if(this.selectedVehicle5){this.payPalConfig = this.initConfig(5);}
                break;
            case 10:
                this.selectedVehicle10 = !this.selectedVehicle10;
                this.selectedVehicle1 = false;
                this.selectedVehicle5 = false;
                this.selectedVehicle11 = false;
                //if(this.selectedVehicle10){this.payPalConfig = this.initConfig(10);}
                break;
            case 11:
                this.selectedVehicle11 = !this.selectedVehicle11;
                this.selectedVehicle1 = false;
                this.selectedVehicle5 = false;
                this.selectedVehicle10 = false;
                //if(this.selectedVehicle11){this.payPalConfig = this.initConfig(11);}
                break;
            default:
                break;
        }
        this.usd = this.getUSD();
        this.zar = this.getZAR();
        setTimeout(() => {
            this.options = this.getOptions();
        }, 100);
    }

    onSelectCardLoad(index: any) {
        switch (index) {
            case 5:
                this.selectedLoad5 = !this.selectedLoad5;
                this.selectedLoad10 = false;
                this.selectedLoad11 = false;
                //if(this.selectedLoad5){this.payPalConfig = this.initConfig(5);}
                break;
            case 10:
                this.selectedLoad10 = !this.selectedLoad10;
                this.selectedLoad5 = false;
                this.selectedLoad11 = false;
                //if(this.selectedLoad10){this.payPalConfig = this.initConfig(10);}
                break;
            case 11:
                this.selectedLoad11 = !this.selectedLoad11;
                this.selectedLoad5 = false;
                this.selectedLoad10 = false;
                //if(this.selectedLoad11){this.payPalConfig = this.initConfig(11);}
                break;
            default:
                break;
        }
        this.usd = this.getUSD();
        this.zar = this.getZAR();
        setTimeout(() => {
            this.options = this.getOptions();
        }, 100);
    }

    getValue(page: string, quantity: number) {
        switch (page) {
            case 'Vehicle':
                return this.pricing.Vehicle.find(x => x.quantity == quantity) ? this.pricing.Vehicle.find(x => x.quantity == quantity) : { quantity: 0, usd: 0, zar: 0 };
            case 'Load':
                return this.pricing.Load.find(x => x.quantity == quantity) ? this.pricing.Load.find(x => x.quantity == quantity) : { quantity: 0, usd: 0, zar: 0 };
            case 'BusinessDirectory':
                return this.pricing.BusinessDirectory.find(x => x.quantity == quantity) ? this.pricing.BusinessDirectory.find(x => x.quantity == quantity) : { quantity: 0, usd: 0, zar: 0 };
            case 'Advert':
                return this.pricing.Advert.find(x => x.quantity == quantity) ? this.pricing.Advert.find(x => x.quantity == quantity) : { quantity: 0, usd: 0, zar: 0 };
            case 'Tms':
                return this.pricing.Tms.find(x => x.quantity == quantity) ? this.pricing.Tms.find(x => x.quantity == quantity) : { quantity: 0, usd: 0, zar: 0 };
            default:
                return { quantity: 0, usd: 0, zar: 0 };
        }
    }

    getUSD() {
        return (this.selectedAdvert ? this.getValue('Advert', 1)!.usd : 0)
            + (this.selectedTms ? this.getValue('Tms', 1)!.usd : 0)
            + (this.selectedBusinessDirectory ? this.getValue('BusinessDirectory', 1)!.usd : 0)
            + (this.selectedVehicle1 ? this.getValue('Vehicle', 1)!.usd : 0)
            + (this.selectedVehicle5 ? this.getValue('Vehicle', 5)!.usd : 0)
            + (this.selectedVehicle10 ? this.getValue('Vehicle', 10)!.usd : 0)
            + (this.selectedVehicle11 ? this.getValue('Vehicle', 11)!.usd : 0)
            + (this.selectedLoad5 ? this.getValue('Load', 5)!.usd : 0)
            + (this.selectedLoad10 ? this.getValue('Load', 10)!.usd : 0)
            + (this.selectedLoad11 ? this.getValue('Load', 11)!.usd : 0)
    }

    getZAR() {
        return (this.selectedAdvert ? this.getValue('Advert', 1)!.zar : 0)
            + (this.selectedTms ? this.getValue('Tms', 1)!.zar : 0)
            + (this.selectedBusinessDirectory ? this.getValue('BusinessDirectory', 1)!.zar : 0)
            + (this.selectedVehicle1 ? this.getValue('Vehicle', 1)!.zar : 0)
            + (this.selectedVehicle5 ? this.getValue('Vehicle', 5)!.zar : 0)
            + (this.selectedVehicle10 ? this.getValue('Vehicle', 10)!.zar : 0)
            + (this.selectedVehicle11 ? this.getValue('Vehicle', 11)!.zar : 0)
            + (this.selectedLoad5 ? this.getValue('Load', 5)!.zar : 0)
            + (this.selectedLoad10 ? this.getValue('Load', 10)!.zar : 0)
            + (this.selectedLoad11 ? this.getValue('Load', 11)!.zar : 0)
    }

    getQuantity(item: string) {
        switch (item) {
            case 'vehicle':
                if (this.selectedVehicle1) {
                    return 1;
                } else {
                    if (this.selectedVehicle5) {
                        return 5;
                    } else {
                        if (this.selectedVehicle10) {
                            return 10;
                        } else {
                            if (this.selectedVehicle11) {
                                return -1;
                            } else {
                                return 0;
                            }
                        }
                    }
                }
            case 'load':
                if (this.selectedLoad5) {
                    return 5;
                } else {
                    if (this.selectedLoad10) {
                        return 10;
                    } else {
                        if (this.selectedLoad11) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                }
            case 'advert':
                return this.selectedAdvert ? 1 : 0;
            case 'tms':
                return this.selectedTms ? 1 : 0;
            case 'directory':
                return this.selectedBusinessDirectory ? 1 : 0;
            default:
                return 0;
        }
    }

    async checkOut() {
        this.fuseSplashScreenService.show();
        var url = environment.apiDotNet + 'payfast/subscription';
        url += '/' + encodeURIComponent(this.currentUser.id).replace(/%20/g, '+');
        url += '/' + encodeURIComponent(this.currentUser.email!).replace(/%20/g, '+');
        url += '/' + encodeURIComponent(this.getZAR()).replace(/%20/g, '+');
        url += '/' + encodeURIComponent(this.getQuantity('vehicle').toString()).replace(/%20/g, '+');
        url += '/' + encodeURIComponent(this.getQuantity('load').toString()).replace(/%20/g, '+');
        url += '/' + encodeURIComponent(this.getQuantity('advert').toString()).replace(/%20/g, '+');
        url += '/' + encodeURIComponent(this.getQuantity('tms').toString()).replace(/%20/g, '+');
        url += '/' + encodeURIComponent(this.getQuantity('directory').toString()).replace(/%20/g, '+')
        url += '/' + this.fromPage;

        if (Capacitor.isNativePlatform()) {
            Browser.open({ url });
        } else {
            window.open(url, '_self');
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    submit() {
        this.fuseSplashScreenService.show();
    }

    actionPayFastJavascript() {
        // Perform your logic here
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        //this.dialogRef.close({ action: this.id ? 'update' : 'insert', value: this.form.value });
    }
}
