import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, inject, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VariableService } from 'app/services/variable.service';
import { directoryCategory } from 'app/models/directoryCategory.model';
import { environment } from 'environments/environment';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { Guid } from 'guid-typescript';
import { directory } from 'app/models/directory.model';
import { Clipboard } from '@capacitor/clipboard';
import { Toast } from '@capacitor/toast';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogDirectoryDetailComponent } from 'app/dialogs/dialog-directory-detail/dialog-directory-detail.component';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { animate, style, transition, trigger } from '@angular/animations';
import { Geolocation } from '@capacitor/geolocation';
import { DialogImageComponent } from 'app/dialogs/dialog-image/dialog-image.component';
import { SqlService } from 'app/services/sql.service';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { EllipsisPipe } from 'app/pipes/elipsis.pipe';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import * as L from 'leaflet';
import { MatCardModule } from '@angular/material/card';
import { DirectoryComponent } from 'app/layout/common/directory/directory.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key';
import { SortPipe } from 'app/pipes/sort.pipe';
import { MatSelectModule } from '@angular/material/select';
import "leaflet.bouncemarker";
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

const iconDefault = L.icon({
    iconRetinaUrl: 'assets/images/marker-icon-2x.png',
    iconUrl: 'assets/images/marker-icon.png',
    shadowUrl: 'assets/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 25000,
    maximumAge: 0
};

export interface Section {
    name: string;
    count: number;
}

@Component({
    selector: 'business-directory',
    templateUrl: './business-directory.component.html',
    styleUrls: ['./business-directory.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, DirectoryComponent, LeafletModule, MatCardModule, EllipsisPipe,
        MatBadgeModule, MatSnackBarModule, MatTableModule, MatPaginatorModule, MatSortModule,
        MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule,
        FormsModule, ReactiveFormsModule, NgIf, MatMenuModule, RouterLink, MatDividerModule,
        TextFieldModule, NgFor, MatRippleModule, SortPipe, MatSelectModule,
        MatCheckboxModule, NgClass, MatDatepickerModule, FuseFindByKeyPipe, DatePipe],
    providers: [SortPipe],
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({ height: 0, opacity: 0 }),
                        animate('1s ease-out',
                            style({ height: "*", opacity: 1 }))
                    ]
                ),
                transition(
                    ':leave',
                    [
                        style({ height: 0, opacity: 1 }),
                        animate('1s ease-in',
                            style({ height: 0, opacity: 0 }))
                    ]
                )
            ]
        )
    ]
})
export class BusinessDirectoryComponent implements OnInit, AfterViewInit, OnDestroy {
    // public auth: Auth = inject(Auth);
    loading: boolean = true;

    private map!: L.Map;
    private tiles!: L.TileLayer;
    lat: number = -26.330647;
    lon: number = 28.107455;
    mapReady: boolean = false;
    // @ViewChild('directoryCategoryItemsPanelOrigin') private _directoryCategoryItemsPanelOrigin: ElementRef;
    @ViewChild('categorySelectionPanel') private _directoryCategoryItemsPanel: TemplateRef<any>;
    directoryCategoryList: directoryCategory[] = [];
    tagsEditMode: boolean = false;
    directoryCategoryItemsFiltered: directoryCategory[] = [];
    private _directoryCategoryItemsPanelOverlayRef: OverlayRef;


    private _unsubscribeAll = new Subject<void>();

    categorySelection: Guid[] = [];
    directoryCategoryListOriginal!: directoryCategory[];
    directoryItems: directory[] = [];
    directoryItemsOriginal: directory[] = [];
    screenSize: number = window.innerWidth;
    directoryCategoryDescription: string = '';
    id: Guid | null = null;

    isScreenSmall!: boolean;
    itemSelected = false;

    count: number = 0;
    scrollIndex = 0;
    timestamp: number = 0;
    imagesFolder = environment.apiImage;

