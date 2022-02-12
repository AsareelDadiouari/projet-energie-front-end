import {Injectable} from "@angular/core";
import {Socket} from 'ngx-socket-io';
import {
  async,
  BehaviorSubject,
  combineLatest,
  forkJoin,
  map, merge,
  mergeMap,
  Observable, of,
  share,
  shareReplay,
  Subject, switchMap,
  tap, zip
} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ChargingPoint, StationInfo} from "../models/stations.interface";
import {Connection, OpenChargeMapOBJ} from "../models/openCharMapOBJ.interface";
import {FeatureCollection} from "../models/feature-collection";
import {Coords} from "../models/coords.interface";
import {NotificationService} from "./notificationService";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  socketDataSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  socketData: string = this.socketDataSubject.value;
  public departure$: Subject<string> = new Subject<string>();
  public arrival$:Subject<string> = new Subject<string>();

  constructor(private socket: Socket,
              private httpClient: HttpClient,
              private notificationService: NotificationService
              ) {
    socket.disconnect();
    this.onReceivingMessage().subscribe(message => {
      this.socketDataSubject.next(message);
      console.log("mapserevice socket =", this.socketDataSubject.value);
    });
  }

  onConnect() {
    return this.socket.fromEvent('connect');
  }

  onReceivingMessage() {
    return this.socket.fromEvent<string>('receive_message').pipe(
      shareReplay(1),
      tap(value => {
        this.socketData = value;
        this.socketDataSubject.next(value);
      })
    );
  }

  onEvent() {
    return this.socket.fromEvent('event');
  }

  sendData() {
    this.socket.emit('send_message', "Salut")
  }

  /**
   * ma, fr, bf, ga //examples
   * @param country
   */
  getChargePoints(country: string): Observable<StationInfo[]> {
    const url = environment.openChargeMap.apiKey + "&countrycode=" + country;
    return this.httpClient.get<OpenChargeMapOBJ[]>(url).pipe(
      map((chargePoints: OpenChargeMapOBJ[]) => chargePoints.map((chargePoint: OpenChargeMapOBJ) => this.buildStation(chargePoint))),
      share(),
    );
  }

  buildStation(openChargemap: OpenChargeMapOBJ): StationInfo {
    const station = {} as StationInfo;
    station.ID = openChargemap?.ID;
    station.title = openChargemap.AddressInfo?.Title;
    station.coords = {lon: openChargemap.AddressInfo?.Longitude, lat: openChargemap.AddressInfo?.Latitude};
    station.town = openChargemap.AddressInfo?.Town;
    station.address = (openChargemap.AddressInfo?.AddressLine1
      ?? openChargemap.AddressInfo?.AddressLine2
      ?? openChargemap.AddressInfo?.Town +
      openChargemap.AddressInfo?.StateOrProvince +
      openChargemap.AddressInfo?.Postcode +
      openChargemap.AddressInfo?.Country?.Title
    );

    station.chargingPoints = openChargemap.Connections.map((chargePoint: Connection) => {
      const charge = {} as ChargingPoint;
      charge.ID = chargePoint?.ID;
      charge.power = chargePoint?.PowerKW;
      charge.formalName = chargePoint?.ConnectionType.FormalName;
      charge.voltage = chargePoint?.Voltage;
      charge.isOperational = chargePoint?.StatusType?.IsOperational;
      return charge;
    })

    return station
  }

  getRouteDirection(type: string): Observable<Coords[] | number[][]>{
    return zip([this.departure$, this.arrival$]).pipe(
      mergeMap((results: [string , string]) => zip([this.geocodeAddress(results[0]), this.geocodeAddress(results[1])])),
      switchMap((values: [FeatureCollection, FeatureCollection]) => this.directionCoordinates(this.parseInStringCoords(values[0]), this.parseInStringCoords(values[1]), type)),
    )
  }

  directionCoordinates(departure: string, arrival: string, type?: string): Observable<Coords[] | number[][]>{
    const url = environment.openMapService.apikeyDirections + "&start=" + departure + "&end=" + arrival;
    return this.httpClient.get<FeatureCollection>(url).pipe(
      map((value: FeatureCollection) => {
        if (type === "numbers")
          return value.features[0].geometry.coordinates as number[][];

        const finalCoords: Coords[] = [];
        (value.features[0].geometry.coordinates as number[][]).forEach(
          (coord: number[]) => finalCoords.push({lon: coord[0], lat: coord[1]} as Coords));
        return finalCoords;
      }),
    )
  }

  geocodeAddress(address: string): Observable<FeatureCollection>{
    return  this.notificationService.selectedCountry.pipe(
      mergeMap((countryInitials: string) => {
        const url = environment.openMapService.apikeyGeoCode + "&text=" + address + "&boundary.country=" + countryInitials;
        return this.httpClient.get<FeatureCollection>(url).pipe()
      }),
    );
  }

  parseInStringCoords(ft: FeatureCollection): string{
    return ft.features[0].geometry.coordinates[0].toString() + "," + ft.features[0].geometry.coordinates[1].toString();
  }
}
