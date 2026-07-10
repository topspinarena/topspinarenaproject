"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
export default function AdminPage() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [courtId, setCourtId] = useState("1");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  async function saveBooking() {
    const { error } = await supabase.from("bookings").insert([
      {
        court_id: Number(courtId),
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTime,
        customer_name: customerName,
        phone,
        status: "BOOKED",
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Booking berhasil disimpan!");
      setCustomerName("");
      setPhone("");
      setBookingDate("");
      setStartTime("");
      setEndTime("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      <div className="max-w-md space-y-4">
        <input
          className="w-full rounded bg-slate-800 p-3"
          placeholder="Nama Customer"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          className="w-full rounded bg-slate-800 p-3"
          placeholder="Nomor HP"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          className="w-full rounded bg-slate-800 p-3"
          value={courtId}
          onChange={(e) => setCourtId(e.target.value)}
        >
          <option value="1">Terracotta Court</option>
          <option value="2">Blue Court</option>
          <option value="3">Pink Court</option>
          <option value="4">Grey Court</option>
        </select>

        <input
          type="date"
          className="w-full rounded bg-slate-800 p-3"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
        />

        <input
          type="time"
          className="w-full rounded bg-slate-800 p-3"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <input
          type="time"
          className="w-full rounded bg-slate-800 p-3"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <button
          onClick={saveBooking}
          className="w-full rounded bg-lime-400 py-3 font-bold text-black"
        >
          Simpan Booking
        </button>
      </div>
    </main>
  );
}