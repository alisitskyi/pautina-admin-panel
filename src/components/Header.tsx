"use client";

import React from "react";
import { Search, Calendar, List, Shield, User, Clock } from "lucide-react";

interface HeaderProps {
  activeView: "schedule" | "room" | "bookings";
  onViewChange: (view: "schedule" | "room" | "bookings") => void;
  onOpenSearch: () => void;
  selectedDate: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onViewChange,
  onOpenSearch,
  selectedDate,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 font-black text-black shadow-lg shadow-amber-500/20">
              <Shield className="h-5 w-5 fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">
                  PAUTINA
                </span>
                <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                  ADMIN 2.0
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Квест-кімнати Києва
              </p>
            </div>
          </div>

          {/* Navigation view tabs */}
          <nav className="hidden md:flex items-center gap-1 rounded-xl bg-zinc-900/90 p-1 border border-zinc-800">
            <button
              onClick={() => onViewChange("schedule")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeView === "schedule"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              Сітка розкладу (День)
            </button>

            <button
              onClick={() => onViewChange("bookings")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                activeView === "bookings"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <List className="h-3.5 w-3.5 text-blue-400" />
              Журнал броней
            </button>
          </nav>
        </div>

        {/* Center: Search pill */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="group flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-zinc-700 hover:bg-zinc-900"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300" />
              <span>Швидкий пошук клієнта за телефоном чи ім&apos;ям...</span>
            </div>
            <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right: Date badge & User info */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-2.5 py-1 text-xs text-zinc-300">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>{selectedDate}</span>
          </div>

          <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-white">Anton</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] text-zinc-400">Адміністратор</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
