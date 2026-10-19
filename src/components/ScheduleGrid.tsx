"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Sparkles, Filter, CheckCircle2, Phone, User, Ban } from "lucide-react";
import { Room, TimeSlot, Booking, GameStatusLabels } from "@/types";
import { STANDARD_TIMES } from "@/lib/data";
import { formatPrice, formatPhone } from "@/lib/utils";


interface ScheduleGridProps {
  rooms: Room[];
  slots: TimeSlot[];
  bookings: Booking[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onSlotClick: (slot: TimeSlot, room: Room, booking?: Booking) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  rooms,
  slots,
  bookings,
  selectedDate,
  onDateChange,
  onSlotClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Date navigation handlers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().split("T")[0]);
  };

  const handleToday = () => {
    onDateChange(new Date().toISOString().split("T")[0]);
  };

  // Filter rooms
  const filteredRooms = rooms.filter((r) => {
    if (selectedCategory !== "all" && r.category !== selectedCategory) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Helper to map slot to room & time
  const getSlot = (roomId: number, time: string): TimeSlot | undefined => {
    return slots.find((s) => s.roomId === roomId && s.time === time);
  };

  const getBooking = (bookingId?: number): Booking | undefined => {
    if (!bookingId) return undefined;
    return bookings.find((b) => b.id === bookingId);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-3.5 backdrop-blur-sm">
        {/* Date Selector */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevDay}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
            title="Попередній день"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={handleToday}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:border-zinc-700 transition-colors"
          >
            Сьогодні
          </button>

          <button
            onClick={handleNextDay}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
            title="Наступний день"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="relative ml-2 flex items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: "all", label: "Усі кімнати" },
            { id: "harry_potter", label: "Гаррі Поттер" },
            { id: "horror", label: "Хоррор / Перформанс" },
            { id: "adventure", label: "Пригоди" },
            { id: "classic", label: "Класика" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Room Search input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Фільтр за назвою..."
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Schedule Matrix */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <table className="w-full border-collapse text-left">
          {/* Header row with time slots */}
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/90 text-xs">
              <th className="sticky left-0 z-20 w-64 min-w-[240px] border-r border-zinc-800 bg-zinc-900 px-4 py-3 font-semibold text-zinc-300 shadow-md">
                Квест-кімната ({filteredRooms.length})
              </th>
              {STANDARD_TIMES.map((time) => (
                <th
                  key={time}
                  className="min-w-[130px] border-r border-zinc-800/60 px-3 py-3 text-center font-mono font-bold text-zinc-200"
                >
                  <span className="rounded bg-zinc-800/80 px-2 py-1">{time}</span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Matrix body */}
          <tbody className="divide-y divide-zinc-900 text-xs">
            {filteredRooms.map((room) => (
              <tr key={room.id} className="group hover:bg-zinc-900/30 transition-colors">
                {/* Sticky Room Name Cell */}
                <td className="sticky left-0 z-10 border-r border-zinc-800 bg-zinc-950 px-4 py-3 group-hover:bg-zinc-900 transition-colors">
                  <div className="font-semibold text-white tracking-tight text-[13px]">
                    {room.name}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-400">
                    <span className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] text-zinc-400">
                      ID: {room.id}
                    </span>
                    <span>{room.capacity}</span>
                  </div>
                </td>

                {/* Slots Cells */}
                {STANDARD_TIMES.map((time) => {
                  const slot = getSlot(room.id, time);
                  if (!slot) {
                    return (
                      <td key={time} className="border-r border-zinc-900 p-1.5 text-center text-zinc-700">
                        —
                      </td>
                    );
                  }

                  const booking = getBooking(slot.bookingId);
                  const isBooked = slot.status === "booked" && booking;
                  const isService = slot.status === "service";

                  // Service Slot
                  if (isService) {
                    return (
                      <td key={time} className="border-r border-zinc-900 p-1.5">
                        <button
                          onClick={() => onSlotClick(slot, room)}
                          className="flex h-16 w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-1.5 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300 transition-all"
                        >
                          <Ban className="h-4 w-4 text-zinc-400" />
                          <span className="mt-1 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                            Сервіс
                          </span>
                        </button>
                      </td>
                    );
                  }

                  // Booked Slot
                  if (isBooked) {
                    const statusConfig = GameStatusLabels[booking.gameStatus];
                    return (
                      <td key={time} className="border-r border-zinc-900 p-1.5">
                        <button
                          onClick={() => onSlotClick(slot, room, booking)}
                          className={`group/card flex h-16 w-full flex-col justify-between rounded-xl border p-2 text-left transition-all hover:scale-[1.02] shadow-sm ${statusConfig.bg}`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="truncate font-semibold text-white text-[12px] leading-tight">
                              {booking.name}
                            </span>
                            {booking.clientConfirm ? (
                              <span title="Підтверджено">
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              </span>
                            ) : (
                              <span className="h-2 w-2 rounded-full bg-rose-400 shrink-0" title="Не підтверджено" />
                            )}

                          </div>

                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-400 font-mono">
                              {formatPhone(booking.phone).slice(-9)}
                            </span>
                            <span className={`font-semibold ${statusConfig.color}`}>
                              {formatPrice(booking.price)}
                            </span>
                          </div>
                        </button>
                      </td>
                    );
                  }

                  // Free Slot
                  return (
                    <td key={time} className="border-r border-zinc-900 p-1.5">
                      <button
                        onClick={() => onSlotClick(slot, room)}
                        className="group/free flex h-16 w-full flex-col items-center justify-center rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-2 text-center transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:shadow-md hover:shadow-emerald-500/5"
                      >
                        <span className="text-xs font-mono font-medium text-zinc-400 group-hover/free:text-emerald-400 transition-colors">
                          {formatPrice(slot.price)}
                        </span>
                        <span className="mt-1 text-[10px] font-semibold text-zinc-400 group-hover/free:text-emerald-400 uppercase tracking-wider">
                          + Запис
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
