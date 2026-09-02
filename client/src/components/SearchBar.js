import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Loader2, TrendingUp, Clock, ArrowRight } from "lucide-react";
import "./SearchBar.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const RECENT_KEY = "bw_recent_searches";
const MAX_RECENT = 6;

function loadRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(query) {
  try {
    const current = loadRecentSearches();
    const updated = [query, ...current.filter(q => q !== query)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch { /* */ }
}

function clearRecentSearches() {
  try { localStorage.removeItem(RECENT_KEY); } catch { /* */ }
}

export default function SearchBar({ onSearch, loading, initialValue = "" }) {
  const [query, setQuery]             = useState(initialValue);
  const [focused, setFocused]         = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [fetching, setFetching]       = useState(false);

  const debounceRef = useRef(null);
  const abortRef    = useRef(null);
  const inputRef    = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch live suggestions from the backend
  const fetchSuggestions = useCallback(async (q) => {
    if (q.trim().length < 2) { setSuggestions([]); return; }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setFetching(true);
    try {
      const res = await fetch(`${BASE_URL}/products/suggestions?q=${encodeURIComponent(q)}`, {
        signal: controller.signal
      });
      if (!res.ok) throw new Error("suggestions failed");
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      if (err.name !== "AbortError") setSuggestions([]);
    } finally {
      setFetching(false);
    }
  }, []);

  // Debounce live suggestion fetching on input change
  useEffect(() => {
    clearTimeout(debounceRef.current);
    setActiveIndex(-1);
    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => fetchSuggestions(query), 300);
    } else {
      setSuggestions([]);
    }
    return () => clearTimeout(debounceRef.current);
  }, [query, fetchSuggestions]);

  const showDropdown = focused && (query.trim().length < 2
    ? recentSearches.length > 0
    : suggestions.length > 0
  );

  // Full list of items in the dropdown for keyboard navigation
  const dropdownItems = query.trim().length < 2 ? recentSearches : suggestions;

  const submit = useCallback((value) => {
    const q = (value || query).trim();
    if (q.length < 2) return;
    saveRecentSearch(q);
    setRecentSearches(loadRecentSearches());
    setQuery(q);
    setFocused(false);
    setSuggestions([]);
    setActiveIndex(-1);
    onSearch(q);
  }, [query, onSearch]);

  const handleKeyDown = (e) => {
    if (!showDropdown) {
      if (e.key === "Enter") { e.preventDefault(); submit(); }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, dropdownItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && dropdownItems[activeIndex]) {
        submit(dropdownItems[activeIndex]);
      } else {
        submit();
      }
    } else if (e.key === "Escape") {
      setFocused(false);
      setSuggestions([]);
      inputRef.current?.blur();
    }
  };

  const handleClearRecent = (e) => {
    e.stopPropagation();
    clearRecentSearches();
    setRecentSearches([]);
  };

  const isShowingRecent = focused && query.trim().length < 2 && recentSearches.length > 0;
  const isShowingSuggestions = focused && query.trim().length >= 2;

  return (
    <div className="searchbar" role="search">
      <div className={`searchbar__wrapper ${focused ? "focused" : ""}`}>
        <Search className="searchbar__icon" size={20} />

        <input
          ref={inputRef}
          type="search"
          className="searchbar__input"
          placeholder="What are you looking for?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={handleKeyDown}
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          autoComplete="off"
          minLength={2}
        />

        {query && (
          <button
            type="button"
            className="searchbar__clear"
            onClick={() => { setQuery(""); setSuggestions([]); inputRef.current?.focus(); }}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}

        <button
          type="button"
          className="searchbar__submit"
          disabled={loading || query.trim().length < 2}
          onClick={() => submit()}
        >
          {loading || fetching ? (
            <Loader2 className="searchbar__spinner" size={20} />
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Recent searches dropdown */}
      {isShowingRecent && (
        <div ref={dropdownRef} className="searchbar__suggestions glass">
          <div className="searchbar__suggestions-header">
            <Clock size={15} color="var(--accent)" />
            <p>Recent searches</p>
            <button
              className="searchbar__clear-recent"
              onMouseDown={handleClearRecent}
            >
              Clear
            </button>
          </div>
          <ul className="searchbar__suggestion-list" role="listbox">
            {recentSearches.map((s, i) => (
              <li
                key={s}
                role="option"
                aria-selected={activeIndex === i}
                className={`searchbar__suggestion-item ${activeIndex === i ? "active" : ""}`}
                onMouseDown={() => submit(s)}
              >
                <Clock size={13} className="item-icon recent" />
                <span>{s}</span>
                <ArrowRight size={13} className="item-arrow" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Live suggestions dropdown */}
      {isShowingSuggestions && suggestions.length > 0 && (
        <div ref={dropdownRef} className="searchbar__suggestions glass">
          <div className="searchbar__suggestions-header">
            <TrendingUp size={15} color="var(--accent)" />
            <p>Suggestions</p>
          </div>
          <ul className="searchbar__suggestion-list" role="listbox">
            {suggestions.map((s, i) => (
              <li
                key={s}
                role="option"
                aria-selected={activeIndex === i}
                className={`searchbar__suggestion-item ${activeIndex === i ? "active" : ""}`}
                onMouseDown={() => submit(s)}
              >
                <Search size={13} className="item-icon" />
                <span>
                  {/* Bold the matching prefix */}
                  <strong>{s.slice(0, query.length)}</strong>
                  {s.slice(query.length)}
                </span>
                <ArrowRight size={13} className="item-arrow" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
