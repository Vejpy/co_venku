"use client";

import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { MarkerData } from "../../types/map";
import { fetchMarkers } from "../../utils/mapData";
import dynamic from "next/dynamic";
import { useTheme } from "../../context/ThemeContext";
import {
  Map,
  MapClusterLayer,
  MapControls,
  MapPopup,
} from "../../components/ui/map";

interface CulturePlace {
  name?: string;
  description?: string;
  website?: string;
  webUrl?: string;
  type?: string;
  address?: string;
  position: [number, number];
}

interface MapContainerProps {
  markersData?: MarkerData[];
}

const DEFAULT_CENTER: [number, number] = [15.8326259, 50.2094261];

function MapControlsExample() {
  return <MapControls />;
}

function MapContainer({}: MapContainerProps) {
  const [markersDataState, setMarkersDataState] = useState<MarkerData[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection<
    GeoJSON.Point,
    MarkerData
  > | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<CulturePlace | null>(
    null,
  );
  const { theme } = useTheme();

  useEffect(() => {
    async function loadMarkers() {
      try {
        const data = await fetchMarkers();
        console.log("Loaded markers:", data);
        setMarkersDataState(data);

        // Transform to GeoJSON
        const features = data.map((marker) => ({
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: Array.isArray(marker.position)
              ? [marker.position[1], marker.position[0]]
              : [0, 0],
          },
          properties: marker,
        }));

        const featureCollection: GeoJSON.FeatureCollection<
          GeoJSON.Point,
          MarkerData
        > = {
          type: "FeatureCollection",
          features,
        };

        console.log("GeoJSON data:", featureCollection);
        setGeoJsonData(featureCollection);
      } catch (err) {
        console.error("Failed to fetch markers:", err);
      }
    }
    loadMarkers();
  }, []);

  if (!geoJsonData) {
    return (
      <div
        style={{
          width: "100%",
          height: "90vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading map...</div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "90vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 12,
          zIndex: 10,
          width: "calc(100% - 24px)",
        }}
      >
        <SearchBar markers={markersDataState} onSelect={() => {}} />
      </div>
      <Map center={DEFAULT_CENTER} zoom={13} theme={theme}>
        <MapClusterLayer
          data={geoJsonData}
          onPointClick={(feature) => {
            if (feature && feature.properties && feature.geometry.coordinates) {
              const [lng, lat] = feature.geometry.coordinates;
              setSelectedMarker({
                ...feature.properties,
                position: [lat, lng],
              });
            }
          }}
        />
        {selectedMarker && (
          <MapPopup
            latitude={selectedMarker.position[0]}
            longitude={selectedMarker.position[1]}
            closeButton={true}
            onClose={() => setSelectedMarker(null)}
          >
            <div style={{ maxWidth: 300, fontFamily: "Arial, sans-serif" }}>
              <h3
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "1.2em",
                  color: theme === "dark" ? "#fff" : "#000",
                }}
              >
                {selectedMarker.name}
              </h3>
              {selectedMarker.description && (
                <p
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "0.9em",
                    color: theme === "dark" ? "#ccc" : "#333",
                  }}
                >
                  {selectedMarker.description}
                </p>
              )}
              {selectedMarker.type && (
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "0.85em",
                    fontWeight: "bold",
                    color: theme === "dark" ? "#aaa" : "#555",
                  }}
                >
                  Type: {selectedMarker.type}
                </p>
              )}
              {selectedMarker.address && (
                <p
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "0.9em",
                    color: theme === "dark" ? "#ccc" : "#333",
                  }}
                >
                  Address: {selectedMarker.address}
                </p>
              )}
              {(selectedMarker.website || selectedMarker.webUrl) && (
                <a
                  href={selectedMarker.website ?? selectedMarker.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    backgroundColor: "#28a745",
                    color: "#fff",
                    padding: "6px 8px",
                    borderRadius: 4,
                    textDecoration: "none",
                    fontSize: "0.9em",
                  }}
                >
                  More Info
                </a>
              )}
            </div>
          </MapPopup>
        )}
        <MapControlsExample />
      </Map>
    </div>
  );
}

export default dynamic(() => Promise.resolve(MapContainer), { ssr: false });
