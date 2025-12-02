import Link from "next/link";

export default function ItemCard({ item, href }) {
  return (
    <Link href={href}>
      <div className="item-card">
        <p>{item.name}</p>
      </div>
    </Link>
  );
}