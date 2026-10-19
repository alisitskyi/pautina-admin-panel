import { Room, Booking, TimeSlot } from "@/types";

export const INITIAL_ROOMS: Room[] = [
  { id: 14, name: "HOTEL HOGVARTS", category: "harry_potter", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Вадима Гетьмана, 1Б" },
  { id: 22, name: "Гаррі Поттер і Таємна кімната", category: "harry_potter", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Вадима Гетьмана, 1Б" },
  { id: 24, name: "Гаррі Поттер та Маховик часу", category: "harry_potter", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Вадима Гетьмана, 1Б" },
  { id: 44, name: "Гаррі Поттер: Таємниця Крестражу", category: "harry_potter", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Вадима Гетьмана, 1Б" },
  { id: 28, name: "Міністерство Магії", category: "harry_potter", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Вадима Гетьмана, 1Б" },

  { id: 11, name: "ВОНО", category: "horror", durationMinutes: 60, capacity: "2-8 гравців", location: "вул. Шота Руставелі, 24" },
  { id: 23, name: "Аннабель", category: "horror", durationMinutes: 60, capacity: "2-7 гравців", location: "вул. Шота Руставелі, 24" },
  { id: 34, name: "АСТРАЛ", category: "horror", durationMinutes: 60, capacity: "2-8 гравців", location: "вул. Шота Руставелі, 24" },
  { id: 35, name: "9 кругов АДА", category: "horror", durationMinutes: 75, capacity: "2-8 гравців", location: "вул. Шота Руставелі, 24" },
  { id: 36, name: "ДЕМОНИ ДОМУ УОРРЕН", category: "horror", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Шота Руставелі, 24" },
  { id: 40, name: "ТАРО: Карта смерті", category: "horror", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Шота Руставелі, 24" },
  { id: 50, name: "Техаська різанина", category: "horror", durationMinutes: 75, capacity: "2-8 гравців", location: "вул. Шота Руставелі, 24" },
  { id: 52, name: "Кровава Мері", category: "horror", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Шота Руставелі, 24" },
  { id: 30, name: "Прокляття монахіні", category: "horror", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Шота Руставелі, 24" },
  { id: 31, name: "ЕКЗОРЦИСТИ", category: "horror", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Шота Руставелі, 24" },
  { id: 37, name: "МОРГ: мітка на тілі", category: "horror", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Шота Руставелі, 24" },
  { id: 38, name: "ЦИРК ЖАХІВ", category: "horror", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Шота Руставелі, 24" },

  { id: 43, name: "ДЖУМАНДЖИ", category: "adventure", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Велика Васильківська, 134" },
  { id: 33, name: "ДЖУНГЛІ", category: "adventure", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Велика Васильківська, 134" },
  { id: 46, name: "ХОББІТ", category: "adventure", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Велика Васильківська, 134" },
  { id: 17, name: "Загублені у космосі", category: "adventure", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Велика Васильківська, 134" },
  { id: 9, name: "МУМІЯ", category: "adventure", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Велика Васильківська, 134" },

  { id: 8, name: "ВТЕЧА / ПОБЕГ", category: "classic", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Хрещатик, 15" },
  { id: 16, name: "ЛАБИРИНТ", category: "classic", durationMinutes: 60, capacity: "2-12 гравців", location: "вул. Хрещатик, 15" },
  { id: 13, name: "Семейка Аддамс", category: "classic", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Хрещатик, 15" },
  { id: 21, name: "ЧУЖІ", category: "classic", durationMinutes: 60, capacity: "2-6 гравців", location: "вул. Хрещатик, 15" },

  { id: 3, name: "ПРОГРАМИ НА ДЕНЬ НАРОДЖЕННЯ", category: "special", durationMinutes: 120, capacity: "до 20 дітей", location: "Усі локації" },
];

export const STANDARD_TIMES = [
  "10:30",
  "12:00",
  "13:30",
  "15:00",
  "16:30",
  "18:00",
  "19:30",
  "21:00",
  "22:30",
];

export function getPriceForTime(time: string): number {
  if (time >= "21:00") return 2000;
  if (time >= "18:00") return 1800;
  return 1600;
}

// Generate realistic slots and sample bookings for today
export function generateInitialSchedule(todayStr: string): { slots: TimeSlot[]; bookings: Booking[] } {
  const slots: TimeSlot[] = [];
  const bookings: Booking[] = [];
  let slotId = 732400;
  let bookingId = 1050;

  INITIAL_ROOMS.forEach((room) => {
    STANDARD_TIMES.forEach((time) => {
      slotId++;
      const price = getPriceForTime(time);

      // Seed a few realistic active bookings
      const isSampleBooked = (room.id === 14 && (time === "15:00" || time === "18:00")) ||
                             (room.id === 11 && (time === "19:30" || time === "21:00")) ||
                             (room.id === 43 && time === "13:30") ||
                             (room.id === 23 && time === "22:30");

      const isSampleService = room.id === 50 && time === "10:30";

      if (isSampleBooked) {
        bookingId++;
        const sampleBooking: Booking = {
          id: bookingId,
          timelineId: slotId,
          roomId: room.id,
          date: todayStr,
          time,
          price,
          name: room.id === 14 ? "Олена Коваль" : room.id === 11 ? "Максим Дмитренко" : "Олександр Шевченко",
          phone: room.id === 14 ? "+380671234567" : room.id === 11 ? "+380509876543" : "+380934445566",
          email: "client@example.com",
          userComment: "Святкуємо День народження, 5 осіб",
          adminComment: "Потрібен додатковий актор",
          clientConfirm: true,
          gameStatus: 2, // Active
          createdAt: "2026-10-19T12:00:00.000Z",
        };


        bookings.push(sampleBooking);
        slots.push({
          id: slotId,
          roomId: room.id,
          date: todayStr,
          time,
          price,
          status: "booked",
          bookingId: bookingId,
        });
      } else if (isSampleService) {
        slots.push({
          id: slotId,
          roomId: room.id,
          date: todayStr,
          time,
          price,
          status: "service",
        });
      } else {
        slots.push({
          id: slotId,
          roomId: room.id,
          date: todayStr,
          time,
          price,
          status: "free",
        });
      }
    });
  });

  return { slots, bookings };
}
