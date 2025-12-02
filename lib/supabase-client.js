"use client";

import { createBrowserClient, createServerClient } from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// VALIDACIÓN DE ENTORNO
if (!supabaseUrl) throw new Error("❌ Missing: NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseAnon) throw new Error("❌ Missing: NEXT_PUBLIC_SUPABASE_ANON_KEY");

// 🔥 CLIENTE PARA EL NAVEGADOR (frontend)
export const supabaseBrowser = () =>
  createBrowserClient(supabaseUrl, supabaseAnon);

// 🔥 CLIENTE PARA EL SERVIDOR (server components / actions)
export const supabaseServer = (cookies) =>
  createServerClient(supabaseUrl, supabaseAnon, {
    cookies: {
      get(name) {
        return cookies.get(name)?.value;
      },
      set(name, value, options) {
        cookies.set(name, value, options);
      },
      remove(name, options) {
        cookies.delete(name, options);
      },
    },
  });