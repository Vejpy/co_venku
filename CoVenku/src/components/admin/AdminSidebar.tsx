"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ShieldExclamationIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

const links = [
  { href: "/admin", label: "Přehled", icon: ChartBarIcon },
  {
    href: "/admin/audit-logs",
    label: "Audit log",
    icon: ClipboardDocumentListIcon,
  },
  {
    href: "/admin/moderation",
    label: "Moderace",
    icon: ShieldExclamationIcon,
  },
  {
    href: "/admin/entities",
    label: "Služby a Entity",
    icon: TableCellsIcon,
  },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <nav aria-label="Administrace" className="flex lg:flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-l-2 border-blue-600 dark:border-blue-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
