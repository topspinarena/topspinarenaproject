"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Court = {
  id: number;
  name: string;
  color?: string;
};

type Booking = {
  id: number;
  court_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  phone: string;
  status: string;
};

const TIME_SLOTS = [
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

export default function Availability() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [serverDate, setServerDate] = useState("");
  const [serverLabel, setServerLabel] = useState("");
  const [serverTime, setServerTime] = useState("");

  async function loadServerTime() {
    const { data, error } = await supabase.rpc("get_server_time");

    if (error) {
      console.log(error);
      return;
    }

    if (data && data.length > 0) {
      setServerDate(data[0].server_date);
      setServerLabel(data[0].server_label);
      setServerTime(data[0].server_time);
    }
  }

  async function loadCourts() {
    const { data } = await supabase
      .from("courts")
      .select("*")
      .order("id");

    if (data) {
      setCourts(data);
    }
  }

  async function loadBookings(date: string) {
    if (!date) return;

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_date", date);

    if (data) {
      setBookings(data);
    }
  }

  async function refreshAll() {
    const { data } = await supabase.rpc("get_server_time");

    if (data && data.length > 0) {
      setServerDate(data[0].server_date);
      setServerLabel(data[0].server_label);
      setServerTime(data[0].server_time);

      await loadBookings(data[0].server_date);
    }

    await loadCourts();
  }

  useEffect(() => {
    refreshAll();

    const timer = setInterval(async () => {
      const { data } = await supabase.rpc("get_server_time");

      if (data && data.length > 0) {
        setServerTime(data[0].server_time);
      }
    }, 1000);

    const channel = supabase
      .channel("booking-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          refreshAll();
        }
      )
      .subscribe();

    return () => {
      clearInterval(timer);
      supabase.removeChannel(channel);
    };
  }, []);  function isBooked(courtId: number, start: string) {
    return bookings.some(
      (booking) =>
        booking.court_id === courtId &&
        booking.status === "BOOKED" &&
        booking.start_time <= start &&
        booking.end_time > start
    );
  }

  return (
    <section className="bg-slate-950 min-h-screen py-20 px-6 text-white">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="text-center mb-12">

          <h2 className="text-5xl font-bold">
            Today's Court Availability
          </h2>

          <p className="mt-4 text-xl text-slate-300">
            📅 {serverLabel}
          </p>

          <p className="mt-2 text-3xl font-bold text-lime-400">
            🕒 {serverTime} WITA
          </p>

        </div>

        {/* Schedule Table */}

        <div className="overflow-x-auto rounded-xl border border-slate-700">

          <table className="w-full">

            <thead className="bg-slate-900">

              <tr>

                <th className="border border-slate-700 p-4 text-left">
                  Time
                </th>

                {courts.map((court) => (

                  <th
                    key={court.id}
                    className="border border-slate-700 p-4 text-center"
                  >
                    {court.name}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {TIME_SLOTS.map(([start, end]) => (

                <tr
                  key={start}
                  className="hover:bg-slate-900 transition"
                >

                  <td className="border border-slate-700 p-4 font-semibold whitespace-nowrap">

                    {start.substring(0,5).replace(":","." )} - {end.substring(0,5).replace(":","." )}

                  </td>

                  {courts.map((court) => {

                    const booked = isBooked(court.id, start);

                    return (

                      <td
                        key={court.id}
                        className="border border-slate-700 p-3 text-center"
                      >

                      <div
                          className={`rounded-lg py-2 font-bold transition ${
                            booked
                              ? "bg-red-600 text-white"
                              : "bg-green-600 text-white"
                          }`}
                        >
                          {booked ? "BOOKED" : "AVAILABLE"}
                        </div>

                      </td>

                    );

                  })}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <div className="mt-8 flex gap-8 justify-center text-sm">

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-600"></div>
            <span>Available</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-600"></div>
            <span>Booked</span>
          </div>

        </div>

      </div>

    </section>
  );

}