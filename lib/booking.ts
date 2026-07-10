import { supabase } from "./supabase";

export async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id,
      booking_date,
      start_time,
      end_time,
      status,
      customer_name,
      court_id,
      courts (
        id,
        name,
        color
      )
    `);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}