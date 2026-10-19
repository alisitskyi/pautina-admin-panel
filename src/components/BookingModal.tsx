"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Calendar, Clock, MapPin, AlertCircle, ArrowRightLeft, Trash2 } from "lucide-react";
import { Room, TimeSlot, Booking, GameStatus, GameStatusLabels } from "@/types";
import { formatPrice } from "@/lib/utils";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot | null;
  room: Room | null;
  booking: Booking | null;
  allRooms: Room[];
  allSlots: TimeSlot[];
  onSaveBooking: (data: Partial<Booking>) => void;
  onCancelBooking?: (bookingId: number) => void;
  onTransferBooking?: (bookingId: number, targetSlotId: number) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  slot,
  room,
  booking,
  allRooms,
  allSlots,
  onSaveBooking,
  onCancelBooking,
  onTransferBooking,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "transfer">("details");

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+380");
  const [email, setEmail] = useState("");
  const [userComment, setUserComment] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [clientConfirm, setClientConfirm] = useState(true);
  const [gameStatus, setGameStatus] = useState<GameStatus>(2);

  // Transfer states
  const [transferRoomId, setTransferRoomId] = useState<number>(room?.id || 14);
  const [transferSlotId, setTransferSlotId] = useState<number | null>(null);

  useEffect(() => {
    if (booking) {
      setName(booking.name);
      setPhone(booking.phone);
      setEmail(booking.email || "");
      setUserComment(booking.userComment || "");
      setAdminComment(booking.adminComment || "");
      setClientConfirm(booking.clientConfirm);
      setGameStatus(booking.gameStatus);
    } else {
      setName("");
      setPhone("+380");
      setEmail("");
      setUserComment("");
      setAdminComment("");
      setClientConfirm(true);
      setGameStatus(2);
    }
    setActiveTab("details");
    if (room) {
      setTransferRoomId(room.id);
    }
  }, [booking, slot, room]);

  if (!isOpen || !slot || !room) return null;

  const isEditing = !!booking;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Введіть ім'я клієнта");
    if (!phone.trim() || phone === "+380") return alert("Введіть номер телефону клієнта");

    onSaveBooking({
      timelineId: slot.id,
      roomId: room.id,
      date: slot.date,
      time: slot.time,
      price: slot.price,
      name,
      phone,
      email,
      userComment,
      adminComment,
      clientConfirm,
      gameStatus,
    });
    onClose();
  };

  const handleTransferSubmit = () => {
    if (!transferSlotId || !booking) return;
    if (onTransferBooking) {
      onTransferBooking(booking.id, transferSlotId);
      onClose();
    }
  };

  // Find free slots for selected transfer room
  const availableTransferSlots = allSlots.filter(
    (s) => s.roomId === transferRoomId && s.status === "free" && s.id !== slot.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {isEditing ? "Редагування броні" : "Нове бронювання"}
              </span>
              <span className="rounded bg-zinc-800 px-2 py-0.5 text-[11px] font-mono text-zinc-300">
                #{slot.id}
              </span>
            </div>
            <h2 className="mt-1 text-lg font-bold text-white">
              {room.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                {slot.date}
              </span>
              <span className="flex items-center gap-1 font-semibold text-white">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                {slot.time}
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-400 border border-emerald-500/20">
                {formatPrice(slot.price)}
              </span>
              {room.location && (
                <span className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-500 truncate max-w-[180px]">
                  <MapPin className="h-3 w-3" />
                  {room.location}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher (if editing existing booking) */}
        {isEditing && (
          <div className="mt-4 flex border-b border-zinc-800/60 pb-2">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                activeTab === "details"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Дані бронювання
            </button>
            <button
              onClick={() => setActiveTab("transfer")}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                activeTab === "transfer"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <ArrowRightLeft className="h-3 w-3 text-amber-400" />
              Перенесення сеансу
            </button>
          </div>
        )}

        {/* Tab Content: Details */}
        {activeTab === "details" && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Client Name */}
              <div>
                <label className="block text-xs font-medium text-zinc-300">
                  Ім&apos;я клієнта <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Олена Коваль"
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              {/* Client Phone */}
              <div>
                <label className="block text-xs font-medium text-zinc-300">
                  Телефон <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+380 67 123 4567"
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-zinc-300">
                Email клієнта (необов&apos;язково)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@gmail.com"
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Status Radio Group */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Статус гри
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {([2, 1, 0, 3] as GameStatus[]).map((statusKey) => {
                  const conf = GameStatusLabels[statusKey];
                  const isSelected = gameStatus === statusKey;
                  return (
                    <button
                      type="button"
                      key={statusKey}
                      onClick={() => setGameStatus(statusKey)}
                      className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center text-xs transition-all ${
                        isSelected
                          ? `${conf.bg} border-amber-500/80 text-white font-semibold ring-1 ring-amber-500`
                          : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <span className={conf.color}>{conf.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client Confirmation Checkbox */}
            <div className="flex items-center gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-3">
              <input
                type="checkbox"
                id="client_confirm"
                checked={clientConfirm}
                onChange={(e) => setClientConfirm(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="client_confirm" className="text-xs font-medium text-zinc-200 cursor-pointer">
                Підтверджено клієнтом (дзвінок зроблено)
              </label>
            </div>

            {/* Comments */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-zinc-400">
                  Коментар клієнта на сайті
                </label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Побажання клієнта (напр. день народження)"
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400">
                  Внутрішній коментар оператора
                </label>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Нотатки для адміністратора (напр. потрібен додатковий актор)"
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-6">
              {isEditing && onCancelBooking ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Ви дійсно бажаєте скасувати це бронювання?")) {
                      onCancelBooking(booking.id);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Скасувати бронь
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                >
                  Закрити
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-semibold text-black shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all"
                >
                  <Check className="h-4 w-4" />
                  {isEditing ? "Зберегти зміни" : "Підтвердити бронь"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab Content: Transfer Booking */}
        {activeTab === "transfer" && (
          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Ви переносите бронь клієнта <strong>{booking?.name}</strong> на інший сеанс. Дані клієнта автоматично прив&apos;яжуться до нового слоту.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300">
                1. Оберіть цільову квест-кімнату
              </label>
              <select
                value={transferRoomId}
                onChange={(e) => {
                  setTransferRoomId(Number(e.target.value));
                  setTransferSlotId(null);
                }}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                {allRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300">
                2. Оберіть вільний сеанс
              </label>
              {availableTransferSlots.length === 0 ? (
                <p className="mt-2 text-xs text-zinc-500 italic">
                  На цю дату у вибраній кімнаті немає вільних слотів.
                </p>
              ) : (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {availableTransferSlots.map((ts) => (
                    <button
                      type="button"
                      key={ts.id}
                      onClick={() => setTransferSlotId(ts.id)}
                      className={`flex flex-col items-center justify-center rounded-lg border p-2 text-xs transition-all ${
                        transferSlotId === ts.id
                          ? "border-amber-500 bg-amber-500/10 text-white font-bold ring-1 ring-amber-500"
                          : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      <span className="font-mono text-sm">{ts.time}</span>
                      <span className="text-[10px] text-zinc-400">{formatPrice(ts.price)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-zinc-800/80 pt-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-900"
              >
                Скасувати
              </button>
              <button
                type="button"
                disabled={!transferSlotId}
                onClick={handleTransferSubmit}
                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-black hover:bg-amber-400 disabled:opacity-50 disabled:pointer-events-none"
              >
                Перенести бронювання
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
