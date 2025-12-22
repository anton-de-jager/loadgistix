import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariableService } from 'app/services/variable.service';
import { UserService } from 'app/core/user/user.service';
import { EventEmitterService } from 'app/services/event-emitter.service';
import { environment } from 'environments/environment';
import { FormGroup } from '@angular/forms';
import { Md5 } from 'ts-md5';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { Browser } from '@capacitor/browser';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'payfast',
    templateUrl: './payfast.component.html',
    styleUrls: ['./payfast.component.scss'],
    standalone: true,
    imports: [CommonModule, MatButtonModule]
})
export class PayfastComponent implements OnInit, AfterViewInit {
    user: any;
    planId = '';
    loading = true;

    paymentAmount: string = '19.80';
    currency: string = 'USD';
    currencyIcon: string = '$';

    form: FormGroup;
    minDate: Date;
    maxDate: Date;
    diff = 0;

    htmlForm = '';

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _userService: UserService,
        private router: Router,
        private eventEmitterService: EventEmitterService,
        private fuseSplashScreenService: FuseSplashScreenService
    ) {
        setTimeout(() => {
            this.eventEmitterService.onChangePage('subscription');
        }, 500);
    }

    ngOnInit(): void {
        //this.initConfig();
        this._userService.user$.subscribe(user => {
            if (user) {
                this.user = user;
            }else{
                localStorage.removeItem('AT');
                localStorage.removeItem('RT');
                localStorage.removeItem('ID');
                this.router.navigateByUrl('/sign-in');
            }
        }, error => {
            localStorage.removeItem('AT');
            localStorage.removeItem('RT');
            localStorage.removeItem('ID');

            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/home';
            this.router.navigateByUrl(redirectURL);
        });
    }

    days = (date_1, date_2) => {
        let difference = date_1.getTime() - date_2.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
    }

    dateChanged(event) {
        this.diff = (this.days(new Date(event.value), new Date()));
        this.createButtons();
    }

    createButtons() {
    }

    subscribe() {
        this.fuseSplashScreenService.show();
        var url = environment.apiDotNet + 'payfast/subscription';
        url += '/' + encodeURIComponent(this.user.id.toString()).replace(/%20/g, '+');
        url += '/' + encodeURIComponent(this.user.email).replace(/%20/g, '+');
        url += '/199';
        Browser.open({ url: url, windowName: '_self' });

        this.fuseSplashScreenService.hide();
    }

    ngAfterViewInit() {
    }

    generateSignature = (data, passPhrase = null) => {
        // Create parameter string
        let pfOutput = "";
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key] !== "") {
                    pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`
                }
            }
        }

        // Remove last ampersand
        let getString = pfOutput.slice(0, -1);
        if (passPhrase !== null) {
            getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
        }

        return Md5.hashStr(getString);
        //return crypto.createHash("md5").update(getString).digest("hex");
    };

    getFormData() {
        let date = new Date();
        date.setDate(date.getDate() + 14);

        const myData = [];
        // Merchant details
        myData["merchant_id"] = "15252850";
        myData["merchant_key"] = "8n1rbtdsbz6io";
        myData["return_url"] = "https://vibeviewer.com/subscription-success";
        myData["cancel_url"] = "https://vibeviewer.com/subscription-cancel";
        myData["notify_url"] = "https://luvirosapi.com:1880/vibeviewer/api/notify";
        // // Buyer details
        // myData["name_first"] = "First Name";
        // myData["name_last"] = "Last Name";
        // myData["email_address"] = "test@test.com";
        // Transaction details
        myData["m_payment_id"] = this.user.id;
        myData["amount"] = "350.00";
        myData["item_name"] = "Loadgistix Subscription";

        myData["subscription_type"] = "1";
        //myData["billing_date"] = date.toISOString().slice(0, 10);
        myData["recurring_amount"] = "350.00";
        myData["frequency"] = "3";
        myData["cycles"] = "0";
        myData["email_address"] = this.user.email;
        // myData["subscription_notify_email"] = "0";
        // myData["subscription_notify_buyer"] = this.user.email;
        // myData["cycles"] = "0";
        // myData["cycles"] = "0";

        // Generate signature
        const myPassphrase = "ThisIsMyVibeViewerPassphrase007";
        myData["signature"] = this.generateSignature(myData, myPassphrase);

        return myData;
    }

    buildForm() {
        let date = new Date();
        date.setDate(date.getDate() + 14);

        const myData = [];
        // Merchant details
        myData["merchant_id"] = "15252850";
        myData["merchant_key"] = "8n1rbtdsbz6io";
        myData["return_url"] = "https://vibeviewer.com/subscription-success";
        myData["cancel_url"] = "https://vibeviewer.com/subscription-cancel";
        myData["notify_url"] = "https://luvirosapi.com:1880/vibeviewer/api/notify";
        // // Buyer details
        // myData["name_first"] = "First Name";
        // myData["name_last"] = "Last Name";
        // myData["email_address"] = "test@test.com";
        // Transaction details
        myData["m_payment_id"] = this.user.id;
        myData["amount"] = "350.00";
        myData["item_name"] = "Loadgistix Subscription";

        myData["subscription_type"] = "1";
        //myData["billing_date"] = date.toISOString().slice(0, 10);
        myData["recurring_amount"] = "350.00";
        myData["frequency"] = "3";
        myData["cycles"] = "0";
        myData["email_address"] = this.user.email;
        // myData["subscription_notify_email"] = "0";
        // myData["subscription_notify_buyer"] = this.user.email;
        // myData["cycles"] = "0";
        // myData["cycles"] = "0";

        // Generate signature
        const myPassphrase = "ThisIsMyVibeViewerPassphrase007";
        myData["signature"] = this.generateSignature(myData, myPassphrase);

        this.htmlForm = `<form action="https://www.payfast.co.za/eng/process" method="post">`;
        for (let key in myData) {
            if (myData.hasOwnProperty(key)) {
                let value = myData[key];
                if (value !== "") {
                    this.htmlForm += `<input name="${key}" type="hidden" value="${value.trim()}" />`;
                }
            }
        }

        this.htmlForm += '<input type="submit" value="Subscribe" /></form>';

        //console.log(this.htmlForm);
    }
}
