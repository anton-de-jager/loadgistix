import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { interval, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { advert } from 'app/models/advert.model';
import { Geolocation } from '@capacitor/geolocation';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { NgIf, NgFor, NgClass, NgTemplateOutlet, DatePipe, NgStyle, NgForOf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { UserService } from 'app/core/user/user.service';
import { SqlService } from 'app/services/sql.service';
import { MatMenuModule } from '@angular/material/menu';
import { VariableService } from 'app/services/variable.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { Preferences } from '@capacitor/preferences';

const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 25000,
  maximumAge: 0
};
// const isDarkMode = document.documentElement.classList.contains('dark');
// const shadowElement = document.getElementById('item-shadow');
// if (shadowElement.classList) {
//   if (isDarkMode) {
//     shadowElement.classList.add('item-shadow-dark');
//     shadowElement.classList.remove('item-shadow');
//   } else {
//     shadowElement.classList.add('item-shadow');
//     shadowElement.classList.remove('item-shadow-dark');
//   }
// }

@Component({
    selector: 'app-adverts',
    templateUrl: './adverts.component.html',
    styleUrls: ['./adverts.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatButtonModule,
        FuseDrawerComponent,
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
        MatSnackBarModule
    ],
})
export class AdvertsComponent implements OnInit, OnDestroy {
    private _unsubscribeAll = new Subject<void>();
    @Input() side: boolean = false;
    loading = false;
    advertItems: advert[] = [];
    timestamp: number = 0;
    subscription!: Subscription;
    imagesFolder = environment.apiImage;
    showAdverts: boolean = true;

    constructor(
        private dialog: MatDialog,
        private sqlService: SqlService,
        private variableService: VariableService,
        private userService: UserService
    ) {
        this.timestamp = new Date().getTime();

        this.variableService.showAdverts$

            .pipe(takeUntil(this._unsubscribeAll)).subscribe((showAdverts) => {
                this.showAdverts = showAdverts;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(undefined);
        this._unsubscribeAll.complete();
    }

    ngOnInit() {
        // const source = interval(600000);
        // this.subscription = source.pipe(takeUntil(this._unsubscribeAll)).subscribe(val => {
        //   this.getAdverts();
        //   this.timestamp = new Date().getTime();
        // });
    }

    toggleAdvertsDrawer() {
        this.variableService.setShowAdverts(!this.showAdverts);
        Preferences.set({ key: 'showAdverts', value: this.showAdverts ? '1' : '0' });
    }

    //   getAdverts() {
    //     this.sqlService.getItemsTag(this.currentUser, 'adverts', 'available', null).pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
    //       this.advertItems = apiResult.data;
    //       this.loading = false;
    //       this.variableService.setShowSpinner(false);
    //     });
    //     setTimeout(() => {
    //       this.getAdverts();
    //     }, 100000);
    //   }

    //   navigateExternal(event: Event, url: string) {
    //     event.preventDefault();
    //     if (Capacitor.isNativePlatform()) {
    //       Browser.open({ url });
    //     } else {
    //       window.open(url, '_blank');
    //     }
    //   }

    //   async viewLocation(item: advert) {
    //     if (Capacitor.getPlatform() !== 'web') {
    //       const geolocationEnabled = await Geolocation.checkPermissions();

    //       if (geolocationEnabled.location !== 'granted') {
    //         const granted = await Geolocation.requestPermissions();

    //         if (granted.location !== 'granted') {
    //           return;
    //         }
    //       }
    //     }
    //     Geolocation.getCurrentPosition(options).then(res => {
    //       let url = 'https://www.google.com/maps/dir/' + res.coords.latitude + ',' + res.coords.longitude + '/' + item.addressLat + ',' + item.addressLon + '/data=!3m1!4b1!4m2!4m1!3e0';
    //       Browser.open({ url });
    //     });
    //   }

    //   viewImage(avatar: string) {
    //     const dialogConfig = new MatDialogConfig();
    //     dialogConfig.data = {
    //       avatar: avatar
    //     }

    //     dialogConfig.autoFocus = true;
    //     dialogConfig.disableClose = true;
    //     dialogConfig.hasBackdrop = true;
    //     dialogConfig.ariaLabel = 'fffff';

    //     this.dialog.open(DialogImageComponent,
    //       dialogConfig);
    //   }

    //   onImageLoad() {
    //     // ('onImageLoad');
    //     // setTimeout(() => {
    //     //   this.loading = false;
    //     // this.variableService.setShowSpinner(false);
    //     // }, 1000);
    //   }
}
