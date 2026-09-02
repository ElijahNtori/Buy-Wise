import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Layers, Heart, ArrowLeftRight, UserCircle, PanelLeft } from "lucide-react";
import { useCompare }  from "../context/CompareContext";
import { useWishlist } from "../context/WishlistContext";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";
import "./Navbar.additions.css";

export default function Navbar() {
  const { count: compareCount }  = useCompare();
  const { count: wishlistCount } = useWishlist();
  const { currency, toggleCurrency } = useCurrency();
  const { isAuthenticated, user } = useAuth();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const compareHref = isAuthenticated
    ? (compareCount > 0 ? "/compare" : "#")
    : "/account?intent=compare";
  const compareTitle = isAuthenticated
    ? (compareCount > 0 ? `Compare ${compareCount} products` : "Add products to compare")
    : "Sign in or create an account to compare";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : "glass"}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <Zap size={32} className="navbar__logo-icon" fill="currentColor" color="currentColor" />
          <span className="navbar__logo-text">Buy<span>Wise</span></span>
        </Link>

        {/* Nav links */}
        <nav className="navbar__links">
          <Link to="/"       className={pathname === "/"       ? "active" : ""}>Home</Link>
          <Link to="/search" className={pathname.startsWith("/search")  ? "active" : ""}>Search</Link>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <ThemeToggle />

          <Link
            to="/account"
            className={`navbar__icon-btn ${isAuthenticated ? "has-items" : ""}`}
            title={isAuthenticated ? `Signed in as ${user?.name}` : "Sign in"}
          >
            <UserCircle size={18} />
          </Link>

          {/* Currency toggle pill */}
          <button
            className="navbar__currency-toggle"
            onClick={toggleCurrency}
            title={`Switch to ${currency === "GHS" ? "USD" : "GHS"}`}
          >
            <ArrowLeftRight size={13} />
            <span>{currency}</span>
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className={`navbar__icon-btn ${wishlistCount > 0 ? "has-items" : ""} ${pathname === "/account" && isAuthenticated ? "mobile-hide" : ""}`}
            title={wishlistCount > 0 ? `Wishlist (${wishlistCount})` : "Wishlist"}
          >
            <Heart size={18} fill={wishlistCount > 0 ? "currentColor" : "none"} />
            {wishlistCount > 0 && (
              <span className="navbar__badge">{wishlistCount}</span>
            )}
          </Link>

          {/* Mobile Sidebar Toggle */}
          {pathname === "/account" && isAuthenticated && (
            <button
              className="navbar__icon-btn navbar__sidebar-toggle mobile-show"
              onClick={() => window.dispatchEvent(new CustomEvent("toggle-account-sidebar"))}
              title="Open account menu"
              aria-label="Open menu"
            >
              <PanelLeft size={18} />
            </button>
          )}

          {/* Compare cart */}
          <Link
            to={compareHref}
            className={`navbar__compare-pill ${isAuthenticated && compareCount === 0 ? "disabled" : ""}`}
            title={compareTitle}
          >
            <Layers size={18} />
            {compareCount > 0 && (
              <span className="navbar__compare-count">{compareCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
