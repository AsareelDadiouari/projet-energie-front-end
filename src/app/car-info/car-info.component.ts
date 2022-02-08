import { Component, OnInit } from '@angular/core';
import vehiclesJson from "../../mock/vehicle.json";
import {Vehicle} from "../models/vehicle.interface";

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.css']
})
export class CarInfoComponent implements OnInit {
  vehicles: Vehicle[] = vehiclesJson;

  constructor() {
    console.log(this.vehicles);
  }

  ngOnInit(): void {
  }

}
