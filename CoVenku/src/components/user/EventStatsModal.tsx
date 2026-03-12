"use client";

import { useState, useEffect } from "react";
import {
  X,
  BarChart2,
  Eye,
  Users,
  TrendingUp,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { fetchEventAnalytics } from "@/services/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import type { CultureEvent } from "@/types/api";

interface EventStatsModalProps {
  event: CultureEvent;
  onClose: () => void;
}

interface EventStats {
  totalAttendees: number;
  views: number;
  conversionRate: number;
  ageDemographics: { group: string; count: number }[];
  genderDemographics: { gender: string; count: number }[];
  salesOverTime: { date: string; count: number }[];
}

type RawStatItem = Record<string, unknown>;

type RawStats = Partial<EventStats> & {
  AgeDemographics?: RawStatItem[];
  GenderDemographics?: RawStatItem[];
  SalesOverTime?: RawStatItem[];
};

const CHART_COLORS = ["#2563eb", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0"];
const ACCENT_BLUE = "#2563eb";

export default function EventStatsModal({
  event,
  onClose,
}: EventStatsModalProps) {
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<EventStats | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const gridColor = isDark ? "#27272a" : "#f3f4f6";
  const tickColor = isDark ? "#71717a" : "#9ca3af";
  const tooltipBg = isDark ? "#18181b" : "#ffffff";
  const tooltipBorder = isDark ? "#27272a" : "#e5e7eb";

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);

      try {
        const res = await fetchEventAnalytics(event.id);

        if (res?.data) {
          const data = res.data as RawStats;

          const normalized: EventStats = {
            totalAttendees: Number(data.totalAttendees ?? 0),
            views: Number(data.views ?? 0),
            conversionRate: Number(data.conversionRate ?? 0),

            ageDemographics: (Array.isArray(data.ageDemographics)
              ? data.ageDemographics
              : Array.isArray(data.AgeDemographics)
                ? data.AgeDemographics
                : []
            ).map((i: RawStatItem) => ({
              group: String(
                i.group ?? i.Group ?? i.ageGroup ?? i.AgeGroup ?? "N/A",
              ),
              count: Number(i.count ?? i.Count ?? 0),
            })),

            genderDemographics: (Array.isArray(data.genderDemographics)
              ? data.genderDemographics
              : Array.isArray(data.GenderDemographics)
                ? data.GenderDemographics
                : []
            ).map((i: RawStatItem) => ({
              gender: String(i.gender ?? i.Gender ?? "N/A"),
              count: Number(i.count ?? i.Count ?? 0),
            })),

            salesOverTime: (Array.isArray(data.salesOverTime)
              ? data.salesOverTime
              : Array.isArray(data.SalesOverTime)
                ? data.SalesOverTime
                : []
            ).map((i: RawStatItem) => ({
              date: String(i.date ?? i.Date ?? ""),
              count: Number(i.count ?? i.Count ?? 0),
            })),
          };

          setStats(normalized);
        }
      } catch {
        toast.error("Nepodařilo se načíst statistiky.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [event.id]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#f9fafb] dark:bg-zinc-950 border border-border shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-6 py-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <BarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Statistiky: {event.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Detailní analytický pohled na výkon akce
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : stats ? (
            <div className="space-y-6">
              {/* KPI */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  label="Registrace"
                  value={stats.totalAttendees}
                  icon={Users}
                />
                <MetricCard label="Zobrazení" value={stats.views} icon={Eye} />
                <MetricCard
                  label="Konverze"
                  value={`${(stats.conversionRate * 100).toFixed(1)}%`}
                  icon={TrendingUp}
                  isPercent
                />
              </div>

              {/* Time Chart */}
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-6">
                  Vývoj registrací
                </h4>

                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.salesOverTime}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke={gridColor}
                      />

                      <XAxis
                        dataKey="date"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: tickColor }}
                        tickFormatter={(str) =>
                          new Date(str).toLocaleDateString("cs-CZ", {
                            day: "numeric",
                            month: "short",
                          })
                        }
                      />

                      <YAxis
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: tickColor }}
                      />

                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: `1px solid ${tooltipBorder}`,
                          boxShadow: "none",
                          background: tooltipBg,
                          color: isDark ? "#fff" : "#000",
                        }}
                        itemStyle={{ color: ACCENT_BLUE }}
                      />

                      <Area
                        type="monotone"
                        dataKey="count"
                        name="Počet"
                        stroke={ACCENT_BLUE}
                        fill={ACCENT_BLUE}
                        fillOpacity={0.05}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age Chart */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-6">
                    Věková demografie
                  </h4>

                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.ageDemographics}
                        layout="vertical"
                        margin={{ left: -20 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="group"
                          type="category"
                          fontSize={11}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: tickColor }}
                          width={80}
                        />

                        <Tooltip
                          cursor={{
                            fill: isDark ? "rgba(255,255,255,0.05)" : "#f9fafb",
                          }}
                          contentStyle={{
                            borderRadius: "8px",
                            border: `1px solid ${tooltipBorder}`,
                            background: tooltipBg,
                          }}
                        />

                        <Bar
                          dataKey="count"
                          name="Počet"
                          fill="#64748b"
                          radius={[0, 4, 4, 0]}
                          barSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gender Chart */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-6">
                    Distribuce pohlaví
                  </h4>

                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.genderDemographics}
                          dataKey="count"
                          nameKey="gender"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          stroke="none"
                        >
                          {stats.genderDemographics.map((_, i) => (
                            <Cell
                              key={i}
                              fill={CHART_COLORS[i % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: `1px solid ${tooltipBorder}`,
                            background: tooltipBg,
                            color: isDark ? "#fff" : "#000",
                          }}
                        />

                        <Legend
                          verticalAlign="bottom"
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: "11px",
                            fontWeight: "600",
                            color: tickColor,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">Žádná data k dispozici.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  isPercent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  isPercent?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg">
          <Icon className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
        </div>

        {!isPercent && (
          <div className="flex items-center text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            LIVE
          </div>
        )}
      </div>

      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
        {label}
      </p>

      <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">
        {value}
      </div>
    </div>
  );
}
