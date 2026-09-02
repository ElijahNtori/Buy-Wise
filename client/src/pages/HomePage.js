import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Laptop, Smartphone, Home, Headphones, Watch, Shirt,
  Search, Scale, Zap, ShieldCheck, TrendingUp, Truck,
  CheckCircle2, Heart, Dumbbell, Baby, ArrowRight, Globe2
} from "lucide-react";
import SearchBar       from "../components/SearchBar";
import RecentlyViewed  from "../components/RecentlyViewed";
import { usePageTitle } from "../hooks/usePageTitle";
import "./HomePage.css";

const FEATURED_CATEGORIES = [
  { icon: Laptop,      label: "Electronics", query: "laptop" },
  { icon: Shirt,       label: "Fashion",     query: "shoes" },
  { icon: Home,        label: "Home",         query: "air fryer" },
  { icon: Smartphone,  label: "Phones",       query: "phone" },
  { icon: Headphones,  label: "Audio",        query: "headphones" },
  { icon: Watch,       label: "Wearables",    query: "smart watch" },
  { icon: Heart,       label: "Beauty",       query: "skincare" },
  { icon: Dumbbell,    label: "Sports",       query: "gym" },
  { icon: Baby,        label: "Toys",         query: "lego" }
];

const MARKETPLACES = [
  { name: "Amazon",     color: "#FF9900", logo: "/logos/amazon.png",     desc: "Worldwide leader" },
  { name: "eBay",       color: "#0064D2", logo: "/logos/ebay.png",       desc: "Auctions & deals" },
  { name: "AliExpress", color: "#E62E04", logo: "/logos/aliexpress.png", desc: "Budget-friendly" },
  { name: "Alibaba",    color: "#FF6600", logo: "/logos/alibaba.png",    desc: "Wholesale & Business" }
];

export default function HomePage() {
  usePageTitle("Premium Price Comparison");
  const navigate = useNavigate();
  const [newsletterMessage, setNewsletterMessage] = useState("");

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
              Live marketplace comparison
            </div>
            <h1 className="home__hero-title fade-up" style={{ animationDelay: "80ms" }}>
              Find the right deal before you buy.
            </h1>
            <p className="home__hero-sub fade-up" style={{ animationDelay: "140ms" }}>
              Search once and compare prices, ratings, delivery, and sellers across the marketplaces shoppers already use.
            </p>
            <div className="home__hero-search fade-up" style={{ animationDelay: "200ms" }}>
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="home__quick-links fade-up" style={{ animationDelay: "260ms" }}>
              {FEATURED_CATEGORIES.slice(0, 5).map(cat => (
                <button key={cat.label} onClick={() => handleSearch(cat.query)}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="home__deal-panel fade-up" style={{ animationDelay: "180ms" }}>
            <div className="home__deal-panel-top">
              <span>Sample comparison</span>
              <strong>Best value detected</strong>
            </div>
            <div className="home__deal-product">
              <img src="/hero.png" alt="" aria-hidden="true" />
              <div>
                <p>Wireless headphones</p>
                <h3>GH₵ 1,245.00</h3>
                <span>18% lower than average</span>
              </div>
            </div>
            <div className="home__deal-bars">
              {MARKETPLACES.map((mp, i) => (
                <div key={mp.name} className="home__deal-row">
                  <img src={mp.logo} alt={mp.name} />
                  <span>{mp.name}</span>
                  <div style={{ "--w": `${92 - i * 14}%`, "--c": mp.color }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed — only renders if there's anything to show */}
      <section className="home__section home__recent">
        <div className="container">
          <RecentlyViewed />
        </div>
      </section>

      {/* Marketplaces */}
      <section className="home__section home__marketplaces">
        <div className="container">
          <div className="home__section-head">
            <span><Globe2 size={16} /> Marketplace coverage</span>
            <h2>One search across the stores that matter.</h2>
            <p>Buy-Wise keeps the comparison surface focused: price, trust signals, delivery, and direct marketplace links.</p>
          </div>
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
      <section className="home__section home__discovery">
        <div className="container">
          <div className="home__section-head home__section-head--row">
            <div>
              <span><Search size={16} /> Start exploring</span>
              <h2>Popular searches, ready to compare.</h2>
            </div>
            <p>Jump into a category or type exactly what you want. The interface is built for fast product decisions, not browsing forever.</p>
          </div>
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
          <div className="home__benefits-intro">
            <span>Why it feels faster</span>
            <h2>Less tab-hopping. More confident decisions.</h2>
          </div>
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
          <div className="home__section-head">
            <span><Scale size={16} /> Comparison flow</span>
            <h2>From search to checkout in three clean moves.</h2>
          </div>
          <div className="home__steps">
            {[
              { n: "1", icon: Search,       title: "Search",  desc: "Type any product name to search across all platforms at once." },
              { n: "2", icon: Scale,        title: "Compare", desc: "See prices, ratings, shipping, and sellers side by side." },
              { n: "3", icon: CheckCircle2, title: "Buy",     desc: "Click 'Buy Now' to go directly to the marketplace and complete your purchase." }
            ].map((step, i) => (
              <div key={step.n} className="home__step fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="home__step-num">{step.n}</div>
                <div className="home__step-icon-wrap"><step.icon size={32} /></div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < 2 && <ArrowRight className="home__step-arrow" size={20} />}
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
              <form
                className="home__newsletter-form"
                onSubmit={e => {
                  e.preventDefault();
                  setNewsletterMessage("You're on the early-access deals list.");
                }}
              >
                <input type="email" placeholder="Enter your email" required />
                <button type="submit" className="btn-primary">Subscribe</button>
              </form>
              {newsletterMessage && (
                <p className="home__newsletter-feedback" role="status">
                  {newsletterMessage}
                </p>
              )}
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
