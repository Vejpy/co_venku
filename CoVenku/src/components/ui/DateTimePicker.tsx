"use client";

import React, { useState, useRef, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, setHours, setMinutes } from "date-fns";
import { cs } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  value: string; // ISO string or empty
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function DateTimePicker({ value, onChange, label, placeholder, className }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dateValue = value ? new Date(value) : null;
  const [viewDate, setViewDate] = useState(dateValue || new Date());

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 }),
  });

  const handleDateSelect = (day: Date) => {
    const newDate = dateValue ? new Date(dateValue) : new Date();
    newDate.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    onChange(newDate.toISOString());
  };

  const handleTimeChange = (type: "hour" | "minute", val: number) => {
    const newDate = dateValue ? new Date(dateValue) : new Date();
    if (type === "hour") newDate.setHours(val);
    else newDate.setMinutes(val);
    onChange(newDate.toISOString());
  };

  return (
    <div className={cn("relative space-y-1.5", className)} ref={containerRef}>
      {label && <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-left hover:border-primary/50 transition-all outline-none"
      >
        <CalendarIcon className="w-4 h-4 text-zinc-400 shrink-0" />
        <span className={cn("flex-1 truncate", !value && "text-zinc-400 text-xs")}>
          {value ? format(new Date(value), "d. MMMM yyyy, HH:mm", { locale: cs }) : (placeholder || "Vyberte datum a čas")}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-[100] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 min-w-[300px] animate-in fade-in zoom-in-95 duration-150 origin-top">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 capitalize">
              {format(viewDate, "MMMM yyyy", { locale: cs })}
            </h4>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setViewDate(subMonths(viewDate, 1))}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewDate(addMonths(viewDate, 1))}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map(d => (
              <div key={d} className="text-[10px] font-bold text-zinc-400 text-center py-1">{d}</div>
            ))}
            {days.map((day, i) => {
              const selected = dateValue && isSameDay(day, dateValue);
              const currentMonth = isSameMonth(day, viewDate);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-xs flex items-center justify-center transition-all",
                    selected ? "bg-primary text-white font-bold" : "hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    !currentMonth && "opacity-20",
                    !selected && isSameDay(day, new Date()) && "border border-primary/30 text-primary"
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          {/* Time Picker */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Čas</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={23}
                value={dateValue ? dateValue.getHours() : 12}
                onChange={(e) => handleTimeChange("hour", parseInt(e.target.value))}
                className="w-12 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-center outline-none focus:ring-1 focus:ring-primary/30"
              />
              <span className="text-zinc-400">:</span>
              <input
                type="number"
                min={0}
                max={59}
                step={5}
                value={dateValue ? dateValue.getMinutes() : 0}
                onChange={(e) => handleTimeChange("minute", parseInt(e.target.value))}
                className="w-12 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-center outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
