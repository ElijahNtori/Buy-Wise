import { Target, ShieldCheck, Zap, Globe, PackageSearch, BarChart3 } from "lucide-react";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page fade-up">
      <section className="about-hero">
        <div className="container">
          <div className="badge-glow">Our Mission</div>
          <h1>Simplifying the way the <br /> <span>world shops.</span></h1>
          <p className="lead">
            Buy-Wise was founded with a simple goal: to eliminate the friction of 
            online shopping by bringing global marketplaces into a single, 
            unified comparison engine.
          </p>
        </div>
      </section>

      <section className="about-features container">
        <div className="features-grid">
          <div className="feature-card glass">
            <div className="feature-icon">
              <PackageSearch size={24} />
            </div>
            <h3>Unified Search</h3>
            <p>Access Amazon, eBay, AliExpress, and Temu simultaneously without switching tabs.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon">
              <BarChart3 size={24} />
            </div>
            <h3>Real-time Data</h3>
            <p>Our engine fetches current pricing and availability to ensure you never miss a deal.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon">
              <ShieldCheck size={24} />
            </div>
            <h3>Transparent Pricing</h3>
            <p>We provide unbiased comparisons, highlighting the best value across all supported regions.</p>
          </div>
        </div>
      </section>

      <section className="about-tech container">
        <div className="tech-inner glass">
          <div className="tech-content">
            <div className="badge-glow">The Technology</div>
            <h2>Built for Speed and Scalability</h2>
            <p>
              Leveraging a high-performance React frontend and a robust Node.js backend, Buy-Wise
              processes thousands of products in milliseconds. Our intelligent scraping and 
              API integration layer ensures data accuracy across diverse marketplace structures.
            </p>
            <ul className="tech-stats">
              <li>
                <strong>4+</strong>
                <span>Global Marketplaces</span>
              </li>
              <li>
                <strong>&lt; 500ms</strong>
                <span>Search Latency</span>
              </li>
              <li>
                <strong>100%</strong>
                <span>Ad-Free Experience</span>
              </li>
            </ul>
          </div>
          <div className="tech-visual">
            <Zap size={120} color="var(--accent)" className="zap-glow" />
          </div>
        </div>
      </section>

      <section className="about-cta container">
        <div className="cta-box glass">
          <h2>Ready to find your next deal?</h2>
          <p>Join thousands of smart shoppers using Buy-Wise daily.</p>
          <a href="/search" className="btn-primary">Start Searching Now</a>
        </div>
      </section>
    </div>
  );
}
