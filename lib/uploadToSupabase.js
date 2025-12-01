import { supabase } from './supabase-client';

export async function uploadToSupabase(file, houseId) {
  const ext = file.name.split('.').pop();
  const fileName = `${houseId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('issue-media')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  const { data: publicURL } = supabase.storage
    .from('issue-media')
    .getPublicUrl(fileName);

  return publicURL.publicUrl;
}
