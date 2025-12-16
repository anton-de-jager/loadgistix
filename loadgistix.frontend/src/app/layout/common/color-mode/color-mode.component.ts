import { NgFor, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { AvailableLangs, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Subject, Subscription, take, takeUntil } from 'rxjs';

@Component({
    selector: 'color-mode',
    templateUrl: './color-mode.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'color-mode',
    standalone: true,
    imports: [TranslocoModule, MatButtonModule, MatMenuModule, NgTemplateOutlet, NgFor],
})
export class ColorModeComponent implements OnInit, OnDestroy {
    private _unsubscribeAll = new Subject<void>();
    availableLangs!: AvailableLangs;
    activeLang!: string;
    flagCodes: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _translocoService: TranslocoService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the available color-mode from transloco
        this.availableLangs = this._translocoService.getAvailableLangs();

        // Subscribe to language changes
        this._translocoService.langChanges$.pipe(takeUntil(this._unsubscribeAll)).subscribe((activeLang) => {
            // Get the active lang
            this.activeLang = activeLang;

            // Update the navigation
            this._updateNavigation(activeLang);
        });

        // Set the country iso codes for color-mode for flags
        this.flagCodes = {
            'en': 'us',
            'tr': 'tr',
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the active lang
     *
     * @param lang
     */
    setActiveLang(lang: string): void {
        // Set the active lang
        this._translocoService.setActiveLang(lang);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the navigation
     *
     * @param lang
     * @private
     */
    private _updateNavigation(lang: string): void {
        // For the demonstration purposes, we will only update the Dashboard names
        // from the navigation but you can do a full swap and change the entire
        // navigation data.
        //
        // You can import the data from a file or request it from your backend,
        // it's up to you.

        // Get the component -> navigation data -> item
        const navComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>('mainNavigation');

        // Return if the navigation component does not exist
        if (!navComponent) {

        } else {

            // Get the flat navigation data
            const navigation = navComponent.navigation;

            // Get the Project dashboard item and update its title
            const projectDashboardItem = this._fuseNavigationService.getItem('dashboards.project', navigation);
            if (projectDashboardItem) {
                this._translocoService.selectTranslate('Project').pipe(take(1))
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((translation) => {
                        // Set the title
                        projectDashboardItem.title = translation;

                        // Refresh the navigation component
                        navComponent.refresh();
                    });
            }

            // Get the Analytics dashboard item and update its title
            const analyticsDashboardItem = this._fuseNavigationService.getItem('dashboards.analytics', navigation);
            if (analyticsDashboardItem) {
                this._translocoService.selectTranslate('Analytics').pipe(take(1))
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((translation) => {
                        // Set the title
                        analyticsDashboardItem.title = translation;

                        // Refresh the navigation component
                        navComponent.refresh();
                    });
            }
        }
    }
}
