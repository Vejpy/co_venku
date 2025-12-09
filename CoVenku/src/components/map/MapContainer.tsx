'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import SearchBar from './SearchBar';
import { MarkerData } from '../../types/map';
import { fetchMarkers } from '../../utils/mapData';

interface MapContainerProps {
  markersData?: MarkerData[];
}

function hasTitle(marker: MarkerData): marker is MarkerData & { title: string } {
  return typeof marker.title === 'string' && marker.title.length > 0;
}

export default function MapContainer({ markersData }: MapContainerProps) {
  const [markersDataState, setMarkersDataState] = useState<MarkerData[]>([]);

  useEffect(() => {
    async function loadMarkers() {
      try {
        console.log('Fetching markers inside MapContainer...');
        const data = await fetchMarkers();
        console.log('Markers fetched:', data);
        setMarkersDataState(data);
      } catch (err) {
        console.error('Failed to fetch markers:', err);
      }
    }
    loadMarkers();
  }, []);

  const dataSource =  markersDataState;

  const firstMarker = markersDataState[0]?.position;
  const defaultCenter: LatLngExpression = [50.08804, 14.42076];

  const MapController: React.FC = () => {
    const map = useMap();

    const handleSearchSelect = (coords: LatLngExpression) => {
      map.flyTo(coords, 15, { duration: 3 });
    };

    return <SearchBar markers={dataSource.filter(hasTitle)} onSelect={handleSearchSelect} />;
  };

  if (!firstMarker) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ width: '100%', height: '90vh', position: 'relative' }}>
      <LeafletMapContainer center={firstMarker || defaultCenter} zoom={13} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />

        {dataSource.map((marker) => {
          const typeMapping: Record<string, 'culture' | 'concert' | 'sport' | 'food'> = {
            divadlo: 'culture',
            koncert: 'concert',
            sport: 'sport',
            restaurace: 'food',
            kino: 'culture',
          };
          const name = marker.title ?? 'Unknown place';
          const description = marker.description ?? '';
          const type = typeMapping[marker.type] ?? 'culture';

          console.log('Rendering marker at position:', marker.position);

          const [lat, lng] = marker.position as [number, number];
          return (
            <Marker
              key={marker.id}
              position={[lat, lng]}
              icon={L.divIcon({
                html: `<div style="width:20px;height:20px;background:red;border-radius:50%;"></div>`,
                className: '',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            >
              <Popup>
                <h3>{name}</h3>
                <p>{description}</p>
                
                <p>Type: {marker.type}</p>
              </Popup>
            </Marker>
          );
        })}

        <MapController />
      </LeafletMapContainer>
    </div>
  );
}