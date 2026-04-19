import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Scale, 
  Trash2, 
  Star, 
  Zap, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Package,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
  Store,
  MessageCircle,
  Truck,
  Box,
  Tag
} from "lucide-react";
import { useCompare } from "../context/CompareContext";
import { usePageTitle } from "../hooks/usePageTitle";
import "./ComparePage.css";

const COMPARE_ROWS = [
  { key: "price",        label: "Price",           icon: Tag,  format: v => `GH₵ ${(Number(v) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
  { key: "marketplace",  label: "Marketplace",      icon: Store,       format: v => v },
  { key: "rating",       label: "Rating",           icon: Star,        format: v => `${v} / 5` },
  { key: "reviewCount",  label: "Reviews",          icon: MessageCircle, format: v => Number(v).toLocaleString() },
  { key: "seller",       label: "Seller",           icon: ShieldCheck,  format: v => v },
  { key: "shipping",     label: "Shipping",         icon: Truck,       format: v => v },
  { key: "deliveryDays", label: "Delivery",         icon: Clock,       format: v => `${v} day${v !== 1 ? "s" : ""}` },
  { key: "condition",    label: "Condition",        icon: Box,         format: v => v },
  { key: "brand",        label: "Brand",            icon: Tag,         format: v => v },
  { key: "inStock",      label: "Stock Status",     icon: Package,     format: v => v ? "In Stock" : "Out of Stock" }
];

function bestValue(products, key) {
  if (products.length < 1) return null;
  if (key === "price") return products.reduce((b, p) => (Number(p.price) < Number(b.price) ? p : b)).id;
  if (key === "rating") return products.reduce((b, p) => (Number(p.rating) > Number(b.rating) ? p : b)).id;
  if (key === "reviewCount") return products.reduce((b, p) => (Number(p.reviewCount) > Number(b.reviewCount) ? p : b)).id;
  if (key === "deliveryDays") return products.reduce((b, p) => (Number(p.deliveryDays) < Number(b.deliveryDays) ? p : b)).id;
  return null;
}

function getAIRecommendation(products) {
  if (products.length < 2) return { bestValue: null, topRated: null };
  
  // Best Value: Lowest price among products with rating >= 4.0
  const goodRating = products.filter(p => Number(p.rating) >= 4.0);
  const valueSource = goodRating.length > 0 ? goodRating : products;
  const bestValue = valueSource.reduce((b, p) => (Number(p.price) < Number(b.price) ? p : b));
  
  // Top Rated: Highest rating
  const topRated = products.reduce((b, p) => (Number(p.rating) > Number(b.rating) ? p : b));
  
  return { bestValue, topRated };
}

function StarRating({ rating }) {
  const r = Number(rating) || 0;
  return (
    <div className="compare-stars">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={12} 
          fill={i < Math.floor(r) ? "var(--warning)" : "transparent"} 
          color={i < Math.floor(r) ? "var(--warning)" : "var(--ink-extra-soft)"} 
        />
      ))}
      <span className="rating-num">{r.toFixed(1)}</span>
    </div>
  );
}

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  usePageTitle(compareList.length > 0 ? `Comparing ${compareList.length} products` : "Compare");

  if (compareList.length === 0) {
    return (
      <div className="compare-page">
        <div className="container compare-page__empty">
          <div className="empty-icon-wrap">
            <Scale size={48} />
          </div>
          <h2>Nothing to compare yet</h2>
          <p>Find products you like and click the <strong>+ Compare</strong> button to see them here.</p>
          <button className="btn-primary" onClick={() => navigate("/search")}>
            Start Searching <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const { bestValue, topRated } = getAIRecommendation(compareList);

  return (
    <div className="compare-page">
      <div className="container">
        {/* Header */}
        <div className="compare-page__header">
          <div className="compare-page__header-text">
            <h1 className="compare-page__title">Compare Products</h1>
            <p className="compare-page__sub">Analyzing {compareList.length} items side-by-side</p>
          </div>
          <div className="compare-page__header-actions">
            <button className="btn-secondary" onClick={() => navigate(-1)}>
               <ArrowLeft size={18} /> Back
            </button>
            <button className="btn-danger" onClick={clearCompare}>
              <Trash2 size={18} /> Clear All
            </button>
          </div>
        </div>

        {/* AI Analysis Section */}
        {bestValue && topRated && (
          <div className="ai-analysis">
            <h2 className="ai-analysis__title">AI Comparative Analysis</h2>
            <div className="ai-analysis__grid">
              <div className="ai-analysis__card best-value">
                <div className="ai-analysis__icon-wrap">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div className="ai-analysis__content">
                  <h3>Best Value Pick</h3>
                  <p>
                    <strong>{bestValue.title}</strong> on <strong>{bestValue.marketplace}</strong> offers the most competitive 
                    total cost at <strong>GH₵ {Number(bestValue.price).toLocaleString()}</strong>.
                  </p>
                </div>
              </div>
              <div className="ai-analysis__card top-rated">
                <div className="ai-analysis__icon-wrap">
                  <Star size={24} fill="currentColor" />
                </div>
                <div className="ai-analysis__content">
                  <h3>Crowd Favorite</h3>
                  <p>
                    <strong>{topRated.title}</strong> is the best-rated option with a 
                    <strong> {topRated.rating}/5</strong> rating based on extensive reviews.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Layout */}
        <div className="compare-layout">
          {/* Sidebar Labels */}
          <div className="compare-sidebar">
            <div className="sidebar-header">
              <h3>PRODUCT SPECS</h3>
            </div>
            <div className="sidebar-rows">
              {COMPARE_ROWS.map(row => (
                <div key={row.key} className="sidebar-row">
                  <row.icon size={16} />
                  <span>{row.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="compare-products">
            {compareList.map(product => (
              <div key={product.id} className="compare-product-col">
                <div className="product-card-header">
                  {/* AI Badges */}
                  <div className="ai-badges">
                    {bestValue && product.id === bestValue.id && (
                      <div className="ai-badge best-value">
                        <Zap size={10} fill="currentColor" /> BEST VALUE
                      </div>
                    )}
                    {topRated && product.id === topRated.id && (
                      <div className="ai-badge top-rated">
                        <Star size={10} fill="currentColor" /> TOP RATED
                      </div>
                    )}
                  </div>

                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCompare(product.id)}
                  >
                    <X size={14} />
                  </button>
                  <div className="img-container">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className="product-meta">
                    <span className={`mp-badge ${product.marketplace}`}>
                      {product.marketplace}
                    </span>
                    <h4 className="title">{product.title}</h4>
                    <StarRating rating={product.rating} />
                    <a href={product.url} target="_blank" rel="noreferrer" className="btn-buy">
                      Buy Now <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <div className="product-specs">
                  {COMPARE_ROWS.map(row => {
                    const bestId = bestValue(compareList, row.key);
                    const isBest = bestId && product.id === bestId;
                    const value = product[row.key];

                    return (
                      <div key={row.key} className={`spec-value ${isBest ? 'is-best' : ''}`}>
                        <div className="spec-mobile-label">
                          <row.icon size={12} />
                          {row.label}
                        </div>
                        <div className="spec-content">
                          {row.key === "inStock" ? (
                            value ? <CheckCircle2 size={18} className="text-success" /> : <XCircle size={18} className="text-danger" />
                          ) : (
                            row.format(value)
                          )}
                        </div>
                        {isBest && <span className="best-tag"><Zap size={10} fill="currentColor" /> BEST</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
