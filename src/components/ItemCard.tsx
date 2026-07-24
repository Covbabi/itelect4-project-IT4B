import type { Item } from "../types/index";

interface ItemCardProps {
  item: Item;
  reporterName?: string;
}

function ItemCard({ item, reporterName }: ItemCardProps) {
  return (
    <article className="card item-card">
      <div className="card-header">
        <span className="badge">ITEM</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <p>{item.location}</p>
      <p>Reported by: {reporterName ?? item.reportedBy}</p>
      <p className={`status-badge ${item.status}`}>{item.status}</p>
    </article>
  );
}

export default ItemCard;
