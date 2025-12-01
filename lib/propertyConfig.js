// lib/propertyConfig.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getPropertyConfig(houseId) {
  const { data, error } = await supabase.functions.invoke('get-house-config', {
    body: { houseId }
  });

  if (error) {
    console.error('❌ Error loading property config:', error);
    throw error;
  }

  return data;
}
