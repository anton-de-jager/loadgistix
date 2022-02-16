import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

const iconRetinaUrl = 'assets/images/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/images/leaflet/location_green.png';
const shadowUrl = 'assets/images/leaflet/marker-shadow.png';
const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl: 'assets/images/leaflet/location_green.png',
    shadowUrl,
    iconSize: [23, 33],
    iconAnchor: [16, 33],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [33, 33]
});
const iconFrom = L.icon({
    iconRetinaUrl,
    iconUrl: 'assets/images/leaflet/truck_green.png',
    shadowUrl,
    iconSize: [33, 33],
    iconAnchor: [16, 33],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [33, 33]
});
const iconTo = L.icon({
    iconRetinaUrl,
    iconUrl: 'assets/images/leaflet/location_red.png',
    shadowUrl,
    iconSize: [23, 32],
    iconAnchor: [12, 32],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [32, 32]
});

@Component({
  selector: 'app-address',
  templateUrl: './dialog-address.component.html',
  styleUrls: ['./dialog-address.component.scss']
})
export class DialogAddressComponent implements OnInit, AfterViewInit {
  private mapAddress;
  location: any;
  lat: number = 28.1045642;
  lon: number = -26.3296247;
  label: string = '';

  private initMap(): void {
    this.mapAddress = L.map('mapAddress', {
      center: [this.lon, this.lat],
      zoom: 14
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const provider = new OpenStreetMapProvider({
      params: {
        countrycodes: 'za', // limit search results to the Netherlands
        addressdetails: 1, // include additional address detail parts
        extratags: 1,
        namedetails: 1,
        pretty: 1
      },
    });
    let searchControl = GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: true, // optional: true|false  - default true
      showPopup: false, // optional: true|false  - default false
      marker: {
        // optional: L.Marker    - default L.Icon.Default
        icon: iconDefault,
        draggable: false
      },
      popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
      resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
      maxMarkers: 1, // optional: number      - default 1
      retainZoomLevel: false, // optional: true|false  - default false
      animateZoom: true, // optional: true|false  - default true
      autoClose: false, // optional: true|false  - default false
      searchLabel: 'Enter address', // optional: string      - default 'Enter address'
      keepResult: false, // optional: true|false  - default false
      updateMap: true, // optional: true|false  - default true
    });
    L.marker([this.lon, this.lat], { icon: iconDefault }).addTo(this.mapAddress).bindPopup(this.label); 
    
    this.mapAddress.addControl(searchControl);
    this.mapAddress.on('geosearch/showlocation', x => {
      this.location = x.location;
      //console.log(x);
    });

    tiles.addTo(this.mapAddress);
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAddressComponent>) {
    if (data) {
      this.lat = data.lat;
      this.lon = data.lon;
      this.label = data.label;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }



  cancel(): void {
    this.dialogRef.close(null);
  }
  submit(): void {
    this.dialogRef.close(this.location);
  }
}
