import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchAppStats } from "@/services/serverApi";
import StatsGrid from "@/components/admin/StatsGrid";

export const metadata: Metadata = {
  title: "Admin Panel | CoVenku",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  let stats = null;
  let error: string | null = null;

  try {
    const res = await fetchAppStats();
    stats = res.data ?? null;
  } catch (e) {
    error = e instanceof Error ? e.message : "Nepodařilo se načíst statistiky.";
  }

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Přehled</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Souhrnné statistiky platformy CoVenku.
        </p>
      </header>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl border border-border bg-card animate-pulse"
                />
              ))}
            </div>
          }
        >
          <StatsGrid stats={stats!} />
        </Suspense>
      )}
    </article>
  );
}
