import "./PrivacyPage.css";

export default function PrivacyPage() {
  const lastUpdated = "April 18, 2026";

  return (
    <div className="legal-page fade-up">
      <div className="container">
        <header className="legal-header">
          <h1>Privacy Policy</h1>
          <p>Last Updated: {lastUpdated}</p>
        </header>

        <div className="legal-content glass">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Buy-Wise. We value your privacy and are committed to protecting 
              your personal data. This Privacy Policy explains how we collect, use, and 
              safeguard your information when you use our price comparison service.
            </p>
          </section>

          <section>
            <h2>2. Data We Collect</h2>
            <p>
              Buy-Wise is designed to be privacy-first. We do not require account creation 
              for basic search and comparison features. However, we may collect:
            </p>
            <ul>
              <li><strong>Search Queries:</strong> To improve our engine and provide relevant results.</li>
              <li><strong>Usage Data:</strong> Information on how you interact with our site (e.g., clicks on marketplace links).</li>
              <li><strong>Device Information:</strong> IP address and browser type to prevent abuse and for security purposes.</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Data</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide and maintain our Service.</li>
              <li>Notify you about changes to our Service.</li>
              <li>Monitor the usage of our Service to improve the search algorithm.</li>
              <li>Detect, prevent, and address technical issues.</li>
            </ul>
          </section>

          <section>
            <h2>4. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our 
              Service and hold certain information. You can instruct your browser to 
              refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2>5. Affiliate Disclosure</h2>
            <p>
              Buy-Wise is a participant in various affiliate marketing programs. Some of the 
              links on this site are affiliate links, which means we may earn a small 
              commission if you click on the link or make a purchase using the link. This 
              comes at no additional cost to you and helps us keep Buy-Wise free.
            </p>
          </section>

          <section>
            <h2>6. Third-Party Links</h2>
            <p>
              Our Service contains links to external marketplaces (Amazon, eBay, etc.) 
              that are not operated by us. We strongly advise you to review the 
              Privacy Policy of every site you visit.
            </p>
          </section>

          <section>
            <h2>7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li>By email: privacy@buywise.com</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
