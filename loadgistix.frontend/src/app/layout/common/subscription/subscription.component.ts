import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { FuseConfig, FuseConfigService, Scheme } from '@fuse/services/config';
import { Subject, takeUntil } from 'rxjs';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'subscription',
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class SubscriptionComponent implements OnInit, AfterViewInit {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Input('emailAddress') emailAddress: string;
    @Input('page') page: string;
    returnUrl: string = environment.url;
    cancelUrl: string = environment.url;
    notifyUrl: string = environment.apiDotNet + 'payfast/notify';
    actionUrl: string = environment.actionUrl;
    @Input('amount') amount: number;
    @Input('itemName') itemName: string;
    @Input('itemDescription') itemDescription: string;
    @Input('recurringAmount') recurringAmount: number;
    @Output() readonly onSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>();
    loading = false;

    constructor() {
    }

    ngOnInit(): void {
        this.returnUrl = this.returnUrl + this.page;
        this.cancelUrl = this.cancelUrl + this.page;
    }

    ngAfterViewInit(): void {
    }

    onSubmit(event: Event) {
        this.onSubmitted.next(true);
        this.loading = true;
        // event.preventDefault(); // Prevent default form submission
        // Perform any pre-submission logic here

        // Optionally submit the form programmatically, if needed:
        // event.target.submit();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
