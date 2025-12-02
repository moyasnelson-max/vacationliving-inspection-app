import { supabase } from "./supabase-client.js";

export async function uploadFile(path, fileBlob) {
  const { data, error } = await supabase.storage
    .from("reports")
    .upload(path, fileBlob, {
      upsert: true,
    });

  if (error) throw error;
  return data;
}