import {Component, ElementRef, Inject, OnInit, Optional, ViewChild} from '@angular/core';
import {Coords} from "../map/map.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface ChargingPoint{
  ID: number,
  formalName: string,
  isOperational: boolean,
  voltage: number,
  power: number
}

export interface StationInfo{
  ID: number,
  title: string,
  address: string,
  town: string,
  coords: Coords
  chargingPoints: ChargingPoint[],
  misc: any
}


@Component({
  selector: 'app-station-info',
  templateUrl: './station-info.component.html',
  styleUrls: ['./station-info.component.css']
})
export class StationInfoComponent implements OnInit {
  @ViewChild('StationInfo') elRef!: ElementRef;

  constructor(elRef: ElementRef,
              @Optional() public dialogRef: MatDialogRef<StationInfoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: StationInfo,) {
    this.elRef = elRef
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
