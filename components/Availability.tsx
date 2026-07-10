"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Booking = {
  id: number;
  court_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
};

type Court = {
  id: number;
  name: string;
};

const times = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

export default function Availability() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  async function loadData() {
    const { data: courtsData } = await supabase
      .from("courts")
      .select("*")
      .order("id");

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_date", selectedDate);

    if (courtsData) setCourts(courtsData);

    if (bookingsData) setBookings(bookingsData);
  }

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel("bookings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);

  function isBooked(courtId: number, time: string) {
    return bookings.some((booking) => {
      if (booking.court_id !== courtId) return false;

      const start = booking.start_time.slice(0, 5);
      const end = booking.end_time.slice(0, 5);

      return time >= start && time < end;
    });
  }

  return (
    <section className="bg-slate-950 py-20 px-8 text-white">

      <h2 className="text-4xl font-bold text-center mb-6">
        Today's Court Availability
      </h2>

      <div className="flex justify-center mb-10">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {courts.map((court) => (

          <div
            key={court.id}
            className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
          >

            <h3 className="text-xl font-bold mb-6">
              {court.name}
            </h3>

            {times.map((time) => {

              const booked = isBooked(court.id, time);

              const endHour =
                String(Number(time.substring(0, 2)) + 1).padStart(2, "0") +
                ":00";

              return (

                <div
                  key={time}
                  className="flex justify-between items-center py-3 border-b border-slate-800"
                >

                  <span>
                    {time.replace(":", ".")} - {endHour.replace(":", ".")}
                  </span>

                  <span
                    className={
                      booked
                        ? "text-red-400 font-bold"
                        : "text-green-400 font-bold"
                    }
                  >
                    {booked ? "Booked" : "Available"}
                  </span>

                </div>

              );

            })}

          </div>

        ))}

      </div>

    </section>
  );
}