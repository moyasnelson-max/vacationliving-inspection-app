// lib/roleManager.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getUserRole() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return user.user_metadata?.role || 'guest';
}

export function isAdmin(role) {
  return role === 'admin';
}

export function isInspector(role) {
  return role === 'inspector';
}

export function isGuest(role) {
  return role === 'guest';
}
