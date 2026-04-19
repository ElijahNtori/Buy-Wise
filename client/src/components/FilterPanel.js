import { useState } from "react";
import { ListFilter, X, Star, ArrowUpDown } from "lucide-react";
import "./FilterPanel.css";

const MARKETPLACES = [
  { id: "all", label: "All" },
  { id: "amazon", label: "Amazon", color: "var(--amazon)" },
  { id: "ebay", label: "eBay", color: "var(--ebay)" },
  { id: "aliexpress", label: "AliExpress", color: "var(--aliexpress)" },
  { id: "alibaba", label: "Alibaba", color: "var(--alibaba)" }
];

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "electronics", label: "Electronics" },
  { id: "fashion", label: "Fashion" },
  { id: "home", label: "Home" },
  { id: "beauty", label: "Beauty" },
  { id: "sports", label: "Sports" },
  { id: "toys", label: "Toys" }
];

const SORT_OPTIONS = [
  { id: "relevance", label: "Relevance" },
  { id: "price_asc", label: "Price: Low → High" },
  { id: "price_desc", label: "Price: High → Low" },
  { id: "rating", label: "Highest Rated" },
  { id: "popularity", label: "Most Popular" }
];

export default function FilterPanel({ filters, onChange, resultCount }) {
  const [open, setOpen] = useState(false);

  const update = (key, value) => onChange({ ...filters, [key]: value });

  const activeCount = [
    filters.marketplace !== "all",
    filters.category !== "all",
    filters.minPrice,
    filters.maxPrice,
    filters.minRating && filters.minRating !== "0",
    filters.sortBy && filters.sortBy !== "relevance"
  ].filter(Boolean).length;

  return (
    <div className="filter-panel">
      {/* Top bar: sort + toggle */}
      <div className="filter-panel__bar">
        <div className="filter-panel__left">
          {resultCount != null && (
            <span className="filter-panel__count">
              <strong>{resultCount}</strong> products
            </span>
          )}
          <button
            className={`filter-panel__toggle ${open ? "open" : ""}`}
            onClick={() => setOpen(v => !v)}
          >
            <ListFilter size={18} />
            Filters
            {activeCount > 0 && (
              <span className="filter-panel__active-badge">{activeCount}</span>
            )}
          </button>
        </div>

        {/* Sort */}
        <div className="filter-panel__sort">
          <ArrowUpDown size={14} color="var(--ink-extra-soft)" />
          <label htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            value={filters.sortBy || "relevance"}
            onChange={e => update("sortBy", e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expanded filters */}
      <div className={`filter-panel__body ${open ? "open" : ""}`}>
        <div className="filter-panel__inner">
          <div className="filter-row">
            {/* Marketplace pills */}
            <div className="filter-group">
              <p className="filter-group__label">Marketplace</p>
              <div className="filter-group__pills">
                {MARKETPLACES.map(mp => (
                  <button
                    key={mp.id}
                    className={`pill ${filters.marketplace === mp.id ? "active" : ""}`}
                    onClick={() => update("marketplace", mp.id)}
                  >
                    {mp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection */}
            <div className="filter-group">
              <p className="filter-group__label">Category</p>
              <div className="filter-group__pills">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    className={`pill ${filters.category === c.id ? "active" : ""}`}
                    onClick={() => update("category", c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-row">
            {/* Price & Rating */}
            <div className="filter-group-inner">
              <div className="filter-input-wrap">
                <p className="filter-group__label">Price range (₵)</p>
                <div className="filter-inputs">
                  <div className="input-with-label">
                    <span>Min</span>
                    <input
                      type="number"
                      min="0"
                      value={filters.minPrice || ""}
                      onChange={e => update("minPrice", e.target.value)}
                      className="filter-input"
                    />
                  </div>
                  <div className="input-with-label">
                    <span>Max</span>
                    <input
                      type="number"
                      min="0"
                      value={filters.maxPrice || ""}
                      onChange={e => update("maxPrice", e.target.value)}
                      className="filter-input"
                    />
                  </div>
                </div>
              </div>

              <div className="filter-input-wrap">
                <p className="filter-group__label">Min Rating</p>
                <div className="rating-select-wrap">
                  <Star size={14} className="rating-icon" />
                  <select
                    value={filters.minRating || "0"}
                    onChange={e => update("minRating", e.target.value)}
                    className="filter-input"
                  >
                    <option value="0">Any rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Reset */}
          {activeCount > 0 && (
            <div className="filter-panel__footer">
              <button
                className="filter-panel__reset"
                onClick={() => onChange({
                  marketplace: "all",
                  category: "all",
                  minPrice: "",
                  maxPrice: "",
                  minRating: "0",
                  sortBy: "relevance"
                })}
              >
                <X size={14} /> Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
