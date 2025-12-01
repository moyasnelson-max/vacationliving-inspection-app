// lib/email.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false } }
);

export async function sendInspectionEmail({ reportId }) {
  const { data, error } = await supabase.functions.invoke('send-report', {
    body: { reportId }
  });

  if (error) {
    console.error('❌ Error sending report email:', error);
    throw error;
  }

  return data;
}
