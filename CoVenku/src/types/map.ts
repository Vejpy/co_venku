// src/types/map.ts
import { LatLngExpression } from 'leaflet';

export interface MarkerData {
  id: number;
  position: LatLngExpression;
  title?: string;
  description?: string;
}