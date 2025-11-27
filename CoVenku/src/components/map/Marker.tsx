'use client';

import { Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import  PlaceCard  from '../place/PlaceCard';
 
type MarkerItemProps = {
  position: LatLngExpression;
  place: {
    imageUrl: string;
    name: string;
    // visitors: number;
    description?: string;
  };
};

export default function MarkerItem({ position, place }: MarkerItemProps) {
  if (!place) {
    return (
      <Marker position={position}>
        <Popup>
          <div className="text-sm text-gray-600">Loading place...</div>
        </Popup>
      </Marker>
    );
  }

  const customIcon = L.icon({
    iconUrl: '/marker.png', 
    iconSize: [64, 64],     
    iconAnchor: [16, 32],   
    popupAnchor: [0, -32], 
  });

  return (
    <Marker position={position} icon={customIcon}>
      <Popup
        className="!p-0 !m-0"
          minWidth={0}
          maxWidth={300}
          autoPan={false}
          
      >
        <div className="flex justify-center items-center">
          <PlaceCard
            imageUrl={place.imageUrl}
            name={place.name}
            disableHover
            className="shadow-none p-0"
          />
        </div>
      </Popup>
    </Marker>
  );
}