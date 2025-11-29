"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./lux-header.module.css";

export default function LuxHeader({ title = "", backHref = "/inspection" }) {
  const [hidden, setHidden] = useState(false);
  let lastScroll = 0;

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll && current > 20) setHidden(true);
      else setHidden(false);
      lastScroll = current;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${hidden ? styles.hidden : ""}`}>
      <div className={styles.topRow}>
        <Link href={backHref} className={styles.backButton}>
          <span className={styles.backIcon}></span>
        </Link>
        <img src="/logo.png" alt="Vacation Living" className={styles.logo} />
        <div className={styles.placeholder}></div>
      </div>
      {title && (
        <div className={styles.breadcrumbs}>
          <span>{title}</span>
        </div>
      )}
    </header>
  );
}
