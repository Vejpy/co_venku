"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProfileHeader from "./ProfileHeader";
import MyEventsTab from "./MyEventsTab";
import ParticipatingTab from "./ParticipatingTab";
import OrganizationTab from "./OrganizationTab";
import SettingsTab from "./SettingsTab";
import UserMapTab from "./UserMapTab";
import StatsTab from "./StatsTab";
import RecommendationsTab from "./RecommendationsTab";
import {
  fetchUserEvents,
  fetchParticipatingEvents,
  fetchMyOrganizationsClient,
  fetchCulturePlacesRaw,
} from "@/services/api";
import type { CultureEvent, Organization, User, CulturePlace } from "@/types/api";
import type { MarkerData } from "@/types/map";
import { Calendar, Map, Star, BarChart2, Building2, Settings, Sparkles, Clock } from "lucide-react";

// ─── Tab definition ───────────────────────────────────────────────────────────

export type Tab =
  | "overview"
  | "map"
  | "events"       // my-events + participating merged
  | "stats"
  | "recommendations"
  | "organization"
  | "settings";

const TABS: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview",       label: "Přehled",       icon: Calendar },
  { key: "map",            label: "Mapa akcí",      icon: Map },
  { key: "events",         label: "Akce",           icon: Star },
  { key: "stats",          label: "Statistiky",     icon: BarChart2 },
  { key: "recommendations",label: "AI Tipy",        icon: Sparkles },
  { key: "organization",   label: "Organizace",     icon: Building2 },
  { key: "settings",       label: "Nastavení",      icon: Settings },
];

const TAB_KEYS = TABS.map((t) => t.key);

interface Props {
  initialUser: User;
  initialOwnedEvents: CultureEvent[];
  initialParticipatingEvents: CultureEvent[];
  initialOrganizations: Organization[];
  places: CulturePlace[];
}

