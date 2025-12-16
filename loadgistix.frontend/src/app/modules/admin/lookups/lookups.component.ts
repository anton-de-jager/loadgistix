import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { LookupsVehicleCategoryComponent } from './vehicle-category/vehicle-category.component';
import { LookupsVehicleTypeComponent } from './vehicle-type/vehicle-type.component';
import { LookupsLoadTypeComponent } from './load-type/load-type.component';
import { LookupsLicenceTypeComponent } from './licence-type/licence-type.component';
import { LookupsDirectoryCategoryComponent } from './directory-category/directory-category.component';
import { LookupsMakeComponent } from './make/make.component';
import { LookupsModelComponent } from './model/model.component';
import { LookupsAxelComponent } from './axel/axel.component';
import { LookupsPdpGroupComponent } from './pdp-group/pdp-group.component';
import { LookupsPdpComponent } from './pdp/pdp.component';
import { LookupsBodyTypeComponent } from './body-type/body-type.component';
import { LookupsBodyLoadComponent } from './body-load/body-load.component';
import { LookupsMaintenancePlannedTypeComponent } from './maintenancePlannedType/maintenancePlannedType.component';
import { LookupsMaintenanceUnPlannedTypeComponent } from './maintenanceUnPlannedType/maintenanceUnPlannedType.component';
import { LookupsReturnReasonComponent } from './returnReason/returnReason.component';
import { LookupsCompanyTypeComponent } from './company-type/company-type.component';
import { LookupsStockProblemComponent } from './stockProblem/stockProblem.component';
import { VariableService } from 'app/services/variable.service';
import { UserService } from 'app/core/user/user.service';
import { Router } from '@angular/router';
import { User } from 'app/core/user/user.types';

@Component({
    selector: 'lookups',
    templateUrl: './lookups.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatSidenavModule, MatButtonModule, MatIconModule, NgFor, NgClass, NgSwitch, NgSwitchCase, LookupsVehicleCategoryComponent, LookupsVehicleTypeComponent, LookupsLoadTypeComponent, LookupsLicenceTypeComponent, LookupsDirectoryCategoryComponent, LookupsMakeComponent, LookupsModelComponent, LookupsAxelComponent, LookupsBodyTypeComponent, LookupsBodyLoadComponent, LookupsCompanyTypeComponent, LookupsPdpGroupComponent, LookupsPdpComponent, LookupsMaintenancePlannedTypeComponent, LookupsMaintenanceUnPlannedTypeComponent, LookupsReturnReasonComponent, LookupsStockProblemComponent],
})
export class LookupsComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [
        {
            id: 'company-type',
            icon: 'heroicons_outline:truck',
            title: 'Company Types',
            description: 'Manage your existing team and change roles/permissions',
        },

        {
            id: 'vehicle-category',
            icon: 'heroicons_outline:user-circle',
            title: 'Vehicle Categories',
            description: 'Manage your public profile and private information',
        },
        {
            id: 'vehicle-type',
            icon: 'heroicons_outline:lock-closed',
            title: 'Vehicle Types',
            description: 'Manage your password and 2-step verification preferences',
        },
        {
            id: 'make',
            icon: 'heroicons_outline:building-office',
            title: 'Vehicle Makes',
            description: 'Manage your existing team and change roles/permissions',
        },
        {
            id: 'model',
            icon: 'heroicons_outline:truck',
            title: 'Vehicle Models',
            description: 'Manage your existing team and change roles/permissions',
        },
        {
            id: 'axel',
            icon: 'heroicons_outline:truck',
            title: 'Axels',
            description: 'Manage your existing team and change roles/permissions',
        },
        {
            id: 'body-type',
            icon: 'heroicons_outline:truck',
            title: 'Body Types',
            description: 'Manage your existing team and change roles/permissions',
        },
        {
            id: 'body-load',
            icon: 'heroicons_outline:truck',
            title: 'Body Loads',
            description: 'Manage your existing team and change roles/permissions',
        },

        // {
        //     id: 'load-category',
        //     icon: 'heroicons_outline:credit-card',
        //     title: 'Load Categories',
        //     description: 'Manage your subscription plan, payment method and billing information',
        // },
        {
            id: 'load-type',
            icon: 'heroicons_outline:bell',
            title: 'Load Types',
            description: 'Manage when you\'ll be notified on which channels',
        },
        {
            id: 'licence-type',
            icon: 'heroicons_outline:user-group',
            title: 'Licence Types',
            description: 'Manage your existing team and change roles/permissions',
        },
        {
            id: 'pdp-group',
            icon: 'heroicons_outline:user-group',
            title: 'Public Driver Permit Categories',
            description: 'Manage your existing team and change roles/permissions',
        },
        {
            id: 'pdp',
            icon: 'heroicons_outline:user-group',
            title: 'Public Driver Permits',
            description: 'Manage your existing team and change roles/permissions',
        },
        {
            id: 'directory-category',
            icon: 'heroicons_outline:user-group',
            title: 'Directory Categories',
            description: 'Manage your existing team and change roles/permissions',
        },
        {
            id: 'maintenancePlannedType',
            icon: 'heroicons_outline:user-group',
            title: 'Maintenance Types (Planned)',
            description: 'Manage your existing team and change roles/permissions',
        },
        {
            id: 'maintenanceUnPlannedType',
            icon: 'heroicons_outline:user-group',
            title: 'Maintenance Types (Un-Planned)',
            description: 'Manage your existing team and change roles/permissions',
        },
        {
            id: 'stockProblem',
            icon: 'heroicons_outline:user-group',
            title: 'Stock Problems',
            description: 'Manage your existing team and change roles/permissions',
        },
        {
            id: 'returnReason',
            icon: 'heroicons_outline:user-group',
            title: 'Return Reasons',
            description: 'Manage your existing team and change roles/permissions',
        },
    ];
    selectedPanel: string = '';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    showAdverts: boolean;
    currentUser: User | null = null;

    /**
     * Constructor
     */
    constructor(
        private userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private variableService: VariableService,
        private router: Router
    ) {
        variableService.setPageSelected('Lookups');
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

    initPage() {
        this.variableService.showAdverts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((showAdverts) => {
                this.showAdverts = showAdverts;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.selectedPanel = 'company-type';
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
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return id ? this.panels.find(panel => panel.id === id) : '';
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
}
