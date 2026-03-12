"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import type { CultureEvent } from "@/types/api";
import { updateEvent } from "@/services/api";
import { toast } from "sonner";
import { UserEventActions } from "./UserEventActions";
import { CreateEventForm } from "../events/CreateEventForm";
import { EditEventModal } from "../events/EditEventModal";
import type { CulturePlace } from "@/types/api";
import {
  Music,
  Drama,
  Palette,
  Film,
  GraduationCap,
  Dumbbell,
  PartyPopper,
  Calendar,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  ChevronDown,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Event type → Lucide icon mapping
// ---------------------------------------------------------------------------

const EVENT_TYPE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  koncert: Music,
  hudba: Music,
  music: Music,
  divadlo: Drama,
  theater: Drama,
  představení: Drama,
  výstava: Palette,
  exhibition: Palette,
  galerie: Palette,
  film: Film,
  kino: Film,
  vzdělávání: GraduationCap,
  workshop: GraduationCap,
  sport: Dumbbell,
  festival: PartyPopper,
};

function getEventIcon(type: string | null) {
  if (!type) return Calendar;
  const key = type.toLowerCase();
  for (const [pattern, icon] of Object.entries(EVENT_TYPE_ICONS)) {
    if (key.includes(pattern)) return icon;
  }
  return Calendar;
}

/** Known event types for the filter dropdown */
const FILTER_TYPES = [
  "Koncert",
  "Divadlo",
  "Výstava",
  "Film",
  "Festival",
  "Workshop",
  "Sport",
];

// ---------------------------------------------------------------------------
// Debounce hook — keeps input responsive while deferring filter computation
// ---------------------------------------------------------------------------

function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    timer.current = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer.current);
  }, [value, delay]);

  return debounced;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  events: CultureEvent[];
  loading: boolean;
  /** Current user id — if matches event.ownerId, show Edit/Delete */
  userId?: number;
  onRefresh?: () => void;
  places: CulturePlace[];
  organizations: import("@/types/api").Organization[];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function MyEventsTab({
  events,
  loading,
  userId,
  onRefresh,
  places,
  organizations,
}: Props) {
  // ── Search: instant input, debounced filter ──────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 200);

  const [typeFilter, setTypeFilter] = useState("");
  const [editingEvent, setEditingEvent] = useState<CultureEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // ── Memoised filtering — never recomputes unless data or filter changes
  const filtered = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch =
        !debouncedSearch ||
        (ev.name ?? "").toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesType =
        !typeFilter ||
        (ev.type ?? "").toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [events, debouncedSearch, typeFilter]);

  if (loading) return <Skeleton />;

  if (events.length === 0) {
    return (
      <>
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Zatím jste nevytvořili žádnou událost.
          <div className="mt-4">
            <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
              Vytvořit událost
            </button>
          </div>
        </div>
        {isCreating && (
          <CreateEventForm 
            places={places} 
            organizations={organizations}
            onCancel={() => setIsCreating(false)} 
            onSuccess={() => { setIsCreating(false); onRefresh?.(); }} 
          />
        )}
      </>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setIsCreating(true)} className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-white transition-colors">
          Vytvořit událost
        </button>
      </div>

      {/* ── Toolbar: Search + Type filter ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 bg-card shadow-sm p-4 rounded-xl border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Hledat podle názvu…"
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="relative w-full sm:w-48">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Všechny typy</option>
            {FILTER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* ── Results count ────────────────────────────────────────────── */}
      <p className="text-xs text-muted-foreground">
        {filtered.length} z {events.length} událostí
      </p>

      {/* ── Table ────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Název</th>
              <th className="px-4 py-3">Typ</th>
              <th className="px-4 py-3">Od</th>
              <th className="px-4 py-3">Do</th>
              <th className="px-4 py-3 text-right">Akce</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  Žádné výsledky.
                </td>
              </tr>
            ) : (
              filtered.map((ev) => {
                const Icon = getEventIcon(ev.type);
                const isOwner = true;
                return (
                  <tr
                    key={ev.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {ev.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        {ev.type ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(ev.validFrom).toLocaleDateString("cs-CZ")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {ev.validTo
                        ? new Date(ev.validTo).toLocaleDateString("cs-CZ")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isOwner && (
                        <UserEventActions
                          eventId={ev.id}
                          eventName={ev.name ?? ""}
                          onEdited={() => setEditingEvent(ev)}
                          onDeleted={() => onRefresh?.()}
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ---- Create modal ---- */}
      {isCreating && (
        <CreateEventForm 
          places={places} 
          organizations={organizations} 
          onCancel={() => setIsCreating(false)} 
          onSuccess={() => { setIsCreating(false); onRefresh?.(); }} 
        />
      )}

      {/* ---- Edit modal ---- */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          places={places}
          onClose={() => setEditingEvent(null)}
          onSaved={() => {
            setEditingEvent(null);
            onRefresh?.();
          }}
        />
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function Skeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-10 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  );
}
