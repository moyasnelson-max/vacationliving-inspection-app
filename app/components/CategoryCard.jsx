"use client";

import Link from "next/link";
import "@theme/category-card.css";

export default function CategoryCard({ category, href }) {
  return (
    <Link href={href} className="cat-card-wrapper">
      <div className="cat-card fade-in">
        <div className="cat-card-header">
          <h3 className="cat-card-title">{category.name}</h3>
        </div>

        {/* Línea decorativa Marriott */}
        <div className="cat-card-divider"></div>

        {/* Conteo opcional si existe */}
        {category.total_items !== undefined && (
          <p className="cat-card-count">{category.total_items} elementos</p>
        )}
      </div>
    </Link>
  );
}
