import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { FuseConfig, FuseConfigService, Scheme } from '@fuse/services/config';
import { Subject, takeUntil } from 'rxjs';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
    selector: 'day-night',
    templateUrl: './day-night.component.html',
    styleUrls: ['./day-night.component.scss'],
    standalone: true
})
export class DayNightComponent implements OnInit, AfterViewInit {
    config!: FuseConfig;
    scheme!: 'dark' | 'light';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _fuseConfigService: FuseConfigService,
        private _changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                // Store the config
                this.config = config;
            });
    }

    ngAfterViewInit(): void {
        this.init();
    }

    async init() {
        let scheme = (await Preferences.get({ key: 'scheme' })).value;
        switch (scheme) {
            case 'dark':
                this.scheme = 'dark'
            default:
                this.scheme = 'light'
        }
        this.setScheme(this.scheme);
        this._changeDetectorRef.detectChanges();
    }

    setScheme(scheme: Scheme): void {
        this._fuseConfigService.config = { scheme };
        Preferences.set({ key: 'scheme', value: scheme });
        if (Capacitor.getPlatform() !== "web") {
            StatusBar.setStyle({ style: scheme == 'dark' ? Style.Dark : Style.Light });
        }
    }

    toggleTheme() {
        this.scheme = this.scheme == 'dark' ? 'light' : 'dark';
        this.setScheme(this.scheme);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
