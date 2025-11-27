// src/types/map.ts
import { LatLngExpression } from 'leaflet';

export interface MarkerData {
  id: number;
  position: LatLngExpression;
  title?: string;
  description?: string;
  imageUrl?: string;
  type: 'culture' | 'concert' | 'sport' | 'food';
  number?: number;
}