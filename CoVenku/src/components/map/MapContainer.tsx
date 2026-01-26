"use client";

import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { MarkerData } from "../../types/map";
import { fetchMarkers } from "../../utils/mapData";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import { useTheme } from "../../context/ThemeContext";

interface MapContainerProps {
  markersData?: MarkerData[];
}

function MapContainer({}: MapContainerProps) {
  const [markersDataState, setMarkersDataState] = useState<MarkerData[]>([]);
  const { theme } = useTheme();
  const [LeafletComponents, setLeafletComponents] = useState<{
    L: typeof import("leaflet");
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    Popup: typeof import("react-leaflet").Popup;
    useMap: typeof import("react-leaflet").useMap;
  } | null>(null);

  useEffect(() => {
    async function loadLeaflet() {
      const L = await import("leaflet");
      const { MapContainer, TileLayer, Marker, Popup, useMap } =
        await import("react-leaflet");
      setLeafletComponents({
        L,
        MapContainer,
        TileLayer,
        Marker,
        Popup,
        useMap,
      });
    }
    loadLeaflet();
  }, []);

  useEffect(() => {
    async function loadMarkers() {
      try {
        const data = await fetchMarkers();
        setMarkersDataState(data);
      } catch (err) {
        console.error("Failed to fetch markers:", err);
      }
    }
    loadMarkers();
  }, []);

  if (!LeafletComponents) return <div>Loading map...</div>;
  if (markersDataState.length === 0) return <div>Loading markers...</div>;

  const {
    L,
    MapContainer: LeafletMapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
  } = LeafletComponents;

  const firstMarker = markersDataState[0]?.position ?? [50.08804, 14.42076];

  // Tile layer URLs pro light a dark mode
  const tileUrls = {
    light:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  };

  const MapController: React.FC = () => {
    const map = useMap();

    const handleSearchSelect = (coords: LatLngExpression) => {
      map.flyTo(coords, 15, { duration: 3 });
    };

    return (
      <SearchBar markers={markersDataState} onSelect={handleSearchSelect} />
    );
  };

  return (
    <div style={{ width: "100%", height: "90vh", position: "relative" }}>
      <LeafletMapContainer
        key={theme}
        center={firstMarker}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url={tileUrls[theme]}
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />
        {markersDataState.map((marker) => {
          const [lat, lng] = marker.position as [number, number];
          return (
            <Marker
              key={marker.id}
              position={[lat, lng]}
              icon={L.divIcon({
                html: `<div style="width:20px;height:20px;background:red;border-radius:50%;"></div>`,
                className: "",
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            >
              <Popup>
                <h3>{marker.title}</h3>
                <p>{marker.description}</p>
              </Popup>
            </Marker>
          );
        })}
        <MapController />
      </LeafletMapContainer>
    </div>
  );
}

export default dynamic(() => Promise.resolve(MapContainer), { ssr: false });
