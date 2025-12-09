'use client';

import dynamic from 'next/dynamic';
import { MarkerData } from '@/types/map';



const MapContainer = dynamic<{ markersData: MarkerData[] }>(
  () => import('@/components/map/MapContainer'),
  { ssr: false }
);

export default function HomePage() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] pt-16">
      <h1>idk</h1>
      <MapContainer markersData={[]}/>
    </div>
  );
}