import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation,
    OnDestroy,
    ChangeDetectionStrategy,
    inject,
    ChangeDetectorRef,
} from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { interval, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
    NgIf,
    NgFor,
    NgClass,
    NgTemplateOutlet,
    DatePipe,
    NgStyle,
    NgForOf,
} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Preferences } from '@capacitor/preferences';
import { NgxSkeletonLoaderModule, NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { User } from 'app/core/user/user.types';
import { advert } from 'app/models/advert.model';
import { environment } from 'environments/environment';
import { UserService } from 'app/core/user/user.service';
import { SqlService } from 'app/services/sql.service';
import { VariableService } from 'app/services/variable.service';
import { DialogImageComponent } from 'app/dialogs/dialog-image/dialog-image.component';

const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 25000,
    maximumAge: 0,
};

@Component({
    selector: 'app-advertHorizontal',
    templateUrl: './advertHorizontal.component.html',
    styleUrls: ['./advertHorizontal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatButtonModule,
        ScrollingModule,
        MatMenuModule,
        MatCardModule,
        NgIf,
        MatIconModule,
        MatTooltipModule,
        NgFor,
        NgForOf,
        NgStyle,
        NgClass,
        NgTemplateOutlet,
        RouterLink,
        DatePipe,
        NgxSkeletonLoaderModule,
        MatSnackBarModule
    ],
})
export class AdvertHorizontalComponent implements OnInit, OnDestroy {
    private _unsubscribeAll = new Subject<void>();
    @Input() position = 'fixed';
    @Input() _height = 'h-full';
    @Input() _top = 16;
    @Input() right = 0;
    @Input() bottom = 0;
    @Input() paddingTop = 0;
    @Input() paddingBottom = 0;
    @Input() marginTop = 0;
    @Input() marginBottom = 0;
    loading = false;
    advertItems: advert[] = [];
    timestamp: number = 0;
    subscription!: Subscription;
    imagesFolder = environment.apiImage;
    drawerOpened: boolean = window.innerWidth > 600;
    isScreenSmall!: boolean;
    drawerMode: 'over' | 'side' = 'side';
    private advertSubscription!: Subscription;
    currentUser: User | null = null;

    constructor(
        private userService: UserService,
        private dialog: MatDialog,
        private sqlService: SqlService,
        private variableService: VariableService,
        private cdRef: ChangeDetectorRef,
        private router: Router
    ) {
        this.timestamp = new Date().getTime();
        this.userService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
            }
        });
        this.initPage();

        this.variableService.showAdverts$

            .pipe(takeUntil(this._unsubscribeAll)).subscribe((showAdverts) => {
                this.drawerOpened = showAdverts;
            });

    }

    initPage() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._unsubscribeAll = new Subject<void>();

        this.getAdverts();
    }

    ngOnDestroy(): void {
        if (this.advertSubscription) {
            this.advertSubscription.unsubscribe();
        }
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnInit() {
    }

    openedChanged(event: boolean) {
        this.variableService.setShowAdverts(event);
        Preferences.set({ key: 'showAdverts', value: event ? '1' : '0' });
    }

    getAdverts() {
        if (this.advertSubscription) {
            this.advertSubscription.unsubscribe();
        }

        this.advertSubscription = this.sqlService
            .getItemsTag(this.currentUser, 'adverts', 'available', null)

            .pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
                if (apiResult.data == "Unauthorised") {
                    this.router.navigate(['/sign-out']);;
                } else {
                    this.advertItems = apiResult.data;
                    this.loading = false;
                }
            });
        // setTimeout(() => {
        //     this.getAdverts();
        // }, 100000);
    }

    navigateExternal(event: Event, url: string) {
        event.preventDefault();
        if (Capacitor.isNativePlatform()) {
            Browser.open({ url });
        } else {
            window.open(url, '_blank');
        }
    }

    async viewLocation(item: advert) {
        if (Capacitor.getPlatform() !== 'web') {
            const geolocationEnabled = await Geolocation.checkPermissions();

            if (geolocationEnabled.location !== 'granted') {
                const granted = await Geolocation.requestPermissions();

                if (granted.location !== 'granted') {
                    return;
                }
            }
        }
        Geolocation.getCurrentPosition(options).then((res) => {
            let url =
                'https://www.google.com/maps/dir/' +
                res.coords.latitude +
                ',' +
                res.coords.longitude +
                '/' +
                item.addressLat +
                ',' +
                item.addressLon +
                '/data=!3m1!4b1!4m2!4m1!3e0';
            Browser.open({ url });
        });
    }

    viewImage(avatar: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            avatar: avatar,
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';

        this.dialog.open(DialogImageComponent, dialogConfig);
    }

    onImageLoad() {
        // ('onImageLoad');
        // setTimeout(() => {
        //   this.loading = false;
        // this.variableService.setShowSpinner(false);
        // }, 1000);
    }
}
