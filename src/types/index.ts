export type GameStatus = 0 | 1 | 2 | 3;

export const GameStatusLabels: Record<GameStatus, { label: string; color: string; bg: string }> = {
  0: { label: "Скасовано / Не відбулась", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  1: { label: "Гра відбулась", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  2: { label: "Буде грати (Активна)", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  3: { label: "Сервісна бронь", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
};

export interface Room {
  id: number;
  name: string;
  category: "harry_potter" | "horror" | "adventure" | "classic" | "special";
  location?: string;
  durationMinutes: number;
  capacity: string;
}

export interface TimeSlot {
  id: number;
  roomId: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (10:30, 12:00, etc.)
  price: number; // 1600, 1800, 2000, 2200
  status: "free" | "booked" | "service";
  bookingId?: number;
}

export interface Booking {
  id: number;
  timelineId: number;
  roomId: number;
  date: string;
  time: string;
  price: number;
  name: string;
  phone: string;
  email?: string;
  userComment?: string;
  adminComment?: string;
  clientConfirm: boolean;
  gameStatus: GameStatus;
  createdAt: string;
}
