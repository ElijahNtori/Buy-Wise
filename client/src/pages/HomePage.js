import { useNavigate } from "react-router-dom";
import { 
  Laptop, 
  Smartphone, 
  Home, 
  Headphones, 
  Watch, 
  Shirt, 
  Search, 
  Scale, 
  ShoppingCart,
  Zap,
  Store,
  ShieldCheck,
  TrendingUp,
  Truck,
  Globe,
  Tag,
  CheckCircle2,
  Heart,
  Dumbbell,
  Baby
} from "lucide-react";
import SearchBar from "../components/SearchBar";
import { usePageTitle } from "../hooks/usePageTitle";
import "./HomePage.css";

const FEATURED_CATEGORIES = [
  { icon: Laptop, label: "Electronics", query: "laptop" },
  { icon: Shirt, label: "Fashion", query: "shoes" },
  { icon: Home, label: "Home", query: "air fryer" },
  { icon: Smartphone, label: "Phones", query: "phone" },
  { icon: Headphones, label: "Audio", query: "headphones" },
  { icon: Watch, label: "Wearables", query: "smart watch" },
  { icon: Heart, label: "Beauty", query: "skincare" },
  { icon: Dumbbell, label: "Sports", query: "gym" },
  { icon: Baby, label: "Toys", query: "lego" }
];

const MARKETPLACES = [
  { name: "Amazon", color: "#FF9900", logo: "/logos/amazon.png", desc: "Worldwide leader" },
  { name: "eBay", color: "#0064D2", logo: "/logos/ebay.png", desc: "Auctions & deals" },
  { name: "AliExpress", color: "#E62E04", logo: "/logos/aliexpress.png", desc: "Budget-friendly" },
  { name: "Alibaba", color: "#FF6600", logo: "/logos/alibaba.png", desc: "Wholesale & Business" }
];

export default function HomePage() {
  usePageTitle("Premium Price Comparison");
  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <div className="container home__hero-inner">
          <div className="home__hero-content">
            <div className="home__hero-tag fade-up">
              <Zap size={14} fill="currentColor" />
              COMPARE GLOBAL PRICES INSTANTLY
            </div>
            <h1 className="home__hero-title fade-up" style={{ animationDelay: "80ms" }}>
              The Smart Way to <br /><span>Shop Globally</span>
            </h1>
            <p className="home__hero-sub fade-up" style={{ animationDelay: "140ms" }}>
              Compare Amazon, eBay, AliExpress & Alibaba in one place. 
              Stop overpaying and start saving with real-time price tracking.
            </p>
            <div className="home__hero-search fade-up" style={{ animationDelay: "200ms" }}>
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
          <div className="home__hero-illustration">
            <img src="/hero.png" alt="" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Marketplaces */}
      <section className="home__section">
        <div className="container">
          <h2 className="home__section-title">Marketplaces We Compare</h2>
          <div className="home__mp-grid">
            {MARKETPLACES.map(mp => (
              <div key={mp.name} className="home__mp-card" style={{ "--mp-color": mp.color }}>
                <div className="home__mp-icon-wrap">
                  <img src={mp.logo} alt={mp.name} className="home__mp-logo" />
                </div>
                <strong className="home__mp-name">{mp.name}</strong>
                <span className="home__mp-desc">{mp.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home__section">
        <div className="container">
          <h2 className="home__section-title">Browse by Category</h2>
          <div className="home__cat-grid">
            {FEATURED_CATEGORIES.map((cat, i) => (
              <button
                key={cat.label}
                className="home__cat-card fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => handleSearch(cat.query)}
              >
                <div className="home__cat-icon-wrap">
                  <cat.icon size={24} />
                </div>
                <span className="home__cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Buy-Wise */}
      <section className="home__section home__benefits">
        <div className="container">
          <div className="home__benefits-grid">
            <div className="home__benefit-card fade-up">
              <ShieldCheck size={40} className="benefit-icon" />
              <h3>Secure & Trusted</h3>
              <p>We only compare vetted, global marketplaces you already know and trust.</p>
            </div>
            <div className="home__benefit-card fade-up" style={{ animationDelay: "100ms" }}>
              <TrendingUp size={40} className="benefit-icon" />
              <h3>Real-time Data</h3>
              <p>Get live prices, availability, and shipping info directly from API sources.</p>
            </div>
            <div className="home__benefit-card fade-up" style={{ animationDelay: "200ms" }}>
              <Truck size={40} className="benefit-icon" />
              <h3>Smart Conversions</h3>
              <p>Pricing automatically adjusted for your region with estimated delivery times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="home__section home__how">
        <div className="container">
          <h2 className="home__section-title">Seamless Comparison Flow</h2>
          <div className="home__steps">
            {[
              { n: "1", icon: Search, title: "Search", desc: "Type any product name to search across all platforms at once." },
              { n: "2", icon: Scale, title: "Compare", desc: "See prices, ratings, shipping, and sellers side by side." },
              { n: "3", icon: CheckCircle2, title: "Buy", desc: "Click 'Buy Now' to go directly to the marketplace and complete your purchase." }
            ].map((step, i) => (
              <div key={step.n} className="home__step fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="home__step-num">{step.n}</div>
                <div className="home__step-icon-wrap">
                  <step.icon size={32} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Newsletter */}
      <section className="home__section home__newsletter">
        <div className="container">
          <div className="home__newsletter-card fade-up">
            <div className="home__newsletter-content">
              <h2>Never Overpay Again</h2>
              <p>Join 50,000+ smart shoppers receiving weekly curated deals and price-drop alerts from across the digital landscape.</p>
              <form className="home__newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" required />
                <button type="submit" className="btn-primary">Subscribe</button>
              </form>
            </div>
            <div className="home__newsletter-icon">
              <Zap size={120} fill="currentColor" opacity={0.1} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
