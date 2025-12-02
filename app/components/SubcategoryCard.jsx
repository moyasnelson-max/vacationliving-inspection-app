import Link from "next/link";

export default function SubcategoryCard({ subcategory, href }) {
  return (
    <Link href={href}>
      <div className="subcategory-card">
        <h4>{subcategory.name}</h4>
      </div>
    </Link>
  );
}