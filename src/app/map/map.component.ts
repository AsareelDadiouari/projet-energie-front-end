import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {GeolocateControl} from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {environment} from "../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {StationInfoComponent} from "../station-info/station-info.component";
import {MapService} from "../service/map.service";
import {Coords} from "../models/coords.interface";
import {StationInfo} from "../models/stations.interface";
import {Subscription} from "rxjs";
import {MarkerMap} from "../models/markerMap";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  searchBarGeoCoder!: MapboxGeocoder;
  currentPositionControl!: GeolocateControl;
  @ViewChild('mapElement', {static: true}) mapElement!: ElementRef;
  map!: mapboxgl.Map;
  style: string = 'mapbox://styles/mapbox/outdoors-v11';
  defaultCoords: Coords;
  currentPosition!: Coords;
  socketData!: any;
  stations!: StationInfo[];
  stationInfoSubscriber!: Subscription;

  constructor(public dialog: MatDialog, private mapService: MapService) {
    this.defaultCoords = {
      lat: 32,
      lon: -5
    }
    this.currentPosition = {} as Coords
  }

  ngOnInit(): void {
    this.mapService.onConnect().subscribe(data => {
      console.log("Connect : ", data)
    });

    this.mapService.onReceivingMessage().subscribe(message => {
      this.socketData = message;
      console.log("socketData : ", this.socketData);
    });

    this.mapService.onEvent().subscribe(event => {
      console.log("Event : ", event);
    });

    this.initMap(this.defaultCoords);
  }

  ngOnDestroy() {
    this.stationInfoSubscriber.unsubscribe();
  }

  ngAfterViewInit() {
  }

  initMap(coords: Coords) {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: this.mapElement.nativeElement as HTMLElement,
      style: this.style,
      zoom: 5,
      center: [coords.lon, coords.lat],
    });

    this.map.addControl(new mapboxgl.NavigationControl({visualizePitch: true}));
    this.addLocateUserPositionControl();
    this.addSearchControl();
    this.addStationsMarkers();
    this.addVehicleInfo();
    this.map.once('load', () => {
      this.map.resize();
    })
  }

  setMarker(coords: Coords, color: string, type: string, customElement?: HTMLElement) {
    const marker = new mapboxgl.Marker({
      color: color,
      element: customElement,
    }).setLngLat(coords).addTo(this.map);

    return marker;
  }

  setChargePointsMarker(stations: StationInfo[]) {
    stations.forEach((station, index) => {
      const marker = this.setMarker(station.coords, "#ff615d", "Station");
      marker.getElement().addEventListener('click', event => {
        this.openDialog(this.findStation(index));
      })
    })
  }

  findStation(index: number): StationInfo {
    return this.stations[index];
  }

  addSearchControl() {
    this.searchBarGeoCoder = new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      mapboxgl: this.map
    });
    this.map.addControl(this.searchBarGeoCoder);
    this.searchBarGeoCoder.on("result", (event) => {
      console.log(event);
    })
  }

  addStationsMarkers() {
    this.stationInfoSubscriber = this.mapService.getChargePoints("ma").subscribe({
      next: (value: StationInfo[]) => {
        this.stations = value;
        this.setChargePointsMarker(this.stations);
      },
      error: err => {
        console.error("Error ==", err);
      }
    })
  }

  addLocateUserPositionControl() {
    this.currentPositionControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: true
    });
    this.map.addControl(this.currentPositionControl);

    this.currentPositionControl.on('geolocate', (event: any) => {
      this.currentPosition = {
        lon: event.coords.longitude,
        lat: event.coords.latitude
      }
    });

    this.map.once('idle', () => {
      this.currentPositionControl.trigger();
    });
  }

  addVehicleInfo() {

  }

  openDialog(stationInfo: (StationInfo | undefined)) {
    const dialogRef = this.dialog.open(StationInfoComponent, {
      width: '330px',
      data: stationInfo
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
    });
  }
}
