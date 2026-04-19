import { Link } from "react-router-dom";
import { Search, Home, ArrowLeft } from "lucide-react";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="not-found-page fade-up">
      <div className="container">
        <div className="not-found-content glass">
          <div className="error-code">404</div>
          <h1>Lost in the marketplace?</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          
          <div className="not-found-actions">
            <Link to="/" className="btn-secondary">
              <Home size={18} /> Back Home
            </Link>
            <Link to="/search" className="btn-primary">
              <Search size={18} /> Try Searching
            </Link>
          </div>

          <button onClick={() => window.history.back()} className="back-link">
            <ArrowLeft size={16} /> Go back to previous page
          </button>
        </div>
      </div>
    </div>
  );
}
