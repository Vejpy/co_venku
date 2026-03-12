"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import {
  fetchAllEvents,
  signUpForEvent,
  leaveEvent,
  fetchEventsByPlace,
} from "@/services/api";
import type { CultureEvent, CulturePlace } from "@/types/api";
import type { MarkerData } from "@/types/map";
import { toast } from "sonner";
import PlaceTypeIcon, { getTypeIconMeta } from "@/components/map/PlaceTypeIcon";
import { Globe, X, Calendar, ChevronDown, ChevronUp, Clock, MapPin } from "lucide-react";

const MapContainer = dynamic(() => import("@/components/map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted rounded-xl">
      Načítání mapy…
    </div>
  ),
});

type FilterType = "all" | "joined" | "owned";

interface Props {
  ownedEvents: CultureEvent[];
  participatingEvents: CultureEvent[];
  places: CulturePlace[];
  userId: number;
}

function getCoords(place: CulturePlace): [number, number] | null {
  const lat = (place as unknown as { lat?: number }).lat ?? place.address?.lat;
  const lon = (place as unknown as { lon?: number }).lon ?? place.address?.lon;
  if (!lat || !lon) return null;
  return [Number(lat), Number(lon)];
}

export default function UserMapTab({
  ownedEvents,
  participatingEvents,
  places,
  userId,
}: Props) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [allEvents, setAllEvents] = useState<CultureEvent[]>([]);
  const [joined, setJoined] = useState<CultureEvent[]>(participatingEvents);
  const [loading, setLoading] = useState(true);

  const [selectedPlace, setSelectedPlace] = useState<CulturePlace | null>(null);
  const [placeEvents, setPlaceEvents] = useState<CultureEvent[]>([]);
  const [placeEventsLoading, setPlaceEventsLoading] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

  // Refs so popup closure never goes stale
  const placesRef = useRef(places);
  const allEventsRef = useRef(allEvents);
  useEffect(() => { placesRef.current = places; }, [places]);
  useEffect(() => { allEventsRef.current = allEvents; }, [allEvents]);

  useEffect(() => {
    fetchAllEvents()
      .then((r) => { if (r.data) setAllEvents(r.data); })
      .catch(() => toast.error("Nepodařilo se načíst všechny akce."))
      .finally(() => setLoading(false));
  }, []);

  // Stable function — uses refs so it's never stale
  const openPlacePanel = (placeId: number) => {
    const place = placesRef.current.find((p) => Number(p.id) === placeId);
    if (!place) return;
    setSelectedPlace(place);
    setExpandedEventId(null);
    setPlaceEventsLoading(true);
    fetchEventsByPlace(placeId)
      .then((res) => setPlaceEvents(res.data ?? []))
      .catch(() => {
        const fallback = allEventsRef.current.filter(
          (e) => Number(e.culturePlaceId) === placeId,
        );
        setPlaceEvents(fallback);
      })
      .finally(() => setPlaceEventsLoading(false));
  };

  // Stable ref for the handler — passed into map popup so it's never recreated
  const openPlacePanelRef = useRef(openPlacePanel);
  useEffect(() => { openPlacePanelRef.current = openPlacePanel; });

  // ── Markers ────────────────────────────────────────────────────────────────
  const markers = useMemo((): MarkerData[] => {
    let srcEvents: CultureEvent[];
    if (filter === "joined") srcEvents = joined;
    else if (filter === "owned") srcEvents = ownedEvents;
    else srcEvents = allEvents;

    const activePlaceIds = new Set(
      srcEvents.map((e) => Number(e.culturePlaceId)).filter(Boolean),
    );

    return places
      .filter((p) => {
        if (!getCoords(p)) return false;
        if (filter === "all") return true;
        return activePlaceIds.has(Number(p.id));
      })
      .map((p) => {
        const coords = getCoords(p)!;
        const count = srcEvents.filter(
          (e) => Number(e.culturePlaceId) === Number(p.id),
        ).length;
        return {
          id: Number(p.id),
          number: Math.max(count, 1),
          name: p.name ?? "Neznámé místo",
          title: p.name ?? "Neznámé místo",
          description: p.description ?? p.type ?? undefined,
          type: p.type ?? "",
          position: coords,
          website: p.webUrl ?? (p as unknown as { website?: string }).website,
        };
      });
  }, [allEvents, joined, ownedEvents, places, filter]);

  // ── Popup (stable — delegates to ref) ─────────────────────────────────────
  const renderPopup = (markerData: MarkerData) => {
    const { color } = getTypeIconMeta(markerData.type ?? "");
    return (
      <div className="p-3 space-y-2 min-w-[190px]">
        <div className="flex items-center gap-1.5">
          <PlaceTypeIcon type={markerData.type ?? ""} className="w-3.5 h-3.5" />
          <p className={`text-[10px] uppercase tracking-widest font-semibold ${color}`}>
            {markerData.type}
          </p>
        </div>
        <h3 className="text-sm font-bold text-foreground leading-snug">{markerData.name}</h3>
        {markerData.description && markerData.description !== markerData.type && (
          <p className="text-xs text-foreground/60 line-clamp-2">{markerData.description}</p>
        )}
        {markerData.website && (
          <a href={markerData.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:underline">
            <Globe className="w-3 h-3" /> Web
          </a>
        )}
        <button
          onClick={() => openPlacePanelRef.current(markerData.id)}
          className="w-full mt-1 bg-primary text-primary-foreground py-1.5 px-3 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          Zobrazit akce →
        </button>
      </div>
    );
  };

  const handleJoin = async (eventId: number) => {
    try {
      await signUpForEvent(eventId);
      toast.success("Přihlášení proběhlo úspěšně!");
      const ev = allEventsRef.current.find((e) => e.id === eventId);
      if (ev) setJoined((prev) => [...prev, ev]);
    } catch {
      toast.error("Přihlášení na akci se nezdařilo.");
    }
  };

  const handleLeave = async (eventId: number) => {
    try {
      await leaveEvent(eventId);
      toast.success("Odhlášení proběhlo úspěšně.");
      setJoined((prev) => prev.filter((e) => e.id !== eventId));
    } catch {
      toast.error("Odhlášení z akce se nezdařilo.");
    }
  };

  return (
    <section className="space-y-4">
      {/* Header + filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-xl border border-border bg-card/50 px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Interaktivní mapa akcí</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Klikněte na kulturní místo a zobrazte dostupné akce.
          </p>
        </div>
        <nav className="flex bg-muted rounded-lg p-1 gap-0.5">
          <FilterBtn active={filter === "all"}    onClick={() => { setFilter("all");    setSelectedPlace(null); }} label="Všechna místa" />
          <FilterBtn active={filter === "joined"} onClick={() => { setFilter("joined"); setSelectedPlace(null); }} label="Účastním se" />
          <FilterBtn active={filter === "owned"}  onClick={() => { setFilter("owned");  setSelectedPlace(null); }} label="Moje akce" />
        </nav>
      </div>

      {/* Map + side panel */}
      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Map */}
        <div className={`rounded-xl overflow-hidden border border-border relative flex-1 transition-all duration-300 ${selectedPlace ? "h-[460px]" : "h-[560px]"}`}>
          {loading && (
            <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-sm text-muted-foreground animate-pulse">Načítám akce…</span>
            </div>
          )}
          <MapContainer markersData={markers} renderPopup={renderPopup} />
        </div>

        {/* Event panel */}
        {selectedPlace && (
          <aside className="lg:w-96 flex flex-col rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex justify-between items-start gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <PlaceTypeIcon type={selectedPlace.type ?? ""} className="w-5 h-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-0.5">
                    {selectedPlace.type}
                  </p>
                  <h3 className="text-sm font-bold text-foreground leading-snug">{selectedPlace.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlace(null)}
                className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors shrink-0"
                aria-label="Zavřít panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[480px]">
              {placeEventsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
                  ))
                : placeEvents.length === 0
                ? (
                  <div className="py-10 text-center text-xs text-muted-foreground">
                    V tomto místě nejsou žádné akce.
                  </div>
                )
                : placeEvents.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    isJoined={joined.some((j) => j.id === ev.id)}
                    isOwned={ev.ownerId === userId}
                    expanded={expandedEventId === ev.id}
                    onToggle={() => setExpandedEventId(expandedEventId === ev.id ? null : ev.id)}
                    onJoin={() => handleJoin(ev.id)}
                    onLeave={() => handleLeave(ev.id)}
                  />
                ))}
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}

