import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, Store, Truck, Calendar, Plus, Check, ExternalLink, Heart, ChevronDown, ThumbsUp } from "lucide-react";
import { useCompare } from "../context/CompareContext";
import { useWishlist } from "../context/WishlistContext";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { generateReviews } from "../utils/reviewsData";
import "./ProductCard.css";
import "./ProductCard.additions.css";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext fill='%23aaa' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo image%3C/text%3E%3C/svg%3E";

const MARKETPLACE_COLORS = {
  amazon:     "var(--amazon)",
  ebay:       "var(--ebay)",
  aliexpress: "var(--aliexpress)",
  alibaba:    "var(--alibaba)",
  temu:       "var(--temu)"
};

const MARKETPLACE_LABELS = {
  amazon:     "Amazon",
  ebay:       "eBay",
  aliexpress: "AliExpress",
  alibaba:    "Alibaba",
  temu:       "Temu"
};

function StarRating({ rating, size = 12 }) {
  const r = Number(rating) || 0;
  return (
    <div className="stars" aria-label={`${r} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.floor(r) ? "var(--warning)" : "transparent"}
          color={i <= Math.floor(r) ? "var(--warning)" : "var(--border)"}
          strokeWidth={2.5}
        />
      ))}
    </div>
  );
}

function ReviewsPanel({ productId, rating }) {
  const reviews = generateReviews(productId, rating, 3);
  return (
    <div className="product-card__reviews-panel">
      <p className="reviews-panel__label">Customer Snippets</p>
      {reviews.map(rev => (
        <div key={rev.id} className="review-item">
          <div className="review-item__header">
            <span className="review-item__user">{rev.username}</span>
            <StarRating rating={rev.rating} size={10} />
            <span className="review-item__date">{rev.date}</span>
          </div>
          <p className="review-item__text">{rev.text}</p>
          <div className="review-item__helpful">
            <ThumbsUp size={11} />
            <span>{rev.helpful} found this helpful</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductCard({ product, animDelay = 0, aiBadge = null }) {
  const { addToCompare, removeFromCompare, isInCompare, maxReached } = useCompare();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { addItem: trackView } = useRecentlyViewed();
  const navigate = useNavigate();
  const location = useLocation();
  const [showReviews, setShowReviews] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const images = product.images || [product.image];
  const hasMultipleImages = images.length > 1;

  const nextImage = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const inCompare  = isInCompare(product.id);
  const inWishlist = isInWishlist(product.id);
  const mpColor    = MARKETPLACE_COLORS[product.marketplace] || "var(--accent)";

  const handleCompareToggle = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/account?intent=compare", {
        state: {
          from: `${location.pathname}${location.search}`,
          message: "Sign in or create an account to compare products."
        }
      });
      return;
    }
    if (inCompare) removeFromCompare(product.id);
    else if (!maxReached) addToCompare(product);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/account?intent=wishlist", {
        state: {
          from: `${location.pathname}${location.search}`,
          message: "Sign in or create an account to save products to your wishlist."
        }
      });
      return;
    }
    toggleWishlist(product);
  };

  const handleViewDeal = () => {
    trackView(product);
    addToast(`Opening deal on ${MARKETPLACE_LABELS[product.marketplace] || product.marketplace}...`, "info");
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

      {/* Wishlist button */}
      <button
        className={`product-card__wishlist ${inWishlist ? "active" : ""}`}
        onClick={handleWishlist}
        title={!isAuthenticated ? "Sign in to save this product" : inWishlist ? "Remove from wishlist" : "Save for later"}
        aria-label={!isAuthenticated ? "Sign in to save this product" : inWishlist ? "Remove from wishlist" : "Save for later"}
      >
        <Heart
          size={16}
          fill={inWishlist ? "currentColor" : "none"}
          strokeWidth={2}
        />
      </button>

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
          src={images[imgIndex] || PLACEHOLDER_IMAGE}
          alt={product.title}
          loading="lazy"
          onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
        />
        
        {hasMultipleImages && (
          <div className="product-card__gallery-controls">
            <button className="gallery-btn prev" onClick={prevImage} aria-label="Previous image">
              <ChevronDown className="rotate-90" size={16} />
            </button>
            <div className="gallery-dots">
              {images.map((_, i) => (
                <span key={i} className={`gallery-dot ${i === imgIndex ? "active" : ""}`} />
              ))}
            </div>
            <button className="gallery-btn next" onClick={nextImage} aria-label="Next image">
              <ChevronDown className="rotate-n90" size={16} />
            </button>
          </div>
        )}

        {product.condition === "Used" && (
          <span className="product-card__condition">Pre-owned</span>
        )}
      </div>

      {/* Body */}
      <div className="product-card__body">
        <p className="product-card__title" title={product.title}>
          {product.title}
        </p>

        <div className="product-card__rating">
          <StarRating rating={Number(product.rating) || 0} />
          <span className="product-card__review-count">
            {(Number(product.reviewCount) || 0).toLocaleString()} reviews
          </span>
        </div>

        {/* Price — respects active currency from CurrencyContext */}
        <div className="product-card__price-row">
          <p className="product-card__price">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="product-card__meta">
          <div className="product-card__meta-item" title="Seller">
            <Store size={14} /><span>{product.seller}</span>
          </div>
          <div className="product-card__meta-item" title="Shipping">
            <Truck size={14} /><span>{product.shipping}</span>
          </div>
          <div className="product-card__meta-item" title="Delivery">
            <Calendar size={14} /><span>{product.deliveryDays}d delivery</span>
          </div>
        </div>
      </div>

      {/* Reviews toggle */}
      <button
        className={`product-card__reviews-toggle ${showReviews ? "open" : ""}`}
        onClick={() => setShowReviews(v => !v)}
        aria-expanded={showReviews}
      >
        <Star size={13} />
        <span>Customer reviews</span>
        <ChevronDown size={14} className="toggle-chevron" />
      </button>

      {/* Reviews panel */}
      {showReviews && (
        <ReviewsPanel productId={product.id} rating={product.rating} />
      )}

      {/* Actions */}
      <div className="product-card__actions">
        <button
          className={`btn-compare ${inCompare ? "active" : ""} ${maxReached && !inCompare ? "disabled" : ""}`}
          onClick={handleCompareToggle}
          title={!isAuthenticated ? "Sign in to compare products" : inCompare ? "Remove from comparison" : "Add to comparison"}
        >
          {inCompare ? <Check size={16} /> : <Plus size={16} />}
          <span>{inCompare ? "Compared" : "Compare"}</span>
        </button>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-buy"
          onClick={handleViewDeal}
        >
          <span>View Deal</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </article>
  );
}
