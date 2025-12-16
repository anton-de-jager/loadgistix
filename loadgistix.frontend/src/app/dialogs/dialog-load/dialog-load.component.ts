/* eslint-disable no-var */
import { Component, Inject, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VariableService } from 'app/services/variable.service';
import { DialogImageUploadComponent } from '../dialog-image-upload/dialog-image-upload.component';
import { loadType } from 'app/models/loadType.model';
import { load } from 'app/models/load.model';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletMarkerClusterModule } from "@asymmetrik/ngx-leaflet-markercluster";
import * as L from 'leaflet';
import { User } from 'app/core/user/user.types';
import { StarRatingColor, StarRatingComponent } from 'app/layout/common/star-rating/star-rating.component';
import { UserService } from 'app/core/user/user.service';
import { SqlService } from 'app/services/sql.service';
import { fuseAnimations } from '@fuse/animations';
import { CommonModule, NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { environment } from 'environments/environment';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { SortPipe } from 'app/pipes/sort.pipe';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogBidComponent } from '../dialog-bid/dialog-bid.component';
import { DialogReviewComponent } from '../dialog-review/dialog-review.component';
import { QuillEditorComponent } from 'ngx-quill';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NominatimService, NominatimResult } from 'app/services/nominatim.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddressLabelPipe } from 'app/pipes/address-label.pipe';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Guid } from 'guid-typescript';
import { AuthService } from 'app/core/auth/auth.service';
import { loadDestination } from 'app/models/loadDestination.model';
import { Router } from '@angular/router';
import { GuidHelper } from 'app/services/guid.helper';

const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 25000,
    maximumAge: 0
};
const iconDefault = L.icon({
    iconRetinaUrl: 'assets/images/marker-icon-2x.png',
    iconUrl: 'assets/images/marker-icon.png',
    shadowUrl: 'assets/images/marker-shadow.png',
    iconSize: [200, 200],
    iconAnchor: [12, 50],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [50, 50]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
    selector: 'dialog-load',
    templateUrl: 'dialog-load.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [MatIconModule, MatProgressSpinnerModule, QuillEditorComponent, MatTooltipModule, MatSnackBarModule, MatDialogModule, MatDatepickerModule, MatButtonModule, FormsModule,
        ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatAutocompleteModule, AddressLabelPipe,
        CommonModule, NgClass, NgFor, NgForOf, NgIf, StarRatingComponent, SortPipe, LeafletModule, LeafletMarkerClusterModule, MatListModule],
})
export class DialogLoadComponent implements OnDestroy, OnInit, AfterViewInit {
    destinationItemsChanged = false;
    imagesFolder = environment.apiImage;

