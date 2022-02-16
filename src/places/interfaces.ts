import {LatLngLiteral} from "leaflet";

// Sharable interface between Client and Backend
export interface IPlace {
  id: string;
  location: LatLngLiteral;
  name: string;
  description: string;
  rating: number;
}
