"use client";

import Link from "next/link";
import "@theme/item-card.css";

export default function ItemCard({ item, href }) {
  if (!item) return null;

  return (
    <Link href={href} className="item-card-link">
      <div className="item-card fade-in">
        <p className="item-card-title">{item.name}</p>
      </div>
    </Link>
  );
}
