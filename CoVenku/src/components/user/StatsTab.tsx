"use client";

import { useState, useEffect } from "react";
import type { CultureEvent } from "@/types/api";
import { fetchEventAnalytics } from "@/services/api";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, CartesianGrid
} from "recharts";
import { Eye, Users, TrendingUp, ChevronDown, ChevronUp, AlertCircle, Calendar, ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";

interface Props {
  ownedEvents: CultureEvent[];
}

const CHART_COLORS = ["#2563eb", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0"];
const ACCENT_BLUE = "#2563eb";
const BORDER_COLOR = "#e5e7eb";

export default function StatsTab({ ownedEvents }: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(ownedEvents[0]?.id ?? null);
  const [detailOpen, setDetailOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const gridColor = isDark ? "#27272a" : "#f3f4f6";
  const tickColor = isDark ? "#71717a" : "#9ca3af";
  const tooltipBg = isDark ? "#18181b" : "#ffffff";
  const tooltipBorder = isDark ? "#27272a" : "#e5e7eb";
  const [stats, setStats] = useState<{
    totalAttendees: number;
    views: number;
    conversionRate: number;
    salesOverTime: { date: string; count: number }[];
    ageDemographics: { group: string; count: number }[];
    genderDemographics: { gender: string; count: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedEventId) return;
    setLoading(true);
    setStats(null);
    fetchEventAnalytics(selectedEventId)
      .then((res) => {
        if (res?.data) {
          const normalized = {
            ...res.data,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ageDemographics: (Array.isArray((res.data as any).ageDemographics || (res.data as any).AgeDemographics) 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ? ((res.data as any).ageDemographics || (res.data as any).AgeDemographics) : []).map((i: Record<string, unknown>) => ({
              group: String(i.group || i.Group || i.ageGroup || i.AgeGroup || "N/A"),
              count: Number(i.count ?? i.Count ?? 0)
            })),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            genderDemographics: (Array.isArray((res.data as any).genderDemographics || (res.data as any).GenderDemographics)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ? ((res.data as any).genderDemographics || (res.data as any).GenderDemographics) : []).map((i: Record<string, unknown>) => ({
              gender: String(i.gender || i.Gender || "N/A"),
              count: Number(i.count ?? i.Count ?? 0)
            })),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            salesOverTime: (Array.isArray((res.data as any).salesOverTime || (res.data as any).SalesOverTime)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ? ((res.data as any).salesOverTime || (res.data as any).SalesOverTime) : []).map((i: Record<string, unknown>) => ({
              date: i.date || i.Date || "",
              count: Number(i.count ?? i.Count ?? 0)
            })),
          };
          setStats(normalized);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedEventId]);

  if (ownedEvents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
        <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-4" />
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Žádné vlastní akce</h3>
        <p className="text-xs text-gray-500">Vytvořte svou první akci a začněte sledovat analytické údaje.</p>
      </div>
    );
  }

  const selectedEvent = ownedEvents.find((e) => e.id === selectedEventId);

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-[#f9fafb] dark:bg-zinc-950 p-6 rounded-2xl min-h-[800px]">
      {/* Sidebar */}
      <div className="w-full lg:w-72 flex-shrink-0">
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Moje Akce</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-50 dark:divide-zinc-800">
            {ownedEvents.map((ev) => (
              <button
                key={ev.id}
                onClick={() => setSelectedEventId(ev.id)}
                className={`w-full text-left px-4 py-3.5 transition-colors ${
                  ev.id === selectedEventId ? "bg-blue-50/50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <p className={`text-sm font-medium truncate ${ev.id === selectedEventId ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                  {ev.name || `Akce #${ev.id}`}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {ev.validFrom ? new Date(ev.validFrom).toLocaleDateString("cs-CZ") : "—"}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {selectedEventId && selectedEvent ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{selectedEvent.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Analytický přehled výkonu události</p>
              </div>
              <button 
                onClick={() => setDetailOpen(!detailOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {detailOpen ? "Skrýt detaily" : "Zobrazit detaily"}
                {detailOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl">
                 <div className="w-6 h-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <MetricCard label="Registrace" value={stats.totalAttendees} icon={Users} />
                  <MetricCard label="Zobrazení" value={stats.views} icon={Eye} />
                  <MetricCard label="Konverze" value={`${(stats.conversionRate * 100).toFixed(1)}%`} icon={TrendingUp} isPercent />
                </div>

                {detailOpen && (
                  <div className="space-y-6">
                    {/* Time Chart */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-6">Vývoj registrací</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={stats.salesOverTime}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis 
                              dataKey="date" 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false} 
                              tick={{ fill: tickColor }}
                              tickFormatter={(str) => new Date(str).toLocaleDateString("cs-CZ", {day: 'numeric', month: 'short'})}
                            />
                            <YAxis 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false} 
                              tick={{ fill: tickColor }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                borderRadius: '8px', 
                                border: `1px solid ${tooltipBorder}`, 
                                boxShadow: 'none',
                                background: tooltipBg,
                                color: isDark ? "#fff" : "#000"
                              }}
                              itemStyle={{ color: ACCENT_BLUE }}
                            />
                            <Area type="monotone" dataKey="count" name="Počet" stroke={ACCENT_BLUE} fill={ACCENT_BLUE} fillOpacity={0.05} strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Age Chart */}
                      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-6">Věková demografie</h4>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.ageDemographics} layout="vertical" margin={{ left: -20 }}>
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
                              <Tooltip cursor={{fill: isDark ? "rgba(255,255,255,0.05)" : "#f9fafb"}} contentStyle={{ borderRadius: '8px', border: `1px solid ${tooltipBorder}`, background: tooltipBg }} />
                              <Bar dataKey="count" name="Počet" fill="#64748b" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Gender Chart */}
                      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-6">Distribuce pohlaví</h4>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie 
                                data={stats.genderDemographics} 
                                dataKey="count" 
                                nameKey="gender" 
                                cx="50%" cy="50%" 
                                innerRadius={60} 
                                outerRadius={85} 
                                paddingAngle={5}
                                stroke="none"
                              >
                                {stats.genderDemographics.map((_, i) => (
                                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '8px', border: `1px solid ${tooltipBorder}`, background: tooltipBg, color: isDark ? "#fff" : "#000" }} />
                              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '600', color: tickColor }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-center p-8">
            <Calendar className="w-8 h-8 text-gray-200 dark:text-zinc-800 mb-4" />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Vyberte událost</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[200px]">Zvolte akci z postranního panelu pro načtení statistik.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, isPercent }: { label: string, value: string | number, icon: React.ElementType, isPercent?: boolean }) {
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
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">{label}</p>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">{value}</div>
    </div>
  );
}
