/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard'
    },
    {
        id: 'fleet',
        type: 'group',
        icon: 'heroicons_outline:commute',
        title: 'My Fleet',
        children: [
            {
                id: 'fleet.branches',
                link: 'branches',
                type: 'basic',
                icon: 'heroicons_outline:local_shipping',
                title: 'My Branches',
            },
            {
                id: 'fleet.vehicles',
                link: 'vehicles',
                type: 'basic',
                icon: 'heroicons_outline:local_shipping',
                title: 'My Vehicles',
            },
            {
                id: 'fleet.drivers',
                title: 'My Drivers',
                type: 'basic',
                link: 'drivers',
                icon: 'heroicons_outline:settings_accessibility',
            },
        ],
    },
    {
        id: 'load',
        type: 'group',
        icon: 'heroicons_outline:fire_truck',
        title: 'Loads',
        children: [
            {
                id: 'load.loads',
                link: 'loads',
                type: 'basic',
                icon: 'heroicons_outline:shopping_cart',
                title: 'My Loads',
            },
            {
                id: 'load.available',
                link: 'loads-available',
                type: 'basic',
                icon: 'heroicons_outline:add_shopping_cart',
                title: 'Loads Available',
            },
        ],
    },
    {
        id: 'bid',
        type: 'group',
        icon: 'heroicons_outline:back_hand',
        title: 'Bids',
        children: [
            {
                id: 'bid.bids',
                link: 'bids',
                type: 'basic',
                icon: 'heroicons_outline:update',
                title: 'My Bids',
            },
        ],
    },
    {
        id: 'marketing',
        type: 'group',
        icon: 'heroicons_outline:building_storefront',
        title: 'My Business',
        children: [
            {
                id: 'marketing.adverts',
                link: 'adverts',
                type: 'basic',
                icon: 'heroicons_outline:campaign',
                title: 'My Adverts',
            },
            {
                id: 'marketing.directories',
                link: 'directories',
                type: 'basic',
                icon: 'heroicons_outline:fact_check',
                title: 'My Directory Info',
            },
            {
                id: 'marketing.business-directory',
                link: 'business-directory',
                type: 'basic',
                icon: 'heroicons_outline:folder_open',
                title: 'Business Directory',
            },
            // {
            //     id: 'marketing.insurance-quote',
            //     link: 'insurance-quote',
            //     type: 'basic',
            //     icon: 'heroicons_outline:folder_open',
            //     title: 'Get Insurance Quote',
            // },
        ],
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard'
    },
    {
        id: 'fleet',
        type: 'aside',
        icon: 'heroicons_outline:commute',
        title: 'My Fleet',
        children: [],
    },
    {
        id: 'load',
        type: 'aside',
        icon: 'heroicons_outline:fire_truck',
        title: 'Loads',
        children: [],
    },
    {
        id: 'bid',
        icon: 'heroicons_outline:back_hand',
        type: 'aside',
        title: 'Bids',
        children: [],
    },
    {
        id: 'marketing',
        type: 'aside',
        icon: 'heroicons_outline:building_storefront',
        title: 'My Business',
        children: [],
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard'
    },
    {
        id: 'fleet',
        type: 'group',
        icon: 'heroicons_outline:commute',
        title: 'My Fleet',
        children: [],
    },
    {
        id: 'load',
        type: 'group',
        icon: 'heroicons_outline:fire_truck',
        title: 'Loads',
        children: [],
    },
    {
        id: 'bid',
        icon: 'heroicons_outline:back_hand',
        type: 'group',
        title: 'Bids',
        children: [],
    },
    {
        id: 'marketing',
        type: 'group',
        icon: 'heroicons_outline:building_storefront',
        title: 'My Business',
        children: [],
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard'
    },
    {
        id: 'fleet',
        type: 'group',
        icon: 'heroicons_outline:commute',
        title: 'My Fleet',
        children: [],
    },
    {
        id: 'load',
        type: 'group',
        icon: 'heroicons_outline:fire_truck',
        title: 'Loads',
        children: [],
    },
    {
        id: 'bid',
        icon: 'heroicons_outline:back_hand',
        type: 'group',
        title: 'Bids',
        children: [],
    },
    {
        id: 'marketing',
        type: 'group',
        icon: 'heroicons_outline:building_storefront',
        title: 'My Business',
        children: [],
    }
];
