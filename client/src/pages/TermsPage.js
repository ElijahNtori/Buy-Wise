export default function TermsPage() {
  const lastUpdated = "April 18, 2026";

  return (
    <div className="legal-page fade-up">
      <div className="container">
        <header className="legal-header">
          <h1>Terms of Service</h1>
          <p>Last Updated: {lastUpdated}</p>
        </header>

        <div className="legal-content glass">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Buy-Wise ("the Service"), you agree to comply with 
              and be bound by these Terms of Service. If you do not agree to these terms, 
              please do not use our Service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              Buy-Wise provides a real-time price comparison engine across multiple 
              third-party marketplaces. We do not sell products directly; we provide 
              information and links to external vendors.
            </p>
          </section>

          <section>
            <h2>3. Accuracy of Information</h2>
            <p>
              While we strive to provide the most accurate and up-to-date pricing and 
              availability, Buy-Wise relies on third-party data. We cannot guarantee 
              the accuracy, completeness, or reliability of any information displayed 
              on the Service. Prices are subject to change without notice on the 
              original marketplace.
            </p>
          </section>

          <section>
            <h2>4. User Responsibilities</h2>
            <p>You agree to use the Service only for lawful purposes. You shall not:</p>
            <ul>
              <li>Use any automated system (bots, crawlers) to access the Service without permission.</li>
              <li>Attempt to interfere with the proper working of the Service.</li>
              <li>Use the Service to engage in any misleading or fraudulent activities.</li>
            </ul>
          </section>

          <section>
            <h2>5. Intellectual Property</h2>
            <p>
              The content, features, and functionality of Buy-Wise are the exclusive 
              property of Buy-Wise and its licensors. Trademarks and logos of third-party 
              marketplaces (Amazon, eBay, etc.) belong to their respective owners.
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              Buy-Wise shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages resulting from your use of or 
              inability to use the Service or any products purchased via third-party links.
            </p>
          </section>

          <section>
            <h2>7. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws 
              of your jurisdiction, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify you 
              of any changes by posting the new Terms of Service on this page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
