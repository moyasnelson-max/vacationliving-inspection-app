import Link from 'next/link';

export default function ItemCard({ houseId, item }) {
  return (
    <Link
      href={`/inspection/${houseId}/items/${item.id}`}
      className="glass-card item-card"
    >
      <h4>{item.name}</h4>
      <p className="item-status">{item.status || 'Pending'}</p>
    </Link>
  );
}
