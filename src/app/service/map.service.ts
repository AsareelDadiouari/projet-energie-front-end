import {Injectable} from "@angular/core";
import {Socket} from 'ngx-socket-io';
import {BehaviorSubject, map, mergeMap, Observable, share, shareReplay, switchMap, tap, toArray} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ChargingPoint, StationInfo} from "../models/stations.interface";
import {Connection, OpenChargeMapOBJ} from "../models/openCharMapOBJ.interface";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  socketDataSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  socketData: string = this.socketDataSubject.value;

  constructor(private socket: Socket, private httpClient: HttpClient) {
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

  buildStation(openChargemap: OpenChargeMapOBJ): StationInfo{
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
}
