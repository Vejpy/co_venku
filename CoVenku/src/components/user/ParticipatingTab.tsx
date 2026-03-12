"use client";

import { useState } from "react";
import { leaveEvent } from "@/services/api";
import type { CultureEvent } from "@/types/api";
import PlaceTypeIcon from "@/components/map/PlaceTypeIcon";
import { Calendar, MapPin, X, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  events: CultureEvent[];
  loading: boolean;
  onLeave?: (eventId: number) => void;
}

export default function ParticipatingTab({ events, loading, onLeave }: Props) {
  if (loading) return <Skeleton />;

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-10 text-center">
        <Calendar className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">Žádné nadcházející akce</p>
        <p className="text-xs text-muted-foreground">Zatím se neúčastníte žádné události.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-3">
        Účastníte se <strong className="text-foreground">{events.length}</strong> {events.length === 1 ? "akce" : "akcí"}.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {events.map((ev) => (
          <EventCard key={ev.id} event={ev} onLeave={onLeave} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event, onLeave }: { event: CultureEvent; onLeave?: (id: number) => void }) {
  const [leaving, setLeaving] = useState(false);

  const handleLeave = async () => {
    setLeaving(true);
    try {
      await leaveEvent(event.id);
      toast.success(`Odhlášení z akce "${event.name}" proběhlo úspěšně.`);
      onLeave?.(event.id);
    } catch {
      toast.error("Odhlášení se nezdařilo.");
    } finally {
      setLeaving(false);
    }
  };

  return (
    <article className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-colors">
      {/* Color strip by type */}
      <div className="h-1 bg-gradient-to-r from-primary/40 to-primary/10" />

      <div className="p-4 flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <PlaceTypeIcon type={event.type ?? ""} className="w-4 h-4 shrink-0" />
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground truncate">
              {event.type ?? "Akce"}
            </span>
          </div>
          {event.validFrom && (
            <span className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(event.validFrom).toLocaleDateString("cs-CZ", { day: "numeric", month: "short" })}
            </span>
          )}
          {event.registrationStatus === "confirmed" && (
            <span className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded flex items-center gap-1 border border-green-100 dark:border-green-900/40">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Potvrzeno
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
          {event.name ?? "Bez názvu"}
        </h3>

        {/* Address */}
        {event.address?.city && (
          <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="w-3 h-3 shrink-0" />
            {[event.address.street, event.address.city].filter(Boolean).join(", ")}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1 mt-auto">
          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Web <ChevronRight className="w-3 h-3" />
            </a>
          )}
          <button
            onClick={handleLeave}
            disabled={leaving}
            className="ml-auto flex items-center gap-1 text-xs text-destructive border border-destructive/30 px-2.5 py-1 rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            <X className="w-3 h-3" />
            {leaving ? "Odhlašuji…" : "Odhlásit se"}
          </button>
        </div>
      </div>
    </article>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-36 rounded-xl border border-border bg-card animate-pulse" />
      ))}
    </div>
  );
}
