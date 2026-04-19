import { useState, useCallback, useRef } from "react";
import { api } from "../utils/api";

export function useSearch() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const abortRef = useRef(null);

  const search = useCallback(async (query, filters = {}) => {
    if (!query || query.trim().length < 2) return;

    setLoading(true);
    setError(null);
    setLastQuery(query);

    try {
      const data = await api.search(query.trim(), filters);
      setResults(data);
    } catch (err) {
      setError(err.message || "Search failed. Please try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults(null);
    setError(null);
    setLastQuery("");
  }, []);

  return { results, loading, error, lastQuery, search, clear };
}
