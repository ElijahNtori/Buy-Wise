import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

const STORAGE_KEY = "bw_recently_viewed";
const MAX_ITEMS = 8;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch { /* fail silently */ }
}

/**
 * Hook for tracking recently viewed products.
 * Reads/writes localStorage directly without holding React state — this means
 * multiple component instances (e.g. many ProductCards) can call addItem
 * without conflicting. The RecentlyViewed display component reads fresh on mount.
 */
export function useRecentlyViewed() {
  const { isAuthenticated, updateUser } = useAuth();
  const getItems = useCallback(() => load(), []);

  const addItem = useCallback((product) => {
    const current = load();
    // Move to front, drop duplicates, cap at MAX_ITEMS
    const updated = [product, ...current.filter(p => p.id !== product.id)].slice(0, MAX_ITEMS);
    save(updated);
    if (isAuthenticated) {
      api.auth.updateRecentlyViewed(updated)
        .then(data => updateUser({ recentlyViewed: data.recentlyViewed }))
        .catch(() => {});
    }
  }, [isAuthenticated, updateUser]);

  const clearItems = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
    if (isAuthenticated) {
      api.auth.updateRecentlyViewed([])
        .then(data => updateUser({ recentlyViewed: data.recentlyViewed }))
        .catch(() => {});
    }
  }, [isAuthenticated, updateUser]);

  return { getItems, addItem, clearItems };
}
