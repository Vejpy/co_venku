'use client';

import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngExpression} from 'leaflet';
import MarkerItem from './Marker';
import SearchBar from './SearchBar';
import { markers } from '../../utils/mapData';
import { MarkerData } from '../../types/map';


interface MapContainerProps {
  markersData?: MarkerData[];
}

function hasTitle(marker: MarkerData): marker is MarkerData & { title: string } {
  return typeof marker.title === 'string' && marker.title.length > 0;
}

export default function MapContainer({ markersData}: MapContainerProps) {
  const center = [50.08804, 14.42076] as [number, number];
  const dataSource = markersData ?? markers;
  console.log('Markers Data:', markersData);

  const isWebView = typeof navigator !== 'undefined' && /WebView|wv/.test(navigator.userAgent);

  const MapController: React.FC = () => {
    const map = useMap();

    const handleSearchSelect = (coords: LatLngExpression) => {
      map.flyTo(coords, 15, { duration: 3 });
    };

    return <SearchBar markers={markers.filter(hasTitle)} onSelect={handleSearchSelect} />;
  };

  return (
    <div className={`w-full h-[calc(90vh-4rem)] relative${isWebView ? ' mt-[120px]' : ''}`}>
      <LeafletMapContainer center={center} zoom={13} preferCanvas={true} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
    keepBuffer={10}            
    updateWhenZooming={false}  // no tile unload mid-zoom
    updateWhenIdle={true}  

          
        />

        {React.useMemo(() => dataSource.map((marker) => {
          const imageUrl = marker.imageUrl ?? '/images/default-place.jpg';
          const name = marker.title ?? 'Unknown place';
          const description = marker.description ?? '';
          const type = marker.type ?? 'culture'; // Default to 'culture' if type is missing

          return (
            <MarkerItem
              key={marker.id}
              position={marker.position}
              place={{
                imageUrl,
                name,
                description,
                type,
              }}
            />
          );
        }), [dataSource])}

        <MapController />
      </LeafletMapContainer>
    </div>
  );
}