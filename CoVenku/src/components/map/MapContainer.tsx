'use client';

import { MapContainer as LeafletMapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
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
  console.log('Markers Data:', markersData);
  // Wrapper component to get map instance
  const MapController: React.FC = () => {
    const map = useMap();

    const handleSearchSelect = (coords: LatLngExpression) => {
      map.flyTo(coords, 15);
    };

    return <SearchBar markers={markers.filter(hasTitle)} onSelect={handleSearchSelect} />;
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] relative">
      <LeafletMapContainer center={center} zoom={13} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {markers.map((marker) => (
          <MarkerItem
            key={marker.id}
            position={marker.position}
            title={marker.title}
            description={marker.description}
          />
        ))}

        <MapController />
      </LeafletMapContainer>
    </div>
  );
}