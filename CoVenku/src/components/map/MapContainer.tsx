// src/components/map/MapContainer.tsx
'use client';

import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import MarkerItem from './Marker';
import { markers } from '../../utils/mapData';
import { MarkerData } from '../../types/map';

interface MapContainerProps {
  markersData?: MarkerData[];
}

export default function MapContainer({ markersData = markers }: MapContainerProps) {
  const center = [50.08804, 14.42076] as [number, number];

  return (
    <div className="w-full h-[calc(100vh-4rem)]">
      <LeafletMapContainer center={center} zoom={13} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {markersData.map((marker) => (
          <MarkerItem
            key={marker.id}
            position={marker.position}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </LeafletMapContainer>
    </div>
  );
}