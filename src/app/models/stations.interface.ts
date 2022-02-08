import {Coords} from "./coords.interface";

export interface ChargingPoint {
  ID: number,
  formalName: string,
  isOperational: boolean,
  voltage: number | undefined,
  power: number
}

export interface StationInfo {
  ID: number,
  title: string,
  address: string,
  town: string,
  coords: Coords
  chargingPoints: ChargingPoint[],
  misc: any
}
