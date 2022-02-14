import {Injectable} from "@angular/core";
import {BehaviorSubject, mergeMap, Observable, Subject} from "rxjs";
import {Vehicle} from "../models/vehicle.interface";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notification$: Subject<string> = new Subject();
  public selectedCountry: BehaviorSubject<string> = new BehaviorSubject<string>("MA");

  constructor() {
  }

  userVehicleInfoIsSaved(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      localStorage.getItem('userVehicleInfos') !== null ? observer.next(true) : observer.next(false);
      observer.complete();
    });
  }

  getSelectedCountry(): Observable<string>{
    return this.selectedCountry;
  }

  getUserVehicle(): Observable<Vehicle>{
    return this.userVehicleInfoIsSaved().pipe(
      mergeMap((value: boolean) => new Observable<Vehicle>((observer) => {
        value ? observer.next(JSON.parse(localStorage.getItem('userVehicleInfos') as string)): observer.next(undefined);
        observer.complete();
      }))
    );
  }

  setCountry(country: string): void {
    this.selectedCountry.next(country);
  }
}
