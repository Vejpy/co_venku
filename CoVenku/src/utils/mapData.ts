// src/utils/mapData.ts
// import { LatLngExpression } from 'leaflet';
import { MarkerData } from '../types/map';

export const markers: MarkerData[] = [
  { id: 1, position: [50.08804, 14.42076] as [number, number], title: 'Prague Castle', description: 'Historic castle complex' },
  { id: 2, position: [50.087, 14.421] as [number, number], title: 'Charles Bridge', description: 'Famous bridge over Vltava river' },
  { id: 3, position: [50.086, 14.423] as [number, number], title: 'Old Town Square', description: 'Central square with Astronomical Clock' },
];

