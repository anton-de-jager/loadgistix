import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    exportAs: 'user',
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, NgIf, MatIconModule, NgClass, MatDividerModule],
})
export class UserComponent implements OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    public currentUser: User | null = null;

    timestamp: number = 0;
    imagesFolder = environment.apiImage;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        public _userService: UserService,
        public _authService: AuthService,

    ) {
        this._userService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
                Preferences.set({
                    key: 'user',
                    value: JSON.stringify(user),
                });
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void {
        // Return if user is not available
        if (!this._userService.user) {
            return;
        }
    }

    selectPage(url: string) {
        this._router.navigate([url]).then(res => {
        }).catch(reason => console.log(reason));
    }

    /**
     * Sign out
     */
    signOut(): void {
        //console.log('signOut');
        this._authService.signOut().subscribe(x => {
            setTimeout(() => {
                this._router.navigate(['/sign-out']);
            }, 100);
        });
    }
}