// ─── FilterBtn ───────────────────────────────────────────────────────────────

function FilterBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
        active
          ? "bg-background text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

// ─── EventCard ───────────────────────────────────────────────────────────────

function EventCard({
  event, isJoined, isOwned, expanded, onToggle, onJoin, onLeave,
}: {
  event: CultureEvent;
  isJoined: boolean;
  isOwned: boolean;
  expanded: boolean;
  onToggle: () => void;
  onJoin: () => Promise<void>;
  onLeave: () => Promise<void>;
}) {
  const [acting, setActing] = useState(false);
  const doJoin  = async () => { setActing(true); await onJoin();  setActing(false); };
  const doLeave = async () => { setActing(true); await onLeave(); setActing(false); };

  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 hover:bg-muted/40 transition-colors"
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            {event.name ?? "Bez názvu"}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{event.type}</p>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          {event.validFrom && (
            <span className="text-[10px] text-muted-foreground">
              {new Date(event.validFrom).toLocaleDateString("cs-CZ")}
            </span>
          )}
          <span className="text-muted-foreground text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-border">
          {event.description && (
            <p className="text-xs text-foreground/75 mt-2 line-clamp-5">{event.description}</p>
          )}
          {event.timeSlots && event.timeSlots.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-foreground uppercase tracking-wide mb-1">Termíny</p>
              <ul className="space-y-0.5">
                {event.timeSlots.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-1 items-start">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      {new Date(s.start).toLocaleString("cs-CZ", { dateStyle: "short", timeStyle: "short" })}
                      {s.end && <> – {new Date(s.end).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })}</>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {event.url && (
            <a href={event.url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-primary hover:underline block">
              Web akce ↗
            </a>
          )}
          <div className="pt-1">
            {isOwned ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full">
                Vaše akce
              </span>
            ) : isJoined ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">✓ Přihlášeni</span>
                <button onClick={doLeave} disabled={acting}
                  className="text-xs text-destructive border border-destructive/30 px-2 py-0.5 rounded-full hover:bg-destructive/10 transition-colors disabled:opacity-50">
                  Odhlásit se
                </button>
              </div>
            ) : (
              <button onClick={doJoin} disabled={acting}
                className="w-full bg-primary text-primary-foreground py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                {acting ? "Přihlašuji…" : "Přihlásit se"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
