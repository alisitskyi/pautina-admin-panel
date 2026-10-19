"use client";

import React, { useState } from "react";
import { Search, Download, Filter, CheckCircle2, Clock, Calendar, ArrowUpDown } from "lucide-react";
import { Booking, Room, GameStatusLabels, GameStatus } from "@/types";
import { formatPrice, formatPhone } from "@/lib/utils";

interface BookingsTableProps {
  bookings: Booking[];
  rooms: Room[];
  onSelectBooking: (booking: Booking) => void;
}

export const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  rooms,
  onSelectBooking,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const getRoomName = (roomId: number) => {
    return rooms.find((r) => r.id === roomId)?.name || `Кімната #${roomId}`;
  };

  const filtered = bookings.filter((b) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        b.name.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        getRoomName(b.roomId).toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== "all" && b.gameStatus !== Number(statusFilter)) {
      return false;
    }
    if (dateFilter && b.date !== dateFilter) {
      return false;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ["ID", "Кімната", "Дата", "Час", "Ціна", "Ім'я", "Телефон", "Статус", "Підтверджено"];
    const rows = filtered.map((b) => [
      b.id,
      `"${getRoomName(b.roomId)}"`,
      b.date,
      b.time,
      b.price,
      `"${b.name}"`,
      `"${b.phone}"`,
      `"${GameStatusLabels[b.gameStatus].label}"`,
      b.clientConfirm ? "Так" : "Ні",
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bookings_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Пошук клієнта, телефону..."
              className="rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none w-60"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="all">Усі статуси</option>
            <option value="2">Буде грати</option>
            <option value="1">Гра відбулась</option>
            <option value="0">Скасовано</option>
            <option value="3">Сервісна бронь</option>
          </select>

          {/* Date filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Скинути дату
            </button>
          )}
        </div>

        {/* Export */}
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-amber-400" />
          Експорт в Excel (CSV)
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 font-semibold text-zinc-400">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Квест-кімната</th>
              <th className="px-4 py-3">Дата & Час</th>
              <th className="px-4 py-3">Ціна</th>
              <th className="px-4 py-3">Клієнт</th>
              <th className="px-4 py-3">Телефон</th>
              <th className="px-4 py-3">Статус гри</th>
              <th className="px-4 py-3">Підтвердження</th>
              <th className="px-4 py-3 text-right">Дія</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-zinc-500">
                  Бронювань не знайдено за вказаними фільтрами.
                </td>
              </tr>
            ) : (
              filtered.map((b) => {
                const statusConf = GameStatusLabels[b.gameStatus];
                return (
                  <tr
                    key={b.id}
                    className="group hover:bg-zinc-900/40 transition-colors cursor-pointer"
                    onClick={() => onSelectBooking(b)}
                  >
                    <td className="px-4 py-3 font-mono text-zinc-500">#{b.id}</td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {getRoomName(b.roomId)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-300">{b.date}</span>
                        <span className="font-bold text-amber-400">{b.time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {formatPrice(b.price)}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-200">{b.name}</td>
                    <td className="px-4 py-3 font-mono text-zinc-400">{formatPhone(b.phone)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${statusConf.bg} ${statusConf.color}`}>
                        {statusConf.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {b.clientConfirm ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Підтверджено
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                          Не підтверджено
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBooking(b);
                        }}
                        className="rounded-lg bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-amber-500 hover:text-black transition-colors"
                      >
                        Редагувати
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
