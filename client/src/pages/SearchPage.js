import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, Search, Zap, RefreshCcw, Star } from "lucide-react";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import ProductCard from "../components/ProductCard";
import CompareBar from "../components/CompareBar";
import { useSearch } from "../hooks/useSearch";
import { usePageTitle } from "../hooks/usePageTitle";
import "./SearchPage.css";

const DEFAULT_FILTERS = {
  marketplace: "all",
  category: "all",
  minPrice: "",
  maxPrice: "",
  minRating: "0",
  sortBy: "relevance"
};

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__img skeleton" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__title skeleton" />
        <div className="skeleton-card__title skeleton" style={{ width: '60%' }} />
        <div className="skeleton-card__price skeleton" />
        <div className="skeleton-card__meta skeleton" />
      </div>
      <div className="skeleton-card__actions">
        <div className="skeleton-card__btn skeleton" />
        <div className="skeleton-card__btn skeleton" />
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { results, loading, error, search } = useSearch();

  const queryFromUrl = searchParams.get("q") || "";
  const marketplaceFromUrl = searchParams.get("m") || "all";

  usePageTitle(queryFromUrl ? `Search results for "${queryFromUrl}"` : "Search Marketplace");

  // Sync filters with URL on mount only
  useEffect(() => {
    if (marketplaceFromUrl !== "all") {
      setFilters(prev => ({ ...prev, marketplace: marketplaceFromUrl }));
    }
  }, [marketplaceFromUrl]);

  // Run search on mount or URL change
  useEffect(() => {
    if (queryFromUrl) {
      search(queryFromUrl, filters);
    }
    // eslint-disable-next-line
  }, [queryFromUrl, filters.marketplace]);

  const handleSearch = useCallback((q) => {
    setSearchParams({ q });
    search(q, filters);
  }, [filters, search, setSearchParams]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    if (queryFromUrl) {
      search(queryFromUrl, newFilters);
    }
  }, [queryFromUrl, search]);

  const hasResults = results && results.products && results.products.length > 0;

  return (
    <div className="search-page">
      {/* Top search bar */}
      <div className="search-page__top">
        <div className="container">
          <SearchBar
            onSearch={handleSearch}
            loading={loading}
            initialValue={queryFromUrl}
          />
        </div>
      </div>

      <div className="container search-page__body">
        {/* Filters */}
        {(results || loading) && (
          <div className="search-page__filters">
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              resultCount={results?.total}
            />
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="search-page__grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="search-page__state">
            <div className="search-page__state-icon-wrap error">
              <AlertTriangle size={48} />
            </div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => handleSearch(queryFromUrl)}>
              <RefreshCcw size={16} /> Try Again
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && results && !hasResults && (
          <div className="search-page__state">
            <div className="search-page__state-icon-wrap">
              <Search size={48} />
            </div>
            <h3>No products found</h3>
            <p>Try a different keyword or remove some filters.</p>
          </div>
        )}

        {/* Results grid */}
        {!loading && hasResults && (
          <>
            {/* Marketplace Tabs */}
            <div className="search-page__tabs-container">
              <div className="search-page__tabs">
                {[
                  { id: "all", label: "All" },
                  { id: "amazon", label: "Amazon" },
                  { id: "ebay", label: "eBay" },
                  { id: "aliexpress", label: "AliExpress" },
                  { id: "alibaba", label: "Alibaba" }
                ].map((mp) => (
                  <button
                    key={mp.id}
                    className={`search-page__tab ${filters.marketplace === mp.id ? "active" : ""} ${mp.id}`}
                    onClick={() => handleFilterChange({ ...filters, marketplace: mp.id })}
                  >
                    <span className="tab-label">{mp.label}</span>
                    {results.byMarketplace[mp.id] !== undefined ? (
                      <span className="tab-count">{results.byMarketplace[mp.id]}</span>
                    ) : mp.id === "all" ? (
                      <span className="tab-count">{results.total}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="search-page__grid">
              {(() => {
                const products = results.products;
                let bestValueId = null;
                let topRatedId = null;

                if (products.length >= 3) {
                  // Best Value: lowest price among products with rating >= 4.0
                  const goodRated = products.filter(p => (Number(p.rating) || 0) >= 4.0);
                  const valueSource = goodRated.length > 0 ? goodRated : products;
                  bestValueId = valueSource.reduce((b, p) => (Number(p.price) < Number(b.price) ? p : b)).id;

                  // Top Rated: highest rating among products with > 10 reviews if possible
                  const withReviews = products.filter(p => (Number(p.reviewCount) || 0) > 10);
                  const ratingSource = withReviews.length > 0 ? withReviews : products;
                  topRatedId = ratingSource.reduce((b, p) => (Number(p.rating) > Number(b.rating) ? p : b)).id;
                }

                return products.map((product, i) => {
                  let aiBadge = null;
                  if (product.id === bestValueId) {
                    aiBadge = { type: 'best-value', icon: <Zap size={10} fill="currentColor" />, label: 'Best Value' };
                  } else if (product.id === topRatedId) {
                    aiBadge = { type: 'top-rated', icon: <Star size={10} fill="currentColor" />, label: 'Top Rated' };
                  }

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      animDelay={i * 40}
                      aiBadge={aiBadge}
                    />
                  );
                });
              })()}
            </div>
          </>
        )}

        {/* Empty state (no search yet) */}
        {!loading && !error && !results && (
          <div className="search-page__state">
            <div className="search-page__state-icon-wrap">
              <Zap size={48} />
            </div>
            <h3>Start searching</h3>
            <p>Enter a product name above to compare prices across marketplaces.</p>
          </div>
        )}
      </div>

      {/* Floating compare bar */}
      <CompareBar />
    </div>
  );
}
