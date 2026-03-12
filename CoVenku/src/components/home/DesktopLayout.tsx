"use client";

import { PlaceMap } from "@/components/places/PlaceMap";
import { PlaceList } from "@/components/places/PlaceList";
import { CulturePlace } from "@/types/map";
import type { PlaceFeatureCollection } from "@/hooks/usePlaces";

interface Props {
  places: CulturePlace[];
  geoJson: PlaceFeatureCollection;
  selectedPlaceId: number | null;
  onSelect: (id: number | null) => void;
  isLoading: boolean;
}

export default function DesktopLayout({
  places,
  geoJson,
  selectedPlaceId,
  onSelect,
  isLoading,
}: Props) {
  return (
    <div className="hidden lg:flex flex-1 overflow-hidden">
      <aside className="w-105 shrink-0 border-r border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 max-h-screen overflow-y-auto transition-colors">
        <div className="sticky top-0 z-10 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 px-4 py-3 transition-colors">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            Kulturní místa
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Objevte kulturní místa ve vašem okolí
          </p>
        </div>

        <PlaceList
          places={places}
          selectedPlaceId={selectedPlaceId}
          onPlaceSelect={onSelect}
          isLoading={isLoading}
        />
      </aside>

      <main className="flex-1 relative">
        <PlaceMap
          geoJson={geoJson}
          selectedPlaceId={selectedPlaceId}
          onPlaceClick={onSelect}
          className="w-full h-full"
        />
      </main>
    </div>
  );
}
