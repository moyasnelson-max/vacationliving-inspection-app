import Link from 'next/link';

export default function CategoryCard({ houseId, category }) {
  return (
    <Link
      href={`/inspection/${houseId}/categories/${category.id}`}
      className="glass-card category-card"
    >
      <h3>{category.name}</h3>
      <p>{category.description}</p>
    </Link>
  );
}
