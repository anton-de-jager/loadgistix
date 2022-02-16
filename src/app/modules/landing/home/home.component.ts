import { Component, ViewEncapsulation } from '@angular/core';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { VariableService } from 'app/shared/variable.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'landing-home',
    templateUrl  : './home.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent
{
    yearlyBilling: boolean = true;
    isScreenSmall: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    navigation: FuseNavigationItem[] = [
        {
            id: 'home',
            title: 'Home',
            type: 'basic',
            icon: 'heroicons_outline:home',
            link: '/home'
        },
        {
            id: 'business-directory',
            title: 'Business Directory',
            type: 'basic',
            icon: 'heroicons_outline:chart-pie',
            link: '/business-directory'
        }
    ]

    slides = [{'image': 'assets/images/banners/BusinessDirectory.png'}, {'image': 'assets/images/banners/FleetManagement.png'}];
    
    constructor(
        private _fuseNavigationService: FuseNavigationService,
        public variableService: VariableService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {
    }
    ngOnInit(): void
    {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }
    
    /**
     * Getter for current year
     */
     get currentYear(): number
     {
         return new Date().getFullYear();
     }
}
