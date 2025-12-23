import { Component, NgZone } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { SqlService } from './services/sql.service';
import { User } from './core/user/user.types';
import { UserService } from './core/user/user.service';
import { Guid } from 'guid-typescript';
import { VersionService } from './services/version.service';
import { CrashLoggerService } from './services/crash-logger.service';

const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 25000,
    maximumAge: 0
};

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, NgxSpinnerModule],
})
export class AppComponent {
    deviceId: string;
    currentUser: User | null = null;
    /**
     * Constructor
     */
    constructor(
        private router: Router,
        private zone: NgZone,
        private sqlService: SqlService,
        private userService: UserService,
        private versionService: VersionService,
        private crashLogger: CrashLoggerService
        ) {
        // Initialize crash logger first to catch any errors
        this.crashLogger.init().catch(() => {});
        
        try {
            this.initDevice();
            this.initPWAInstallPrompt();
            this.initVersionCheck();
            this.userService.user$.subscribe(user => {
                if (user) {
                    this.currentUser = user;
                }
            });
            App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
                this.zone.run(() => {
                    const domain = 'loadgistix.com';
                    const pathAttay = event.url.split(domain);
                    const appPath = pathAttay.pop();

                    if(appPath) {
                        this.router.navigateByUrl(appPath);
                    }
                });
            });

            App.addListener('appStateChange', ({ isActive }) => {
                //console.log('App state changed. Is active?', isActive);
                if (isActive) {
                    //this.router.navigateByUrl('refresh');
                    this.initDevice();
                }
            });
        } catch (error) {
            this.crashLogger.logError(error as Error, 'AppComponent.constructor');
            throw error; // Re-throw to let the global handler catch it too
        }
    }

    initDevice() {
        Device.getId().then(id => {
            this.deviceId = id.identifier;
            this.logLocation();
        });
    }

    logLocation() {
        Geolocation.getCurrentPosition(options).then(getCurrentPositionResult => {
            this.sqlService.createItem('device/log', { deviceId: this.deviceId, userId: this.currentUser ? this.currentUser.id : Guid.EMPTY, platform: Capacitor.getPlatform(), lat: getCurrentPositionResult.coords.latitude, lon: getCurrentPositionResult.coords.longitude }).subscribe(res => {

            });
            // console.log(Capacitor.getPlatform(), { id: this.deviceId, lat: getCurrentPositionResult.coords.latitude, lon: getCurrentPositionResult.coords.longitude });
            // // this.apiService.saveLocation(this.deviceId, getCurrentPositionResult.coords.latitude, getCurrentPositionResult.coords.longitude).subscribe(res => {
            // //     // if (Capacitor.getPlatform() !== 'web') {
            // //     //     // this.getDevicePromotions(getCurrentPositionResult.coords.latitude, getCurrentPositionResult.coords.longitude);
            // //     // }
            // // });
        }).catch(error => {
            // Silently handle geolocation errors (permission denied, unavailable, timeout, etc.)
            console.warn('Geolocation not available:', error);
            // Optionally log device without location
            // this.sqlService.createItem('device/log', { deviceId: this.deviceId, userId: this.currentUser ? this.currentUser.id : Guid.EMPTY, platform: Capacitor.getPlatform(), lat: null, lon: null }).subscribe(res => {});
        });
    }

    initPWAInstallPrompt() {
        // Only run PWA code on web platform
        if (Capacitor.getPlatform() !== 'web') {
            return;
        }
        
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Store the event for later use
            (window as any).deferredPrompt = e;
            console.log('PWA install prompt available');
        });

        // Listen for successful install
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            (window as any).deferredPrompt = null;
        });
    }

    initVersionCheck() {
        try {
            // Initialize version checking (non-blocking)
            this.versionService.init().catch(error => {
                console.warn('Version check initialization failed:', error);
            });

            // Listen for update available event (mobile fallback)
            window.addEventListener('app-update-available', (event: CustomEvent) => {
                this.zone.run(() => {
                    const { version } = event.detail;
                    if (confirm(`A new version (${version}) is available. Would you like to update now?`)) {
                        this.versionService.openAppStore();
                    }
                });
            });
        } catch (error) {
            console.warn('Version check setup failed:', error);
        }
    }
}
