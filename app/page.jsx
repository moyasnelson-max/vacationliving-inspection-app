"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "./providers";

export default function HomePage() {
  const { t, lang } = useI18n();

  return (
    <main className="vl-shell">
      <Header />

      {/* HERO + QUICK ACTIONS */}
      <section className="vl-hero">
        <div className="vl-hero_bg" aria-hidden="true" />

        <div className="vl-container vl-hero_inner">
          {/* Left column: hero copy */}
          <div className="vl-hero_copy">
            <p className="vl-kicker">{t.hero_kicker}</p>

            <h1 className="vl-h1">
              <span className="vl-title">
                {t.hero_title} <span className="vl-dot" />
              </span>
            </h1>

            <p className="vl-subtitle">{t.hero_subtitle}</p>

            <div className="vl-ctaRow">
              <Link className="vl-btn vl-btn--primary" href="/inspection">
                {t.hero_primaryCta}
              </Link>

              <Link
                className="vl-btn vl-btn--ghost vl-hero_secondary"
                href="/reports?view=by_property"
              >
                {t.hero_secondaryCta}
              </Link>
            </div>

            <div className="vl-badges" role="list">
              <span className="vl-badge">{t.badge_role}</span>
              <span className="vl-badge">{t.badge_photos}</span>
              <span className="vl-badge">{t.badge_mobile}</span>
              <span className="vl-badge">{t.badge_scale}</span>
            </div>
          </div>

          {/* Right column: quick actions panel */}
          <div className="vl-actionsPanel">
            <div className="vl-actions_header">
              <div className="vl-actions_title">
                {lang === "en" ? "Quick actions" : "Acciones rápidas"}
              </div>
              <span className="vl-actions_version">v1</span>
            </div>

            <div className="vl-actions">
              <QuickAction
                title={t.actions_newInspection_title}
                desc={t.actions_newInspection_desc}
                href="/inspection"
                label={t.actions_newInspection_label}
              />
              <QuickAction
                title={t.actions_issue_title}
                desc={t.actions_issue_desc}
                href="/inspection?mode=issue"
                label={t.actions_issue_label}
              />
              <QuickAction
                title={t.actions_dashboard_title}
                desc={t.actions_dashboard_desc}
                href="/dashboard"
                label={t.actions_dashboard_label}
              />
              <QuickAction
                title={t.actions_history_title}
                desc={t.actions_history_desc}
                href="/reports?sort=latest"
                label={t.actions_history_label}
              />
            </div>

            <div className="vl-note vl-note--inline">
              <p>
                <strong>Tip:</strong> {t.tip_main}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BASIC WORKFLOW */}
      <section className="vl-section">
        <div className="vl-container vl-twoCols">
          <div className="vl-card vl-card--soft">
            <h3 className="vl-h3">{t.how_title}</h3>
            <ul className="vl-list">
              <li>{t.how_step1}</li>
              <li>{t.how_step2}</li>
              <li>{t.how_step3}</li>
              <li>{t.how_step4}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="vl-section">
        <div className="vl-container">
          <div className="vl-sectionHead">
            <h2 className="vl-h2">{t.benefits_title}</h2>
            <p className="vl-muted">{t.benefits_subtitle}</p>
          </div>

          <div className="vl-features">
            <Feature title={t.benefits_ux_title} desc={t.benefits_ux_desc} />
            <Feature
              title={t.benefits_auto_title}
              desc={t.benefits_auto_desc}
            />
            <Feature
              title={t.benefits_evidence_title}
              desc={t.benefits_evidence_desc}
            />
            <Feature
              title={t.benefits_arch_title}
              desc={t.benefits_arch_desc}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ================= HEADER CON LOGO + TOGGLE EN/ES ================= */

function Header() {
  const { lang, setLang, t } = useI18n();

  const toggleLang = () => {
    setLang(lang === "en" ? "es" : "en");
  };

  return (
    <header className="vl-topbar">
      <div className="vl-container vl-topbar_inner">
        <div className="vl-brand">
          {/* Logo principal */}
          <Image
            src="/logo.png"
            alt="Vacation Living logo"
            width={130}
            height={32}
            className="vl-brand_logo"
            priority
          />
          <div className="vl-brand_text">
            <div className="vl-brand_title">{t.nav_brandTitle}</div>
            <div className="vl-brand_sub">{t.nav_brandSub}</div>
          </div>
        </div>

        <nav className="vl-nav">
          <Link className="vl-link vl-link--active" href="/dashboard">
            {t.nav_dashboard}
          </Link>
          <Link className="vl-link" href="/inspection">
            {t.nav_inspections}
          </Link>
          <Link className="vl-link" href="/reports">
            {t.nav_reports}
          </Link>

          <button
            type="button"
            className="vl-btn vl-btn--small vl-btn--ghost"
            onClick={toggleLang}
          >
            {lang === "en" ? "EN / ES" : "ES / EN"}
          </button>

          <Link className="vl-btn vl-btn--small" href="/auth/login">
            {t.nav_login}
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ================= COMPONENTES PEQUEÑOS ================= */

function QuickAction({ title, desc, href, label }) {
  return (
    <Link className="vl-action" href={href}>
      <div className="vl-action_title">{title}</div>
      <div className="vl-action_desc">{desc}</div>
      <div className="vl-action_go">
        <span>{label} →</span>
      </div>
    </Link>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="vl-feature">
      <div className="vl-feature_icon" />
      <div>
        <div className="vl-feature_title">{title}</div>
        <div className="vl-feature_desc">{desc}</div>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useI18n();

  return (
    <footer className="vl-footer">
      <div className="vl-container vl-footer_inner">
        <div className="vl-footer_brand">
          {/* Icono compacto en el footer */}
          <span className="vl-footer_mark">
            <Image
              src="/icon.png"
              alt="Vacation Living icon"
              width={24}
              height={24}
            />
          </span>
          <div className="vl-footer_title">{t.footer_title}</div>
          <div className="vl-footer_sub">{t.footer_sub}</div>
        </div>

        <div className="vl-footer_sub">
          v1.0 · Miami, FL ·{" "}
          <Link className="vl-link" href="/reports">
            {t.footer_help}
          </Link>
        </div>
      </div>
    </footer>
  );
}