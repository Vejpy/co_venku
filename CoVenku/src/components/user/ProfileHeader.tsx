"use client";

import type { Organization } from "@/types/api";

interface ProfileUser {
  id: number;
  name: string | null;
  role: string | null;
}

interface ProfileHeaderProps {
  user: ProfileUser;
  organizations?: Organization[];
}

export default function ProfileHeader({ user, organizations = [] }: ProfileHeaderProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 flex items-center gap-4">
      {/* Avatar placeholder */}
      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold shrink-0">
        {user.name?.charAt(0).toUpperCase() ?? "?"}
      </div>
      <div>
        <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 capitalize">
            {user.role === "Admin" ? "Administrátor" : user.role === "Organizer" ? "Organizátor" : "Uživatel"}
          </p>
          {organizations.length > 0 && (
            <>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground/80">Organizace:</span>{" "}
                {organizations.map((org, i) => (
                  <span key={org.id}>
                    {i > 0 && ", "}
                    <span className={org.isBlocked ? "text-red-500/80 line-through decoration-red-500/50" : ""}>
                      {org.name}{org.isBlocked ? " (Blokováno)" : ""}
                    </span>
                  </span>
                ))}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
