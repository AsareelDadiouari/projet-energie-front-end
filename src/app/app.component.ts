import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {DomService} from "./service/dom.service";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationService} from "./service/NotificationService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'projet-energie-front-end';
  @ViewChildren('tabs') tabs!: QueryList<ElementRef>;
  @ViewChild('toolbar') toolbar!: ElementRef;
  public tabIndex: number = 0;

  constructor(private domService: DomService,
              private _snackBar: MatSnackBar,
              private notificationService: NotificationService) {
    this.domService.toolbarSubject.next(this.toolbar);
    this.domService.tabsSubject.next(this.tabs);
  }

  ngOnInit(): void {
    this.notificationService.notification$.subscribe(value => {
      this._snackBar.open(value, "", {
        duration: 5 * 1000,
      })
    })
  }

  openSettings(){
  }

  updateTabIndex(eventValue: number) {
    this.tabIndex = eventValue;
    console.log("index from app",eventValue);
  }
}
