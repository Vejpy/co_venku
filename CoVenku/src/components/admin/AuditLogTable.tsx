"use client";

import Link from "next/link";
import type { AuditLogItem, PagedResult } from "@/types/api";

interface Props {
  data: PagedResult<AuditLogItem>;
  currentPage: number;
}

export default function AuditLogTable({ data, currentPage }: Props) {
  const items = data.items ?? [];

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Akce</th>
              <th className="px-4 py-3">Entita</th>
              <th className="px-4 py-3">ID entity</th>
              <th className="px-4 py-3">Uživatel</th>
              <th className="px-4 py-3">Čas</th>
              <th className="px-4 py-3">Změny</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Žádné záznamy.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {item.action ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.entityName ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {item.entityId ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.userName ??
                      (item.userId != null ? `#${item.userId}` : "—")}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleString("cs-CZ")}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">
                    {item.newValues ?? item.oldValues ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <nav
          aria-label="Stránkování"
          className="flex items-center justify-between text-sm"
        >
          <span className="text-muted-foreground">
            Strana {currentPage} z {data.totalPages} · Celkem{" "}
            {data.totalCount.toLocaleString("cs-CZ")} záznamů
          </span>

          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link
                href={`/admin/audit-logs?page=${currentPage - 1}`}
                className="rounded-lg border border-border px-3 py-1.5 text-foreground hover:bg-muted transition-colors"
              >
                Předchozí
              </Link>
            )}
            {currentPage < data.totalPages && (
              <Link
                href={`/admin/audit-logs?page=${currentPage + 1}`}
                className="rounded-lg border border-border px-3 py-1.5 text-foreground hover:bg-muted transition-colors"
              >
                Další
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
