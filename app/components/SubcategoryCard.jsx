"use client";

import Link from "next/link";

export default function SubcategoryCard({ subcategory, href }) {
  return (
    <Link href={href} className="vl-subcategory-card fade-in">
      <div className="vl-subcategory-inner">
        <h4 className="vl-subcategory-title">{subcategory.name}</h4>
      </div>
    </Link>
  );
}
