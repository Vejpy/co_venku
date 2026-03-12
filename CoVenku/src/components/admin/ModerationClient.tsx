"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  fetchAdminUsers,
  fetchAdminOrganizations,
  blockUserAction,
  blockOrganizationAction,
  updateAdminUser,
} from "@/services/api";
import type { User, Organization } from "@/types/api";
import { toast } from "sonner";

function isAuthError(err: unknown): boolean {
  return (
    axios.isAxiosError(err) &&
    (err.response?.status === 401 || err.response?.status === 403)
  );
}

type Tab = "users" | "organizations";

export default function ModerationClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("users");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);

  const handleAuthError = useCallback(
    (err: unknown) => {
      if (isAuthError(err)) {
        toast.error("Platnost relace vypršela nebo nemáte oprávnění.");
        router.push("/Login_Register");
        return true;
      }
      return false;
    },
    [router],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, orgsRes] = await Promise.all([
        fetchAdminUsers(1, 100).catch(() => null),
        fetchAdminOrganizations(1, 100).catch(() => null),
      ]);

      setUsers(usersRes?.data?.items ?? []);
      setOrgs(orgsRes?.data?.items ?? []);
    } catch (err) {
      if (!handleAuthError(err)) {
        toast.error("Nepodařilo se načíst data pro moderaci.");
      }
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted p-1 w-fit">
        <button
          onClick={() => setTab("users")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            tab === "users"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Uživatelé {users.length > 0 && `(${users.length})`}
        </button>
        <button
          onClick={() => setTab("organizations")}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            tab === "organizations"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Organizace {orgs.length > 0 && `(${orgs.length})`}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-border bg-card animate-pulse"
            />
          ))}
        </div>
      ) : tab === "users" ? (
        <UserList
          users={users}
          onRefresh={loadData}
          onAuthError={handleAuthError}
        />
      ) : (
        <OrgList
          orgs={orgs}
          onRefresh={loadData}
          onAuthError={handleAuthError}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Users list
// ---------------------------------------------------------------------------

function UserList({
  users,
  onRefresh,
  onAuthError,
}: {
  users: User[];
  onRefresh: () => void;
  onAuthError: (err: unknown) => boolean;
}) {
  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Žádní uživatelé nenalezeni.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Jméno</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Stav</th>
            <th className="px-4 py-3 text-right">Akce</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              onRefresh={onRefresh}
              onAuthError={onAuthError}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({
  user,
  onRefresh,
  onAuthError,
}: {
  user: User;
  onRefresh: () => void;
  onAuthError: (err: unknown) => boolean;
}) {
  const [acting, setActing] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");

  const handleBlock = async (isBlocked: boolean) => {
    setActing(true);
    try {
      await blockUserAction(user.id, { isBlocked, reason: reason || null });
      toast.success(
        isBlocked
          ? `Uživatel ${user.name} byl zablokován.`
          : `Uživatel ${user.name} byl odblokován.`,
      );
      setShowReason(false);
      setReason("");
      onRefresh();
    } catch (err) {
      if (!onAuthError(err)) toast.error("Akce se nezdařila.");
    } finally {
      setActing(false);
    }
  };

  const handleRoleChange = async (role: string) => {
    setActing(true);
    try {
      await updateAdminUser(user.id, { name: user.name ?? "", role });
      toast.success(`Role uživatele ${user.name} změněna na ${role}.`);
      onRefresh();
    } catch (err) {
      if (!onAuthError(err)) toast.error("Změna role se nezdařila.");
    } finally {
      setActing(false);
    }
  };

  const roleColor: Record<string, string> = {
    admin: "text-red-600 dark:text-red-400",
    organizer: "text-blue-600 dark:text-blue-400",
    user: "text-muted-foreground",
  };

  return (
    <>
      <tr className={`hover:bg-muted/50 transition-colors ${user.isBlocked ? "opacity-60" : ""}`}>
        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{user.id}</td>
        <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
        <td className="px-4 py-3">
          <div className="flex gap-1">
            {(["user", "admin", "moderator"] as const).map((r) => (
              <button
                key={r}
                disabled={acting}
                onClick={() => r !== (user.role ?? "user") && handleRoleChange(r)}
                className={`text-[10px] px-2 py-0.5 rounded-full border font-medium transition-colors disabled:opacity-50 ${
                  (user.role ?? "user") === r
                    ? r === "admin"
                      ? "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800"
                      : r === "moderator"
                      ? "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800"
                      : "bg-muted text-muted-foreground border-border"
                    : "text-muted-foreground border-transparent hover:border-border hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`text-xs font-medium ${user.isBlocked ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
            {user.isBlocked ? "Zablokován" : "Aktivní"}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            {user.isBlocked ? (
              <button
                onClick={() => handleBlock(false)}
                disabled={acting}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Odblokovat
              </button>
            ) : (
              <button
                onClick={() => setShowReason(!showReason)}
                disabled={acting}
                className="rounded-lg bg-destructive/10 text-destructive px-3 py-1.5 text-xs font-medium hover:bg-destructive/20 transition-colors disabled:opacity-50"
              >
                Blokovat
              </button>
            )}
          </div>
        </td>
      </tr>

      {showReason && (
        <tr>
          <td colSpan={5} className="px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-3 max-w-lg">
              <input
                type="text"
                placeholder="Důvod blokace…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={() => handleBlock(true)}
                disabled={acting}
                className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {acting ? "Blokuji…" : "Potvrdit"}
              </button>
              <button
                onClick={() => { setShowReason(false); setReason(""); }}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                Zrušit
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Organizations list
// ---------------------------------------------------------------------------

function OrgList({
  orgs,
  onRefresh,
  onAuthError,
}: {
  orgs: Organization[];
  onRefresh: () => void;
  onAuthError: (err: unknown) => boolean;
}) {
  if (orgs.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
        Žádné organizace nenalezeny.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Název</th>
            <th className="px-4 py-3">IČO</th>
            <th className="px-4 py-3">Vlastník</th>
            <th className="px-4 py-3">Stav ověření</th>
            <th className="px-4 py-3 text-right">Akce</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orgs.map((o) => (
            <OrgRow
              key={o.id}
              org={o}
              onRefresh={onRefresh}
              onAuthError={onAuthError}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrgRow({
  org,
  onRefresh,
  onAuthError,
}: {
  org: Organization;
  onRefresh: () => void;
  onAuthError: (err: unknown) => boolean;
}) {
  const [blocking, setBlocking] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");

  const handleBlock = async (isBlocked: boolean) => {
    setBlocking(true);
    try {
      await blockOrganizationAction(org.id, { isBlocked, reason: reason || null });
      toast.success(
        isBlocked
          ? `Organizace ${org.name} byla zablokována.`
          : `Organizace ${org.name} byla odblokována.`,
      );
      setShowReason(false);
      setReason("");
      onRefresh();
    } catch (err) {
      if (!onAuthError(err)) toast.error("Akce se nezdařila.");
    } finally {
      setBlocking(false);
    }
  };

  const statusColor: Record<string, string> = {
    unverified: "text-muted-foreground",
    pending: "text-yellow-600 dark:text-yellow-400",
    verified: "text-green-600 dark:text-green-400",
    rejected: "text-red-500",
  };
  const statusLabel: Record<string, string> = {
    unverified: "Neověřeno",
    pending: "Čeká na schválení",
    verified: "Ověřeno",
    rejected: "Zamítnuto",
  };
  const status = org.verificationStatus?.toLowerCase() ?? "unverified";

  return (
    <>
      <tr className="hover:bg-muted/50 transition-colors">
        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{org.id}</td>
        <td className="px-4 py-3 font-medium text-foreground">
          <div>{org.name}</div>
          {(org as unknown as {contactEmail?: string}).contactEmail && (
            <div className="text-[10px] text-muted-foreground">{(org as unknown as {contactEmail?: string}).contactEmail}</div>
          )}
        </td>
        <td className="px-4 py-3 text-muted-foreground">{org.ico ?? "—"}</td>
        <td className="px-4 py-3 text-muted-foreground text-xs">{(org as unknown as {ownerName?: string}).ownerName ?? "—"}</td>
        <td className="px-4 py-3">
          <span className={`text-xs font-medium ${statusColor[status] ?? "text-muted-foreground"}`}>
            {statusLabel[status] ?? status}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            {(org as unknown as { isBlocked?: boolean }).isBlocked ? (
              <button
                onClick={() => handleBlock(false)}
                disabled={blocking}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                {blocking ? "Probíhá…" : "Odblokovat"}
              </button>
            ) : (
              <button
                onClick={() => setShowReason(!showReason)}
                disabled={blocking}
                className="rounded-lg bg-destructive/10 text-destructive px-3 py-1.5 text-xs font-medium hover:bg-destructive/20 transition-colors disabled:opacity-50"
              >
                Blokovat
              </button>
            )}
          </div>
        </td>
      </tr>

      {showReason && (
        <tr>
          <td colSpan={5} className="px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-3 max-w-lg">
              <input
                type="text"
                placeholder="Důvod blokace…"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={() => handleBlock(true)}
                disabled={blocking}
                className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {blocking ? "Blokuji…" : "Potvrdit"}
              </button>
              <button
                onClick={() => { setShowReason(false); setReason(""); }}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                Zrušit
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
