'use client';

import dynamic from 'next/dynamic';
import { MarkerData } from '@/types/map';

const MapContainer = dynamic<{ markersData: MarkerData[] }>(
  () => import('@/components/map/MapContainer'),
  { ssr: false }
);

export default function HomePage() {
  const markers: MarkerData[] = [
    {
      id: 1,
      position: [50.08804, 14.42076] as [number, number],
      title: 'Prague Castle',
      description: 'Historic castle complex',
    },
    {
      id: 2,
      position: [50.087, 14.421] as [number, number],
      title: 'Charles Bridge',
      description: 'Famous bridge over Vltava river',
    },
  ];

  return (
    <div className="w-full h-[calc(100vh-4rem)] pt-16">
      <MapContainer markersData={markers} />
    </div>
  );
}