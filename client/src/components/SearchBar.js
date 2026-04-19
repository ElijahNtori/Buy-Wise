import { useState } from "react";
import { Search, X, Loader2, TrendingUp } from "lucide-react";
import "./SearchBar.css";

const SUGGESTIONS = [
  "headphones", "laptop", "shoes", "smart watch", "air fryer",
  "power bank", "tv", "phone", "vacuum cleaner", "blender"
];

export default function SearchBar({ onSearch, loading, initialValue = "" }) {
  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) onSearch(query.trim());
  };

  const handleSuggestion = (s) => {
    setQuery(s);
    onSearch(s);
    setFocused(false);
  };

  return (
    <form className="searchbar" onSubmit={handleSubmit} role="search">
      <div className={`searchbar__wrapper ${focused ? "focused" : ""}`}>
        <Search className="searchbar__icon" size={20} />

        <input
          type="search"
          className="searchbar__input"
          placeholder="What are you looking for?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          aria-label="Search products"
          autoComplete="off"
          minLength={2}
        />

        {query && (
          <button
            type="button"
            className="searchbar__clear"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}

        <button
          type="submit"
          className="searchbar__submit"
          disabled={loading || query.trim().length < 2}
        >
          {loading ? (
            <Loader2 className="searchbar__spinner" size={20} />
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Quick suggestions */}
      {focused && !query && (
        <div className="searchbar__suggestions glass">
          <div className="searchbar__suggestions-header">
            <TrendingUp size={16} color="var(--accent)" />
            <p>Popular searches</p>
          </div>
          <div className="searchbar__chips">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                type="button"
                className="searchbar__chip"
                onMouseDown={() => handleSuggestion(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
