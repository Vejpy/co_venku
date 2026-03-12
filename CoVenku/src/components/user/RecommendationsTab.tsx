"use client";

import { useState, useEffect } from "react";
import { fetchAIRecommendations, signUpForEvent } from "@/services/api";
import type { CultureEvent } from "@/types/api";
import { toast } from "sonner";

export default function RecommendationsTab() {
  const [events, setEvents] = useState<CultureEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [joining, setJoining] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAIRecommendations();
      setEvents(res.data ?? []);
      setLoaded(true);
    } catch {
      toast.error("Nepodařilo se načíst doporučení.");
    } finally {
      setLoading(false);
    }
  };

  const join = async (eventId: number) => {
    setJoining(eventId);
    try {
      await signUpForEvent(eventId);
      toast.success("Přihlášení proběhlo úspěšně!");
    } catch {
      toast.error("Přihlášení na akci se nezdařilo.");
    } finally {
      setJoining(null);
    }
  };

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card/50 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">✨</span>
            <h2 className="text-sm font-semibold text-foreground">AI Doporučení akcí</h2>
          </div>
          <p className="text-[11px] text-muted-foreground max-w-md">
            Na základě vaší historie akcí vám Gemini AI doporučí podobné události, které by vás mohly zajímat.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="inline-block w-3 h-3 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
              Analyzuji…
            </>
          ) : (
            <>✨ {loaded ? "Znovu doporučit" : "Získat doporučení"}</>
          )}
        </button>
      </div>

      {/* Not loaded yet */}
      {!loaded && !loading && (
        <div className="rounded-xl border border-dashed border-border py-14 text-center">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-sm font-medium text-foreground mb-1">Personalizovaná doporučení</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Klikněte na tlačítko výše a AI analyzuje vaši historii, aby vám doporučila nejrelevantnější akce.
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      )}

      {/* Results */}
      {loaded && !loading && events.length === 0 && (
        <div className="rounded-xl border border-border bg-card py-12 text-center">
          <p className="text-3xl mb-2">🤔</p>
          <p className="text-sm font-medium text-foreground mb-1">Žádná doporučení</p>
          <p className="text-xs text-muted-foreground">
            AI nenašla vhodné akce. Zkuste se přihlásit na více aktivit a zkuste to znovu.
          </p>
        </div>
      )}

      {loaded && !loading && events.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground">
            AI nalezla <strong className="text-foreground">{events.length}</strong> doporučených akcí pro vás.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {events.map((ev) => (
              <RecommendationCard
                key={ev.id}
                event={ev}
                joining={joining === ev.id}
                onJoin={() => join(ev.id)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function RecommendationCard({
  event,
  joining,
  onJoin,
}: {
  event: CultureEvent;
  joining: boolean;
  onJoin: () => void;
}) {
  const typeColor: Record<string, string> = {
    Divadlo: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    Výstava: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    Koncert: "bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300",
    Festival: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300",
  };
  const typeClass = typeColor[event.type ?? ""] ?? "bg-muted text-muted-foreground";

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors group">
      {/* Type badge header */}
      <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeClass}`}>
          {event.type ?? "Akce"}
        </span>
        {event.validFrom && (
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {new Date(event.validFrom).toLocaleDateString("cs-CZ")}
          </span>
        )}
      </div>

      <div className="px-4 pb-3 flex-1 flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
          {event.name ?? "Bez názvu"}
        </h3>
        {event.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{event.description}</p>
        )}
        {event.address?.city && (
          <p className="text-[10px] text-muted-foreground">📍 {event.address.city}</p>
        )}
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={onJoin}
          disabled={joining}
          className="w-full py-1.5 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
        >
          {joining ? "Přihlašuji…" : "Přihlásit se"}
        </button>
      </div>
    </article>
  );
}