    showList: boolean = false;
    distance: number = 10;
    rangeItems: any[] = [
        { description: '10km', value: 10 },
        { description: '50km', value: 50 },
        { description: '100km', value: 100 },
        { description: '500km', value: 500 },
        { description: 'ALL', value: 100000 },
    ]
    currentUser: User | null = null;

    locationAvailable = false;

    constructor(
        private sqlService: SqlService,
        private _snackBar: MatSnackBar,
        public variableService: VariableService,
        private userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _viewContainerRef: ViewContainerRef,
        private _overlay: Overlay,
        private dialog: MatDialog,
        private router: Router
    ) {
        variableService.setPageSelected('Business Directory');
        if (this.router.url.indexOf('business-directory-open') < 0) {
            this.userService.user$.subscribe(user => {
                if (user) {
                    this.currentUser = user;
                    this.initPage();
                }
            });
        } else {
            this.initPage();
        }

        setTimeout(() => {
            if (this.router.url.indexOf('business-directory-open') < 0) {
                if (!this.currentUser) {
                    this.router.navigate(['/sign-out']);;
                }
            }
        }, 2000);


        this.timestamp = new Date().getTime();
    }

    initPage() {
        this.getDirectoriesByDistance().then(getDirectoriesByDistanceResult => {
            this.directoryItemsOriginal = getDirectoriesByDistanceResult;
            const result = getDirectoriesByDistanceResult.reduce((acc, item) => {
                const found = acc.find(x => x.id === item.directoryCategoryId);

                if (found) {
                    found.directoryCount++;
                } else {
                    acc.push({
                        id: item.directoryCategoryId,
                        description: item.directoryCategoryDescription,
                        changedOn: item.changedOn,
                        directoryCount: 1,
                    });
                }

                return acc;
            }, []);


            this.directoryCategoryListOriginal = JSON.parse(JSON.stringify(result));
            this.directoryCategoryList = result;
            this.directoryCategoryItemsFiltered = result;
            this.loading = false;

        });
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.openMenu();
            let inputElement = document.getElementById('menu-trigger');
            inputElement.click();
        }, 500);
    }

    markerItems: L.Marker[] = [];
    updateMap() {
        this.directoryItems = JSON.parse(JSON.stringify(this.directoryItemsOriginal));
        var minlat = 200, minlon = 200, maxlat = -200, maxlon = -200;
        this.directoryItems.forEach(row => {
            if (this.categorySelection.indexOf(row.directoryCategoryId) >= 0) {
                const myIcon = L.icon({
                    iconUrl: row.avatar ? (this.imagesFolder + 'Directories/' + row.id + row.avatar + '?t=' + this.timestamp) : 'assets/images/no-image.jpg',
                    iconSize: [60, 45],
                    className: 'drop-shadow-2xl rounded-full', // Class for the CSS animation
                });

                if (minlat > row.addressLat!) minlat = row.addressLat!;
                if (minlon > row.addressLon!) minlon = row.addressLon!;
                if (maxlat < row.addressLat!) maxlat = row.addressLat!;
                if (maxlon < row.addressLon!) maxlon = row.addressLon!;

                const marker = new L.Marker([row.addressLat, row.addressLon],
                    {
                        icon: myIcon,
                        bounceOnAdd: true,
                        bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
                        bounceOnAddCallback: function () { console.log("done"); }
                    }).on('click', () => { this.showItem(row); })
                this.markerItems.push(marker);
            }
        });

        setTimeout(() => {
            if (this.markerItems.length > 0) {
                this.map.fitBounds(L.latLngBounds(new L.LatLng(minlat, minlon), new L.LatLng(maxlat, maxlon)));
                setTimeout(() => {
                    this.markerItems.forEach(item => {
                        item.addTo(this.map);
                    })
                }, 500);
            }
        }, 1000);

        //});
    }

    getMarker() {
        return L.circleMarker([this.lat, this.lon], {
            color: '#003e3e',
            fillOpacity: 0.6,
            fillColor: '#4ca3a3',
            className: 'pulse',
            weight: 2,
            radius: 3 + this.map.getZoom() / 4
        });
    }

    async getCurrentLocation() {
        this.variableService.checkLocationPermissions(false).then(async permission => {
            if (permission) {
                this.locationAvailable = true;
                this.variableService.getPosition().then(coordinates => {
                    this.lat = coordinates!.coords.latitude;
                    this.lon = coordinates!.coords.longitude;
                    this.initMap();
                });
            } else {
                this.locationAvailable = false;
                // this.variableService.showInfo('ERROR', 'Permission Error', 'Location needs to be enabled for this feature', true).then(showInfoResult => {
                //     this.initMap();
                // });
            }
        });

    }

    requestPermission() {
        if (Capacitor.getPlatform() !== 'web') {
            this.variableService.requestPermission().then(location => {
                if (location == 'granted') {
                }
            });
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.mapReady = true;
            this.initMap();
            // this.openCategorySelectionPanel();
            this.getCurrentLocation();
        }, 100);
    }

    private initMap(): void {
        const data: any[] = [];
        if (this.mapReady) {
            if (this.map) {
                this.map.off();
                this.map.remove();
            }

            this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                minZoom: 3,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            })
            const container = document.getElementById('map');
            if (container) {
                this.map = L.map('map', {
                    center: [this.lat!, this.lon],
                    maxZoom: 18,
                    zoom: 14,
                    layers: [this.tiles]
                });
            }
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this.loading = false;

        if (this.map) {
            this.map.off();
            this.map.remove();
        }

    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.directoryCategoryList = this.directoryCategoryListOriginal.filter(x => x.description!.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0);
    }

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    getDirectoriesByDistance(): Promise<any[]> {
        var promise = new Promise<any[]>((resolve) => {
            try {
                this.variableService.getPosition().then(coordinates => {
                    this.lat = coordinates!.coords.latitude;
                    this.lon = coordinates!.coords.longitude;

                    this.sqlService.getItemsTag(this.currentUser, 'directories', 'distance', { lat: this.lat, lon: this.lon, distance: this.distance }).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                        next: (apiResult: any) => {
                            if (apiResult.data == "Unauthorised") {
                                this.router.navigate(['/sign-out']);;
                            } else {
                                if (apiResult.result == true) {
                                    resolve(apiResult.data);
                                } else {
                                    resolve([]);
                                }
                            }
                        },
                        error: (error) => {
                            console.log('error', error);
                            this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                            resolve([]);
                        },
                        complete: () => {
                        }
                    });
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }
    getDirectoryCategories(): Promise<directoryCategory[]> {
        var promise = new Promise<directoryCategory[]>((resolve) => {
            try {
                this.sqlService.getItemsTag(this.currentUser, 'directoryCategories', 'available', { distance: this.distance }).pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.data == "Unauthorised") {
                            this.router.navigate(['/sign-out']);;
                        } else {
                            if (apiResult.result == true) {
                                resolve(apiResult.data);
                            }
                        }
                    },
                    error: (error) => {
                        console.log('error', error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                    },
                    complete: () => {
                    }
                });
            } catch (exception) {
                resolve([]);
            }
        });
        return promise;
    }

    goto(item: directoryCategory) {
        this.loading = true;

        // this.variableService.menuSelected = item.description;
        this.id = item.id;
        //this.initDetail(item.id);
    }

    goHome() {
        this.router.navigate(['/home']);
    }

    initDetail(id: Guid) {
        if (id!) {
            this.count = 0;
            this.scrollIndex = 0;
            this.getDirectories().then(getDirectoriesResult => {
                this.loading = false;

                this.count = getDirectoriesResult.length > 0 ? getDirectoriesResult[0].count : 0;
                if (getDirectoriesResult.length > 0) {
                    this.directoryItems = getDirectoriesResult;
                    this.directoryCategoryDescription = this.directoryItems[0].directoryCategoryDescription;
                    this.itemSelected = true;
                } else {
                    this.itemSelected = false;
                }
            });
        }
    }


    onScrollDown(ev: any) {
        // if (!this.loading && this.scrollIndex + 10 < this.count) {
        //   this.loading = true;

        //   this.scrollIndex += 10;
        //   this.getDirectories().then(getDirectoriesResult => {
        //     this.directoryItems = this.directoryItems.concat(getDirectoriesResult);
        //     this.count = this.directoryItems.length > 0 ? this.directoryItems[0].count : 0;
        //     this.loading = false;

        //   });
        // }
    }


    getDirectories(): Promise<directory[]> {
        var promise = new Promise<directory[]>((resolve) => {
            try {
                this.sqlService.getDirectories(this.id, 0)
                    .pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
                        if (apiResult.result == true) {
                            resolve(apiResult.data);
                        } else {
                            resolve([]);
                        }
                    });
            } catch (exception) {
                console.log(exception);
                resolve([]);
            }
        });
        return promise;
    }

    copyToClipboard(str: any) {
        Clipboard.write({
            string: str
        });
        Toast.show({
            text: 'Copied Successfully'
        });
    }

    showItem(item: any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            directoryItem: item
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';
        // dialogConfig.width = "600px";
        dialogConfig.maxWidth = "90vw";

        const dialogRef = this.dialog.open(DialogDirectoryDetailComponent,
            dialogConfig);
    }

    getAddressSubstring(str: string, char: string) {
        let arr = str ? (str.split(char) ? str.split(char) : '') : '';
        return arr.length > 1 ? arr[0] + ',' + arr[1] : str;
    }

    navigateExternal(event: Event, url: string) {
        event.preventDefault();
        if (Capacitor.isNativePlatform()) {
            Browser.open({ url });
        } else {
            window.open(url, '_blank');
        }
    }

    async viewLocation(item: directory) {
        if (Capacitor.getPlatform() !== 'web') {
            const geolocationEnabled = await Geolocation.checkPermissions();

            if (geolocationEnabled.location !== 'granted') {
                const granted = await Geolocation.requestPermissions();

                if (granted.location !== 'granted') {
                    return;
                }
            }
        }
        Geolocation.getCurrentPosition(options).then(res => {
            let url = 'https://www.google.com/maps/dir/' + res.coords.latitude + ',' + res.coords.longitude + '/' + item.addressLat + ',' + item.addressLon + '/data=!3m1!4b1!4m2!4m1!3e0';
            Browser.open({ url });
        });
    }

    viewImage(avatar: string) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            avatar: avatar
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;
        dialogConfig.ariaLabel = 'fffff';

        this.dialog.open(DialogImageComponent,
            dialogConfig);
    }

    back() {
        // this.variableService.menuSelected = '';
    }

    openMenu() {
        this.directoryCategoryItemsFiltered = this.directoryCategoryList;
    }
    /**
       * Open directoryCategoryList panel
       */
    // openCategorySelectionPanel(): void {
    //   // Create the overlay
    //   this._directoryCategoryItemsPanelOverlayRef = this._overlay.create({
    //     backdropClass: '',
    //     hasBackdrop: true,
    //     scrollStrategy: this._overlay.scrollStrategies.block(),
    //     positionStrategy: this._overlay.position()
    //       .flexibleConnectedTo(this._directoryCategoryItemsPanelOrigin.nativeElement)
    //       .withFlexibleDimensions(true)
    //       .withViewportMargin(64)
    //       .withLockedPosition(true)
    //       .withPositions([
    //         {
    //           originX: 'start',
    //           originY: 'bottom',
    //           overlayX: 'start',
    //           overlayY: 'top',
    //         },
    //       ]),
    //   });

    //   // Subscribe to the attachments observable
    //   this._directoryCategoryItemsPanelOverlayRef.attachments().pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
    //     // Focus to the search input once the overlay has been attached
    //     this._directoryCategoryItemsPanelOverlayRef.overlayElement.querySelector('input').focus();
    //   });

    //   // // Create a portal from the template
    //   // const templatePortal = new TemplatePortal(this._directoryCategoryItemsPanel, this._viewContainerRef);
    //   // // Attach the portal to the overlay
    //   // this._directoryCategoryItemsPanelOverlayRef.attach(templatePortal);

    //   // // Subscribe to the backdrop click
    //   // this._directoryCategoryItemsPanelOverlayRef.backdropClick().pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
    //   //   // If overlay exists and attached...
    //   //   if (this._directoryCategoryItemsPanelOverlayRef && this._directoryCategoryItemsPanelOverlayRef.hasAttached()) {
    //   //     // Detach it
    //   //     this._directoryCategoryItemsPanelOverlayRef.detach();

    //   //     // Reset the directoryCategoryItem filter
    //   //     this.directoryCategoryItemsFiltered = this.directoryCategoryList;

    //   //     // Toggle the edit mode off
    //   //     this.tagsEditMode = false;
    //   //   }

    //   //   // If template portal exists and attached...
    //   //   if (templatePortal && templatePortal.isAttached) {
    //   //     // Detach it
    //   //     templatePortal.detach();
    //   //   }
    //   // });
    // }

    /**
     * Toggle the directoryCategoryList edit mode
     */
    toggleCategorySelectionEditMode(): void {
        this.tagsEditMode = !this.tagsEditMode;
    }

    changeListVisibility() {
        this.showList = !this.showList;
    }
    /**
     * Filter directoryCategoryList
     *
     * @param event
     */
    filterCategorySelection(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the directoryCategoryList
        this.directoryCategoryItemsFiltered = this.directoryCategoryList.filter(directoryCategoryItem => directoryCategoryItem.description.toLowerCase().includes(value));
    }

    changeRange() {
        this.initPage();
    }

    /**
     * Filter directoryCategoryList input key down event
     *
     * @param event
     */
    filterCategorySelectionInputKeyDown(event): void {
        // Return if the pressed key is not 'Enter'
        if (event.key !== 'Enter') {
            return;
        }

        // If there is no directoryCategoryItem available...
        if (this.directoryCategoryItemsFiltered.length === 0) {
            // Create the directoryCategoryItem
            this.createCategoryItem(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a directoryCategoryItem...
        const directoryCategoryItem = this.directoryCategoryItemsFiltered[0];
        const isCategoryItemApplied = this.directoryCategoryList.find(item => item.id === directoryCategoryItem.id);

        // If the found directoryCategoryItem is already applied to the task...
        if (isCategoryItemApplied) {
            // Remove the directoryCategoryItem from the task
            this.deleteCategoryItemFromTask(directoryCategoryItem);
        }
        else {
            // Otherwise add the directoryCategoryItem to the task
            this.addCategoryItemToTask(directoryCategoryItem);
        }
    }

    /**
     * Create a new directoryCategoryItem
     *
     * @param description
     */
    createCategoryItem(item: directoryCategory): void {
        this.addCategoryItemToTask(item);
    }

    /**
     * Add directoryCategoryItem to the task
     *
     * @param directoryCategoryItem
     */
    addCategoryItemToTask(directoryCategoryItem: directoryCategory): void {
        // Add the directoryCategoryItem
        this.categorySelection.unshift(directoryCategoryItem.id);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete directoryCategoryItem from the task
     *
     * @param directoryCategoryItem
     */
    deleteCategoryItemFromTask(directoryCategoryItem: directoryCategory): void {
        // Remove the directoryCategoryItem
        this.categorySelection.splice(this.categorySelection.findIndex(item => item === directoryCategoryItem.id), 1);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle task directoryCategoryItem
     *
     * @param directoryCategoryItem
     */
    toggleTaskCategoryItem(directoryCategoryItem: directoryCategory): void {
        if (this.categorySelection.includes(directoryCategoryItem.id)) {
            this.deleteCategoryItemFromTask(directoryCategoryItem);
        }
        else {
            this.addCategoryItemToTask(directoryCategoryItem);
        }
        // setTimeout(() => {
        //   this.updateMap();
        // }, 500);
    }
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
