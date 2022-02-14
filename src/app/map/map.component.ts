import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {FlyToOptions, GeolocateControl} from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {environment} from "../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {StationInfoComponent} from "../station-info/station-info.component";
import {MapService} from "../service/map.service";
import {Coords} from "../models/coords.interface";
import {StationInfo} from "../models/stations.interface";
import {Subscription} from "rxjs";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import {DepartureArrivalFormClass} from "../models/departure-arrival-form.class";
import {NotificationService} from "../service/notificationService";
import {MathService} from "../service/math.service";
import {Vehicle} from "../models/vehicle.interface";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  searchBarGeoCoder!: MapboxGeocoder;
  currentPositionControl!: GeolocateControl;
  departureArrivalFormControl!: DepartureArrivalFormClass;
  @ViewChild('mapElement', {static: true}) mapElement!: ElementRef;
  @ViewChild('departureArrivalForm', {static: true}) departureArrivalForm!: ElementRef;
  map!: mapboxgl.Map;
  style: string = 'mapbox://styles/mapbox/outdoors-v11';
  defaultCoords: Coords;
  currentPosition!: Coords;
  socketData!: any;
  stations!: StationInfo[];
  markers: mapboxgl.Marker[] = [];
  depArrMarkers: mapboxgl.Marker[] = [];
  stationInfoSubscriber!: Subscription;
  distanceCoordinates: (Coords[] | number[][]) = [];
  layersAndSources: string[] = [];
  lineColors: string[] = ["#0a73f3", "#dec10b"]

  constructor(public dialog: MatDialog,
              private mapService: MapService,
              private notificationService: NotificationService,
              private mathService: MathService
  ) {
    this.defaultCoords = {
      lat: 32,
      lon: -5
    }
    this.currentPosition = {} as Coords;
    this.departureArrivalFormControl = new DepartureArrivalFormClass();
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
    this.notificationService.selectedCountry.subscribe(_ => {
      this.removeOldLayersAndSources();
    });

    this.mapService.distanceInKM$.subscribe(distance => {
      console.log("Distance :",distance);

      this.notificationService.getUserVehicle().subscribe((vehicle: Vehicle) => {
        if (vehicle.autonomy - distance < 0){
          const currentPos = this.distanceCoordinates[0];
          const autonomyAt20Percent = (20*vehicle.autonomy)/100;
          const distanceToTravelFrom20PercentAuto = (distance - (80*vehicle.autonomy)/100);
          const distanceToTravelCoords20Percent = this.mathService.reduceCoordinateArray(this.distanceCoordinates as Coords[], distanceToTravelFrom20PercentAuto, 100);

          console.log("position Actuelle :", currentPos);
          console.log("Autonomie à 20 % :",autonomyAt20Percent);
          console.log("Distance restante à parcourir à 20%:",distanceToTravelFrom20PercentAuto);
          console.log("Position à 20% dautonomie : ", distanceToTravelCoords20Percent[0]);
          this.setMarker(distanceToTravelCoords20Percent[0], "#000000", "pin")
          console.log("Distance restante à parcourir coordonées :",distanceToTravelCoords20Percent);


          console.log("Closest station : ",this.mathService.findClosestStation(distanceToTravelCoords20Percent[0], this.stations));

        }
      });
    });

  }

  ngOnDestroy() {
    this.stationInfoSubscriber.unsubscribe();
  }

  ngAfterViewInit() {
    this.getGeoCoordinates();
  }

  initMap(coords: Coords) {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: this.mapElement.nativeElement as HTMLElement,
      style: this.style,
      zoom: 5,
      center: [coords.lon, coords.lat],
    });


    this.map.on('', (event) => {

    });

    this.map.addControl(new mapboxgl.NavigationControl({visualizePitch: true}));
    this.map.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}));
    this.addLocateUserPositionControl();
    this.addSearchControl();
    this.addStationsMarkers();
    //this.addDepartureArrivalFormControl();

    this.map.once('load', () => {
      this.map.resize();
    })
  }

  setMarker(coords: Coords, color: string, type: string, customElement?: HTMLElement) {
    const marker = new mapboxgl.Marker({
      color: color,
      element: customElement,
    }).setLngLat(coords).addTo(this.map);

    if (type === "Dep" || type === "Arr")
      this.depArrMarkers.push(marker);

    this.markers.push(marker);
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
    this.notificationService.getSelectedCountry().subscribe((country: string) => {
      this.stationInfoSubscriber = this.mapService.getChargePoints(country).subscribe({
        next: (value: StationInfo[]) => {
          this.deleteMarkers();
          this.stations = value;
          const toCenter: [number, number] = this.mathService.getMiddleLatLngCenter(Object.assign([], this.stations.map(x => x.coords)));
          this.flyTo(toCenter);
          this.setChargePointsMarker(this.stations);
        },
        error: err => {
          console.error("Error ==", err);
        }
      });
    })
  }

  flyTo(geoJsonCenter: [number, number], zoom?: number){
    if (this.stations !== undefined)
      this.map.flyTo({
        center: geoJsonCenter,
        zoom: zoom ?? 5,
      });
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

  addDepartureArrivalFormControl() {
    this.map.addControl(this.departureArrivalFormControl);
  }

  deleteMarkers(){
    this.markers.forEach(maker => maker.remove());
    this.markers.splice(0, this.markers.length);
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

  displayRouteFromDirections(coordinates: Coords[]){
    this.depArrMarkers.forEach(x => x.remove());
    this.removeOldLayersAndSources();
    const routeId = 'route-' + Math.random();
    this.layersAndSources.push(routeId);
    this.setMarker(coordinates[0], "#5994ff", "Dep");
    this.setMarker(coordinates[coordinates.length - 1], "#50e039", "Arr");

    this.map.addSource(routeId, {
      type: "geojson",
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: (coordinates as Coords[]).map((value: Coords) => [value.lon, value.lat]) as []
        }
      }
    });

    //(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')

    this.map.addLayer({
      'id': routeId,
      'type': 'line',
      'source': routeId,
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': this.lineColors[0],
        'line-width': 8
      }
    });
    this.flyTo(this.mathService.getMiddleLatLngCenter(this.distanceCoordinates as Coords[]), 8)
  }

  getGeoCoordinates(){
    this.mapService.getRouteDirection("coords").subscribe((value) => {
      this.distanceCoordinates = value;
      this.displayRouteFromDirections(this.distanceCoordinates as Coords[]);
      this.mapService.distanceInKM$.next(this.mathService.getDistanceInKm(this.distanceCoordinates as Coords[]));
    });
  }

  removeOldLayersAndSources(){
    this.layersAndSources.forEach(
      routeID => {
        this.map.removeLayer(routeID);
        this.map.removeSource(routeID)
      }
    );
    this.layersAndSources.splice(0, this.layersAndSources.length);
  }
}
