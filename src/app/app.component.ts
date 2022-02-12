import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {DomService} from "./service/dom.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationService} from "./service/notificationService";
import {FormControl, Validators} from "@angular/forms";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'projet-energie-front-end';
  @ViewChildren('tabs') tabs!: QueryList<ElementRef>;
  @ViewChild('toolbar') toolbar!: ElementRef;
  public tabIndex: number = 0;
  public itineraryIsAccessible: boolean = false;
  public countryFormControl: FormControl = new FormControl("");
  public countriesSelection = ["MA", "FR", "DE", "CA", "US", "JP", "GB", "NL"]

  constructor(private domService: DomService,
              private _snackBar: MatSnackBar,
              public notificationService: NotificationService) {
    this.domService.toolbarSubject.next(this.toolbar);
    this.domService.tabsSubject.next(this.tabs);
    this.countryFormControl.addValidators([Validators.required, Validators.maxLength(2)]);
    this.notificationService.setCountry(this.countriesSelection[0].toLowerCase());
  }

  ngOnInit(): void {
    this.notificationService.notification$.subscribe(value => {
      this._snackBar.open(value, "", {
        duration: 5 * 1000,
      })
    })
  }

  openSettings() {
  }

  updateTabIndex(eventValue: number) {
    this.tabIndex = eventValue;
    console.log("index from app", eventValue);
  }

  fillOnOptionSelect($event: MatAutocompleteSelectedEvent) {
    this.notificationService.setCountry($event.option.value);
  }

  changeCountry(countryName: any) {
    console.log(this.countryFormControl.value)
  }
}
