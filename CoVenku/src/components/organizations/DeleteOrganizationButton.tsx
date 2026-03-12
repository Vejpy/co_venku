import React, { useState } from "react";
import { deleteOrganization } from "@/services/api";
import { toast } from "sonner";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface Props {
  organizationId: number;
  organizationName: string;
  onSuccess: () => void;
}

export function DeleteOrganizationButton({ organizationId, organizationName, onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteOrganization(organizationId);
      toast.success("Organizace byla úspěšně smazána.");
      setIsOpen(false);
      onSuccess();
    } catch (e: unknown) {
      if ((e as { response?: { status?: number } }).response?.status === 403) {
        toast.error("Nejste oprávněni smazat tuto organizaci.");
      } else {
        toast.error("Nepodařilo se smazat organizaci.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-[8px] bg-transparent border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Smazat organizaci
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/40 p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-[#e2e8f0] dark:border-zinc-800 rounded-[8px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2"> Smazat organizaci? </h3>
              <p className="text-sm text-zinc-500 mb-6"> Opravdu chcete smazat organizaci <span className="font-semibold text-zinc-900 dark:text-white">{organizationName}</span>? Tato akce je nevratná a odstraní všechna spojená data. </p>
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="flex-[1] px-4 py-3 rounded-[8px] border border-[#e2e8f0] dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                > Zrušit </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-[1] px-4 py-3 rounded-[8px] bg-red-600 border border-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                > {loading ? "Mažu..." : "Ano, smazat"} </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
