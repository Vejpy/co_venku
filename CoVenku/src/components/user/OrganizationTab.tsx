"use client";

import { useState } from "react";
import type { CultureEvent, Organization, VerificationTokenResponse, CulturePlace } from "@/types/api";
import { createOrganization, verifyOrganization, deleteCulturePlace } from "@/services/api";
import { toast } from "sonner";
import PlaceModal from "./PlaceModal";
import { MapPin, Plus, Edit2, Trash2, Calendar, X, Settings, BarChart2 } from "lucide-react";
import EventStatsModal from "./EventStatsModal";
import { DeleteOrganizationButton } from "@/components/organizations/DeleteOrganizationButton";

interface Props {
  organizations: Organization[];
  ownedEvents?: CultureEvent[];
  places?: CulturePlace[];
  onRefresh: () => void;
}

export default function OrganizationTab({ organizations, ownedEvents = [], places = [], onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="space-y-6">
      {/* Existing organizations */}
      {organizations.length > 0 ? (
        <div className="space-y-3">
          {organizations.map((org) => (
            <OrgCard
              key={org.id}
              org={org}
              relatedEvents={ownedEvents.filter(
                (ev) => ev.organizationId != null && Number(ev.organizationId) === Number(org.id)
              )}
              places={places.filter(
                (p) => p.organizationId != null && Number(p.organizationId) === Number(org.id)
              )}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          Nemáte zatím žádnou organizaci.
        </div>
      )}

      {/* Create new */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Založit organizaci
        </button>
      ) : (
        <CreateOrgForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            onRefresh();
          }}
        />
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Organization card with verify action
// ---------------------------------------------------------------------------

function OrgCard({
  org,
  relatedEvents = [],
  places = [],
  onRefresh,
}: {
  org: Organization;
  relatedEvents?: CultureEvent[];
  places?: CulturePlace[];
  onRefresh: () => void;
}) {
  const [method, setMethod] = useState<"dns" | "manual" | null>(null);
  const [manualNote, setManualNote] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [checking, setChecking] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationTokenResponse | null>(null);
  
  // Place Management
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<CulturePlace | undefined>();
  
  // Slide Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Stats Modal State
  const [statsEvent, setStatsEvent] = useState<CultureEvent | null>(null);

  const handleEditPlace = (place: CulturePlace) => {
    setEditingPlace(place);
    setIsPlaceModalOpen(true);
  };

  const handleCreatePlace = () => {
    setEditingPlace(undefined);
    setIsPlaceModalOpen(true);
  };

  const handleDeletePlace = async (placeId: number) => {
    if (!confirm("Opravdu chcete smazat toto kulturní místo?")) return;
    try {
      await deleteCulturePlace(placeId, org.id);
      toast.success("Místo bylo smazáno.");
      onRefresh();
    } catch (e: unknown) {
      toast.error((e as { response?: { data?: { message?: string } } }).response?.data?.message || "Nelze smazat místo (může být použito u události).");
    }
  };

  const handleInitiateVerify = async (selectedMethod: "dns" | "manual") => {
    if (selectedMethod === "manual" && !manualNote.trim()) {
        toast.error("Prosím uveďte odkaz na sociální sítě nebo zdůvodnění.");
        return;
    }
    setVerifying(true);
    try {
      const res = await import("@/services/api").then(m => m.verifyOrganization(org.id, selectedMethod, manualNote.trim() || undefined));
      if (res.data) {
        setVerificationData(res.data);
        setMethod(selectedMethod);
        if (selectedMethod === "manual") {
            toast.success("Žádost o manuální schválení administrátorem byla odeslána.");
            onRefresh();
            setVerificationData(null);
            setMethod(null);
            setManualNote("");
        }
      }
    } catch {
      toast.error("Nepodařilo se inicializovat ověření.");
    } finally {
      setVerifying(false);
    }
  };

  const handleCheckVerify = async () => {
      setChecking(true);
      try {
          const res = await import("@/services/api").then(m => m.checkOrganizationVerification(org.id));
          if (res.data) {
              toast.success("Ověření proběhlo úspěšně!");
              onRefresh();
              setVerificationData(null);
              setMethod(null);
          } else {
             toast.error(res.message || "Nepodařilo se ověřit organizaci.");
          }
      } catch (e: unknown) {
          toast.error((e as { response?: { data?: { message?: string } } }).response?.data?.message || "Ověření selhalo.");
      } finally {
          setChecking(false);
      }
  }

  const statusLabel: Record<string, string> = {
    unverified: "Neověřeno",
    pending: "Čeká na schválení",
    verified: "Ověřeno",
    blocked: "Zablokováno",
  };

  const statusColor: Record<string, string> = {
    unverified: "text-muted-foreground",
    pending: "text-yellow-600 dark:text-yellow-400",
    verified: "text-green-600 dark:text-green-400",
    blocked: "text-red-600 dark:text-red-400",
  };

  const status = org.isBlocked ? "blocked" : (org.verificationStatus?.toLowerCase() ?? "unverified");

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate text-lg">{org.name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium text-foreground/80">IČO:</span> {org.ico ?? "—"} <span className="mx-2 text-border">|</span>
            <span className="font-medium text-foreground/80">Web:</span> <a href={org.website || undefined} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 dark:text-blue-400 font-medium">{org.website || "—"}</a> <span className="mx-2 text-border">|</span>
            {org.contactEmail}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'verified' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : status === 'blocked' ? 'bg-red-500' : 'bg-muted-foreground'}`} />
            <p className={`text-xs font-semibold uppercase tracking-wider ${statusColor[status] ?? "text-muted-foreground"}`}>
              {statusLabel[status] ?? status}
            </p>
          </div>
        </div>

        {status !== "pending" && status !== "blocked" && status !== "unverified" && (
          <div className="flex gap-2 shrink-0 mt-3 sm:mt-0 w-full sm:w-auto">
              <button
                  onClick={() => setIsPanelOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition-colors shadow-sm dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                  <Settings className="w-4 h-4" />
                  Správa organizace
              </button>
          </div>
        )}
      </div>

      {status === "pending" && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5 shadow-sm">
           <div className="flex items-start gap-4">
             <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 mt-0.5 shadow-sm">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <div>
               <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Vaše žádost o ověření se zpracovává</h4>
               <p className="text-sm text-yellow-700/80 dark:text-yellow-400/80 mt-1.5 max-w-3xl leading-relaxed">Organizace právě prochází ručním ověřením administrátorem. Pokud bude vše v pořádku, účet brzy schválíme. O výsledku vás budeme informovat na kontaktním e-mailu.</p>
             </div>
           </div>
        </div>
      )}

      {status === "unverified" && !verificationData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between hover:border-blue-500/30 transition-colors duration-300">
             <div>
               <h4 className="font-semibold text-foreground text-lg mb-1.5 flex items-center gap-2">
                 Automaticky přes DNS
                 <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block">Doporučeno</span>
               </h4>
               <p className="text-sm text-muted-foreground mb-5 leading-relaxed">Pokud máte přístup k administraci domény pro <span className="font-medium text-foreground">{org.website}</span>, můžete organizaci nezávisle ověřit přidáním TXT záznamu během jedné minuty.</p>
             </div>
             <button
                onClick={() => handleInitiateVerify("dns")}
                disabled={verifying}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
             >
                Zobrazit DNS TXT záznam →
             </button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between hover:border-primary/20 transition-colors duration-300">
             <div>
               <h4 className="font-semibold text-foreground text-lg mb-1.5">Nemám vlastní web</h4>
               <p className="text-sm text-muted-foreground mb-4 leading-relaxed">Nemáte-li web nebo nevíte jak nastavit DNS, administrátoři vás mohou zkusit schválit ručně. Urychlete proces pomocí odkazu např. na vaše sociální sítě.</p>
               <input 
                  type="text" 
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  placeholder="https://facebook.com/vase-spolecnost..."
                  className="w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring mb-4 transition-all"
               />
             </div>
             <button
               onClick={() => handleInitiateVerify("manual")}
               disabled={verifying || !manualNote.trim()}
               className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors shadow-sm disabled:opacity-50"
             >
                {verifying && method === "manual" ? "Odesílám..." : "Požádat o manuální schválení"}
             </button>
          </div>
        </div>
      )}

      {verificationData && method === "dns" && (
         <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Dokončení DNS ověření
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                    Přihlaste se ke správci vaší domény a vytvořte nový DNS záznam typu TXT. Do hodnoty zkopírujte níže uvedený ověřovací token vázaný na váš web <span className="font-medium text-foreground">{org.website}</span>.
                  </p>
               </div>
               <button onClick={() => setVerificationData(null)} className="text-muted-foreground hover:text-foreground p-1.5 rounded hover:bg-muted transition-colors" title="Zavřít"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                     <div>
                        <p className="text-sm font-semibold mb-2 text-foreground/90">Jak provést nastavení:</p>
                        <div className="rounded-lg bg-muted/30 p-4 border border-border text-sm text-foreground font-mono overflow-x-auto shadow-inner">
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span className="text-muted-foreground w-20">Typ:</span> <span className="font-medium bg-card border border-border px-2 py-0.5 rounded shadow-sm">TXT</span></div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span className="text-muted-foreground w-20">Název/Host:</span> <span className="font-medium bg-card border border-border px-2 py-0.5 rounded shadow-sm">_covenku-verification</span></div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4"><span className="text-muted-foreground w-20 shrink-0">Hodnota:</span> <code className="bg-white dark:bg-zinc-950 text-foreground px-2 py-0.5 rounded border border-border select-all break-all shadow-sm flex-1">{verificationData.token}</code></div>
                            </div>
                        </div>
                     </div>
                </div>

                <div className="bg-muted/30 border border-border rounded-xl p-5 flex flex-col justify-center">
                    <div>
                        <p className="text-sm font-semibold mb-2 text-foreground/90">Spustit kontrolu</p>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">Zkontrolujeme shodu záznamu pro doménu <span className="font-medium text-foreground">{org.website}</span>. DNS se navenek může propisovat několik minut.</p>
                    </div>
                    
                    <button
                        onClick={handleCheckVerify}
                        disabled={checking}
                        className="w-full rounded-xl bg-zinc-900 dark:bg-zinc-100 px-4 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {checking ? "Probíhá kontrola…" : "Ověřit TXT záznam"}
                    </button>
                    
                    <div className="mt-4 text-center">
                       <p className="text-xs text-muted-foreground"><span className="opacity-70">Platnost tokenu vyprší:</span> {new Date(verificationData.expiresAt).toLocaleString("cs-CZ")}</p>
                    </div>
                </div>
            </div>
         </div>
      )}
      {/* ── Slide-over Panel ────────────────────────────────────────────── */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl h-full bg-background shadow-2xl animate-in slide-in-from-right flex flex-col pt-4 sm:pt-0">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Správa: {org.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                   Stav: {statusLabel[status] ?? status}
                </p>
              </div>
              <button 
                onClick={() => setIsPanelOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                title="Zavřít"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
               {/* Places Section */}
               <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-2">
                    <div>
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Kulturní místa a lokace ({places.length})
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">Místa svázaná s touto organizací.</p>
                    </div>
                    <button
                      onClick={() => {
                        if (status !== "verified") {
                          toast.error("Organizace musí být nejprve ověřena, abyste mohli přidávat místa.");
                          return;
                        }
                        handleCreatePlace();
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Přidat místo
                    </button>
                  </div>

                  {places.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic mb-2">Nemáte vytvořená žádná místa pro pořádání akcí.</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {places.map(place => (
                         <div key={place.id} className="relative group rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/50 transition-colors">
                            <p className="font-semibold text-foreground pr-10 truncate" title={place.name || undefined}>{place.name}</p>
                            <p className="text-xs text-muted-foreground truncate mb-1">{place.type || 'Nespecifikováno'}</p>
                            {place.address && (
                              <p className="text-xs text-muted-foreground truncate opacity-80">{place.address.city}, {place.address.street}</p>
                            )}
                            
                            <div className="absolute top-3 right-3 flex opacity-0 group-hover:opacity-100 transition-opacity bg-card rounded shadow-sm border border-border">
                               <button onClick={() => handleEditPlace(place)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Upravit">
                                  <Edit2 className="w-3.5 h-3.5" />
                               </button>
                               <div className="w-[1px] bg-border my-1" />
                               <button onClick={() => handleDeletePlace(place.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" title="Smazat">
                                  <Trash2 className="w-3.5 h-3.5" />
                               </button>
                            </div>
                         </div>
                      ))}
                    </div>
                  )}
               </div>

               {/* Events Section */}
               <div className="space-y-4">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-2">
                    <div>
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Akce organizace ({relatedEvents.length})
                      </h4>
                      <p className="text-sm text-muted-foreground mt-0.5">Spravovány uživateli pod touto organizací.</p>
                    </div>
                 </div>

                  {relatedEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Tato organizace zatím nepořádá žádné události.</p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {relatedEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between"
                        >
                          <div>
                             <p className="font-medium text-foreground line-clamp-2 leading-tight" title={ev.name || undefined}>{ev.name}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-2">
                             <div className="flex items-center gap-2 overflow-hidden">
                               <p className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                                 {ev.validFrom ? new Date(ev.validFrom).toLocaleDateString("cs-CZ") : "Neurčeno"}
                               </p>
                               {ev.type && (
                                 <span className="shrink-0 rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground truncate max-w-[80px]">
                                   {ev.type}
                                 </span>
                               )}
                             </div>
                             <button
                               onClick={() => setStatsEvent(ev)}
                               className="flex items-center gap-1 px-2 py-1 rounded border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-[10px] font-bold dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40"
                               title="Statistiky akce"
                             >
                               <BarChart2 className="w-3 h-3" />
                               Stats
                             </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
               </div>

               {/* Danger Zone */}
               <div className="space-y-4 pt-4 border-t border-red-500/20">
                 <div className="flex flex-col items-start gap-1">
                    <h4 className="font-bold text-red-600 dark:text-red-400">
                      Nebezpečná zóna
                    </h4>
                    <p className="text-sm text-muted-foreground mt-0.5 mb-2">Tyto akce jsou nevratné a mohou smazat data spojená s touto organizací.</p>
                 </div>
                 <DeleteOrganizationButton
                   organizationId={org.id}
                   organizationName={org.name || "Neznámá organizace"}
                   onSuccess={() => {
                     setIsPanelOpen(false);
                     onRefresh();
                   }}
                 />
               </div>
            </div>
          </div>
        </div>
      )}

      {statsEvent && (
        <EventStatsModal
          event={statsEvent}
          onClose={() => setStatsEvent(null)}
        />
      )}

      {isPlaceModalOpen && (
        <PlaceModal
          organizationId={org.id}
          existingPlace={editingPlace}
          onClose={() => setIsPlaceModalOpen(false)}
          onSuccess={() => {
            setIsPlaceModalOpen(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create organization form (Wizard)
// ---------------------------------------------------------------------------

function CreateOrgForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [ico, setIco] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdOrgId, setCreatedOrgId] = useState<number | null>(null);
  const [isAresLoading, setIsAresLoading] = useState(false);
  const [isNameLocked, setIsNameLocked] = useState(false);

  const handleLoadAres = async () => {
    if (ico.length !== 8 || !/^\d{8}$/.test(ico)) {
        toast.error("IČO musí mít přesně 8 číslic");
        return;
    }
    setIsAresLoading(true);
    try {
        const res = await import("@/services/api").then(m => m.fetchAresData(ico));
        if (res.data) {
            setName(res.data.companyName);
            setIsNameLocked(true);
            toast.success("Údaje úspěšně načteny z ARES");
        }
    } catch (e: unknown) {
        toast.error((e as { response?: { data?: { message?: string } } }).response?.data?.message || "Nepodařilo se načíst data z ARES.");
        setIsNameLocked(false);
    } finally {
        setIsAresLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createOrganization({ name, ico, website, contactEmail: email });
      if (res.data) {
          setCreatedOrgId(res.data.id);
          toast.success("Organizace uložena. Nyní vyberte metodu ověření.");
          setStep(2);
      }
    } catch {
      toast.error("Nepodařilo se uložit základní údaje organizace.");
    } finally {
      setSubmitting(false);
    }
  };

  const finishWizard = () => {
      onSuccess();
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 max-w-2xl mx-auto shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
      </div>

      {step === 1 && (
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
              <h3 className="text-xl font-bold text-foreground">Krok 1: Základní údaje</h3>
              <p className="text-sm text-muted-foreground mt-1">
                  Vyplňte oficiální název a identifikační údaje vaší organizace. Tyto údaje uvidí návštěvníci vašich akcí.
              </p>
          </div>

          <fieldset disabled={submitting} className="space-y-4">
            <Input label="Název organizace" value={name} onChange={setName} required placeholder="Spolek přátel kultury z.s." disabled={isNameLocked} />
            <div className="flex items-end gap-2">
			  <div className="flex-1">
				<Input
				  label="IČO (volitelné)"
				  value={ico}
				  onChange={setIco}
				  placeholder="12345678"
				  pattern="\d{8}"
			    />
			  </div>
			  <button 
                type="button" 
                onClick={handleLoadAres} 
                disabled={isAresLoading || ico.length !== 8 || submitting}
				className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50 h-[38px] mb-[2px] mt-auto"
			  >
				{isAresLoading ? "Načítám..." : "ARES ↓"}
			  </button>
            </div>
            <Input
              label="Oficiální webové stránky"
              type="url"
              value={website}
              onChange={setWebsite}
              required
              placeholder="https://www.vaseorganizace.cz"
            />
            <Input
              label="Kontaktní email"
              type="email"
              value={email}
              onChange={setEmail}
              required
              placeholder="info@spolek.cz"
            />
          </fieldset>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Ukládám…" : "Pokračovat k ověření →"}
            </button>
          </div>
        </form>
      )}

      {step === 2 && createdOrgId && (
          <div className="space-y-6">
               <div>
                  <h3 className="text-xl font-bold text-foreground">Krok 2: Odeslat k ověření</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                      Založení proběhlo úspěšně. Aby mohla vaše organizace publikovat akce, musí být ověřena. 
                      Můžete tak učinit hned, nebo se k tomuto kroku vrátit později z přehledu organizací.
                  </p>
              </div>
              
              <div className="rounded-lg bg-muted/50 p-4 border border-border">
                  <h4 className="font-medium mb-2">Možnosti ověření</h4>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                      <li><strong>DNS záznam</strong>: Rychlé automatické ověření pomocí TXT záznamu na doméně vašeho webu.</li>
                      <li><strong>Manuální ověření</strong>: Pokud nemáte do správy DNS zón přístup, kontaktujeme Vás na ověřených údajích z ARES.</li>
                  </ul>
              </div>

              <div className="flex justify-end pt-2">
                  <button
                    onClick={finishWizard}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Dokončit a přejít na přehled
                  </button>
              </div>
          </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tiny reusable input
// ---------------------------------------------------------------------------

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  pattern,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  pattern?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-foreground mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        pattern={pattern}
        disabled={disabled}
        className={`w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${disabled ? "opacity-50 cursor-not-allowed bg-muted" : ""}`}
      />
    </div>
  );
}
