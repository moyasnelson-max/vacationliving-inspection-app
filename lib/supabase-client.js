// lib/supabase-client.js
import { createClient } from "@supabase/supabase-js";

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const privateService = process.env.NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY;

if (!publicUrl || !publicAnon) {
  throw new Error("❌ Missing Supabase environment variables");
}

export const supabase =
  typeof window === "undefined"
    ? createClient(publicUrl, privateService, {
        auth: { persistSession: false },
      })
    : createClient(publicUrl, publicAnon, {
        auth: { persistSession: true },
      });