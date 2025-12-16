import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletMarkerClusterModule } from "@asymmetrik/ngx-leaflet-markercluster";
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet.markercluster';
import { CommonModule } from '@angular/common';

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
@Component({
    selector: 'map',
    templateUrl: './map.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [CommonModule, LeafletModule, LeafletMarkerClusterModule],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
    private map!: L.Map;
    private tiles!: L.TileLayer;
    lat: number = -26.330647;
    lon: number = 28.107455;
    mapReady: boolean = false;

    constructor(
    ) {
    }
    ngOnDestroy(): void {
        if (this.map) {
            this.map.off();
            this.map.remove();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.mapReady = true;
            this.initMap();
        }, 100);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    private initMap(): void {
        const data: any[] = [];
        if (this.mapReady) {
            if (this.map) {
                this.map.off();
                this.map.remove();
            }

            // this.tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            //     maxZoom: 18,
            //     minZoom: 3,
            //     attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
            // });
            this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                minZoom: 3,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });
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
}
