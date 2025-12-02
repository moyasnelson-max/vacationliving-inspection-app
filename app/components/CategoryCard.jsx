import Link from "next/link";

export default function CategoryCard({ category, href }) {
  return (
    <Link href={href}>
      <div className="category-card">
        <h3>{category.name}</h3>
      </div>
    </Link>
  );
}