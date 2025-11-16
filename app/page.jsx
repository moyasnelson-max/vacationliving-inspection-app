export default function Home() {
  return (
    <div style={{ padding: 40, fontSize: 28, fontWeight: 600 }}>
      Vacation Living – Inspection System
      <p style={{ marginTop: 20, fontSize: 18, fontWeight: 400 }}>
        Bienvenido. Seleccione una opción:
      </p>

      <div style={{ marginTop: 30 }}>
        <a href="/login" style={{ display: 'block', marginBottom: 10 }}>
          🔐 Login Inspectores
        </a>

        <a href="/reports/new" style={{ display: 'block', marginBottom: 10 }}>
          📝 Reporte Huéspedes (sin login)
        </a>
      </div>
    </div>
  );
}
