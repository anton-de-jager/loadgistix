import { Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MapComponent } from 'app/layout/common/map/map.component';
import { CommonModule, NgFor } from '@angular/common';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { DialogInfoComponent } from 'app/dialogs/dialog-info/dialog-info.component';
import { load } from 'app/models/load.model';
import { Capacitor } from "@capacitor/core";
import { environment } from 'environments/environment';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SqlService } from 'app/services/sql.service';
import { VariableService } from 'app/services/variable.service';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';

@Component({
    selector: 'account-delete',
    templateUrl: './account-delete.component.html',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MatIconModule, MatCardModule, MatFormFieldModule, RouterLink, MatToolbarModule, MatInputModule,
        MatButtonModule, MatSidenavModule, MapComponent, MatDialogModule,
        MatExpansionModule, NgFor]
})
export class AccountDeleteComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public loads: load[] = [];
    public token = '';
    showAdverts: boolean;
    currentUser: User | null = null;

    /**
     * Constructor
     */
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private _fuseConfirmationService: FuseConfirmationService,
        private sqlService: SqlService,
        private variableService: VariableService,
        private router: Router
    ) {
        variableService.setPageSelected('Delete Account');
        this.userService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
                this.initPage();
            }
        });

        setTimeout(() => {
            if (!this.currentUser) {
                this.router.navigate(['/sign-out']);;
            }
        }, 2000);
    }

    initPage(){

    }


    ngOnInit(): void {
        this.variableService.showAdverts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((showAdverts) => {
                this.showAdverts = showAdverts;
            });
    }

    sendMessage() {
        // const message = {
        //     data: {
        //         score: '850',
        //         time: '2:45'
        //     },
        //     token: this.token
        // };

        // messaging.send(message)
        //     .then((response) => {
        //         // Response is a message ID string.
        //         console.log('Successfully sent message:', response);
        //     })
        //     .catch((error) => {
        //         console.log('Error sending message:', error);
        //     });
    }

    delete(item: string) {
        let msg: string = item == 'account' ? 'your account' : 'these items';
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Item',
            message: 'Are you sure you want to delete ' + msg + '? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });
        confirmation.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
            if (result === 'confirmed') {
                switch (item) {
                    case 'history':
                        this.sqlService.deleteUserData(this.currentUser).pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {

                        });
                        break;
                    case 'account':
                        this.sqlService.deleteUser(this.currentUser).pipe(takeUntil(this._unsubscribeAll)).subscribe((res) => {

                        });
                    default:
                        break;
                }
            }
        });
    }



    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
