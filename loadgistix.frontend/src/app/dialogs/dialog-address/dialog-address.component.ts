// import { Component, OnInit, AfterViewInit, Inject, ViewEncapsulation, OnDestroy, inject } from '@angular/core';
// import * as L from 'leaflet';
// import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
// import { DialogInfoComponent } from 'app/dialogs/dialog-info/dialog-info.component';
// import { VariableService } from 'app/services/variable.service';
// import { Address } from 'app/models/address';
// // import { NativeGeocoder } from '@capgo/nativegeocoder';
// import { NgIf } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { environment } from 'environments/environment';
// import { Subject, Subscription } from 'rxjs';

// const iconRetinaUrl = 'assets/images/origin-blue.png';
// const shadowUrl = '';
// const iconDefault = L.icon({
//   iconRetinaUrl,
//   iconUrl: 'assets/images/origin-blue.png',
//   shadowUrl,
//   iconSize: [33, 43],
//   iconAnchor: [16, 43],
//   shadowAnchor: [12, 53],
//   popupAnchor: [1, -34],
//   tooltipAnchor: [16, -28],
//   shadowSize: [43, 53]
// });
// const iconFrom = L.icon({
//   iconRetinaUrl,
//   iconUrl: 'assets/images/origin-blue.png',
//   shadowUrl,
//   iconSize: [50, 50],
//   iconAnchor: [25, 50],
//   popupAnchor: [1, -50],
//   tooltipAnchor: [25, -34],
//   shadowSize: [50, 50]
// });
// const iconTo = L.icon({
//   iconRetinaUrl,
//   iconUrl: 'assets/images/destination-green.png',
//   shadowUrl,
//   iconSize: [42, 50],
//   iconAnchor: [12, 50],
//   popupAnchor: [1, -34],
//   tooltipAnchor: [16, -28],
//   shadowSize: [50, 50]
// });
// const options: any = {
//   componentRestrictions: { country: 'za' },
//   useLocale: true,
//   maxResults: 1,
//   apiKey: environment.apiKey
// };
// @Component({
//   selector: 'app-address',
//   templateUrl: './dialog-address.component.html',
//   styleUrls: ['./dialog-address.component.scss'],
//   standalone: true,
//   imports: [MatIconModule, MatDialogModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf],
//   encapsulation: ViewEncapsulation.None
// })
// export class DialogAddressComponent implements OnDestroy, OnInit, AfterViewInit {
//   private _unsubscribeAll = new Subject<void>();
//   mapsActive = false;
//   private map!: L.Map;
//   location: Address = { lat: 0, lon: 0, label: '' };
//   loaded = false;
//   loading = false;
//   lat2!: number;
//   lon2!: number;
//   control: string = '';

//   constructor(
//     private dialog: MatDialog,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     public dialogRef: MatDialogRef<DialogAddressComponent>,
//     private variableService: VariableService
//   ) {
//     if (data) {
//       this.location.lat = data.lat;
//       this.location.lon = data.lon;
//       this.location.label = data.label;
//       this.lat2 = data.lat2;
//       this.lon2 = data.lon2;
//       this.control = data.control;
//       this.loaded = true;
//     }
//   }
//   ngOnDestroy(): void {
//     this.loaded = true;
//     this.loading = false;

//     this._unsubscribeAll.next();
//     this._unsubscribeAll.complete();
//   }

//   ngOnInit(): void {
//   }

//   ngAfterViewInit(): void {
//     setTimeout(() => {
//       //this.initMap();
//       this.initAutocomplete();
//     }, 100);
//   }

//   private initMap(): void {
//     this.map = L.map('map', {
//       center: [this.location.lat, this.location.lon],
//       zoom: 14
//     });

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       maxZoom: 18,
//       minZoom: 3,
//       attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//     }).addTo(this.map);

//     L.marker(new L.LatLng(this.location.lat, this.location.lon), { icon: iconDefault }).addTo(this.map);
//   }

//   async current() {
//     this.map.remove();
//     this.variableService.checkLocationPermissions(true).then(permission => {
//       this.mapsActive = permission;
//       if (permission) {
//         this.variableService.getPosition().then(res => {
//           this.location.lat = res!.coords.latitude;
//           this.location.lon = res!.coords.longitude;

