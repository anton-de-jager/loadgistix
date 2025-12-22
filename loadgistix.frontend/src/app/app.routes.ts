import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboard'
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'undefined', pathMatch: 'full', redirectTo: 'sign-out' },

    // Redirect signed-in user to the '/dashboard'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') },
            {
                path: 'business-directory-open',
                loadChildren: () =>
                    import(
                        'app/modules/admin/business-directory/business-directory.routes'
                    ),
            }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes') },
            {
                path: 'terms-and-conditions',
                loadChildren: () =>
                    import('app/modules/landing/terms-and-conditions/terms-and-conditions.routes'),
            },
            {
                path: 'privacy-policy',
                loadChildren: () =>
                    import('app/modules/landing/privacy-policy/privacy-policy.routes'),
            },
            {
                path: 'quote',
                loadChildren: () =>
                    import('app/modules/landing/quote-view/quote-view.routes'),
            },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.routes') },
            {
                path: 'branches',
                loadChildren: () =>
                    import('app/modules/admin/branches/branches.routes'),
            },
            {
                path: 'vehicles',
                loadChildren: () =>
                    import('app/modules/admin/vehicles/vehicles.routes'),
            },
            {
                path: 'drivers',
                loadChildren: () =>
                    import('app/modules/admin/drivers/drivers.routes'),
            },
            {
                path: 'loads',
                loadChildren: () =>
                    import('app/modules/admin/loads/loads.routes'),
            },
            {
                path: 'loads-available',
                loadChildren: () =>
                    import(
                        'app/modules/admin/loads-available/loads-available.routes'
                    ),
            },
            {
                path: 'bids',
                loadChildren: () =>
                    import('app/modules/admin/bids/bids.routes'),
            },
            {
                path: 'adverts',
                loadChildren: () =>
                    import('app/modules/admin/adverts/adverts.routes'),
            },
            {
                path: 'directories',
                loadChildren: () =>
                    import('app/modules/admin/directories/directories.routes'),
            },
            {
                path: 'business-directory',
                loadChildren: () =>
                    import(
                        'app/modules/admin/business-directory/business-directory.routes'
                    ),
            },
            {
                path: 'profile',
                loadChildren: () =>
                    import('app/modules/admin/profile/profile.routes'),
            },
            {
                path: 'account',
                loadChildren: () =>
                    import('app/modules/admin/account/account.routes'),
            },
            {
                path: 'account-delete',
                loadChildren: () =>
                    import('app/modules/admin/account-delete/account-delete.routes'),
            },
            {
                path: 'lookups',
                loadChildren: () =>
                    import('app/modules/admin/lookups/lookups.routes'),
            },
            // {
            //     path: 'tms',
            //     loadChildren: () =>
            //         import('app/modules/admin/tms/tms.routes'),
            // },
        ]
    }
];
