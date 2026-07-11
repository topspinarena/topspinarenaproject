import { supabase } from "./supabase";

export async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("court_id")
    .order("start_time");

  if (error) throw error;

  return data;
}