export default function UserClient({
  initialUser,
  initialOwnedEvents,
  initialParticipatingEvents,
  initialOrganizations,
  places,
}: Props) {
  const searchParams = useSearchParams();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [eventsSubTab, setEventsSubTab] = useState<"my" | "participating">("my");
  const [ownedEvents, setOwnedEvents] = useState(initialOwnedEvents);
  const [participatingEvents, setParticipatingEvents] = useState(initialParticipatingEvents);
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [allPlaces, setAllPlaces] = useState(places);
  const [refreshing, setRefreshing] = useState(false);

  // Sync tab from URL ?tab=...
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && TAB_KEYS.includes(tab as Tab)) {
      setActiveTab(tab as Tab);
    }
  }, [searchParams]);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [owned, participating, orgs, newPlaces] = await Promise.all([
        fetchUserEvents(initialUser.id).then((r) => r.data ?? []),
        fetchParticipatingEvents(initialUser.id).then((r) => r.data ?? []).catch(() => []),
        fetchMyOrganizationsClient().then((r) => r.data ?? []).catch(() => []),
        fetchCulturePlacesRaw().then((r) => r.data ?? []),
      ]);
      setOwnedEvents(owned);
      setParticipatingEvents(participating);
      setOrganizations(orgs);
      setAllPlaces(newPlaces);
    } catch { /* individual failures handled */ }
    finally { setRefreshing(false); }
  }, [initialUser.id]);

  // Upcoming events the user is registered for (next 30 days, sorted)
  const upcomingEvents = participatingEvents
    .filter((e) => e.validFrom && new Date(e.validFrom) > new Date())
    .sort((a, b) => new Date(a.validFrom!).getTime() - new Date(b.validFrom!).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-5">
        <ProfileHeader user={initialUser} organizations={organizations} />

        {/* Tab navigation */}
        <nav className="flex gap-1 rounded-xl border border-border bg-muted/60 p-1 overflow-x-auto" aria-label="Uživatelské záložky">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === key
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* ── Overview ──────────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                label="Moje akce"
                value={ownedEvents.length}
                icon={Star}
                onClick={() => { setActiveTab("events"); setEventsSubTab("my"); }}
              />
              <StatCard
                label="Účastním se"
                value={participatingEvents.length}
                icon={Calendar}
                onClick={() => { setActiveTab("events"); setEventsSubTab("participating"); }}
              />
              <StatCard
                label="Organizace"
                value={organizations.length}
                icon={Building2}
                onClick={() => setActiveTab("organization")}
              />
              <StatCard
                label="Nadcházející"
                value={upcomingEvents.length}
                icon={Clock}
              />
            </div>

            {/* Upcoming events widget */}
            {upcomingEvents.length > 0 && (
              <section className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Nejbližší akce
                  </h2>
                  <button
                    onClick={() => { setActiveTab("events"); setEventsSubTab("participating"); }}
                    className="text-xs text-primary hover:underline"
                  >
                    Všechny →
                  </button>
                </div>
                <ul className="divide-y divide-border">
                  {upcomingEvents.map((ev) => (
                    <li key={ev.id} className="px-4 py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{ev.name ?? "Bez názvu"}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{ev.type}</p>
                      </div>
                      {ev.validFrom && (
                        <time
                          dateTime={ev.validFrom}
                          className="shrink-0 text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md"
                        >
                          {new Date(ev.validFrom).toLocaleDateString("cs-CZ", {
                            weekday: "short", day: "numeric", month: "short",
                          })}
                        </time>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Quick actions */}
            <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Prozkoumat mapu", desc: "Najdi akce v okolí", tab: "map" as Tab, icon: Map },
                { label: "AI doporučení", desc: "Personalizované tipy", tab: "recommendations" as Tab, icon: Sparkles },
                { label: "Spravovat organizaci", desc: "Nastavení a členové", tab: "organization" as Tab, icon: Building2 },
              ].map(({ label, desc, tab, icon: Icon }) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="text-left rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 hover:bg-card/80 transition-all group"
                >
                  <Icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{desc}</p>
                </button>
              ))}
            </section>
          </div>
        )}

        {/* ── Map ───────────────────────────────────────────────────────────── */}
        {activeTab === "map" && (
          <UserMapTab
            ownedEvents={ownedEvents}
            participatingEvents={participatingEvents}
            places={places}
            userId={initialUser.id}
          />
        )}

        {/* ── Events (my + participating merged into sub-tabs) ──────────────── */}
        {activeTab === "events" && (
          <div className="space-y-4">
            <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
              <SubTabBtn active={eventsSubTab === "my"}            onClick={() => setEventsSubTab("my")}            label="Moje akce" />
              <SubTabBtn active={eventsSubTab === "participating"} onClick={() => setEventsSubTab("participating")} label="Účastním se" />
            </div>
            {eventsSubTab === "my" && (
              <MyEventsTab
                events={ownedEvents}
                loading={refreshing}
                userId={initialUser.id}
                onRefresh={refreshData}
                places={places}
                organizations={organizations}
              />
            )}
            {eventsSubTab === "participating" && (
              <ParticipatingTab
                events={participatingEvents}
                loading={refreshing}
                onLeave={(id) => setParticipatingEvents((prev) => prev.filter((e) => e.id !== id))}
              />
            )}
          </div>
        )}

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        {activeTab === "stats" && <StatsTab ownedEvents={ownedEvents} />}

        {/* ── AI Recommendations ────────────────────────────────────────────── */}
        {activeTab === "recommendations" && <RecommendationsTab />}

        {/* ── Organization ──────────────────────────────────────────────────── */}
        {activeTab === "organization" && (
          <OrganizationTab
            organizations={organizations}
            ownedEvents={ownedEvents}
            places={allPlaces}
            onRefresh={refreshData}
          />
        )}

        {/* ── Settings ──────────────────────────────────────────────────────── */}
        {activeTab === "settings" && <SettingsTab logout={logout} />}
      </div>
    </div>
  );
}

// ─── Sub tab button ───────────────────────────────────────────────────────────

function SubTabBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
        active ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon: Icon, onClick,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className="text-left rounded-xl border border-border bg-card px-4 py-3 flex flex-col gap-2 hover:border-primary/30 transition-colors disabled:cursor-default"
    >
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-2xl font-bold text-foreground tabular-nums">{value}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
    </button>
  );
}
