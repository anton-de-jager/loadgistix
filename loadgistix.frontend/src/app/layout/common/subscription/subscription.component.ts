import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { FuseConfig, FuseConfigService, Scheme } from '@fuse/services/config';
import { Subject, takeUntil } from 'rxjs';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';

export interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'card' | 'eft' | 'wallet' | 'bnpl' | 'other';
    popular?: boolean;
}

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
    
    selectedPaymentMethod: string = '';
    showPaymentMethods = false;

    paymentMethods: PaymentMethod[] = [
        // Cards
        {
            id: 'cc',
            name: 'Credit/Debit Card',
            description: 'Visa, Mastercard, Amex, Diners',
            icon: '💳',
            category: 'card',
            popular: true
        },
        // Instant EFT
        {
            id: 'ef',
            name: 'Instant EFT',
            description: 'Direct bank transfer - ABSA, Capitec, FNB, Nedbank, Standard Bank',
            icon: '🏦',
            category: 'eft',
            popular: true
        },
        // Digital Wallets
        {
            id: 'ss',
            name: 'SnapScan',
            description: 'Scan & pay with SnapScan app',
            icon: '📱',
            category: 'wallet',
            popular: true
        },
        {
            id: 'zp',
            name: 'Zapper',
            description: 'Scan & pay with Zapper app',
            icon: '⚡',
            category: 'wallet'
        },
        {
            id: 'mp',
            name: 'Masterpass',
            description: 'Pay with Masterpass wallet',
            icon: '🔐',
            category: 'wallet'
        },
        {
            id: 'sp',
            name: 'Samsung Pay',
            description: 'Pay with Samsung Pay',
            icon: '📲',
            category: 'wallet'
        },
        {
            id: 'ap',
            name: 'Apple Pay',
            description: 'Pay with Apple Pay',
            icon: '🍎',
            category: 'wallet'
        },
        // Buy Now Pay Later
        {
            id: 'mc',
            name: 'Mobicred',
            description: 'Buy now, pay later monthly',
            icon: '🛒',
            category: 'bnpl',
            popular: true
        },
        {
            id: 'mt',
            name: 'MoreTyme',
            description: 'Pay in 3 interest-free installments',
            icon: '⏰',
            category: 'bnpl'
        },
        {
            id: 'pj',
            name: 'PayJustNow',
            description: 'Split into 3 interest-free payments',
            icon: '💰',
            category: 'bnpl'
        },
        {
            id: 'rcs',
            name: 'RCS',
            description: 'Pay with your RCS card',
            icon: '💎',
            category: 'bnpl'
        },
        // Other
        {
            id: 'sc',
            name: 'SCode',
            description: 'Pay with SCode voucher',
            icon: '🎟️',
            category: 'other'
        },
        {
            id: 'mu',
            name: '1Voucher',
            description: 'Pay with 1Voucher',
            icon: '🎫',
            category: 'other'
        }
    ];

    constructor() {
    }

    ngOnInit(): void {
        this.returnUrl = this.returnUrl + this.page;
        this.cancelUrl = this.cancelUrl + this.page;
    }

    ngAfterViewInit(): void {
    }

    togglePaymentMethods(): void {
        this.showPaymentMethods = !this.showPaymentMethods;
    }

    selectPaymentMethod(method: PaymentMethod): void {
        this.selectedPaymentMethod = method.id;
    }

    getPopularMethods(): PaymentMethod[] {
        return this.paymentMethods.filter(m => m.popular);
    }

    getMethodsByCategory(category: string): PaymentMethod[] {
        return this.paymentMethods.filter(m => m.category === category);
    }

    getCategoryLabel(category: string): string {
        const labels: Record<string, string> = {
            'card': 'Cards',
            'eft': 'Bank Transfer',
            'wallet': 'Digital Wallets',
            'bnpl': 'Buy Now Pay Later',
            'other': 'Other Options'
        };
        return labels[category] || category;
    }

    getSelectedMethodName(): string {
        const method = this.paymentMethods.find(m => m.id === this.selectedPaymentMethod);
        return method ? method.name : 'PayFast';
    }

    onSubmit(event: Event) {
        this.onSubmitted.next(true);
        this.loading = true;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
