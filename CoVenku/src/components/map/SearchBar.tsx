"use client";

import React, { useState } from "react";
import { LatLngExpression } from "leaflet";

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
  const [query, setQuery] = useState("");
  const [filteredMarkers, setFilteredMarkers] = useState<MarkerOption[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      setFilteredMarkers([]);
      return;
    }

    const filtered = markers.filter((marker) =>
      marker.title.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredMarkers(filtered);
  };

  const handleSelect = (marker: MarkerOption) => {
    setQuery(marker.title);
    setFilteredMarkers([]);
    onSelect(marker.position);
  };

  return (
    <div className="absolute top-2.5 right-2.5 z-1000 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Hledat místo"
        className="p-2 w-52 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      {filteredMarkers.length > 0 && (
        <ul className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 mt-1 p-2 list-none max-h-150px overflow-y-auto rounded">
          {filteredMarkers.map((marker) => (
            <li
              key={marker.id}
              className="py-1 px-2 cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
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