    user$!: Observable<User | null>;

    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            [{ align: [] }],
            ['clean'],
        ],
    };

    loading: boolean = true;
    private map!: L.Map;
    private previewMap!: L.Map;
    private tiles: L.TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
    private previewTiles: L.TileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: ''
    })
    private markers!: L.MarkerClusterGroup;
    private previewMarkers!: L.MarkerClusterGroup;
    mapsActive = false;
    timestamp: number = 0;
    form!: FormGroup;
    formRating!: FormGroup;
    formBid!: FormGroup;
    formErrors: any;
    formValid!: boolean;
    private _unsubscribeAll = new Subject<void>();
    previewImage: string | null = null;
    fileToUpload: any;
    readOnly: boolean = false;
    bidRow!: any;
    starColor: StarRatingColor = StarRatingColor.accent;
    starColorP: StarRatingColor = StarRatingColor.primary;
    starColorW: StarRatingColor = StarRatingColor.warn;
    avatarChanged = false;
    dateToday = new Date();
    mapReady: boolean = false;
    iLoaded = 0;
    id: string | null = null;
    showMap: boolean = false;
    showPreviewMap: boolean = false;
    @ViewChild('target') private myScrollContainer: ElementRef;
    loadDestinationItems: loadDestination[] = [];
    loadDestinationCurrent: loadDestination;
    initLoadDestinations = true;
    currentUser: User | null = null;

    scrollToElement(el): void {
        this.myScrollContainer.nativeElement.scroll({
            top: this.myScrollContainer.nativeElement.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });
    }

    // Nominatim autocomplete
    originatingSuggestions: NominatimResult[] = [];
    destinationSuggestionsMap: Map<number, NominatimResult[]> = new Map();
    private originatingSearchSubject = new Subject<string>();
    private destinationSearchSubjects: Map<number, Subject<string>> = new Map();
    private originatingUserInputPrefix: string = '';
    private destinationUserInputPrefixes: Map<number, string> = new Map();

    constructor(
        private router: Router,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogLoadComponent>,
        private _fuseConfirmationService: FuseConfirmationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private userService: UserService,
        private sqlService: SqlService,
        private variableService: VariableService,
        private nominatimService: NominatimService) {
        this.loadDestinationItems = data.loadDestinationItems;
        this.loadDestinationCurrent = data.loadDestinationCurrent;
        this.readOnly = data.readOnly == 1 ? true : false;
        if (this.data.readOnly == 1) {
            this.showMap = true;
            this.delay(100).then(res => {
                // Remove existing map instance if it exists
                if (this.map) {
                    this.map.off();
                    this.map.remove();
                }
                this.map = L.map('map-load');
            });
            this.bidRow = data.item;
        }
        this.timestamp = new Date().getTime();
        this.formErrors = data.formErrors;
        this.id = data.item ? data.item.id : null;
        this._unsubscribeAll = new Subject();
        this.userService.user$.subscribe(user => {
            if (user) {
                this.currentUser = user;
            }
        });

        setTimeout(() => {
            //console.log('id', this.id);
            //console.log('data', this.data);
        }, 1000);
    }
    ngOnDestroy(): void {
        this.loading = false;

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        if (this.map) {
            this.map.off();
            this.map.remove();
        }
        if (this.previewMap) {
            this.previewMap.off();
            this.previewMap.remove();
        }
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;
        this.loading = false;
        this.loadTypeChanged();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.init();
        }, 100);
    }

    init(){
        if (this.initLoadDestinations) {
            this.mapReady = true;
            if (this.data.readOnly == 1) {
                this.bidRow = this.data.item;
                this.initMap(this.data.item);
            } else {
                this.initAutocomplete();
            }
        }else{
            setTimeout(() => {
                this.init();
            }, 100);
        }
    }

    getCurrentDestinationString(): string {
        return this.loadDestinationCurrent ? this.loadDestinationCurrent.destinationAddressLabel : '';
    }

    getCurrentLoadDestinationId(): Guid {
        return this.loadDestinationCurrent ? this.loadDestinationCurrent.id : null;
    }


    async viewLocation() {
        if (Capacitor.getPlatform() !== 'web') {
            const geolocationEnabled = await Geolocation.checkPermissions();

            if (geolocationEnabled.location !== 'granted') {
                const granted = await Geolocation.requestPermissions();

                if (granted.location !== 'granted') {
                    return;
                }
            }
        }
        Geolocation.getCurrentPosition(options).then((res) => {
            let lat = this.loadDestinationItems.filter(x => x.status == 'Open' || x.status == 'Accepted').length > 0 ? this.loadDestinationItems.filter(x => x.status == 'Open' || x.status == 'Accepted').sort((a, b) => a.pos - b.pos)[0].destinationAddressLat : ''
            let lon = this.loadDestinationItems.filter(x => x.status == 'Open' || x.status == 'Accepted').length > 0 ? this.loadDestinationItems.filter(x => x.status == 'Open' || x.status == 'Accepted').sort((a, b) => a.pos - b.pos)[0].destinationAddressLon : ''
            let url =
                'https://www.google.com/maps/dir/' +
                res.coords.latitude +
                ',' +
                res.coords.longitude +
                '/' +
                lat +
                ',' +
                lon +
                '/data=!3m1!4b1!4m2!4m1!3e0';
            Browser.open({ url });
        });
    }

    uploadImage(event: Event) {
        event.preventDefault();
        const dialogConfig = new MatDialogConfig();

        dialogConfig.data = {
            title: 'Upload Image',
            message: 'Please select an image to upload',
            roundCropper: false,
            croppedImage: this.avatarChanged
                ? this.form.value.fileToUpload
                : this.avatarChanged ? this.fileToUpload : this.form.value.avatar ? this.imagesFolder + 'Loads/' + this.form.value.id + this.form.value.avatar + '?t=' + this.timestamp : 'assets/images/no-image.png',
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(
            DialogImageUploadComponent,
            dialogConfig
        );

        dialogRef.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result: string | null) => {
                if (result !== null) {
                    this.avatarChanged = true;
                    this.fileToUpload = result;
                    this.form.value.fileToUpload = result;
                }
            })
    }

    initAutocomplete() {
        // Subscribe to originating address search
        this.nominatimService.createAutocompleteObservable(this.originatingSearchSubject, 'za')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(results => {
                this.originatingSuggestions = results;
            });

        this.initAutocompleteDestinations();
    }

    onOriginatingInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        // Extract potential house number from the beginning of the input
        const houseNumberMatch = value.match(/^(\d+[a-zA-Z]?)\s+/);
        this.originatingUserInputPrefix = houseNumberMatch ? houseNumberMatch[1] : '';
        this.originatingSearchSubject.next(value);
    }

    onOriginatingSelected(event: any): void {
        const selectedResult = event.option.value as NominatimResult;
        if (selectedResult) {
            let formattedAddress = this.nominatimService.formatAddress(selectedResult);
            // Add the user's house number prefix if not already there
            if (this.originatingUserInputPrefix && !formattedAddress.startsWith(this.originatingUserInputPrefix)) {
                const hasHouseNumber = /^\d+[a-zA-Z]?\s/.test(formattedAddress);
                if (!hasHouseNumber) {
                    formattedAddress = `${this.originatingUserInputPrefix} ${formattedAddress}`;
                }
            }
            this.form.controls['originatingAddressLabel'].setValue(formattedAddress);
            this.form.controls['originatingAddressLat'].setValue(parseFloat(selectedResult.lat));
            this.form.controls['originatingAddressLon'].setValue(parseFloat(selectedResult.lon));
            this.originatingSuggestions = [];
        }
    }

    getFormattedOriginatingAddress(result: NominatimResult): string {
        let formatted = this.nominatimService.formatAddress(result);
        if (this.originatingUserInputPrefix && !formatted.startsWith(this.originatingUserInputPrefix)) {
            const hasHouseNumber = /^\d+[a-zA-Z]?\s/.test(formatted);
            if (!hasHouseNumber) {
                formatted = `${this.originatingUserInputPrefix} ${formatted}`;
            }
        }
        return formatted;
    }

    initAutocompleteDestinations() {
        this.destinationItemsChanged = true;
        Object.keys(this.form.controls).forEach(key => {
            if (key.includes('destinationAddressLabel')) {
                this.form.removeControl(key);
            }
            if (key.includes('destinationAddressLat')) {
                this.form.removeControl(key);
            }
            if (key.includes('destinationAddressLon')) {
                this.form.removeControl(key);
            }
        });
        
        setTimeout(() => {
            if (this.loadDestinationItems.length > 0) {
                this.loadDestinationItems.sort(x => x.pos).forEach(loadDestinationItem => {
                    this.form.addControl('destinationAddressLabel' + loadDestinationItem.pos, this._formBuilder.control(loadDestinationItem.destinationAddressLabel, Validators.required));
                    this.form.addControl('destinationAddressLat' + loadDestinationItem.pos, this._formBuilder.control(loadDestinationItem.destinationAddressLat, Validators.required));
                    this.form.addControl('destinationAddressLon' + loadDestinationItem.pos, this._formBuilder.control(loadDestinationItem.destinationAddressLon, Validators.required));

                    // Create a search subject for this destination
                    const searchSubject = new Subject<string>();
                    this.destinationSearchSubjects.set(loadDestinationItem.pos, searchSubject);
                    this.destinationSuggestionsMap.set(loadDestinationItem.pos, []);

                    // Subscribe to search for this destination
                    this.nominatimService.createAutocompleteObservable(searchSubject, 'za')
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(results => {
                            this.destinationSuggestionsMap.set(loadDestinationItem.pos, results);
                        });
                });
                this.loading = false;
                // Initialize preview map after destinations are loaded
                this.initPreviewMap();
            } else {
                this.loading = false;
            }
        }, 100);
    }

    onDestinationInput(event: Event, pos: number): void {
        const value = (event.target as HTMLInputElement).value;
        // Extract potential house number from the beginning of the input
        const houseNumberMatch = value.match(/^(\d+[a-zA-Z]?)\s+/);
        this.destinationUserInputPrefixes.set(pos, houseNumberMatch ? houseNumberMatch[1] : '');
        const searchSubject = this.destinationSearchSubjects.get(pos);
        if (searchSubject) {
            searchSubject.next(value);
        }
    }

    onDestinationSelected(event: any, pos: number): void {
        const selectedResult = event.option.value as NominatimResult;
        if (selectedResult) {
            let formattedAddress = this.nominatimService.formatAddress(selectedResult);
            const userPrefix = this.destinationUserInputPrefixes.get(pos) || '';
            // Add the user's house number prefix if not already there
            if (userPrefix && !formattedAddress.startsWith(userPrefix)) {
                const hasHouseNumber = /^\d+[a-zA-Z]?\s/.test(formattedAddress);
                if (!hasHouseNumber) {
                    formattedAddress = `${userPrefix} ${formattedAddress}`;
                }
            }
            
            this.destinationItemsChanged = true;
            this.loadDestinationItems[pos].pos = pos;
            this.loadDestinationItems[pos].destinationAddressLabel = formattedAddress;
            this.loadDestinationItems[pos].destinationAddressLat = parseFloat(selectedResult.lat);
            this.loadDestinationItems[pos].destinationAddressLon = parseFloat(selectedResult.lon);

            this.form.controls['destinationAddressLabel' + pos].setValue(formattedAddress);
            this.form.controls['destinationAddressLat' + pos].setValue(parseFloat(selectedResult.lat));
            this.form.controls['destinationAddressLon' + pos].setValue(parseFloat(selectedResult.lon));
            
            this.destinationSuggestionsMap.set(pos, []);
        }
    }

    getDestinationSuggestions(pos: number): NominatimResult[] {
        return this.destinationSuggestionsMap.get(pos) || [];
    }

    getFormattedDestinationAddress(result: NominatimResult, pos: number): string {
        let formatted = this.nominatimService.formatAddress(result);
        const userPrefix = this.destinationUserInputPrefixes.get(pos) || '';
        if (userPrefix && !formatted.startsWith(userPrefix)) {
            const hasHouseNumber = /^\d+[a-zA-Z]?\s/.test(formatted);
            if (!hasHouseNumber) {
                formatted = `${userPrefix} ${formatted}`;
            }
        }
        return formatted;
    }

    initAutocompleteDestination() {
        this.destinationItemsChanged = true;
        this.loadDestinationItems.push({
            loadId: null,
            pos: this.loadDestinationItems.length,
            originatingAddressLabel: null,
            originatingAddressLat: null,
            originatingAddressLon: null,
            destinationAddressLabel: '',
            destinationAddressLat: 0,
            destinationAddressLon: 0,
            odoStart: null,
            odoEnd: null,
            deliveryNoteNumber: null,
            weighBridgeTicketNumber: null,
            returnDocumentNumber: null,
            returnKgs: null,
            returnReasonId: null,
            stockProblemId: null,
            returnPallets: null,
            userIdDelivered: null,
            userIdDeliveredConfirmed: null,
            createdOn: null,
            changedOn: null,
            status: null
        });
        this.initAutocompleteDestinations();
    }

    removeDestination(i: number) {
        //this.loading = true;
        this.loadDestinationItems.forEach(loadDestinationItem => {
            if (loadDestinationItem.pos > i) {
                loadDestinationItem.pos--;
            }
        });
        this.loadDestinationItems.splice(i, 1);
        this.destinationItemsChanged = true;
        this.initAutocompleteDestinations();
    }

    getIcon(str: string, status: string, bidCount: number) {
        let url: string = '';
        switch (status) {
            case 'Open': url = 'assets/images/' + str + '-' + (bidCount > 0 ? 'bids' : 'open') + '.png'; break;
            case 'Bid(s) Placed': url = 'assets/images/' + str + '-bids.png'; break;
            case 'Accepted': url = 'assets/images/' + str + '-accepted.png'; break;
            case 'Loaded': url = 'assets/images/' + str + '-loaded.png'; break;
            case 'Loaded Confirmed': url = 'assets/images/' + str + '-loaded-confirmed.png'; break;
            case 'Delivered': url = 'assets/images/' + str + '-delivered.png'; break;
            case 'Delivered Confirmed': url = 'assets/images/' + str + '-delivered-confirmed.png'; break;
            default: url = 'assets/images/' + str + '-open.png'; break;
        }

        if (str == 'origin') {
            return L.icon({
                iconRetinaUrl: url,
                iconUrl: url,
                shadowUrl: '',
                iconSize: [50, 50],
                iconAnchor: [25, 50],
                popupAnchor: [1, -50],
                tooltipAnchor: [25, -34],
                shadowSize: [50, 50]
            });
        } else {
            return L.icon({
                iconRetinaUrl: url,
                iconUrl: url,
                shadowUrl: '',
                iconSize: [42, 50],
                iconAnchor: [12, 50],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                shadowSize: [50, 50]
            });
        }
    }
    getColor(status: string, bidCount: number) {
        switch (status) {
            case 'Open': return (bidCount > 0 ? '#f8a407' : '#5db1de');
            case 'Bid(s) Placed': return '#f8a407';
            case 'Accepted': return '#00ff00';
            case 'Loaded': return '#fba7ed';
            case 'Loaded Confirmed': return '#ff05d5';
            case 'Delivered': return '#000000';
            case 'Delivered Confirmed': return '#b3b3b3';
            default: return '#5db1de';
        }
    }

    getLoadTypeDescription(val: Guid): string {
        return this.data.loadTypeList.find((x: loadType) => x.id == val) ?
            this.data.loadTypeList.find((x: loadType) => x.id == val).description :
            '';
    }
    isPowder(): boolean {
        let loadType = this.form ? this.getLoadTypeDescription(this.form.value.loadTypeId) : '';
        return loadType == '' ? false : (loadType.toLowerCase().indexOf('powder') >= 0);
    }
    calculateSideLength(volume: number): number {
        const sideLength = Math.pow(volume, 1 / 3);
        return Math.round(sideLength);
    }

    getLoadTypeLiquid(val: string): string {
        return this.data.loadTypeList.find((x: loadType) => x.id.toString() == val) ? this.data.loadTypeList.find((x: loadType) => x.id.toString() == val).liquid : false;
    }

    loadTypeChanged() {
        if (this.form.value.loadTypeId) {
            this.form.controls['loadTypeDescription'].setValue(this.data.loadTypeList.find((x: loadType) => x.id == this.form.value.loadTypeId).description);
        }
        if (this.getLoadTypeLiquid(this.form.value.loadTypeId) || this.isPowder()) {
            this.form.controls['liquid'].setValue(!this.isPowder());
            this.form.controls["height"].clearValidators();
            this.form.controls["width"].clearValidators();
            this.form.controls["length"].clearValidators();
            this.form.controls["itemCount"].clearValidators();
            this.form.controls["volume"].setValidators([Validators.required]);
        } else {
            this.form.controls['liquid'].setValue(false);
            this.form.controls["height"].setValidators([Validators.required]);
            this.form.controls["width"].setValidators([Validators.required]);
            this.form.controls["length"].setValidators([Validators.required]);
            this.form.controls["itemCount"].setValidators([Validators.required]);
            this.form.controls["volume"].clearValidators();
        }
        this.form.controls["height"].updateValueAndValidity();
        this.form.controls["width"].updateValueAndValidity();
        this.form.controls["length"].updateValueAndValidity();
        this.form.controls["itemCount"].updateValueAndValidity();
        this.form.controls["volume"].updateValueAndValidity();
    }




    private initMap(item: load): void {
        if (this.mapReady && this.iLoaded < 100 && this.readOnly) {
            if (this.map) {
                this.map.off();
                this.map.remove();
            }

            // this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //     maxZoom: 18,
            //     minZoom: 3,
            //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            // })
            this.map = L.map('map-load', {
                center: [item.originatingAddressLat!, item.originatingAddressLon],
                maxZoom: 18,
                zoom: 14,
                layers: [this.tiles]
            });
            this.markers = L.markerClusterGroup({ animateAddingMarkers: true, showCoverageOnHover: true, zoomToBoundsOnClick: true });

            const waypoints: L.LatLngExpression[] = JSON.parse(item.route.replaceAll('"lat":', '').replaceAll('"lng":', '').replaceAll('{', '[').replaceAll('}', ']')!);

            const points: L.LatLngExpression[] = waypoints.map((coords: any) => L.latLng((coords as [number, number])[0], (coords as [number, number])[1]));
            //polylines.push(L.polyline(points, { color: 'blue', weight: 5 }));
            L.polyline(points, { color: this.getColor(item.status, item.bidCount), weight: 5 }).addTo(this.map);

            var minlat = 200, minlon = 200, maxlat = -200, maxlon = -200;
            if (minlat > item.originatingAddressLat!) minlat = item.originatingAddressLat!;
            if (minlon > item.originatingAddressLon!) minlon = item.originatingAddressLon!;
            if (maxlat < item.originatingAddressLat!) maxlat = item.originatingAddressLat!;
            if (maxlon < item.originatingAddressLon!) maxlon = item.originatingAddressLon!;

            this.markers.addLayer(
                L.marker(new L.LatLng(item.originatingAddressLat!, item.originatingAddressLon!), { icon: this.getIcon('origin', item.status, item.bidCount) })
            );

            this.loadDestinationItems.forEach(loadDestinationItem => {
                if (minlat > loadDestinationItem.destinationAddressLat!) minlat = loadDestinationItem.destinationAddressLat!;
                if (minlon > loadDestinationItem.destinationAddressLon!) minlon = loadDestinationItem.destinationAddressLon!;
                if (maxlat < loadDestinationItem.destinationAddressLat!) maxlat = loadDestinationItem.destinationAddressLat!;
                if (maxlon < loadDestinationItem.destinationAddressLon!) maxlon = loadDestinationItem.destinationAddressLon!;

                this.markers.addLayer(
                    L.marker(new L.LatLng(loadDestinationItem.destinationAddressLat!, loadDestinationItem.destinationAddressLon!), { icon: this.getIcon('destination', item.status, item.bidCount) })
                );
            });
            // if (minlat > item.destinationAddressLat!) minlat = item.destinationAddressLat!;
            // if (minlon > item.destinationAddressLon!) minlon = item.destinationAddressLon!;
            // if (maxlat < item.destinationAddressLat!) maxlat = item.destinationAddressLat!;
            // if (maxlon < item.destinationAddressLon!) maxlon = item.destinationAddressLon!;

            setTimeout(() => {
                this.map.fitBounds(L.latLngBounds(new L.LatLng(minlat, minlon), new L.LatLng(maxlat, maxlon)));
                setTimeout(() => {
                    this.map.zoomOut(1);
                    setTimeout(() => {
                        this.markers.addTo(this.map)
                    }, 100);
                }, 100);
            }, 100);
        } else {
            setTimeout(() => {
                this.iLoaded++;
                this.initMap(item);
            }, 500);
        }
    }

    initPreviewMap(): void {
        // Only show preview map if we have route data and destinations
        if (!this.data.item || !this.data.item.route || this.loadDestinationItems.length === 0) {
            this.showPreviewMap = false;
            return;
        }

        this.showPreviewMap = true;
        
        setTimeout(() => {
            const mapContainer = document.getElementById('map-preview');
            if (!mapContainer) {
                // Map container not ready yet, retry
                setTimeout(() => this.initPreviewMap(), 100);
                return;
            }

            if (this.previewMap) {
                this.previewMap.off();
                this.previewMap.remove();
            }

            const item = this.data.item;
            
            // Create new tile layer for preview map
            const previewTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                minZoom: 3,
                attribution: ''
            });
            
            this.previewMap = L.map('map-preview', {
                center: [item.originatingAddressLat, item.originatingAddressLon],
                maxZoom: 18,
                zoom: 12,
                layers: [previewTiles],
                zoomControl: false,
                attributionControl: false
            });

            // Draw the route polyline
            try {
                const waypoints: L.LatLngExpression[] = JSON.parse(
                    item.route.replaceAll('"lat":', '').replaceAll('"lng":', '').replaceAll('{', '[').replaceAll('}', ']')
                );
                const points: L.LatLngExpression[] = waypoints.map((coords: any) => 
                    L.latLng((coords as [number, number])[0], (coords as [number, number])[1])
                );
                L.polyline(points, { color: '#3b82f6', weight: 5 }).addTo(this.previewMap);
            } catch (e) {
                console.warn('Could not parse route for preview map');
            }

            var minlat = 200, minlon = 200, maxlat = -200, maxlon = -200;
            
            // Add origin marker
            if (item.originatingAddressLat && item.originatingAddressLon) {
                if (minlat > item.originatingAddressLat) minlat = item.originatingAddressLat;
                if (minlon > item.originatingAddressLon) minlon = item.originatingAddressLon;
                if (maxlat < item.originatingAddressLat) maxlat = item.originatingAddressLat;
                if (maxlon < item.originatingAddressLon) maxlon = item.originatingAddressLon;

                L.marker(new L.LatLng(item.originatingAddressLat, item.originatingAddressLon), { 
                    icon: this.getIcon('origin', item.status || 'Open', item.bidCount || 0) 
                }).addTo(this.previewMap);
            }

            // Add destination markers
            this.loadDestinationItems.forEach(loadDestinationItem => {
                if (loadDestinationItem.destinationAddressLat && loadDestinationItem.destinationAddressLon) {
                    if (minlat > loadDestinationItem.destinationAddressLat) minlat = loadDestinationItem.destinationAddressLat;
                    if (minlon > loadDestinationItem.destinationAddressLon) minlon = loadDestinationItem.destinationAddressLon;
                    if (maxlat < loadDestinationItem.destinationAddressLat) maxlat = loadDestinationItem.destinationAddressLat;
                    if (maxlon < loadDestinationItem.destinationAddressLon) maxlon = loadDestinationItem.destinationAddressLon;

                    L.marker(new L.LatLng(loadDestinationItem.destinationAddressLat, loadDestinationItem.destinationAddressLon), { 
                        icon: this.getIcon('destination', item.status || 'Open', item.bidCount || 0) 
                    }).addTo(this.previewMap);
                }
            });

            // Fit bounds to show all markers
            setTimeout(() => {
                if (minlat < 200 && maxlat > -200) {
                    this.previewMap.fitBounds(
                        L.latLngBounds(new L.LatLng(minlat, minlon), new L.LatLng(maxlat, maxlon)),
                        { padding: [20, 20] }
                    );
                }
            }, 100);
        }, 300);
    }

    public hasError = (controlName: string, errorName: string) => {
        if (this.form.controls[controlName]) {
            return this.form.controls[controlName].hasError(errorName);
        } else {
            return false;
        }
    }

    controlExists(i) {
        if (this.form.controls['destinationAddressLabel' + i]) {
            return true;
        } else {
            return false;
        }
    }

    initBid() {
        this.formBid = this._formBuilder.group({
            id: [null],
            userId: [this.currentUser.id],
            userDescription: [this.currentUser == null ? 'n/a' : this.currentUser.name],
            loadId: [this.bidRow.id, Validators.required],
            loadDescription: [this.bidRow.description],
            loadTypeId: [this.bidRow.loadTypeId],
            loadTypeDescription: [this.bidRow.loadTypeDescription],
            vehicleId: [null, Validators.required],
            vehicleDescription: [null],
            vehicleCategoryId: [null],
            vehicleCategoryDescription: [null],
            vehicleTypeId: [null],
            vehicleTypeDescription: [null],
            driverId: [null, Validators.required],
            driverDescription: [null],
            price: [this.bidRow.price, Validators.required],
            dateOut: [this.bidRow.dateOut, Validators.required],
            dateIn: [this.bidRow.dateIn, Validators.required],
            status: ['Open']
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            user: this.currentUser,
            item: this.bidRow,
            form: this.formBid,
            action: 'insert',
            loadList: [this.bidRow],//this.loadList,
            loadDestinationCurrent: this.loadDestinationCurrent,
            liquid: this.bidRow.liquid,
            loadTypeList: this.data.loadTypeList,
            vehicleList: this.data.vehicleList,
            vehicleCategoryList: this.data.vehicleCategoryList,
            vehicleTypeList: this.data.vehicleTypeList,
            driverList: this.data.driverList,
            title: 'Place a'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(DialogBidComponent,
            dialogConfig);


        dialogRef.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result !== false) {
                    this.loading = true;

                    if (result.action == 'submit') {
                        this.sqlService.createItem('bids', result.form)
                            .pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
                                this.dialogRef.close({ action: 'reload' });
                                this.loading = false;

                            })
                    } else {
                        this.loading = false;

                    }
                    // this.apiService.saveItem('bids', result).pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
                    //     this.dialogRef.close(false);
                    //     this.userService.setLoading('dialog-load', false);
                    // }, error => {
                    //     this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                    //     this.userService.setLoading('dialog-load', false);
                    // });
                }
            })
    }

    testUpdate(status: string) {
        let row = this.form.value;
        row.status = status;
        row.loadId = this.loadDestinationCurrent ? this.loadDestinationCurrent.loadId : null;
    }
    updateStatus(status: string) {
        let row = this.form.value;
        if (status === 'Delivered' || status === 'Delivered Confirmed') {
            this.initRating(row, 'Driver', status);
        } else {
            this.loading = true;
            row.status = status;
            row.loadId = this.loadDestinationCurrent.loadId;
            this.sqlService.updateItemTagPost('loads', 'status', { Load: row, LoadDestination: [{ ...row, id: this.loadDestinationCurrent.id, status: status }] })
                .pipe(takeUntil(this._unsubscribeAll)).subscribe({
                    next: (apiResult: any) => {
                        if (apiResult.result == true) {
                            this.dialogRef.close({ action: 'reload' });
                        } else {
                            this._snackBar.open('Error: ' + apiResult.message, undefined, { duration: 2000 });
                            this.loading = false;

                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                        this.loading = false;

                    },
                    complete: () => {
                        //console.log('Done');
                    }
                })
        }
    }
    initRating(row: any, reviewType: string, status: any) {
        this.formRating = this._formBuilder.group({
            loadId: [row.id],
            userId: [row.userId],
            userDescription: [row.userDescription],
            ratingPunctuality: [0],
            ratingVehicleDescription: [0],
            ratingLoadDescription: [0],
            ratingCare: [0],
            ratingCondition: [0],
            ratingPayment: [0],
            ratingAttitude: [0],
            note: ['']
        });

        const dialogConfigRating = new MatDialogConfig();
        dialogConfigRating.data = {
            item: row,
            form: this.formRating,
            reviewType: reviewType,
            title: 'Add'
        }

        dialogConfigRating.autoFocus = true;
        dialogConfigRating.disableClose = true;
        dialogConfigRating.hasBackdrop = true;

        const dialogRefReview = this.dialog.open(DialogReviewComponent,
            dialogConfigRating);

        dialogRefReview.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result !== false) {
                    this.loading = true;

                    this.sqlService.createItem('reviewDrivers', { loadId: row.id, driverId: row.driverId, loadDestinationId: this.getCurrentLoadDestinationId(), ratingPunctuality: result.ratingPunctuality, ratingVehicleDescription: result.ratingVehicleDescription, ratingCare: result.ratingCare, ratingCondition: result.ratingCondition, ratingAttitude: result.ratingAttitude, note: result.note })
                        .pipe(takeUntil(this._unsubscribeAll)).subscribe({
                            next: (apiResultRating: any) => {
                                if (apiResultRating.result == true) {
                                    row.status = status;
                                    row.loadId = this.loadDestinationCurrent.loadId;
                                    this.sqlService.updateItemTagPost('loads', 'status', { Load: row, LoadDestination: [{ ...row, id: this.loadDestinationCurrent.id, status: status }] })
                                        .pipe(takeUntil(this._unsubscribeAll)).subscribe({
                                            next: (apiResult: any) => {
                                                if (apiResult.result == true) {
                                                    this.dialogRef.close({ action: 'reload' });
                                                } else {
                                                    this._snackBar.open('Error: ' + apiResult.message, undefined, { duration: 2000 });
                                                    this.loading = false;

                                                }
                                            },
                                            error: (error) => {
                                                console.log(error);
                                                this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                                                this.loading = false;

                                            },
                                            complete: () => {
                                                //console.log('Done');
                                            }
                                        })
                                } else {
                                    if (apiResultRating.message == 'Expired') {
                                    } else {
                                        this._snackBar.open('Error: ' + apiResultRating.message, undefined, { duration: 2000 });
                                        this.loading = false;

                                    }
                                }
                            },
                            error: (error: string) => {
                                console.log('error', error);
                                this._snackBar.open('Error: ' + error, undefined, { duration: 2000 });
                                this.loading = false;

                            },
                            complete: () => {
                            }
                        })
                }
            })
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    deleteClick(): void {
        this.initDelete(this.id);
    }
    async initDelete(id: any) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete Item',
            message: 'Are you sure you want to delete this item? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });
        confirmation.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
                if (result === 'confirmed') {
                    this.sqlService.deleteItem('loads', id)
                        .pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
                            this.dialogRef.close({ action: 'delete', value: id });
                        })
                }
            })
    }
    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        // this.form.controls['dateIn'].setValue(
        //     new Date(this.form.value.dateIn)
        // );
        // this.form.controls['dateOut'].setValue(
        //     new Date(this.form.value.dateOut)
        // );
        // this.form.controls['dateBidEnd'].setValue(
        //     new Date(this.form.value.dateBidEnd)
        // );
        if (this.form.controls['originatingAddressLat'].value) {
            if (!this.data.item) {
                this.completeSubmit(true);
            } else {
                if (
                    this.data.item.originatingAddressLat.toString() == this.form.controls['originatingAddressLat'].value.toString()
                    && this.data.item.originatingAddressLon.toString() == this.form.controls['originatingAddressLon'].value.toString()
                    && !this.destinationItemsChanged
                    // && this.data.item.destinationAddressLat.toString() == this.form.controls['destinationAddressLat'].value.toString()
                    // && this.data.item.destinationAddressLon.toString() == this.form.controls['destinationAddressLon'].value.toString()
                ) {
                    this.completeSubmit(false);
                } else {
                    this.completeSubmit(true);
                }
            }
        } else {
            this.completeSubmit(false);
        }
    }
    checkMap(): boolean {
        const mapContainer = document.getElementById('map-load');
        if (this.map instanceof L.Map && this.map.getContainer()
            && mapContainer && mapContainer instanceof HTMLElement) {
            return true;
        } else {
            return false;
        }
    }
    // checkMap(): boolean {
    //     const mapContainer = document.getElementById('map-load');
    //     if (this.map instanceof L.Map && this.map.getContainer()) {
    //         console.log("Leaflet map is properly initialized.");
    //         if (mapContainer && mapContainer instanceof HTMLElement) {
    //             console.log("Map container exists");
    //             return true;
    //         } else {
    //             console.log("Map container does not exist");
    //             return false;
    //         }
    //     } else {
    //         console.log("Leaflet map is not properly initialized.");
    //         if (mapContainer && mapContainer instanceof HTMLElement) {
    //             console.log("Map container exists");
    //             return true;
    //         } else {
    //             console.log("Map container does not exist");
    //             return false;
    //         }
    //     }
    // }

    iCheckMap = 0;
    initSubmitWithRoute() {
        this.iCheckMap++;
        if (this.iCheckMap < 10) {
            if (this.checkMap()) {
                this.submitWithRoute();
            } else {
                setTimeout(() => {
                    this.initSubmitWithRoute();
                }, 100);
            }
        } else {
            this.iCheckMap = 0;
        }
    }

    async completeSubmit(routeIncluded: boolean) {
        // this.checkMap();

        if (routeIncluded) {
            this.showMap = true;
            this.delay(100).then(res => {
                // Remove existing map instance if it exists
                if (this.map) {
                    this.map.off();
                    this.map.remove();
                }
                
                // Initialize new map
                this.map = L.map('map-load');
            });
            this.iCheckMap = 0;
            this.initSubmitWithRoute();
        } else {
            if (this.isPowder()) {
                let side = this.calculateSideLength(this.form.controls['volume'].value);
                this.form.controls['height'].setValue(side);
                this.form.controls['width'].setValue(side);
                this.form.controls['length'].setValue(side);
            }
            this.dialogRef.close({ form: this.form, loadDestinationItems: this.loadDestinationItems });
        }
    }

    submitWithRoute() {
        const delayLoop = (fn, delay) => {
            return (x, i) => {
                setTimeout(() => {
                    fn(x);
                }, i * delay);
            };
        };

        const lat1 = this.form.controls['originatingAddressLat'].value;
        const lon1 = this.form.controls['originatingAddressLon'].value;

        this.scrollToElement(this.myScrollContainer);
        this.loading = true;

        let waypoints: L.LatLng[] = [new L.LatLng(lat1, lon1)];
        this.loadDestinationItems.forEach(loadDestinationItem => {
            waypoints.push(new L.LatLng(loadDestinationItem.destinationAddressLat!, loadDestinationItem.destinationAddressLon!));

            this.loadDestinationItems[loadDestinationItem.pos].originatingAddressLabel = loadDestinationItem.pos == 0 ? this.form.controls['originatingAddressLabel'].value : this.loadDestinationItems[loadDestinationItem.pos - 1].destinationAddressLabel;
            this.loadDestinationItems[loadDestinationItem.pos].originatingAddressLat = loadDestinationItem.pos == 0 ? this.form.controls['originatingAddressLat'].value : this.loadDestinationItems[loadDestinationItem.pos - 1].destinationAddressLat;
            this.loadDestinationItems[loadDestinationItem.pos].originatingAddressLon = loadDestinationItem.pos == 0 ? this.form.controls['originatingAddressLon'].value : this.loadDestinationItems[loadDestinationItem.pos - 1].destinationAddressLon;
        });

        setTimeout(() => {
            L.Routing.control({
                waypoints: waypoints,
                routeWhileDragging: true,
                show: false,
                fitSelectedRoutes: "smart"
            }).on('routesfound', async (e) => {
                const routes = e.routes;
                const summary = routes[0].summary;
                this.form.controls['meters'].setValue(summary.totalDistance);
                this.form.controls['minutes'].setValue(summary.totalTime / 60);
                this.form.controls['route'].setValue(JSON.stringify(routes[0].coordinates));

                if (this.isPowder()) {
                    let side = this.calculateSideLength(this.form.controls['volume'].value);
                    this.form.controls['height'].setValue(side);
                    this.form.controls['width'].setValue(side);
                    this.form.controls['length'].setValue(side);
                }

                this.dialogRef.close({ form: this.form, loadDestinationItems: this.loadDestinationItems });
            }).addTo(this.map);
        }, 100);

        /*
        let waypoint: L.LatLng;
        let t = this.loadDestinationItems.length;
        let i = 0;
        this.loadDestinationItems.forEach(delayLoop(loadDestinationItem => {
            let waypoints: L.LatLng[];
            if (i == 0) {
                waypoints = [new L.LatLng(lat1, lon1)];
            } else {
                waypoints = [waypoint];
            }
            waypoints.push(new L.LatLng(loadDestinationItem.destinationAddressLat!, loadDestinationItem.destinationAddressLon!));
            waypoint = new L.LatLng(loadDestinationItem.destinationAddressLat!, loadDestinationItem.destinationAddressLon!);

            L.Routing.control({
                waypoints: waypoints,
                routeWhileDragging: true,
                show: false,
                fitSelectedRoutes: "smart"
            }).on('routesfound', async (e) => {
                const routes = e.routes;
                const summary = routes[0].summary;
                console.log(e, summary);
                this.form.controls['meters'].setValue(summary.totalDistance);
                this.form.controls['minutes'].setValue(summary.totalTime / 60);
                this.form.controls['route'].setValue(JSON.stringify(routes[0].coordinates));

                loadDestinationItem.meters = summary.totalDistance;
                loadDestinationItem.minutes = summary.totalTime / 60;
                loadDestinationItem.route = JSON.stringify(routes[0].coordinates);

                // await this.delay(50);
                console.log(i, loadDestinationItem);
                if (i == t) {
                    setTimeout(() => {
                        console.log(i, this.loadDestinationItems);
                        this.dialogRef.close({ form: this.form, loadDestinationItems: this.loadDestinationItems });
                    }, 100);
                }
                i++;
            }).addTo(this.map);
        }, 100));
        */

    }

    check() {
        console.log(this.form.value);
        console.log(this.form);
    }

    /**
     * Helper method to compare GUIDs in a case-insensitive manner
     * @param guid1 First GUID
     * @param guid2 Second GUID
     * @returns True if GUIDs match (case-insensitive)
     */
    guidsEqual(guid1: string | null | undefined, guid2: string | null | undefined): boolean {
        return GuidHelper.equals(guid1, guid2);
    }
}
