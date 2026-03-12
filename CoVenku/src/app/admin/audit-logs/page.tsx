import { fetchAuditLogs } from "@/services/serverApi";
import AuditLogTable from "@/components/admin/AuditLogTable";
import type { AuditLogItem, PagedResult } from "@/types/api";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AuditLogsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  let data: PagedResult<AuditLogItem> | null = null;
  let error: string | null = null;

  try {
    const res = await fetchAuditLogs(page, 50);
    data = res.data ?? null;
  } catch (e) {
    error = e instanceof Error ? e.message : "Nepodařilo se načíst audit logy.";
  }

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Audit log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Přehled všech akcí provedených v systému.
        </p>
      </header>

      {error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <AuditLogTable data={data!} currentPage={page} />
      )}
    </article>
  );
}
