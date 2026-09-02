import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { getAuthToken } from "../utils/api";

const CompareContext = createContext(null);

const MAX_COMPARE        = 4;
const SESSION_STORAGE_KEY = "bw_compareList";

/**
 * FIX: compareList was plain useState — lost on page refresh, which is
 * disruptive when a user navigates away mid-comparison. Now initialises from
 * sessionStorage and keeps it in sync on every change.
 * sessionStorage (not localStorage) is intentional: the list clears when the
 * browser tab closes, which avoids stale product data persisting across days.
 */
function loadFromSession() {
  if (!getAuthToken()) return [];
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState(loadFromSession);
  const { isAuthenticated, loading } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      setCompareList([]);
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // Ignore storage failures.
      }
    }
  }, [isAuthenticated, loading]);

  // Keep sessionStorage in sync whenever the list changes
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(compareList));
    } catch {
      // sessionStorage unavailable (private browsing quota) — fail silently
    }
  }, [compareList]);

  const addToCompare = useCallback((product) => {
    if (!isAuthenticated) {
      addToast("Please sign in to compare products.", "warning");
      return;
    }
    const exists = compareList.some(p => p.id === product.id);
    if (exists) {
      addToast(`"${product.title.substring(0, 25)}..." is already in the comparison list.`, "info");
      return;
    }
    if (compareList.length >= MAX_COMPARE) {
      addToast(`You can compare up to ${MAX_COMPARE} products at a time.`, "warning");
      return;
    }
    setCompareList(prev => [...prev, product]);
    addToast(`"${product.title.substring(0, 25)}..." added to comparison.`, "success");
  }, [isAuthenticated, compareList, addToast]);

  const removeFromCompare = useCallback((productId) => {
    const item = compareList.find(p => p.id === productId);
    setCompareList(prev => prev.filter(p => p.id !== productId));
    if (item) {
      addToast(`"${item.title.substring(0, 25)}..." removed from comparison.`, "info");
    }
  }, [compareList, addToast]);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    addToast("Comparison list cleared.", "info");
  }, [addToast]);

  const isInCompare = useCallback(
    (productId) => compareList.some(p => p.id === productId),
    [compareList]
  );

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      maxReached: compareList.length >= MAX_COMPARE,
      count:      compareList.length,
      MAX_COMPARE
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
