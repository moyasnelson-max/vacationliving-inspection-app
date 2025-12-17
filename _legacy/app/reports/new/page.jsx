const createReport = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const cleanProperty = propertyName.trim();
  const cleanInspector = inspector.trim();
  const cleanNotes = notes.trim();

  // Validaciones PRO
  if (!cleanProperty) {
    setError("Property name is required");
    setLoading(false);
    return;
  }

  if (!cleanInspector) {
    setError("Inspector name is required");
    setLoading(false);
    return;
  }

  if (cleanNotes.length > 800) {
    setError("Notes cannot exceed 800 characters");
    setLoading(false);
    return;
  }

  // Inserción Marriott-level
  const { data, error } = await supabase
    .from("reports")
    .insert([
      {
        property_name: cleanProperty,
        inspector: cleanInspector,
        notes: cleanNotes,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("❌ Error creating report:", error);
    setError("Error creating report");
    setLoading(false);
    return;
  }

  // Redirigir al reporte recién creado
  window.location.href = `/reports/${data.id}`;
};
