import { Injectable, OnDestroy, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogInfoComponent } from 'app/dialogs/dialog-info/dialog-info.component';
import { LatLng } from 'leaflet';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable, Subject, Subscription, from, map, takeUntil } from 'rxjs';

interface IResizeImageOptions {
    maxSize: number;
    file: File;
}
const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: Infinity,
    maximumAge: 0
};

@Injectable({
    providedIn: 'root',
})
export class VariableService implements OnDestroy  {
    private pageNameSubject = new BehaviorSubject<string>('');
    pageSelected$ = this.pageNameSubject.asObservable();

    private showAdvertsSubject = new BehaviorSubject<boolean>(true);
    showAdverts$ = this.showAdvertsSubject.asObservable();

    private showAdvertsSpacingSubject = new BehaviorSubject<boolean>(true);
    showAdvertsSpacing$ = this.showAdvertsSpacingSubject.asObservable();

    private _unsubscribeAll = new Subject<void>();

    permissinonErrorBusy = false;

    constructor(
        private dialog: MatDialog
    ) { }

    setPageSelected(pageSelected: string) {
        //this.pageNameSubject.next(pageSelected);
    }

    setShowAdverts(showAdverts: boolean) {
        Preferences.get({ key: 'layout' }).then((_layout) => {
            if (_layout.value === 'centered'
                || _layout.value === 'enterprise'
                || _layout.value === 'material'
                || _layout.value === 'modern') {
                this.showAdvertsSpacingSubject.next(false);
            } else {
                this.showAdvertsSpacingSubject.next(true);
            }
            this.showAdvertsSubject.next(window.innerWidth > 600 ? showAdverts : false);
        });
    }

    resizeImage = (settings: IResizeImageOptions): Promise<string> => {
        const file = settings.file;
        const maxSize = settings.maxSize;
        const reader = new FileReader();
        const image = new Image();
        const canvas = document.createElement('canvas');
        const dataURItoBlob = (dataURI: string) => {
            const bytes =
                dataURI.split(',')[0].indexOf('base64') >= 0
                    ? atob(dataURI.split(',')[1])
                    : unescape(dataURI.split(',')[1]);
            const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
            const max = bytes.length;
            const ia = new Uint8Array(max);
            for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
            return new Blob([ia], { type: mime });
        };
        const resize = () => {
            let width = image.width;
            let height = image.height;

            if (width > height) {
                if (width > maxSize) {
                    height *= maxSize / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width *= maxSize / height;
                    height = maxSize;
                }
            }

            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d')!.drawImage(image, 0, 0, width, height);
            let dataUrl = canvas.toDataURL('image/jpeg');
            return dataUrl; //dataURItoBlob(dataUrl);
        };

        return new Promise((ok, no) => {
            if (!file.type.match(/image.*/)) {
                no(new Error('Not an image'));
                return;
            }

            reader.onload = (readerEvent: any) => {
                image.onload = () => ok(resize());
                image.src = readerEvent.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    blobToFile = (theBlob: Blob, fileName: string): File => {
        var b: any = theBlob;
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;

        //Cast to a File() type
        return <File>theBlob;
    };

    checkLocationPermissions(showError: boolean): Promise<boolean> {
        var promise = new Promise<boolean>(async (resolve) => {
            try {

                navigator.geolocation.getCurrentPosition(success => {
                    // console.log(success);
                }, error => {
                    console.log(error);
                });

                const geolocationEnabled = await Geolocation.checkPermissions();
                if (geolocationEnabled.location !== 'granted') {
                    if (Capacitor.getPlatform() !== 'web') {
                        const granted = await Geolocation.requestPermissions();
                        if (granted.location !== 'granted') {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    } else {
                        if (showError && !this.permissinonErrorBusy) {
                            this.permissinonErrorBusy = true;
                            this.showInfo(
                                'ERROR',
                                'Permissinon Error',
                                'Please enable location on browser',
                                false
                            ).then(async (showInfoResult) => {
                                const geolocationEnabledNow =
                                    await Geolocation.checkPermissions();
                                if (
                                    geolocationEnabledNow.location !== 'granted'
                                ) {
                                    this.permissinonErrorBusy = false;
                                    resolve(false);
                                } else {
                                    this.permissinonErrorBusy = false;
                                    resolve(true);
                                }
                            });
                        } else {
                            resolve(false);
                        }
                    }
                } else {
                    resolve(true);
                }
            } catch (exception) {
                resolve(false);
            }
        });
        return promise;
    }

    showInfo(
        title: string,
        alertHeading: string,
        alertContent: string,
        stopAction: boolean
    ): Promise<boolean> {
        var promise = new Promise<boolean>((resolve) => {
            try {
                const dialogConfig = new MatDialogConfig();
                dialogConfig.data = {
                    title: title,
                    alertHeading: alertHeading,
                    alertContent: alertContent,
                    stopAction: stopAction,
                };

                dialogConfig.autoFocus = true;
                dialogConfig.disableClose = true;
                dialogConfig.hasBackdrop = true;

                const dialogRef = this.dialog.open(
                    DialogInfoComponent,
                    dialogConfig
                );

                if (stopAction) {
                    resolve(false);
                } else {
                    dialogRef
                        .afterClosed()

                        .pipe(takeUntil(this._unsubscribeAll)).subscribe((result) => {
                            resolve(result);
                        });
                    setTimeout(() => {
                        this._unsubscribeAll.next();
                        this._unsubscribeAll.complete();
                    }, 100);
                }
            } catch (exception) {
                resolve(false);
            }
        });
        return promise;
    }

    get() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: Position) => {
                if (position) {
                    //this.lat = position.coords.latitude;
                    //this.lng = position.coords.longitude;
                    //this.getAddress = (this.lat, this.lng)
                }
            });
        }
    }

    getPosition(): Promise<Position | null> {
        var promise = new Promise<Position | null>(async (resolve) => {
            try {
                const coordinates = await Geolocation.getCurrentPosition(
                    options
                );
                resolve(coordinates);
            } catch (exception) {
                resolve(null);
            }
        });
        return promise;
    }

    requestPermission(): Promise<string> {
        var promise = new Promise<string>(async (resolve) => {
            try {
                const status = await Geolocation.requestPermissions();
                resolve(status.location);
            } catch (exception) {
                resolve('none');
            }
        });
        return promise;
    }

    toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    calculateDistance(pos1: LatLng, pos2: LatLng) {
        const R = 6371e3; // radius of Earth in meters
        const lat1Rad = this.toRadians(pos1.lat);
        const lat2Rad = this.toRadians(pos2.lat);
        const deltaLat = this.toRadians(pos2.lat - pos1.lat);
        const deltaLon = this.toRadians(pos2.lng - pos1.lng);

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1Rad) *
            Math.cos(lat2Rad) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distanceInMeters = R * c;
        const distanceInKilometers = distanceInMeters / 1000;
        const distanceInMiles = distanceInMeters / 1609.344;

        return {
            meters: distanceInMeters,
            kilometers: distanceInKilometers,
            miles: distanceInMiles,
        };
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
