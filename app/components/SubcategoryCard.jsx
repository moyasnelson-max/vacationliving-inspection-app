import Link from 'next/link';

export default function SubcategoryCard({ houseId, subcategory }) {
  return (
    <Link
      href={`/inspection/${houseId}/subcategories/${subcategory.id}`}
      className="glass-card subcategory-card"
    >
      <h3>{subcategory.name}</h3>
    </Link>
  );
}
