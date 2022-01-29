import {Component, OnInit, ChangeDetectorRef, OnDestroy, ElementRef} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {environment} from "../../environments/environment";
import {BehaviorSubject, catchError, Observable, Subscription, throwError} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {StationInfoComponent} from "../station-info/station-info.component";
import {MapService} from "../service/map.service";

export interface Coords{
  lon: number,
  lat: number
}
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  map!: mapboxgl.Map;
  style: string = 'mapbox://styles/mapbox/streets-v11';
  defaultCoords: Coords = {
    lat: 37,
    lon: 10
  };
  currentPosition: Coords = this.defaultCoords;
  socketData: any;

  constructor(public dialog: MatDialog, private mapService: MapService) {

  }

  ngOnInit(): void {
    this.mapService.onConnect().subscribe(data => {
      console.log("Connect : ", data)
    });

    this.mapService.onReceivingMessage().subscribe(message => {
      this.socketData = message;
      console.log("Message : ",message);
    })

    this.mapService.onEvent().subscribe(event => {
      console.log("Event : ",event);
    })

    navigator.geolocation.getCurrentPosition((position => {
      this.defaultCoords.lon = position.coords.longitude;
      this.defaultCoords.lat = position.coords.latitude;
      this.initMap(this.defaultCoords);
    }));
  }

  ngOnDestroy() {
  }

  initMap(coords: Coords){
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: "map",
      style: this.style,
      zoom: 13,
      center: [coords.lon, coords.lat]
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    this.setMarker( this.currentPosition,"#3384ff"); // Set current Position
    this.map.resize();
  }

  setMarker(coords: Coords,color: string, customElement?: HTMLElement){

    const marker = new mapboxgl.Marker({
      color: color,
      element: customElement
    }).setLngLat(coords).addTo(this.map)

    marker.getElement().addEventListener('click', (event) => {
      this.mapService.sendData();
      this.openDialog(this.socketData);
    });
  }

  openDialog(info: any){
    const dialogRef = this.dialog.open(StationInfoComponent, {
      width: '250px',
      data: {
        title: "Test",
        misc: info
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
