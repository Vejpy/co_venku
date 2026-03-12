"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { fetchCulturePlacesRaw, fetchAllEvents, fetchEventsByPlace, signUpForEvent, fetchAllOrganizations } from "@/services/api";
import type { CultureEvent, Organization } from "@/types/api";
import type { CulturePlace, MarkerData } from "@/types/map";
import { PlaceList } from "@/components/places/PlaceList";
import PlaceTypeIcon, { getTypeIconMeta } from "@/components/map/PlaceTypeIcon";
import { Calendar, Globe, X, ChevronDown, ChevronUp, MapPin, Clock, UserPlus, CheckCircle, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

const MapContainer = dynamic(() => import("@/components/map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/30">
      <span className="text-sm text-muted-foreground animate-pulse">Načítám mapu…</span>
    </div>
  ),
});

function getCoords(place: CulturePlace): [number, number] | null {
  const lat = (place as unknown as { lat?: number }).lat ?? place.address?.lat;
  const lon = (place as unknown as { lon?: number }).lon ?? place.address?.lon;
  if (!lat || !lon) return null;
  return [Number(lat), Number(lon)];
}

export default function PlacesLayoutClient() {
  const [places, setPlaces] = useState<CulturePlace[]>([]);
  const [allEvents, setAllEvents] = useState<CultureEvent[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  const [panelPlace, setPanelPlace] = useState<CulturePlace | null>(null);
  const [panelEvents, setPanelEvents] = useState<CultureEvent[]>([]);
  const [panelLoading, setPanelLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [joinedIds, setJoinedIds] = useState<Set<number>>(new Set());
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { user } = useAuth();

  const placesRef = useRef(places);
  const allEventsRef = useRef(allEvents);
  useEffect(() => { placesRef.current = places; }, [places]);
  useEffect(() => { allEventsRef.current = allEvents; }, [allEvents]);

  useEffect(() => {
    Promise.all([
      fetchCulturePlacesRaw().then((r) => {
        setPlaces(Array.isArray(r.data) ? r.data : []);
      }).catch(() => {}),
      fetchAllEvents().then((r) => {
        if (r.data) setAllEvents(r.data);
      }).catch(() => {}),
      fetchAllOrganizations().then((r) => {
        if (r.data) setOrganizations(r.data);
      }).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const openPanel = (placeId: number) => {
    const place = placesRef.current.find((p) => Number(p.id) === placeId);
    if (!place) return;
    setPanelPlace(place);
    setExpandedId(null);
    setPanelLoading(true);
    fetchEventsByPlace(placeId)
      .then((res) => setPanelEvents(res.data ?? []))
      .catch(() => {
        setPanelEvents(
          allEventsRef.current.filter((e) => Number(e.culturePlaceId) === placeId),
        );
      })
      .finally(() => setPanelLoading(false));
  };

  const openPanelRef = useRef(openPanel);
  useEffect(() => { openPanelRef.current = openPanel; });

  // Filtered places and events based on search
  const filteredPlaces = useMemo(() => {
    if (!debouncedSearch) return places;
    const query = debouncedSearch.toLowerCase();
    
    return places.filter(place => {
      // Search in place name/type
      const placeMatch = 
        place.name.toLowerCase().includes(query) || 
        place.type.toLowerCase().includes(query);
      
      if (placeMatch) return true;

      // Search in events of this place
      const eventsMatch = allEvents.some(event => 
        (Number(event.culturePlaceId) === Number(place.id)) && (
          (event.name?.toLowerCase().includes(query)) ||
          (event.description?.toLowerCase().includes(query)) ||
          (event.type?.toLowerCase().includes(query))
        )
      );

      return eventsMatch;
    });
  }, [places, allEvents, debouncedSearch]);

  const markers: MarkerData[] = filteredPlaces
    .filter((p) => !!getCoords(p))
    .map((p) => {
      const coords = getCoords(p)!;
      const count = allEvents.filter((e) => Number(e.culturePlaceId) === Number(p.id)).length;
      const org = p.organizationId ? organizations.find(o => o.id === p.organizationId) : null;
      return {
        id: Number(p.id),
        number: Math.max(count, 1),
        name: p.name,
        title: p.name,
        description: p.description ?? p.type,
        type: p.type,
        position: coords,
        website: (p as unknown as { webUrl?: string }).webUrl ?? p.website,
        organizationName: org?.name
      };
    });

  const renderPopup = (markerData: MarkerData) => {
    const { color } = getTypeIconMeta(markerData.type ?? "");
    return (
      <div className="p-3 space-y-2 min-w-[200px]">
        <div className="flex items-center gap-1.5">
          <PlaceTypeIcon type={markerData.type ?? ""} className="w-3.5 h-3.5" />
          <p className={`text-[10px] uppercase tracking-widest font-semibold ${color}`}>
            {markerData.type}
          </p>
        </div>
        <h3 className="text-sm font-bold text-foreground leading-snug">{markerData.title}</h3>
        {markerData.description && markerData.description !== markerData.type && (
          <p className="text-xs text-foreground/60 line-clamp-2">{markerData.description}</p>
        )}
        {markerData.organizationName && (
           <p className="text-[10px] font-medium text-primary mt-1 truncate" title={markerData.organizationName}>
              🏢 Spravováno: {markerData.organizationName}
           </p>
        )}
        {markerData.website && (
          <a href={markerData.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:underline">
            <Globe className="w-3 h-3" /> Web místa
          </a>
        )}
        <button
          onClick={() => openPanelRef.current(markerData.id)}
          className="w-full mt-1 bg-primary text-primary-foreground py-1.5 px-3 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          Zobrazit akce →
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full md:flex-row">
      {/* Left sidebar */}
      <div className="w-full md:w-72 lg:w-80 flex flex-col border-r border-border">
        {/* Search Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Hledat místa nebo akce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <PlaceList
            places={filteredPlaces}
            selectedPlaceId={selectedPlaceId}
            onPlaceSelect={(id: number) => {
              setSelectedPlaceId(id);
              openPanelRef.current(id);
            }}
            isLoading={loading}
          />
        </div>
      </div>

      {/* Map + event panel */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-sm text-muted-foreground animate-pulse">Načítám akce…</span>
            </div>
          )}
          <MapContainer markersData={markers} renderPopup={renderPopup} />
        </div>

        {/* Event panel */}
        {panelPlace && (
          <aside className="w-80 flex flex-col border-l border-border bg-card overflow-hidden">
            {/* Panel header */}
            <div className="px-4 py-3 border-b border-border flex justify-between items-start gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <PlaceTypeIcon type={panelPlace.type ?? ""} className="w-5 h-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    {panelPlace.type}
                  </p>
                  <h2 className="text-sm font-bold text-foreground leading-snug truncate">{panelPlace.name}</h2>
                </div>
              </div>
              <button
                onClick={() => setPanelPlace(null)}
                className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors shrink-0"
                aria-label="Zavřít panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Event list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {panelLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
                  ))
                : panelEvents.length === 0
                ? (
                  <div className="py-10 text-center">
                    <Calendar className="w-7 h-7 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">V tomto místě nejsou žádné akce.</p>
                  </div>
                )
                : panelEvents.map((ev) => {
                   const org = ev.organizationId ? organizations.find(o => o.id === ev.organizationId) : null;
                   return (
                      <ReadOnlyEventCard
                        key={ev.id}
                        event={ev}
                        expanded={expandedId === ev.id}
                        onToggle={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
                        isLoggedIn={!!user}
                        isJoined={joinedIds.has(ev.id)}
                        organizationName={org?.name}
                        onJoin={async () => {
                          try {
                            await signUpForEvent(ev.id);
                            setJoinedIds((prev) => new Set([...prev, ev.id]));
                            toast.success(`Přihlášen na: ${ev.name ?? "akci"}`);
                          } catch {
                            toast.error("Nepodařilo se přihlásit na akci.");
                          }
                        }}
                      />
                   );
                })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function TimeSlotGroups({ slots }: { slots: { start: string; end?: string | null }[] }) {
  const [showAll, setShowAll] = useState(false);
  const grouped = slots.reduce<Record<string, { start: string; end?: string | null }[]>>((acc, slot) => {
    const key = slot.start.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort();
  const visible = showAll ? dates : dates.slice(0, 5);
  const remaining = dates.length - 5;
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground mb-1.5 flex items-center gap-1">
        <Clock className="w-3 h-3" /> Termíny ({slots.length})
      </p>
      <ul className="space-y-1">
        {visible.map((dk) => {
          const daySlots = grouped[dk];
          const label = new Date(dk).toLocaleDateString("cs-CZ", { weekday: "short", day: "numeric", month: "short" });
          const times = daySlots.map((s) => {
            const from = new Date(s.start).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });
            const to = s.end ? new Date(s.end).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" }) : null;
            return to ? `${from}–${to}` : from;
          }).join(", ");
          return (
            <li key={dk} className="text-[10px] text-muted-foreground">
              <span className="font-medium text-foreground/70 mr-1">{label}:</span>{times}
            </li>
          );
        })}
      </ul>
      {remaining > 0 && (
        <button onClick={() => setShowAll(!showAll)} className="mt-1 text-[10px] text-primary hover:underline">
          {showAll ? "Zobrazit méně" : `Dalších ${remaining} dní →`}
        </button>
      )}
    </div>
  );
}

function ReadOnlyEventCard({
  event, expanded, onToggle, isLoggedIn, isJoined, onJoin, organizationName
}: {
  event: CultureEvent;
  expanded: boolean;
  onToggle: () => void;
  isLoggedIn: boolean;
  isJoined: boolean;
  onJoin: () => Promise<void>;
  organizationName?: string | null;
}) {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isJoined || !isLoggedIn) return;
    setIsJoining(true);
    try {
      await onJoin();
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <article className="rounded-lg border border-border bg-background overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <PlaceTypeIcon type={event.type ?? ""} className="w-3.5 h-3.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{event.name ?? "Bez názvu"}</p>
            <p className="text-[10px] text-muted-foreground">{event.type}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          {event.validFrom && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <Calendar className="w-2.5 h-2.5" />
              {new Date(event.validFrom).toLocaleDateString("cs-CZ", { day: "numeric", month: "short" })}
            </span>
          )}
          {expanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-border">
          {event.description && (
            <p className="text-xs text-foreground/75 mt-2 line-clamp-5">{event.description}</p>
          )}
          {event.timeSlots && event.timeSlots.length > 0 && (
            <TimeSlotGroups slots={event.timeSlots} />
          )}
          {event.address?.city && (
            <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0" />
              {[event.address.street, event.address.city].filter(Boolean).join(", ")}
            </p>
          )}
          {event.url && (
            <a href={event.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline">
              <Globe className="w-3 h-3" /> Web akce
            </a>
          )}
          
          {organizationName && (
             <div className="pt-2">
                 <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5 truncate rounded-lg bg-muted/50 px-2 py-1.5 w-fit border border-border" title={organizationName}>
                    🏢 Spravuje organizace: <span className="text-foreground truncate max-w-[120px]">{organizationName}</span>
                 </p>
             </div>
          )}

          <div className="pt-2 border-t border-border mt-2">
            {!isLoggedIn ? (
              <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                <UserPlus className="w-3 h-3" />
                Pro přihlášení na akci se musíte nejdříve přihlásit do systému.
              </p>
            ) : isJoined ? (
              <p className="text-xs font-medium text-green-600 dark:text-green-500 flex items-center gap-1.5 bg-green-500/10 px-2 py-1.5 rounded-md w-fit">
                <CheckCircle className="w-3.5 h-3.5" />
                Jste přihlášeni k účasti
              </p>
            ) : (
              <button
                onClick={handleJoin}
                disabled={isJoining}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {isJoining ? "Přihlašování..." : "Přihlásit se na akci"}
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
