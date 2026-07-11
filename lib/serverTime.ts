import { supabase } from "./supabase";

export async function getServerTime() {
  const { data, error } = await supabase.rpc("get_server_time");

  if (error) throw error;

  return data;
}