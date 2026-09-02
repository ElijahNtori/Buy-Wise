import { useState, useCallback, useRef } from "react";
import { api } from "../utils/api";

/**
 * FIX: abortRef was declared but never used, leaving a race condition where
 * fast successive searches could resolve out of order. Now:
 *   1. Each new search call aborts the previous in-flight request.
 *   2. AbortError is caught and swallowed (not shown to the user as an error).
 */
export function useSearch() {
  const [results, setResults]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const abortRef                  = useRef(null);

  const search = useCallback(async (query, filters = {}) => {
    if (!query || query.trim().length < 2) return;

    // Cancel the previous in-flight request before starting a new one
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setLastQuery(query);

    try {
      const data = await api.search(query.trim(), filters, controller.signal);
      setResults(data);
    } catch (err) {
      // AbortError means a newer search superseded this one — not a real error
      if (err.name === "AbortError") return;
      setError(err.message || "Search failed. Please try again.");
      setResults(null);
    } finally {
      // Only clear loading if this controller is still the active one
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setResults(null);
    setError(null);
    setLastQuery("");
  }, []);

  return { results, loading, error, lastQuery, search, clear };
}
