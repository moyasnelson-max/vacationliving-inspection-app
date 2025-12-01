import { supabase } from './supabase-client';

export async function fetchItems(subcategoryId) {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('subcategory_id', subcategoryId);

  if (error) throw error;
  return data || [];
}
