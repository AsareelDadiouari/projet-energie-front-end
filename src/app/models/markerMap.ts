import * as mapboxgl from "mapbox-gl";

export enum MarkerType{
  Station = "Station",
  Position = "Position",
}

export interface MarkerMap {
  marker: mapboxgl.Marker,
  type: MarkerType
}
