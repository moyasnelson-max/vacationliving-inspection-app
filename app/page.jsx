import Link from "next/link";

export default function HomePage() {
  return (
    <main className="vl-shell">
      <Header />

      <section className="vl-hero">
        <div className="vl-hero__bg" aria-hidden="true" />
        <div className="vl-container vl-hero__inner">
          <div className="vl-hero__copy">
            <p className="vl-kicker">Inspection & Operations Suite</p>
            <h1 className="vl-h1">
              Vacation Living <span className="vl-dot">·</span> Inspection System
            </h1>
            <p className="vl-subtitle">
              Plataforma interna para <strong>inspecciones</strong>,{" "}
              <strong>reportes</strong>, automatización y control operativo por
              propiedad. Diseñada para ser <strong>rápida</strong>,{" "}
              <strong>clara</strong> y <strong>escalable</strong>.
            </p>

            <div className="vl-ctaRow">
              <Link className="vl-btn vl-btn--primary" href="/auth/login">
                Iniciar sesión
              </Link>
              <Link className="vl-btn vl-btn--ghost" href="/reports">
                Ver reportes (solo lectura)
              </Link>
            </div>

            <div className="vl-badges" role="list">
              <span className="vl-badge">Seguridad por roles</span>
              <span className="vl-badge">Fotos + evidencia</span>
              <span className="vl-badge">Rápido en móvil</span>
              <span className="vl-badge">Listo para 50+ propiedades</span>
            </div>

            <div className="vl-meta">
              <span className="vl-meta__dot" />
              <span>Vacation Living · Miami, FL</span>
            </div>
          </div>

          <div className="vl-hero__panel">
            <div className="vl-card">
              <div className="vl-card__head">
                <h2 className="vl-h2">Acciones rápidas</h2>
                <span className="vl-pill">v1</span>
              </div>

              <div className="vl-card__grid">
                <QuickAction
                  title="Nueva inspección"
                  desc="Crear inspección por propiedad con checklist y evidencia."
                  href="/inspection"
                />
                <QuickAction
                  title="Reportar issue"
                  desc="Abrir incidencia con fotos, severidad y categoría."
                  href="/issues/new"
                />
                <QuickAction
                  title="Dashboard"
                  desc="Tus propiedades asignadas, actividad y pendientes."
                  href="/dashboard"
                />
                <QuickAction
                  title="Historial"
                  desc="Ver reportes previos y trazabilidad de casos."
                  href="/reports"
                />
              </div>

              <div className="vl-divider" />

              <div className="vl-note">
                <strong>Tip:</strong> Si eres inspector y no ves propiedades,
                revisa tu asignación en <code>inspector_houses</code> por{" "}
                <code>user_id</code>.
              </div>
            </div>

            <div className="vl-card vl-card--soft">
              <h3 className="vl-h3">Cómo funciona</h3>
              <ul className="vl-list">
                <li>Inicias sesión.</li>
                <li>Seleccionas propiedad asignada.</li>
                <li>Creas reporte/issue con fotos.</li>
                <li>El sistema notifica y mantiene historial.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="vl-section">
        <div className="vl-container">
          <div className="vl-sectionHead">
            <h2 className="vl-h2">Diseñado para operación real</h2>
            <p className="vl-muted">
              Menos clicks, más claridad. Estructura lista para escalar con tu
              Supabase.
            </p>
          </div>

          <div className="vl-features">
            <Feature
              title="UX simple y rápida"
              desc="Flujos cortos para inspección en campo. Botones grandes, lectura clara, mobile-first."
            />
            <Feature
              title="Evidencia y trazabilidad"
              desc="Issues con fotos, categoría, severidad y estado. Historial por propiedad y por caso."
            />
            <Feature
              title="Automatización"
              desc="Conexión a emails/PDF y resúmenes semanales cuando tú lo actives. Sin ruido."
            />
            <Feature
              title="Arquitectura limpia"
              desc="Componentes reutilizables, estilos consistentes, preparado para roles y RLS."
            />
          </div>
        </div>
      </section>

      <footer className="vl-footer">
        <div className="vl-container vl-footer__inner">
          <div className="vl-footer__brand">
            <span className="vl-footer__mark">VL</span>
            <div>
              <div className="vl-footer__title">Vacation Living</div>
              <div className="vl-footer__sub">
                Inspection & Operations Suite
              </div>
            </div>
          </div>

          <div className="vl-footer__links">
            <Link className="vl-link" href="/auth/login">Login</Link>
            <Link className="vl-link" href="/dashboard">Dashboard</Link>
            <Link className="vl-link" href="/reports">Reports</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Header() {
  return (
    <header className="vl-topbar">
      <div className="vl-container vl-topbar__inner">
        <div className="vl-brand">
          <span className="vl-brand__mark">VL</span>
          <div>
            <div className="vl-brand__title">Vacation Living</div>
            <div className="vl-brand__sub">Inspections</div>
          </div>
        </div>

        <nav className="vl-nav">
          <Link className="vl-link" href="/dashboard">Dashboard</Link>
          <Link className="vl-link" href="/inspection">Inspections</Link>
          <Link className="vl-link" href="/reports">Reports</Link>
          <Link className="vl-btn vl-btn--small" href="/auth/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}

function QuickAction({ title, desc, href }) {
  return (
    <Link className="vl-action" href={href}>
      <div className="vl-action__title">{title}</div>
      <div className="vl-action__desc">{desc}</div>
      <div className="vl-action__go">
        <span>Open</span> →
      </div>
    </Link>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="vl-feature">
      <div className="vl-feature__icon" />
      <div>
        <div className="vl-feature__title">{title}</div>
        <div className="vl-feature__desc">{desc}</div>
      </div>
    </div>
  );
}