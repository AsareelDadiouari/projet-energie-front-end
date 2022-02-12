import {Injectable} from "@angular/core";
import {Coords} from "../models/coords.interface";

@Injectable({
  providedIn: 'root'
})
export class MathService {
  constructor() {
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
}
