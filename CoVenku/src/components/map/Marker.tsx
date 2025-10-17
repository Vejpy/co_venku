'use client';

import { Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

type MarkerItemProps = {
  position: LatLngExpression;
  title?: string;
  description?: string;
};

export default function MarkerItem({ position, title, description }: MarkerItemProps) {
  const customIcon = L.icon({
    iconUrl: '/marker.png', 
    iconSize: [64, 64],     
    iconAnchor: [16, 32],   
    popupAnchor: [0, -32], 
  });

  return (
    <Marker position={position} icon={customIcon}>
      <Popup>
        <strong>{title}</strong>
        <p>{description}</p>
      </Popup>
    </Marker>
  );
}