import { useNavigate } from "react-router-dom";
import { Heart, Trash2, Search, Scale, ExternalLink, Store, ChevronRight } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
import "./WishlistPage.css";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f0f0f0' width='200' height='200'/%3E%3Ctext fill='%23aaa' font-family='sans-serif' font-size='13' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo image%3C/text%3E%3C/svg%3E";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCompare, isInCompare, maxReached } = useCompare();
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  usePageTitle(wishlist.length > 0 ? `Wishlist (${wishlist.length})` : "Wishlist");

  if (!isAuthenticated) {
    return (
      <div className="wishlist-page">
        <div className="container wishlist-page__empty wishlist-page__empty--auth">
          <div className="empty-icon-wrap">
            <Heart size={48} strokeWidth={1.5} />
          </div>
          <h2>Sign in to use your wishlist</h2>
          <p>Create an account or sign in to save products and keep them synced across your devices.</p>
          <button className="btn-primary" onClick={() => navigate("/account?intent=wishlist")}>
            Sign In or Register <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container wishlist-page__empty">
          <div className="empty-icon-wrap">
            <Heart size={48} strokeWidth={1.5} />
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Tap the <Heart size={14} style={{ display: "inline", verticalAlign: "middle" }} /> heart on any product to save it for later.</p>
          <button className="btn-primary" onClick={() => navigate("/search")}>
            Start Searching <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        {/* Header */}
        <div className="wishlist-page__header">
          <div>
            <h1 className="wishlist-page__title">
              <Heart size={24} fill="currentColor" /> Wishlist
            </h1>
            <p className="wishlist-page__sub">{wishlist.length} saved {wishlist.length === 1 ? "item" : "items"}</p>
          </div>
          <div className="wishlist-page__actions">
            <button className="btn-secondary" onClick={() => navigate("/search")}>
              <Search size={16} /> Keep Shopping
            </button>
            <button className="btn-danger" onClick={clearWishlist}>
              <Trash2 size={16} /> Clear All
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="wishlist-grid">
          {wishlist.map((product, i) => {
            const inCompare  = isInCompare(product.id);
            const canCompare = inCompare || !maxReached;

            return (
              <div
                key={product.id}
                className="wishlist-card fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Remove button */}
                <button
                  className="wishlist-card__remove"
                  onClick={() => removeFromWishlist(product.id)}
                  title="Remove from wishlist"
                >
                  <Trash2 size={14} />
                </button>

                {/* Image */}
                <div className="wishlist-card__img-wrap">
                  <img
                    src={product.image || PLACEHOLDER}
                    alt={product.title}
                    onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER; }}
                  />
                  <span className={`wishlist-card__mp-badge ${product.marketplace}`}>
                    {product.marketplace}
                  </span>
                </div>

                {/* Body */}
                <div className="wishlist-card__body">
                  <p className="wishlist-card__title" title={product.title}>
                    {product.title}
                  </p>
                  <p className="wishlist-card__price">{formatPrice(product.price)}</p>
                  <div className="wishlist-card__meta">
                    <Store size={12} />
                    <span>{product.seller}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="wishlist-card__actions">
                  <button
                    className={`btn-compare ${inCompare ? "active" : ""} ${!canCompare ? "disabled" : ""}`}
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate("/account?intent=compare", {
                          state: {
                            from: "/wishlist",
                            message: "Sign in or create an account to compare products."
                          }
                        });
                        return;
                      }
                      if (!inCompare && canCompare) addToCompare(product);
                    }}
                    title={inCompare ? "Already in compare" : maxReached ? "Compare list full" : "Add to compare"}
                  >
                    <Scale size={14} />
                    <span>{inCompare ? "Added" : "Compare"}</span>
                  </button>

                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-buy"
                  >
                    <span>View Deal</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
