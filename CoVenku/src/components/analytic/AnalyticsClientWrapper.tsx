"use client";

import { usePlaces } from "@/hooks/usePlaces";
import { CulturePlace } from "@/types/map";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default function AnalyticsClientWrapper() {
  const { places, isLoading } = usePlaces();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 bg-gray-200 dark:bg-gray-700 rounded-lg"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
  }

  const mappedPlaces = places.map((p: CulturePlace) => ({
    id: p.id,
    name: p.name,
    imageUrl: "",
    visitors: 0,
    description: p.description,
  }));

  return <AnalyticsDashboard places={mappedPlaces} />;
}
