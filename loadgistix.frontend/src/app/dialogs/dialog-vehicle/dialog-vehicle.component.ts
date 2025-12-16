import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy, inject,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Address } from 'app/models/address';
import { VariableService } from 'app/services/variable.service';
import { vehicleType } from 'app/models/vehicleType.model';
import { DialogImageUploadComponent } from '../dialog-image-upload/dialog-image-upload.component';

// import * as turf from '@turf/turf';
import { CommonModule, NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SortPipe } from 'app/pipes/sort.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { environment } from 'environments/environment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { forEach } from 'lodash';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NominatimService, NominatimResult } from 'app/services/nominatim.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { model } from 'app/models/model.model';
import { make } from 'app/models/make.model';
import { vehicleCategory } from 'app/models/vehicleCategory.model';
import { bodyType } from 'app/models/bodyType.model';
import { bodyLoad } from 'app/models/bodyLoad.model';
import { SqlService } from 'app/services/sql.service';
import { Guid } from 'guid-typescript';
import { DialogMakeComponent } from '../dialog-make/dialog-make.component';
import { DialogModelComponent } from '../dialog-model/dialog-model.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { extractApiData } from 'app/services/api-response.helper';
import { GuidHelper } from 'app/services/guid.helper';

@Component({
    selector: 'dialog-vehicle',
    templateUrl: 'dialog-vehicle.component.html',
    standalone: true,
    imports: [MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, MatDialogModule, MatDatepickerModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatAutocompleteModule, CommonModule, NgClass, NgFor, NgForOf, NgIf, SortPipe, NgxMatSelectSearchModule],
    providers: [SortPipe],
    encapsulation: ViewEncapsulation.None
})
export class DialogVehicleComponent implements OnDestroy, OnInit, AfterViewInit {
    mapsActive = false;
    timestamp: number = 0;
    form!: FormGroup;
    formErrors: any;
    formValid!: boolean;
    private _unsubscribeAll = new Subject<void>();
    previewImage: string | null = null;
    fileToUpload: string | null = null;
    avatarChanged = false;
    id: string | null = null;
    loadingOriginatingAddress: boolean = false;
    loadingDistinationAddress: boolean = false;
    loadingSubmit: boolean = false;
    loading: boolean = false;
    location: Address = { lat: 0, lon: 0, label: '' };
    imagesFolder = environment.apiImage;

    vehicleCategoryList: any[] = [];
    vehicleTypeList: any[] = [];
    bodyTypeList: any[] = [];
    bodyLoadList: any[] = [];

    makeIdSearch = new FormControl();
    modelIdSearch = new FormControl();

    filteredMakeList: any[] = [];
    filteredModelList: any[] = [];

    // Nominatim autocomplete
    originatingSuggestions: NominatimResult[] = [];
    destinationSuggestions: NominatimResult[] = [];
    private originatingSearchSubject = new Subject<string>();
    private destinationSearchSubject = new Subject<string>();
    private originatingUserInputPrefix: string = '';
    private destinationUserInputPrefix: string = '';

