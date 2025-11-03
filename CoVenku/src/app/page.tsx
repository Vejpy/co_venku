'use client';

import dynamic from 'next/dynamic';
import { MarkerData } from '@/types/map';
import { markers } from '@/utils/mapData';

const MapContainer = dynamic<{ markersData: MarkerData[] }>(
  () => import('@/components/map/MapContainer'),
  { ssr: false }
);

export default function HomePage() {
  
  

  return (
    <div className="w-full h-[calc(100vh-4rem)] pt-16">
      <MapContainer markersData={markers}/>
    </div>
  );
}