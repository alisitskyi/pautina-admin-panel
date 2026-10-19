"use client";

import React from "react";
import { CalendarCheck, Users, Banknote, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StatsCardsProps {
  totalSlots: number;
  bookedSlots: number;
  freeSlots: number;
  totalRevenue: number;
  pendingConfirm: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalSlots,
  bookedSlots,
  freeSlots,
  totalRevenue,
  pendingConfirm,
}) => {
  const occupancyRate = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {/* 1. Bookings count */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">Броней сьогодні</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <CalendarCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-white">{bookedSlots}</span>
          <span className="text-xs text-zinc-400">з {totalSlots} сеансів</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-emerald-400">{occupancyRate}%</span>
        </div>
      </div>

      {/* 2. Total Revenue */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">Прогноз каси</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Banknote className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold tracking-tight text-white">{formatPrice(totalRevenue)}</span>
        </div>
        <p className="mt-2 text-[11px] text-zinc-400">Сума заброньованих ігор</p>
      </div>

      {/* 3. Available Slots */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">Вільних слотів</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold tracking-tight text-white">{freeSlots}</span>
        </div>
        <p className="mt-2 text-[11px] text-zinc-400">Доступно для запису</p>
      </div>

      {/* 4. Pending Confirmation */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">Очікують дзвінка</span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold tracking-tight text-rose-400">{pendingConfirm}</span>
        </div>
        <p className="mt-2 text-[11px] text-zinc-400">Не підтверджено клієнтом</p>
      </div>
    </div>
  );
};
