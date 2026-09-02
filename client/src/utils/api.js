/**
 * Buy-Wise API Client
 * Centralized fetch wrapper for all backend API calls.
 *
 * FIX: apiFetch now accepts an optional AbortSignal so callers (useSearch)
 * can cancel in-flight requests when a newer search supersedes an older one.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "bw_auth_token";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function apiFetch(path, options = {}) {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }
  return data;
}

export const api = {
  /** Search products across marketplaces. Accepts an optional AbortSignal. */
  search: (query, filters = {}, signal) => {
    const params = new URLSearchParams({ q: query });
    if (filters.marketplace && filters.marketplace !== "all") params.set("marketplace", filters.marketplace);
    if (filters.category   && filters.category   !== "all") params.set("category",    filters.category);
    if (filters.minPrice)  params.set("minPrice",  filters.minPrice);
    if (filters.maxPrice)  params.set("maxPrice",  filters.maxPrice);
    if (filters.minRating) params.set("minRating", filters.minRating);
    if (filters.sortBy)    params.set("sortBy",    filters.sortBy);
    return apiFetch(`/products/search?${params.toString()}`, { signal });
  },

  /** Fetch a single product by ID */
  getProduct: (id) => apiFetch(`/products/${id}`),

  /** Compare multiple products by IDs */
  compare: (ids) =>
    apiFetch("/products/compare", {
      method: "POST",
      body: JSON.stringify({ ids })
    }),

  /** Get all categories */
  getCategories: () => apiFetch("/products/categories"),

  /** Get all supported marketplaces */
  getMarketplaces: () => apiFetch("/products/marketplaces"),

  /** Health check */
  health: () => apiFetch("/health"),

  /** Live exchange-rate snapshot used by currency display */
  exchangeRates: () => apiFetch("/exchange-rates"),

  auth: {
    register: (payload) =>
      apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
      }),
    login: (payload) =>
      apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
      }),
    forgotPassword: (email) =>
      apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      }),
    resetPassword: (token, password) =>
      apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password })
      }),
    me: () => apiFetch("/auth/me"),
    sync: (payload) =>
      apiFetch("/auth/sync", {
        method: "POST",
        body: JSON.stringify(payload)
      }),
    updateWishlist: (wishlist) =>
      apiFetch("/auth/wishlist", {
        method: "PUT",
        body: JSON.stringify({ wishlist })
      }),
    updateRecentlyViewed: (recentlyViewed) =>
      apiFetch("/auth/recently-viewed", {
        method: "PUT",
        body: JSON.stringify({ recentlyViewed })
      }),
    updateProfile: (name) =>
      apiFetch("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ name })
      }),
    changePassword: (currentPassword, newPassword) =>
      apiFetch("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword })
      })
  }
};
