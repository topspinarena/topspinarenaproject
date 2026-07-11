"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Availability() {
  const [courts, setCourts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  const hours = [
    ["06:00:00", "07:00:00"],
    ["07:00:00", "08:00:00"],
    ["08:00:00", "09:00:00"],
    ["09:00:00", "10:00:00"],
    ["10:00:00", "11:00:00"],
    ["11:00:00", "12:00:00"],
    ["12:00:00", "13:00:00"],
    ["13:00:00", "14:00:00"],
    ["14:00:00", "15:00:00"],
    ["15:00:00", "16:00:00"],
    ["16:00:00", "17:00:00"],
    ["17:00:00", "18:00:00"],
    ["18:00:00", "19:00:00"],
    ["19:00:00", "20:00:00"],
    ["20:00:00", "21:00:00"],
    ["21:00:00", "22:00:00"],
    ["22:00:00", "23:00:00"],
    ["23:00:00", "00:00:00"],
  ];

  async function loadData() {
    const today = new Date().toISOString().split("T")[0];

    const { data: courtsData } = await supabase
      .from("courts")
      .select("*")
      .order("id");

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_date", today);

    setCourts(courtsData || []);
    setBookings(bookingsData || []);
  }

  useEffect(() => {
    loadData();

    const realtime = supabase
      .channel("booking-live")
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
      supabase.removeChannel(realtime);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="bg-slate-950 text-white py-20 px-6">

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">
          Today's Court Availability
        </h2>

        <p className="text-xl mt-4">
          📅 {today}
        </p>

        <p className="text-green-400 text-2xl font-bold mt-2">
          🕒 {currentTime} WITA
        </p>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">

        {courts.map((court) => (

          <div
            key={court.id}
            className="bg-slate-900 rounded-2xl border border-slate-700 p-6"
          >

            <h3 className="text-2xl font-bold mb-6 text-center">
              {court.name}
            </h3>

            {hours.map(([start, end]) => {

              const booked = bookings.some(
                (booking) =>
                  booking.court_id === court.id &&
                  booking.start_time <= start &&
                  booking.end_time > start
              );

              return (
                <div
                  key={start}
                  className="flex justify-between items-center py-2 border-b border-slate-800"
                >

                  <span>
                    {start.substring(0, 5).replace(":", ".")} -{" "}
                    {end.substring(0, 5).replace(":", ".")}
                  </span>

                  <span
                    className={
                      booked
                        ? "text-red-500 font-bold"
                        : "text-green-400 font-bold"
                    }
                  >
                    {booked ? "BOOKED" : "AVAILABLE"}
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