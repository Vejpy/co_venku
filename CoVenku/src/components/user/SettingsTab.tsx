"use client";

import { useRouter } from "next/navigation";
import { LogOut, Moon, Sun, Shield, Bell, User, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";

interface Props {
  logout: () => void;
}

export default function SettingsTab({ logout }: Props) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <section className="space-y-4 max-w-lg">
      {/* Account section */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Účet</p>
        </div>
        <div className="divide-y divide-border">
          <SettingsRow icon={User} label="Profil" description="Zobrazit a upravit veřejný profil" action={<ChevronRight className="w-4 h-4 text-muted-foreground" />} />
          <SettingsRow icon={Shield} label="Bezpečnost" description="Heslo a dvoufaktorové ověření" action={<ChevronRight className="w-4 h-4 text-muted-foreground" />} />
          <SettingsRow icon={Bell} label="Notifikace" description="Emailové a push notifikace" action={<ChevronRight className="w-4 h-4 text-muted-foreground" />} />
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vzhled</p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {resolvedTheme === "dark" ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
            <div>
              <p className="text-sm font-medium text-foreground">Barevný motiv</p>
              <p className="text-xs text-muted-foreground">{resolvedTheme === "dark" ? "Tmavý" : "Světlý"} motiv</p>
            </div>
          </div>
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="relative w-10 h-5 rounded-full bg-muted transition-colors focus:outline-none"
            aria-label="Přepnout motiv"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${resolvedTheme === "dark" ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-destructive/20 bg-destructive/5">
        <div className="px-5 py-3 border-b border-destructive/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-destructive/70">Nebezpečná zóna</p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Odhlásit se</p>
            <p className="text-xs text-muted-foreground">Ukončit aktuální relaci</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-destructive px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
          >
            <LogOut className="w-3.5 h-3.5" />
            Odhlásit se
          </button>
        </div>
      </div>
    </section>
  );
}

function SettingsRow({
  icon: Icon, label, description, action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-3 flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
