import type { AppStats } from "@/types/api";
import {
  UsersIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

interface Props {
  stats: AppStats;
}

const cards = [
  {
    key: "users" as const,
    label: "Celkem uživatelů",
    icon: UsersIcon,
    color: "text-blue-500",
  },
  {
    key: "places" as const,
    label: "Kulturní místa",
    icon: BuildingOffice2Icon,
    color: "text-emerald-500",
  },
  {
    key: "events" as const,
    label: "Celkem událostí",
    icon: CalendarDaysIcon,
    color: "text-amber-500",
  },
];

export default function StatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon className={`h-4 w-4 ${color}`} />
            <span className="text-xs font-medium uppercase tracking-wide">
              {label}
            </span>
          </div>
          <span className="text-3xl font-semibold text-foreground tabular-nums">
            {stats[key].toLocaleString("cs-CZ")}
          </span>
        </div>
      ))}
    </div>
  );
}