//           options.latitude = this.location.lat;
//           options.longitude = this.location.lon;
//           //@capgo/nativegeocoder
//           // NativeGeocoder.reverseGeocode(options)
//           //   .then((result: any) => console.log(JSON.stringify(result[0])))
//           //   .catch((error: any) => console.log(error));


//           this.initMap();
//           this.initAutocomplete();
//         });
//       } else {
//         // this.showInfo('ERROR', 'Permission Error', 'Location needs to be enabled for this feature', false).then(showInfoResult => {
//         this.dialogRef.close(null);
//         // });
//       }
//     });
//     // this.clearWatch();
//     // this.getCurrentCoordinate();
//     // this.watchPosition();
//   }


//   showInfo(title: string, alertHeading: string, alertContent: string, stopAction: boolean): Promise<boolean> {
//     var promise = new Promise<boolean>((resolve) => {
//       try {
//         const dialogConfig = new MatDialogConfig();
//         dialogConfig.data = {
//           title: title,
//           alertHeading: alertHeading,
//           alertContent: alertContent,
//           stopAction: stopAction
//         }

//         dialogConfig.autoFocus = true;
//         dialogConfig.disableClose = true;
//         dialogConfig.hasBackdrop = true;

//         const dialogRef = this.dialog.open(DialogInfoComponent,
//           dialogConfig);

//         if (stopAction) {
//           resolve(false);
//         } else {
//           dialogRef.afterClosed().subscribe((result: boolean | PromiseLike<boolean>) => {
//             resolve(result);
//           });
//         }
//       } catch (exception) {
//         resolve(false);
//       }
//     });
//     return promise;
//   }

//   initAutocomplete() {
//     const input = document.getElementById("pac-input") as HTMLInputElement;

//     const searchBox = new google.maps.places.Autocomplete(input, options);

//     searchBox.addListener("place_changed", () => {
//       const place = searchBox.getPlace();

//       if (!place.geometry || !place.geometry.location) {
//         console.log("Returned place contains no geometry");
//         return;
//       }

//       this.location.lat = place.geometry.location.lat();
//       this.location.lon = place.geometry.location.lng();
//       this.location.label = place.formatted_address == undefined ? '' : place.formatted_address;

//       // L.marker(new L.LatLng(this.location.lat, this.location.lon), { icon: iconDefault }).addTo(this.map);

//       // setTimeout(() => {
//       //   this.map.fitBounds(L.latLngBounds(new L.LatLng(this.location.lat, this.location.lon), new L.LatLng(this.location.lat, this.location.lon)))
//       // }, 100);
//     });
//   }

//   cancel(): void {
//     //this.setLocation();
//     this.dialogRef.close(null);
//   }
//   submit(): void {
//     if (this.control == undefined) {
//       this.dialogRef.close(this.location);
//     } else {
//       if (this.lat2 == undefined || this.lon2 == undefined) {
//         this.dialogRef.close({ location: this.location, meters: 0, minutes: 0, route: '' });
//       } else {
//         this.loading = true;

//         L.Routing.control({
//           waypoints:
//             [
//               this.control.indexOf('originating') >= 0 ? new L.LatLng(this.lat2, this.lon2) : new L.LatLng(this.location.lat, this.location.lon),
//               this.control.indexOf('originating') >= 0 ? new L.LatLng(this.location.lat, this.location.lon) : new L.LatLng(this.lat2, this.lon2)
//             ],
//           routeWhileDragging: true,
//           show: false,
//           fitSelectedRoutes: "smart"
//         }).on('routesfound', (e) => {
//           let routes = e.routes;
//           let summary = routes[0].summary;
//           //this.map.fitBounds(L.latLngBounds(new L.LatLng(this.lat2, this.lon2), new L.LatLng(this.location.lat, this.location.lon)));
//           setTimeout(() => {
//             //this.map.zoomOut(1);
//             setTimeout(() => {
//               //this.map.panTo(new L.LatLng(this.map.getCenter().lat + 0.1, this.map.getCenter().lng));
//             }, 100);
//           }, 500);

//           setTimeout(() => {
//             this.loading = false;

//             this.dialogRef.close({ location: this.location, meters: summary.totalDistance, minutes: summary.totalTime / 60, route: routes[0].coordinates });
//           }, 2000);
//         })//.addTo(this.map);
//       }
//     }
//   }
// }
