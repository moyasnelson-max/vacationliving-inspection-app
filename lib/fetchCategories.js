import { supabase } from './supabase-client';

export async function fetchCategories(houseId) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('house_id', houseId);

  if (error) throw error;
  return data || [];
}
