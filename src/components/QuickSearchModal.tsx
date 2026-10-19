"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Calendar, Clock, Phone, User, CheckCircle2 } from "lucide-react";
import { Booking, Room, GameStatusLabels } from "@/types";
import { formatPrice, formatPhone } from "@/lib/utils";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  rooms: Room[];
  onSelectBooking: (booking: Booking) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  bookings,
  rooms,
  onSelectBooking,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        // Toggle or open handled by parent
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getRoomName = (roomId: number) => {
    return rooms.find((r) => r.id === roomId)?.name || `Кімната #${roomId}`;
  };

  const filtered = bookings.filter((b) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      getRoomName(b.roomId).toLowerCase().includes(q) ||
      b.date.includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl shadow-black">
        {/* Search Input */}
        <div className="relative flex items-center border-b border-zinc-800 pb-3">
          <Search className="h-5 w-5 text-zinc-400 ml-2" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Шукати за ім'ям клієнта, телефоном, назвою квесту..."
            className="w-full bg-transparent px-3 py-1 text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="mt-3 max-h-96 overflow-y-auto divide-y divide-zinc-900">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              Нічого не знайдено за запитом &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((b) => {
              const statusConf = GameStatusLabels[b.gameStatus];
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    onSelectBooking(b);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-zinc-900/60 rounded-xl"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">
                        {b.name}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">
                        {formatPhone(b.phone)}
                      </span>
                      {b.clientConfirm && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="text-amber-400 font-medium">
                        {getRoomName(b.roomId)}
                      </span>
                      <span>{b.date}</span>
                      <span className="font-semibold text-zinc-300">{b.time}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-white text-sm">
                      {formatPrice(b.price)}
                    </div>
                    <span className={`text-[11px] font-medium ${statusConf.color}`}>
                      {statusConf.label}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="mt-3 border-t border-zinc-900 pt-2 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Натисніть <strong>Esc</strong> щоб закрити</span>
          <span>Знайдено: {filtered.length} броней</span>
        </div>
      </div>
    </div>
  );
};
