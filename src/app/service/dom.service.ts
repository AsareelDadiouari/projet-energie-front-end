import {ElementRef, Injectable, QueryList} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DomService {
  public tabsSubject: Subject<QueryList<ElementRef>> = new Subject<QueryList<ElementRef>>();
  public toolbarSubject: Subject<ElementRef> = new Subject<ElementRef>();

  constructor() {
  }


}
