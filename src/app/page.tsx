"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { ScheduleGrid } from "@/components/ScheduleGrid";
import { BookingModal } from "@/components/BookingModal";
import { QuickSearchModal } from "@/components/QuickSearchModal";
import { BookingsTable } from "@/components/BookingsTable";
import { INITIAL_ROOMS, generateInitialSchedule, STANDARD_TIMES, getPriceForTime } from "@/lib/data";
import { Room, TimeSlot, Booking } from "@/types";

const DEFAULT_DATE = "2026-10-19";


export default function AdminDashboardPage() {
  const [selectedDate, setSelectedDate] = useState<string>(DEFAULT_DATE);
  const [activeView, setActiveView] = useState<"schedule" | "room" | "bookings">("schedule");
  const [rooms] = useState<Room[]>(INITIAL_ROOMS);

  // Initialize slots and bookings
  const [{ slots, bookings }, setData] = useState(() => {
    return generateInitialSchedule(DEFAULT_DATE);
  });


  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<TimeSlot | null>(null);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  // Quick search modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const daySlots = slots.filter((s) => s.date === selectedDate);
    const dayBookings = bookings.filter((b) => b.date === selectedDate && b.gameStatus !== 0);

    const totalSlots = daySlots.length || rooms.length * STANDARD_TIMES.length;
    const bookedSlots = dayBookings.length;
    const freeSlots = Math.max(0, totalSlots - bookedSlots);
    const totalRevenue = dayBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    const pendingConfirm = dayBookings.filter((b) => !b.clientConfirm).length;

    return {
      totalSlots,
      bookedSlots,
      freeSlots,
      totalRevenue,
      pendingConfirm,
    };
  }, [slots, bookings, selectedDate, rooms.length]);

  // Handle slot click in ScheduleGrid
  const handleSlotClick = (slot: TimeSlot, room: Room, booking?: Booking) => {
    setActiveSlot(slot);
    setActiveRoom(room);
    setActiveBooking(booking || null);
    setIsModalOpen(true);
  };

  // Handle booking selection from Search or Table
  const handleSelectBooking = (booking: Booking) => {
    const room = rooms.find((r) => r.id === booking.roomId) || rooms[0];
    const slot = slots.find((s) => s.id === booking.timelineId) || {
      id: booking.timelineId,
      roomId: booking.roomId,
      date: booking.date,
      time: booking.time,
      price: booking.price,
      status: "booked" as const,
      bookingId: booking.id,
    };

    setActiveSlot(slot);
    setActiveRoom(room);
    setActiveBooking(booking);
    setIsModalOpen(true);
  };

  // Save (Create or Update) Booking
  const handleSaveBooking = (bookingData: Partial<Booking>) => {
    if (!activeSlot || !activeRoom) return;

    if (activeBooking) {
      // Update existing
      setData((prev) => ({
        ...prev,
        bookings: prev.bookings.map((b) =>
          b.id === activeBooking.id ? ({ ...b, ...bookingData } as Booking) : b
        ),
      }));
    } else {
      // Create new
      const newBookingId = Date.now();
      const newBooking: Booking = {
        id: newBookingId,
        timelineId: activeSlot.id,
        roomId: activeRoom.id,
        date: activeSlot.date,
        time: activeSlot.time,
        price: activeSlot.price,
        name: bookingData.name || "Клієнт",
        phone: bookingData.phone || "",
        email: bookingData.email,
        userComment: bookingData.userComment,
        adminComment: bookingData.adminComment,
        clientConfirm: bookingData.clientConfirm ?? true,
        gameStatus: bookingData.gameStatus ?? 2,
        createdAt: new Date().toISOString(),
      };

      setData((prev) => ({
        slots: prev.slots.map((s) =>
          s.id === activeSlot.id
            ? { ...s, status: "booked" as const, bookingId: newBookingId }
            : s
        ),
        bookings: [newBooking, ...prev.bookings],
      }));
    }
  };

  // Cancel Booking
  const handleCancelBooking = (bookingId: number) => {
    setData((prev) => {
      const target = prev.bookings.find((b) => b.id === bookingId);
      if (!target) return prev;

      return {
        slots: prev.slots.map((s) =>
          s.id === target.timelineId ? { ...s, status: "free" as const, bookingId: undefined } : s
        ),
        bookings: prev.bookings.map((b) =>
          b.id === bookingId ? { ...b, gameStatus: 0 } : b
        ),
      };
    });
  };

  // Transfer Booking
  const handleTransferBooking = (bookingId: number, targetSlotId: number) => {
    setData((prev) => {
      const currentBooking = prev.bookings.find((b) => b.id === bookingId);
      const targetSlot = prev.slots.find((s) => s.id === targetSlotId);
      if (!currentBooking || !targetSlot) return prev;

      const updatedBooking: Booking = {
        ...currentBooking,
        timelineId: targetSlot.id,
        roomId: targetSlot.roomId,
        date: targetSlot.date,
        time: targetSlot.time,
        price: targetSlot.price,
      };

      return {
        slots: prev.slots.map((s) => {
          if (s.id === currentBooking.timelineId) {
            return { ...s, status: "free" as const, bookingId: undefined };
          }
          if (s.id === targetSlotId) {
            return { ...s, status: "booked" as const, bookingId: bookingId };
          }
          return s;
        }),
        bookings: prev.bookings.map((b) => (b.id === bookingId ? updatedBooking : b)),
      };
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-amber-500 selection:text-black">
      {/* Top Navigation */}
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenSearch={() => setIsSearchOpen(true)}
        selectedDate={selectedDate}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-[1700px] px-4 py-6 sm:px-6 space-y-6">
        {/* Statistics Bar */}
        <StatsCards
          totalSlots={stats.totalSlots}
          bookedSlots={stats.bookedSlots}
          freeSlots={stats.freeSlots}
          totalRevenue={stats.totalRevenue}
          pendingConfirm={stats.pendingConfirm}
        />

        {/* View Switcher: Schedule Grid vs Bookings Table */}
        {activeView === "schedule" ? (
          <ScheduleGrid
            rooms={rooms}
            slots={slots}
            bookings={bookings}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onSlotClick={handleSlotClick}
          />
        ) : (
          <BookingsTable
            bookings={bookings}
            rooms={rooms}
            onSelectBooking={handleSelectBooking}
          />
        )}
      </main>

      {/* Booking Create/Edit/Transfer Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slot={activeSlot}
        room={activeRoom}
        booking={activeBooking}
        allRooms={rooms}
        allSlots={slots}
        onSaveBooking={handleSaveBooking}
        onCancelBooking={handleCancelBooking}
        onTransferBooking={handleTransferBooking}
      />

      {/* Quick Search Modal (Ctrl + K) */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        bookings={bookings}
        rooms={rooms}
        onSelectBooking={handleSelectBooking}
      />
    </div>
  );
}
