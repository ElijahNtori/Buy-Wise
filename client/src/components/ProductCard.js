import { Star, Store, Truck, Calendar, ShoppingCart, Plus, Check, ExternalLink } from "lucide-react";
import { useCompare } from "../context/CompareContext";
import "./ProductCard.css";

const MARKETPLACE_COLORS = {
  amazon: "var(--amazon)",
  ebay: "var(--ebay)",
  aliexpress: "var(--aliexpress)",
  alibaba: "var(--alibaba)",
  temu: "var(--temu)"
};

const MARKETPLACE_LABELS = {
  amazon: "Amazon",
  ebay: "eBay",
  aliexpress: "AliExpress",
  alibaba: "Alibaba",
  temu: "Temu"
};

function StarRating({ rating }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          fill={i <= Math.floor(rating) ? "var(--warning)" : "transparent"}
          color={i <= Math.floor(rating) ? "var(--warning)" : "var(--border)"}
          strokeWidth={2.5}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product, animDelay = 0, aiBadge = null }) {
  const { addToCompare, removeFromCompare, isInCompare, maxReached } = useCompare();
  const inCompare = isInCompare(product.id);
  const mpColor = MARKETPLACE_COLORS[product.marketplace] || "var(--accent)";

  const handleCompareToggle = (e) => {
    e.stopPropagation();
    if (inCompare) removeFromCompare(product.id);
    else if (!maxReached) addToCompare(product);
  };

  return (
    <article
      className="product-card fade-up"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* AI Recommendation Badge */}
      {aiBadge && (
        <div className={`product-card__ai-badge ${aiBadge.type}`}>
          {aiBadge.icon}
          <span>{aiBadge.label}</span>
        </div>
      )}

      {/* Marketplace ribbon */}
      <div
        className={`product-card__ribbon ${product.marketplace}`}
        style={{ background: mpColor }}
      >
        {MARKETPLACE_LABELS[product.marketplace]}
      </div>

      {/* Image */}
      <div className="product-card__img-wrap">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={e => { e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; }}
        />
        {product.condition === "Used" && (
          <span className="product-card__condition">Pre-owned</span>
        )}
      </div>

      {/* Body */}
      <div className="product-card__body">
        <p className="product-card__title" title={product.title}>
          {product.title}
        </p>

        {/* Rating */}
        <div className="product-card__rating">
          <StarRating rating={Number(product.rating) || 0} />
          <span className="product-card__review-count">
            {(Number(product.reviewCount) || 0).toLocaleString()} reviews
          </span>
        </div>

        {/* Price */}
        <div className="product-card__price-row">
          <p className="product-card__price">
            GH₵ {(typeof product.price === 'number' ? product.price : 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="product-card__currency">{product.currency}</span>
        </div>

        {/* Meta */}
        <div className="product-card__meta">
          <div className="product-card__meta-item" title="Seller">
            <Store size={14} />
            <span>{product.seller}</span>
          </div>
          <div className="product-card__meta-item" title="Shipping">
            <Truck size={14} />
            <span>{product.shipping}</span>
          </div>
          <div className="product-card__meta-item" title="Delivery">
            <Calendar size={14} />
            <span>{product.deliveryDays}d delivery</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="product-card__actions">
        <button
          className={`btn-compare ${inCompare ? "active" : ""} ${maxReached && !inCompare ? "disabled" : ""}`}
          onClick={handleCompareToggle}
          title={inCompare ? "Remove from comparison" : "Add to comparison"}
        >
          {inCompare ? <Check size={16} /> : <Plus size={16} />}
          <span>{inCompare ? "Compared" : "Compare"}</span>
        </button>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-buy"
          onClick={e => e.stopPropagation()}
        >
          <span>View Deal</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </article>
  );
}
