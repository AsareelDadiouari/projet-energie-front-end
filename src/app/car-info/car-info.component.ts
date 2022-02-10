import {Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList} from '@angular/core';
import vehiclesJson from "../../mock/vehicle.json";
import {Vehicle} from "../models/vehicle.interface";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {DomService} from "../service/dom.service";
import {MatTab, MatTabChangeEvent, MatTabGroup} from "@angular/material/tabs";
import {MatToolbar} from "@angular/material/toolbar";
import {NotificationService} from "../service/NotificationService";

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.css']
})
export class CarInfoComponent implements OnInit {
  vehicles: Vehicle[] = vehiclesJson;
  userCarInfo: Vehicle = {} as Vehicle;
  carInfoForm!: FormGroup
  @Input() tabs!: MatTabGroup;
  @Input() toolbar!: MatToolbar;
  @Input() tabIndex!: number;
  @Output() tabModificationEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService) {
    this.carInfoForm = this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      power: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
      battery: new FormControl("", [Validators.pattern("^[0-9]*$")]),
      autonomy: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
      consumption: new FormControl("", [Validators.pattern("^[0-9]*$")])
    })
  }

  ngOnInit(): void {
    this.tabs.selectedTabChange.subscribe((value: MatTabChangeEvent) => {
      console.log(value.tab);
      console.log(this.tabs.selectedIndex);
    });
  }

  fillOnOptionSelect(event: MatAutocompleteSelectedEvent){
    this.userCarInfo = vehiclesJson.find(x => x.name === event.option.value) as Vehicle;
  }

  onSubmit(event: Event){
    if (this.userCarInfo.name !== this.carInfoForm.get('name')?.value){
      this.userCarInfo = {} as Vehicle;
    }
    console.log("index from car :", this.tabIndex);
    this.tabModificationEmitter.emit(this.tabIndex > 0 ? --this.tabIndex : this.tabIndex);
    this.carInfoForm.markAsPristine();
    this.carInfoForm.markAsUntouched();
    this.carInfoForm.reset();
    this.notificationService.notification$.next("Données du véhicule enregistrées");
  }

}
