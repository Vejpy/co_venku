"use client";

import { useState, useEffect } from "react";
import { usePlaces } from "@/hooks/usePlaces";
import { getPlaceTypeColor } from "@/hooks/usePlaces";

interface StatsData {
  totalPlaces: number;
  uniqueCities: number;
  uniqueTypes: number;
  placesByType: { type: string; count: number }[];
  placesByCity: { city: string; count: number }[];
}

export default function AnalyticsPage() {
  const { places, isLoading } = usePlaces();
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    if (places.length > 0) {
      const typeCount: Record<string, number> = {};
      const cityCount: Record<string, number> = {};

      places.forEach((place) => {
        const type = place.type || "Ostatní";
        typeCount[type] = (typeCount[type] || 0) + 1;

        const city = place.address?.city || "Neznámé";
        cityCount[city] = (cityCount[city] || 0) + 1;
      });

      const placesByType = Object.entries(typeCount)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      const placesByCity = Object.entries(cityCount)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setStats({
        totalPlaces: places.length,
        uniqueCities: Object.keys(cityCount).length,
        uniqueTypes: Object.keys(typeCount).length,
        placesByType,
        placesByCity,
      });
    }
  }, [places]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-8">
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
        </div>
      </div>
    );
  }

  const maxTypeCount = stats?.placesByType[0]?.count || 1;
  const maxCityCount = stats?.placesByCity[0]?.count || 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Analytika
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Přehled kulturních míst v databázi
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Places Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                  Kulturních míst
                </p>
                <p className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  {stats?.totalPlaces.toLocaleString("cs-CZ")}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Cities Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-default">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                  Pokrytých měst
                </p>
                <p className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
                  {stats?.uniqueCities.toLocaleString("cs-CZ")}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Places by Type */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-6">
              Místa podle typu
            </h2>
            <div className="space-y-4">
              {stats?.placesByType.map((item, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {item.type}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                      style={{
                        width: `${(item.count / maxTypeCount) * 100}%`,
                        backgroundColor: getPlaceTypeColor(item.type),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 10 Cities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-6">
              Top 10 měst
            </h2>
            <div className="space-y-3">
              {stats?.placesByCity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 group hover:bg-gray-50 dark:hover:bg-gray-700 -mx-2 px-2 py-1.5 rounded-md transition-colors"
                >
                  <span className="w-5 text-xs font-bold text-gray-400 dark:text-gray-500 tabular-nums">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1.5">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.city}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {item.count} míst
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.count / maxCityCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Type Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            {
              label: "Divadla",
              value:
                stats?.placesByType.find(
                  (t) => t.type.toLowerCase() === "divadlo",
                )?.count || 0,
              color: "#e74c3c",
            },
            {
              label: "Kina",
              value:
                stats?.placesByType.find((t) => t.type.toLowerCase() === "kino")
                  ?.count || 0,
              color: "#9b59b6",
            },
            {
              label: "Muzea",
              value:
                stats?.placesByType.find(
                  (t) => t.type.toLowerCase() === "muzeum",
                )?.count || 0,
              color: "#3498db",
            },
            {
              label: "Galerie",
              value:
                stats?.placesByType.find(
                  (t) => t.type.toLowerCase() === "galerie",
                )?.count || 0,
              color: "#1abc9c",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-10 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                    {item.value}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {item.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
