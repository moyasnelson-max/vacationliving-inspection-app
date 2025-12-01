export async function generatePdf(reportId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-pdf`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reportId }),
    }
  );

  if (!res.ok) throw new Error('PDF generation failed');

  return await res.json();
}