    constructor(
        @Inject(MatDialog) private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogVehicleComponent>,
        private _fuseConfirmationService: FuseConfirmationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _snackBar: MatSnackBar,
        private variableService: VariableService,
        private sqlService: SqlService,
        private _formBuilder: FormBuilder,
        private nominatimService: NominatimService
    ) {
        console.log('data', data);
        this.timestamp = new Date().getTime();
        this.formErrors = data.formErrors;
        this.id = data.item ? (data.item.id ? data.item.id : data.item.id) : null;
        this._unsubscribeAll = new Subject();
        this.filteredMakeList = data.makeList;
        this.filteredModelList = data.modelList;
    }
    ngOnDestroy(): void {
        this.loadingSubmit = false;
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void {
        this.form = this.data.form;
        this.formValid = false;
        // Removed duplicate initAutocomplete call - it's called in ngAfterViewInit
        this.makeIdSearch.valueChanges.subscribe((value) => {
            this.filteredMakeList = this.filterMakes(value);
        });
        this.modelIdSearch.valueChanges.subscribe((value) => {
            this.filteredModelList = this.filterModels(value);
        });
        // this.data.vehicleCategoryList.forEach(
        //   (vehicleCategoryItem: { vehicleTypeList: any; id: any }) => {
        //     vehicleCategoryItem.vehicleTypeList = this.data.vehicleTypeList
        //       .filter(
        //         (x: { vehicleCategoryId: any }) =>
        //           x.vehicleCategoryId == vehicleCategoryItem.id
        //       )
        //       .sort((a: { description: string }, b: { description: any }) =>
        //         a.description.localeCompare(b.description)
        //       );
        //     this.vehicleCategoryList.push(vehicleCategoryItem);
        //   }
        // );

        setTimeout(() => {
            this.vehicleTypeChanged();
            this.bodyLoadChanged();
            this.bodyTypeChanged();
            this.makeChanged();
            this.modelChanged();
            this.vehicleCategoryChanged();
            this.branchChanged();
        }, 100);
    }

    getErrors() {
        console.log(this.form);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.initAutocomplete();
        }, 100);
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
                : this.avatarChanged ? this.fileToUpload : this.form.value.avatar ? this.imagesFolder + 'Vehicles/' + this.form.value.id + this.form.value.avatar + '?t=' + this.timestamp : 'assets/images/no-image.png',
        };

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(
            DialogImageUploadComponent,
            dialogConfig
        );

        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result: string | null) => {
            if (result !== null) {
                this.avatarChanged = true;
                this.fileToUpload = result;
                this.form.value.fileToUpload = result;
            }
        });
    }

    initAutocomplete() {
        // Subscribe to originating address search
        this.nominatimService.createAutocompleteObservable(this.originatingSearchSubject, 'za')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(results => {
                this.originatingSuggestions = results;
            });

        // Subscribe to destination address search
        this.nominatimService.createAutocompleteObservable(this.destinationSearchSubject, 'za')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(results => {
                this.destinationSuggestions = results;
            });
    }

    onOriginatingInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        // Extract potential house number from the beginning of the input
        const houseNumberMatch = value.match(/^(\d+[a-zA-Z]?)\s+/);
        this.originatingUserInputPrefix = houseNumberMatch ? houseNumberMatch[1] : '';
        this.originatingSearchSubject.next(value);
    }

    onDestinationInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        // Extract potential house number from the beginning of the input
        const houseNumberMatch = value.match(/^(\d+[a-zA-Z]?)\s+/);
        this.destinationUserInputPrefix = houseNumberMatch ? houseNumberMatch[1] : '';
        this.destinationSearchSubject.next(value);
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

    onDestinationSelected(event: any): void {
        const selectedResult = event.option.value as NominatimResult;
        if (selectedResult) {
            let formattedAddress = this.nominatimService.formatAddress(selectedResult);
            // Add the user's house number prefix if not already there
            if (this.destinationUserInputPrefix && !formattedAddress.startsWith(this.destinationUserInputPrefix)) {
                const hasHouseNumber = /^\d+[a-zA-Z]?\s/.test(formattedAddress);
                if (!hasHouseNumber) {
                    formattedAddress = `${this.destinationUserInputPrefix} ${formattedAddress}`;
                }
            }
            this.form.controls['destinationAddressLabel'].setValue(formattedAddress);
            this.form.controls['destinationAddressLat'].setValue(parseFloat(selectedResult.lat));
            this.form.controls['destinationAddressLon'].setValue(parseFloat(selectedResult.lon));
            this.destinationSuggestions = [];
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

    getFormattedDestinationAddress(result: NominatimResult): string {
        let formatted = this.nominatimService.formatAddress(result);
        if (this.destinationUserInputPrefix && !formatted.startsWith(this.destinationUserInputPrefix)) {
            const hasHouseNumber = /^\d+[a-zA-Z]?\s/.test(formatted);
            if (!hasHouseNumber) {
                formatted = `${this.destinationUserInputPrefix} ${formatted}`;
            }
        }
        return formatted;
    }

    vehicleCategoryChanged() {
        if (this.form.value.vehicleCategoryId) {
            this.form.controls['vehicleCategoryDescription'].setValue(
                this.getVehicleCategoryDescription(this.form.value.vehicleCategoryId)
            );
            setTimeout(() => {
                console.log('form.value.vehicleCategoryId', this.form.value.vehicleCategoryId);
            }, 100);
        }
    }
    getVehicleCategoryDescription(val: Guid): string {
        return this.data.vehicleCategoryList.find((x: vehicleCategory) => x['id'] == val)
            .description;
    }
    isPowder(): boolean {
        let bodyLoad = this.form ? this.getBodyLoadDescription(this.form.value.bodyLoadId) : '';
        return bodyLoad == '' ? false : (bodyLoad.toLowerCase().indexOf('powder') >= 0);
    }
    calculateSideLength(volume: number): number {
        const sideLength = Math.pow(volume, 1 / 3);
        return Math.round(sideLength);
    }

    filterMakes(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.data.makeList.filter((makeItem) => makeItem.description.toLowerCase().includes(filterValue));
    }
    initAddMake(event: PointerEvent) {
        event.stopPropagation();

        let form = this._formBuilder.group({
            id: undefined,
            description: [null, Validators.required]
        });

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
            item: null,
            form: form,
            makeList: [],
            title: 'Insert'
        }

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.hasBackdrop = true;

        const dialogRef = this.dialog.open(DialogMakeComponent,
            dialogConfig);


        dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            if (result !== false) {
                switch (result.action) {
                    case 'insert':
                        this.sqlService.createItem('makes', result.value).pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult) => {
                            const newItem = extractApiData(apiResult.data);
                            if (newItem) {
                                this.data.makeList.push(newItem);
                                this.form.controls['makeId'].setValue(newItem.id);
                            }
                        });
                        break;
                    default:
                        break;
                }
            }
        })
    }

    filterModels(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.data.modelList.filter((modelItem) => modelItem.description.toLowerCase().includes(filterValue));
    }
    initAddModel(event) {
        event.stopPropagation();

        if (this.form.controls['makeId'].value) {
            let form = this._formBuilder.group({
                id: null,
                makeId: [this.form.controls['makeId'].value, Validators.required],
                makeDescription: [this.getMakeDescription(this.form.controls['makeId'].value), Validators.required],
                description: [null, Validators.required],
            });

            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
                item: null,
                form: form,
                makeList: this.data.makeList,
                modelList: this.data.modelList,
                title: 'Insert'
            }

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            dialogConfig.hasBackdrop = true;

            const dialogRef = this.dialog.open(DialogModelComponent,
                dialogConfig);


            dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                if (result !== false) {
                    switch (result.action) {
                        case 'insert':
                            this.sqlService.createItem('models', result.value).pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult) => {
                                const newItem = extractApiData(apiResult.data);
                                if (newItem) {
                                    this.data.modelList.push(newItem);
                                    this.form.controls['modelId'].setValue(newItem.id);
                                }
                            });
                            break;
                        default:
                            break;
                    }
                }
            })
        }
    }

    vehicleTypeChanged() {
        if (this.form.value.vehicleTypeId) {
            this.form.controls['vehicleTypeDescription'].setValue(
                this.getVehicleTypeDescription(this.form.value.vehicleTypeId)
            );
        }
    }
    getVehicleTypeDescription(val: Guid): string {
        return this.data.vehicleTypeList.find((x: vehicleType) => x['id'] == val)
            .description;
    }

    getBodyLoadLiquid(): boolean {
        let bodyLoadId = this.form.controls['bodyLoadId'].value;
        return this.data.bodyLoadList.find((x: bodyLoad) => x['id'] == bodyLoadId) ? this.data.bodyLoadList.find((x: bodyLoad) => x['id'] == bodyLoadId).liquid : false;
    }

    makeChanged() {
        if (this.form.value.makeId) {
            this.form.controls['makeDescription'].setValue(
                this.getMakeDescription(this.form.value.makeId)
            );
        }
    }
    modelChanged() {
        if (this.form.value.modelId) {
            this.form.controls['modelDescription'].setValue(
                this.getModelDescription(this.form.value.modelId)
            );
        }
    }
    getMakeDescription(val: Guid): string {
        return this.data.makeList.find((x: make) => x['id'] == val)
            .description;
    }
    getModelDescription(val: Guid): string {
        return this.data.modelList.find((x: model) => x['id'] == val)
            .description;
    }

    bodyTypeChanged() {
        if (this.form.value.bodyTypeId) {
            this.form.controls['bodyTypeDescription'].setValue(
                this.getBodyTypeDescription(this.form.value.bodyTypeId)
            );
        }
    }
    bodyLoadChanged() {
        if (this.form.value.bodyLoadId) {
            this.form.controls['bodyLoadDescription'].setValue(
                this.getBodyLoadDescription(this.form.value.bodyLoadId)
            );
        }
        if (this.getBodyLoadLiquid() || this.isPowder()) {
            this.form.controls['liquid'].setValue(!this.isPowder());
            this.form.controls['maxLoadHeight'].clearValidators();
            this.form.controls['maxLoadWidth'].clearValidators();
            this.form.controls['maxLoadLength'].clearValidators();
            this.form.controls['availableCapacity'].clearValidators();
            this.form.controls['maxLoadVolume'].setValidators([Validators.required]);
        } else {
            this.form.controls['liquid'].setValue(false);
            this.form.controls['maxLoadHeight'].setValidators([Validators.required]);
            this.form.controls['maxLoadWidth'].setValidators([Validators.required]);
            this.form.controls['maxLoadLength'].setValidators([Validators.required]);
            this.form.controls['availableCapacity'].setValidators([
                Validators.required,
            ]);
            this.form.controls['maxLoadVolume'].clearValidators();
        }
        // setTimeout(() => {
        this.form.controls['maxLoadHeight'].updateValueAndValidity();
        this.form.controls['maxLoadWidth'].updateValueAndValidity();
        this.form.controls['maxLoadLength'].updateValueAndValidity();
        this.form.controls['availableCapacity'].updateValueAndValidity();
        this.form.controls['maxLoadVolume'].updateValueAndValidity();
        // }, 100);
    }
    branchChanged() {
        if (this.form.value.branchId) {
            this.form.controls['branchDescription'].setValue(
                this.getBranchDescription(this.form.value.branchId)
            );
        }
    }

    getBodyTypeDescription(val: Guid): string {
        return this.data.bodyTypeList.find((x: model) => x['id'] == val)
            .description ?? '';
    }
    getBodyLoadDescription(val: Guid): string {
        return this.data.bodyLoadList.find((x: model) => x['id'] == val) ?
            this.data.bodyLoadList.find((x: model) => x['id'] == val).description :
            '';
    }
    getBranchDescription(val: Guid): string {
        return this.data.branchList.find((x: model) => x['id'] == val)
            .description;
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.form.controls[controlName].hasError(errorName);
    };

    onDeleteClick(): void {
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
        confirmation.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
            if (result === 'confirmed') {
                this.sqlService.deleteItem('vehicles', id).pipe(takeUntil(this._unsubscribeAll)).subscribe((apiResult: any) => {
                    this.sqlService.delete('vehicle', id).pipe(takeUntil(this._unsubscribeAll)).subscribe(event => {
                        this.dialogRef.close(false);
                    })
                });
            }
        });
    }
    getStatus(): void {
    }
    onNoClick(): void {
        this.dialogRef.close(false);
    }
    onYesClick(): void {
        // this.form.controls['availableFrom'].setValue(
        //     new Date(this.form.value.availableFrom)
        // );
        // this.form.controls['availableTo'].setValue(
        //     new Date(this.form.value.availableTo)
        // );
        if (this.isPowder()) {
            let side = this.calculateSideLength(this.form.controls['maxLoadVolume'].value);
            this.form.controls['maxLoadHeight'].setValue(side);
            this.form.controls['maxLoadWidth'].setValue(side);
            this.form.controls['maxLoadLength'].setValue(side);
        }
        this.dialogRef.close({
            form: this.form.value,
            fileToUpload: this.fileToUpload,
        });
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
