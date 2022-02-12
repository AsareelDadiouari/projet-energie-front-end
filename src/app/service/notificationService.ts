import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from "rxjs";

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

  setCountry(country: string): void {
    this.selectedCountry.next(country);
  }
}
