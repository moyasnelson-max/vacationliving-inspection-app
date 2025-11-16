export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Vacation Living - Inspection System</h1>
      <p>Bienvenido. Seleccione una opción:</p>

      <div style={{ marginTop: 30 }}>
        <a href="/login" style={{ display: "block", marginBottom: 10 }}>
          🔐 Login Inspectores
        </a>

        <a href="/reports/new" style={{ display: "block", marginBottom: 10 }}>
          📝 Reporte Huéspedes (sin login)
        </a>
      </div>
    </div>
  );
}
