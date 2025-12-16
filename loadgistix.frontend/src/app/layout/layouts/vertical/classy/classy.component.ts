import { NgClass, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, inject, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { Subject, takeUntil } from 'rxjs';
import { DayNightComponent } from "../../../common/day-night/day-night.component";
import { AdvertComponent } from "../../../common/advert/advert.component";
import { AdvertsComponent } from "../../../common/adverts/adverts.component";
import { VariableService } from 'app/services/variable.service';
import { environment } from 'environments/environment';
import { Preferences } from '@capacitor/preferences';

@Component({
    selector: 'classy-layout',
    templateUrl: './classy.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FuseLoadingBarComponent, FuseVerticalNavigationComponent, NotificationsComponent, UserComponent, NgIf, MatIconModule, MatButtonModule, LanguagesComponent, FuseFullscreenComponent, SearchComponent, ShortcutsComponent, MessagesComponent, RouterOutlet, QuickChatComponent, DayNightComponent, AdvertComponent, AdvertsComponent, NgClass],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    pageSelected!: string;
    showAdverts: boolean = true;
    showAdvertsBottom: boolean = false;
    isScreenSmOrBigger: boolean = true;
    imagesFolder = environment.apiImage;
    timestamp = 0;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private cdRef: ChangeDetectorRef,
        private variableService: VariableService,
    ) {
    }

    ngAfterViewInit() {
        this.variableService.pageSelected$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pageSelected) => {
                this.pageSelected = pageSelected;
                this.cdRef.detectChanges(); // manually trigger change detection
            });

        this.variableService.showAdverts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((showAdverts) => {
                this.showAdverts = showAdverts;
                this.showAdvertsBottom = !showAdverts;
                this.cdRef.detectChanges(); // manually trigger change detection
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
                this.timestamp = new Date().getTime();
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        this.checkScreenSize();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        this.checkScreenSize();
    }

    private checkScreenSize(): void {
        this.isScreenSmOrBigger = window.innerWidth >= 640; // Tailwind CSS 'sm' breakpoint is 640px
        if(this.showAdverts){            
            this.variableService.setShowAdverts(!(this.showAdverts && !this.isScreenSmOrBigger));
            Preferences.set({ key: 'showAdverts', value: (this.showAdverts && !this.isScreenSmOrBigger) ? '1' : '0' });
        }
        setTimeout(() => {
            if (this.showAdverts && !this.isScreenSmOrBigger) {
                this.showAdverts = false;
                this.variableService.setShowAdverts(!this.showAdverts);
                Preferences.set({ key: 'showAdverts', value: this.showAdverts ? '1' : '0' });
            } 
        }, 100);
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
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    // getTimeStamp(){
    //     return Preferences.get({key: 'timestamp'});
    // }
}
