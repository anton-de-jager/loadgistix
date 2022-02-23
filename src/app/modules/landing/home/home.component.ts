import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { VariableService } from 'app/shared/variable.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent {
    isScreenSmall: boolean;
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

    slides = [{ 'image': 'assets/images/banners/BusinessDirectory.png' }, { 'image': 'assets/images/banners/FleetManagement.png' }];

    constructor(
        public variableService: VariableService,
        private _router: Router
    ) {
    }

    ngOnInit(): void {
    }

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    signIn(): void {
        this._router.navigate(['/sign-in']);
    }

    signUp(): void {
        this._router.navigate(['/sign-up']);
    }

    businessDirectory(): void {
        this._router.navigate(['/businessDirectory']);
    }
}
