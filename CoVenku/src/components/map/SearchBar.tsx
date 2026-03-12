"use client";

import React, { useState } from "react";
import { LatLngExpression } from "leaflet";
import { Search, X } from "lucide-react";

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

  const clearSearch = () => {
    setQuery("");
    setFilteredMarkers([]);
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] w-72">
      <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 transition-colors">
        <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Hledat místo..."
          className="w-full pl-9 pr-9 py-2.5 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none rounded-xl"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {filteredMarkers.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto">
          {filteredMarkers.map((marker) => (
            <li
              key={marker.id}
              className="px-4 py-2.5 text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
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
