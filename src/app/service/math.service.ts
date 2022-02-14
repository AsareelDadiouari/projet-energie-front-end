import {Injectable} from "@angular/core";
import {Coords} from "../models/coords.interface";
import {StationInfo} from "../models/stations.interface";
import {map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {FeatureCollection} from "../models/feature-collection";

@Injectable({
  providedIn: 'root'
})
export class MathService {
  constructor(private httpClient: HttpClient) {
  }

   private static radianToDegree(radian: number) { return radian * 180 / Math.PI; }
   private static degreeToRadian(degree: number) { return degree * Math.PI / 180; }

  /**
   * @param latLngIn array of arrays with latitude and longtitude
   *   pairs in degrees. e.g. [[latitude1, longtitude1], [latitude2
   *   [longtitude2] ...]
   *
   * @return array with the center latitude longtitude pairs in
   *   degrees.
   */
   getMiddleLatLngCenter(latLngIn: Coords[]): [number, number] {
    let lng;
    let lat;
    const LATIDX = 0;
    const LNGIDX = 1;
    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;

    for (var i=0; i<latLngIn.length; i++) {
      lat = MathService.degreeToRadian(latLngIn[i].lat);
      lng = MathService.degreeToRadian(latLngIn[i].lon);
      // sum of cartesian coordinates
      sumX += Math.cos(lat) * Math.cos(lng);
      sumY += Math.cos(lat) * Math.sin(lng);
      sumZ += Math.sin(lat);
    }

    const avgX = sumX / latLngIn.length;
    const avgY = sumY / latLngIn.length;
    const avgZ = sumZ / latLngIn.length;

    // convert average x, y, z coordinate to latitude and longtitude
    lng = Math.atan2(avgY, avgX);
    const hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    lat = Math.atan2(avgZ, hyp);

    return ([MathService.radianToDegree(lng), MathService.radianToDegree(lat)]);
  }

  getDistanceFromLatLonInKm(dep: Coords, arr: Coords) { // A vol d'oiseau
     const [lat1, lon1, lat2, lon2] = [dep.lat, dep.lon, arr.lat, arr.lon];
    const R = 6371; // Radius of the earth in km
    const dLat = MathService.degreeToRadian(lat2 - lat1);  // deg2rad below
    const dLon = MathService.degreeToRadian(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(MathService.degreeToRadian(lat1)) * Math.cos(MathService.degreeToRadian(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  getDistanceInKm(geoJSON: Coords[], percentage?: number){
     let distance = 0;
     const size = percentage ? (percentage!*geoJSON.length)/100 : geoJSON.length;
     console.log("Size in get distance :",size);

     for (let i = 1; i < size; i++){
       distance += this.getDistanceFromLatLonInKm(geoJSON[i - 1], geoJSON[i]);
     }

     return distance
  }

  reduceCoordinateArray(coords: Coords[], startPercentage: number, endPercentage: number): Coords[]{
    const array: Coords[] = [];
    const beginSize = Math.floor((startPercentage*coords.length) / 100);
    const endSize = Math.floor((endPercentage*coords.length) / 100);

    for (let i = beginSize; i < endSize; i++){
      array.push(coords[i]);
    }

    return array as Coords[];
  }

  getDistanceFromDrawnRoute(departure: Coords, arrival: Coords): Observable<number>{
    const url = environment.openMapService.apikeyDirections
      + "&start="
      + departure.lat.toString() + "," + departure.lon.toString()
      + "&end="
      + arrival.lat.toString() + "," + arrival.lon.toString();

    /*return this.httpClient.get(url).pipe(
      map((array: FeatureCollection) => array.features[0].properties.confidence)
    )*/ return  of(1)
  }

  findClosestStation(currentPosition: Coords, stationList: StationInfo[]): [StationInfo, number]{
     let closestStation: StationInfo = stationList[0];
     let distance = this.getDistanceFromLatLonInKm(currentPosition, closestStation.coords);

     stationList.forEach(station =>{
       const tempDistance = this.getDistanceFromLatLonInKm(currentPosition, station.coords);
       if (tempDistance < distance){
         distance = tempDistance;
         closestStation = station;
       }
     });

     return [closestStation, distance];
  }

}
