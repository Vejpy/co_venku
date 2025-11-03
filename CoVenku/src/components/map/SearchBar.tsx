'use client';

import React, { useState } from 'react';
import { LatLngExpression } from 'leaflet';

interface MarkerOption {
  id: string | number;
  title: string;
  position: LatLngExpression;
}

interface SearchBarProps {
  markers: MarkerOption[];
  onSelect: (coords: LatLngExpression) => void;
}

export default function SearchBar({ markers, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [filteredMarkers, setFilteredMarkers] = useState<MarkerOption[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      setFilteredMarkers([]);
      return;
    }

    const filtered = markers.filter((marker) =>
      marker.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMarkers(filtered);
  };

  const handleSelect = (marker: MarkerOption) => {
    setQuery(marker.title);
    setFilteredMarkers([]);
    onSelect(marker.position);
  };

  return (
    <div className="absolute top-2.5 right-2.5 z-[1000] bg-white p-2 rounded shadow-md">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search location"
        className="p-2 w-52"
      />
      {filteredMarkers.length > 0 && (
        <ul className="bg-white border border-gray-300 mt-0 p-2 list-none max-h-[150px] overflow-y-auto">
          {filteredMarkers.map((marker) => (
            <li
              key={marker.id}
              className="py-1 cursor-pointer"
              onClick={() => handleSelect(marker)}
            >
              {marker.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}