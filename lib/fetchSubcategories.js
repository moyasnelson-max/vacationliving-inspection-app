import { supabase } from './supabase-client';

export async function fetchSubcategories(categoryId) {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', categoryId);

  if (error) throw error;
  return data || [];
}
