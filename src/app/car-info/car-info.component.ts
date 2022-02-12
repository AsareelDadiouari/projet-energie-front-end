import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import vehiclesJson from "../../mock/vehicle.json";
import {Vehicle} from "../models/vehicle.interface";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatTabChangeEvent, MatTabGroup} from "@angular/material/tabs";
import {MatToolbar} from "@angular/material/toolbar";
import {NotificationService} from "../service/notificationService";

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.css']
})
export class CarInfoComponent implements OnInit {
  vehicles: Vehicle[] = vehiclesJson;
  userCarInfo: Vehicle = {} as Vehicle;
  carInfoForm!: FormGroup;
  formRegex = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;
  @Input() tabs!: MatTabGroup;
  @Input() toolbar!: MatToolbar;
  @Input() tabIndex!: number;
  @Output() tabModificationEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor(private formBuilder: FormBuilder,
              private notificationService: NotificationService) {
    this.carInfoForm = this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      power: new FormControl("", [Validators.required, Validators.pattern(this.formRegex)]),
      battery: new FormControl("", [Validators.pattern(this.formRegex)]),
      autonomy: new FormControl("", [Validators.required, Validators.pattern(this.formRegex)]),
      consumption: new FormControl("", [Validators.pattern(this.formRegex)])
    })
  }

  ngOnInit(): void {
    this.tabs.selectedTabChange.subscribe((value: MatTabChangeEvent) => {
      //console.log(value.tab);
      console.log("Tab : ", this.tabs.selectedIndex);
    });
  }

  fillOnOptionSelect(event: MatAutocompleteSelectedEvent) {
    this.userCarInfo = vehiclesJson.find(x => x.name === event.option.value) as Vehicle;
    this.carInfoForm.get('name')?.setValue(this.userCarInfo.name);
    this.carInfoForm.get('battery')?.setValue(this.userCarInfo.battery);
    this.carInfoForm.get('power')?.setValue(this.userCarInfo.power);
    this.carInfoForm.get('consumption')?.setValue(this.userCarInfo.consumption);
    this.carInfoForm.get('autonomy')?.setValue(this.userCarInfo.autonomy);
  }

  buildUserVehicle(): Vehicle {
    return Object.keys(this.userCarInfo).length > 0 ? this.userCarInfo : {
      name: this.carInfoForm.get('name')?.value,
      power: this.carInfoForm.get('power')?.value,
      autonomy: this.carInfoForm.get('autonomy')?.value,
      consumption: this.carInfoForm.get('consumption')?.value,
      battery: this.carInfoForm.get('battery')?.value,
      image: ""
    } as Vehicle
  }

  onSubmit(event: Event) {
    if (this.userCarInfo.name !== this.carInfoForm.get('name')?.value) {
      this.userCarInfo = {} as Vehicle;
    }
    console.log("index from car :", this.tabIndex);
    this.tabModificationEmitter.emit(this.tabIndex > 0 ? --this.tabIndex : this.tabIndex);

    localStorage.setItem('userVehicleInfos', JSON.stringify(this.buildUserVehicle()));

    this.carInfoForm.markAsPristine();
    this.carInfoForm.markAsUntouched();
    this.carInfoForm.reset();
    this.notificationService.notification$.next("Données du véhicule enregistrées");
  }

}
