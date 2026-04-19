import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Layers } from "lucide-react";
import { useCompare } from "../context/CompareContext";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

export default function Navbar() {
  const { count } = useCompare();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

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
          <Link to="/" className={pathname === "/" ? "active" : ""}>Home</Link>
          <Link to="/search" className={pathname.startsWith("/search") ? "active" : ""}>Search</Link>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <ThemeToggle />
          
          {/* Compare cart - Black Pill Style */}
          <Link
            to={count > 0 ? "/compare" : "#"}
            className={`navbar__compare-pill ${count === 0 ? "disabled" : ""}`}
            title={count > 0 ? `Compare ${count} products` : "Add products to compare"}
          >
            <Layers size={18} />
            {count > 0 && <span className="navbar__compare-count">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
