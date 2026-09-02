import { useState, useEffect } from "react";
import { Clock, ExternalLink, X } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import "./RecentlyViewed.css";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23f0f0f0' width='80' height='80'/%3E%3C/svg%3E";

export default function RecentlyViewed() {
  const { getItems, clearItems } = useRecentlyViewed();
  const { formatPrice } = useCurrency();
  const [items, setItems] = useState([]);

  // Read from localStorage on mount (and whenever window regains focus)
  useEffect(() => {
    const load = () => setItems(getItems());
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [getItems]);

  if (items.length === 0) return null;

  const handleClear = () => {
    clearItems();
    setItems([]);
  };

  return (
    <section className="recently-viewed">
      <div className="recently-viewed__header">
        <Clock size={16} />
        <h3>Recently Viewed</h3>
        <button className="recently-viewed__clear" onClick={handleClear}>
          Clear all
        </button>
      </div>
      <div className="recently-viewed__track">
        {items.map(product => (
          <a
            key={product.id}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rv-card"
            title={product.title}
          >
            <div className="rv-card__img-wrap">
              <img
                src={product.image || PLACEHOLDER}
                alt={product.title}
                onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER; }}
              />
              <span className={`rv-card__mp-dot ${product.marketplace}`} />
            </div>
            <div className="rv-card__body">
              <p className="rv-card__title">{product.title}</p>
              <p className="rv-card__price">{formatPrice(product.price)}</p>
            </div>
            <div className="rv-card__overlay">
              <ExternalLink size={16} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
