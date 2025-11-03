// src/utils/mapData.ts
// import { LatLngExpression } from 'leaflet';
import { MarkerData } from '../types/map';

export const markers: MarkerData[] = [
  { id: 1, position: [50.08804, 14.42076] as [number, number], title: 'Prague Castle', description: 'Historic castle complex' },
  { id: 2, position: [50.087, 14.421] as [number, number], title: 'Charles Bridge', description: 'Famous bridge over Vltava river' },
  { id: 3, position: [50.086, 14.423] as [number, number], title: 'Old Town Square', description: 'Central square with Astronomical Clock' },
  { id: 4, position: [49.1951, 16.6068] as [number, number], title: 'Brno Cathedral', description: 'Cathedral of St. Peter and Paul' },
  { id: 5, position: [50.0755, 15.4383] as [number, number], title: 'Hradec Králové', description: 'Historic city with beautiful architecture' },
  { id: 6, position: [49.8175, 18.2625] as [number, number], title: 'Ostrava City Hall', description: 'Modernist city hall building' },
  { id: 7, position: [50.4542, 14.1536] as [number, number], title: 'České Budějovice', description: 'Known for Budweiser beer and historic square' },
  { id: 8, position: [50.6403, 13.8242] as [number, number], title: 'Ústí nad Labem', description: 'Industrial city on the Elbe river' },
  { id: 9, position: [49.7415, 13.3736] as [number, number], title: 'Plzeň', description: 'Birthplace of Pilsner beer' },
  { id: 10, position: [50.1039, 14.4114] as [number, number], title: 'Vyšehrad', description: 'Historic fort overlooking Prague' },
  { id: 11, position: [49.195, 16.608] as [number, number], title: 'Špilberk Castle', description: 'Castle and fortress in Brno' },
  { id: 12, position: [50.226, 12.871] as [number, number], title: 'Karlovy Vary', description: 'Famous spa town with hot springs' },
  { id: 13, position: [50.225, 14.390] as [number, number], title: 'Kutná Hora', description: 'Historic town with Sedlec Ossuary' },
  { id: 14, position: [49.941, 14.492] as [number, number], title: 'Jihlava', description: 'One of the oldest mining towns in Czech Republic' },
  { id: 15, position: [50.770, 15.054] as [number, number], title: 'Liberec', description: 'City with Ještěd Tower and ski resort' },
  { id: 16, position: [48.974, 14.474] as [number, number], title: 'Český Krumlov', description: 'UNESCO town with a medieval castle' },
  { id: 17, position: [50.033, 14.474] as [number, number], title: 'Terezín', description: 'Historic fortress and WWII memorial' },
  { id: 18, position: [49.903, 15.474] as [number, number], title: 'Pardubice', description: 'Known for horse racing and gingerbread' },
  { id: 19, position: [50.433, 14.041] as [number, number], title: 'Mělník', description: 'Town famous for wine production' },
  { id: 20, position: [50.080, 14.430] as [number, number], title: 'National Museum Prague', description: 'Largest museum in the Czech Republic' },
];
