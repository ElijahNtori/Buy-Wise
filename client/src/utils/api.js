/**
 * Buy-Wise API Client
 * Centralized fetch wrapper for all backend API calls.
 */

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function apiFetch(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }
  return data;
}

export const api = {
  /** Search products across marketplaces */
  search: (query, filters = {}) => {
    const params = new URLSearchParams({ q: query });
    if (filters.marketplace && filters.marketplace !== "all") params.set("marketplace", filters.marketplace);
    if (filters.category && filters.category !== "all") params.set("category", filters.category);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.minRating) params.set("minRating", filters.minRating);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    return apiFetch(`/products/search?${params.toString()}`);
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
  health: () => apiFetch("/health")
};
