"use client";

import React, { useEffect, useState, useMemo } from "react";
import SearchBar from "./SearchBar";
import { MarkerData } from "../../types/map";
import { fetchMarkers } from "../../utils/mapData";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  Map,
  MapClusterLayer,
  MapControls,
  MapPopup,
} from "../../components/ui/map";

interface MapContainerProps {
  markersData?: MarkerData[];
  selectedPlaceId?: number | null;
  renderPopup?: (marker: MarkerData) => React.ReactNode;
}

const DEFAULT_CENTER: [number, number] = [15.8326259, 50.2094261];

function MapControlsExample() {
  return <MapControls />;
}

function MapContainer({ markersData, selectedPlaceId, renderPopup }: MapContainerProps) {
  // Internal fallback markers — only used when markersData prop is NOT provided
  const [internalMarkers, setInternalMarkers] = useState<MarkerData[]>([]);
  const [internalLoaded, setInternalLoaded] = useState(false);

  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const { resolvedTheme } = useTheme();
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState<number>(13);

  // Decide which markers to show: external prop wins over internal fetch
  const activeMarkers = markersData ?? internalMarkers;

  // Fly to selected place
  useEffect(() => {
    if (!selectedPlaceId) return;
    const marker = activeMarkers.find((m) => m.id === selectedPlaceId);
    if (!marker || !Array.isArray(marker.position)) return;
    const [lat, lng] = marker.position;
    setCenter([lng, lat]);
    setZoom(16);
  }, [selectedPlaceId, activeMarkers]);

  // Close popup when external markers change (filter switch)
  useEffect(() => {
    setSelectedMarker(null);
  }, [markersData]);

  // Load internal markers only when no external data supplied
  useEffect(() => {
    if (markersData !== undefined) return; // external data — skip internal fetch
    if (internalLoaded) return;
    async function loadMarkers() {
      try {
        const data = await fetchMarkers();
        setInternalMarkers(data);
      } catch (err) {
        console.error("Failed to fetch markers:", err);
      } finally {
        setInternalLoaded(true);
      }
    }
    loadMarkers();
  }, [markersData, internalLoaded]);

  // Build GeoJSON from active markers — always emit a valid FeatureCollection
  const geoJsonData = useMemo(
    (): GeoJSON.FeatureCollection<GeoJSON.Point, MarkerData> => ({
      type: "FeatureCollection" as const,
      features: activeMarkers.map((marker) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: Array.isArray(marker.position)
            ? [marker.position[1], marker.position[0]]
            : [0, 0],
        },
        properties: marker,
      })),
    }),
    [activeMarkers]
  );

  // Show loading ONLY when we're waiting for internal fetch (no external markersData)
  const isLoading = markersData === undefined && !internalLoaded;

  if (isLoading) {
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
        <div>Načítám mapu...</div>
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
        <SearchBar markers={activeMarkers} onSelect={() => {}} />
      </div>
      <Map center={center} zoom={zoom} theme={resolvedTheme as "light" | "dark" | undefined}>
        <MapClusterLayer
          data={geoJsonData}
          resolvedTheme={resolvedTheme || "light"}
          clusterColors={["#3b82f6", "#8b5cf6", "#ec4899"]}
          onPointClick={(feature) => {
            if (feature && feature.properties && feature.geometry.coordinates) {
              const [lng, lat] = feature.geometry.coordinates;
              const clicked = feature.properties as MarkerData;
              // If same marker clicked again, deselect (allows re-selecting)
              setSelectedMarker((prev) =>
                prev?.id === clicked.id ? null : { ...clicked, position: [lat, lng] }
              );
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
            {renderPopup ? (
              renderPopup(selectedMarker)
            ) : (
              <div style={{ maxWidth: 300, fontFamily: "Arial, sans-serif" }}>
                <h3
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "1.2em",
                    color: resolvedTheme === "dark" ? "#fff" : "#000",
                  }}
                >
                  {selectedMarker.name}
                </h3>
                {selectedMarker.description && (
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "0.9em",
                      color: resolvedTheme === "dark" ? "#ccc" : "#333",
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
                      color: resolvedTheme === "dark" ? "#aaa" : "#555",
                    }}
                  >
                    {selectedMarker.type}
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
                    Více info
                  </a>
                )}
              </div>
            )}
          </MapPopup>
        )}
        <MapControlsExample />
      </Map>
    </div>
  );
}

export default dynamic(() => Promise.resolve(MapContainer), { ssr: false });
