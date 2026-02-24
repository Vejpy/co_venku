"use client";

import { useMemo } from "react";

export interface Place {
  id: number;
  name: string;
  imageUrl: string;
  visitors: number;
  description?: string;
}

interface AnalyticsDashboardProps {
  places: Place[];
}

export default function AnalyticsDashboard({
  places,
}: AnalyticsDashboardProps) {
  const stats = useMemo(() => {
    const nameCount: Record<string, number> = {};

    places.forEach((place) => {
      const name = place.name || "Neznámé";
      nameCount[name] = (nameCount[name] || 0) + 1;
    });

    const placesByName = Object.entries(nameCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const topByVisitors = [...places]
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10)
      .map((p) => ({ name: p.name, visitors: p.visitors }));

    return {
      totalPlaces: places.length,
      uniqueNames: Object.keys(nameCount).length,
      placesByName,
      topByVisitors,
    };
  }, [places]);

  const maxNameCount = stats.placesByName[0]?.count || 1;
  const maxVisitors = stats.topByVisitors[0]?.visitors || 1;

  return (
    <>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
            Kulturních míst
          </p>
          <p className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
            {stats.totalPlaces.toLocaleString("cs-CZ")}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
            Unikátních míst
          </p>
          <p className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
            {stats.uniqueNames.toLocaleString("cs-CZ")}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Name */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-6">
            Místa podle názvu
          </h2>

          <div className="space-y-4">
            {stats.placesByName.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.count}
                  </span>
                </div>

                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                    style={{ width: `${(item.count / maxNameCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top by Visitors */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-6">
            Top 10 podle návštěvnosti
          </h2>

          <div className="space-y-3">
            {stats.topByVisitors.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.visitors} míst
                  </span>
                </div>

                <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                    style={{ width: `${(item.visitors / maxVisitors) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
