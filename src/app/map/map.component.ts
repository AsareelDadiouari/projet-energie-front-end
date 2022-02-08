import {Component, OnDestroy, OnInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {environment} from "../../environments/environment";
import {MatDialog} from "@angular/material/dialog";
import {StationInfoComponent} from "../station-info/station-info.component";
import {MapService} from "../service/map.service";
import {Coords} from "../models/coords.interface";
import {StationInfo} from "../models/stations.interface";
import {Subscription} from "rxjs";
import {MarkerMap} from "../models/markerMap";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  map!: mapboxgl.Map;
  style: string = 'mapbox://styles/mapbox/streets-v11';
  defaultCoords: Coords;
  currentPosition!: Coords;
  socketData!: any;
  stations!: StationInfo[];
  stationsMarkers: MarkerMap[] = []
  stationInfoSubscriber!: Subscription;

  constructor(public dialog: MatDialog, private mapService: MapService) {
    this.defaultCoords = {
      lat: 32,
      lon: -5
    }
    this.currentPosition = {} as Coords
  }

  ngOnInit(): void {
    /*this.mapService.onConnect().subscribe(data => {
      console.log("Connect : ", data)
    });

    this.mapService.onReceivingMessage().subscribe(message => {
      this.socketData = message;
      console.log("socketData : ", this.socketData);
    });

    this.mapService.onEvent().subscribe(event => {
      console.log("Event : ", event);
    })*/

    navigator.geolocation.getCurrentPosition((position => {
      this.currentPosition.lon = position.coords.longitude;
      this.currentPosition.lat = position.coords.latitude;
      this.initMap(this.currentPosition);
    }), err => {
      this.initMap(this.defaultCoords);
    });

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

  ngOnDestroy() {
    this.stationInfoSubscriber.unsubscribe();
  }

  initMap(coords: Coords) {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: "map",
      style: this.style,
      zoom:  Object.keys(this.currentPosition).length > 0 ? 13 : 5,
      center: [coords.lon, coords.lat]
    });

    this.map.addControl(new mapboxgl.NavigationControl({visualizePitch: true}));
    if (Object.keys(this.currentPosition).length > 0)
      this.setMarker(coords, "#3384ff", "Position"); // Set current Position
    this.addVehicleLayer();
    this.map.resize();
  }

  setMarker(coords: Coords, color: string, type: string, customElement?: HTMLElement) {
    const marker = new mapboxgl.Marker({
      color: color,
      element: customElement,
    }).setLngLat(coords).addTo(this.map);

    if (type === "Station"){
      this.stationsMarkers.push(<MarkerMap>{marker: marker, type: type});
    }

    return marker;
  }

  setChargePointsMarker(stations: StationInfo[]){
    stations.forEach((station, index) => {
      const marker = this.setMarker(station.coords, "#ff615d", "Station");
      marker.getElement().addEventListener('click', event =>{
        console.log(index);
        this.openDialog(this.findStation(index));
      })
    })
  }

  findStation(index: number): StationInfo{
    return this.stations[index];
  }

  addVehicleLayer(){
    this.map.on('load', () =>{
      this.map.addSource('Test_A', {
        type: 'vector',
        url: 'mapbox://liamboltonuk.bv937ecm'
      });
      this.map.addLayer({
        'id': 'Test_A',
        'type': 'circle',
        'source': 'Test_A',
        'layout':
          {
            'visibility': 'visible'
          },
        'paint': {
          'circle-radius': 4,
          'circle-color': {
            property: 'conct',
            type: 'interval',
            stops: [
              [1, '#00477a'],
              [700, '#00477a']
            ]
          },
          'circle-opacity': {
            stops: [
              [12, 1],
              [13, 0.75]
            ]
          },
        },
        'source-layer': 'LAEI_2013_N0x-5pzq5d'
      });
    });
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
