'use client';

import { Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import  PlaceCard  from '../place/PlaceCard';
import CustomSVGMarker from './CustomSVGMarker';
 
type MarkerItemProps = {
  position: LatLngExpression;
  place: {
    imageUrl: string;
    name: string;
    description?: string;
    type: 'culture' | 'concert' | 'sport' | 'food';
    number?: number;
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

  const customIcon = L.divIcon({
    className: '',
    html: ReactDOMServer.renderToStaticMarkup(
      <CustomSVGMarker type={place.type} number={place.number} />
    ),
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