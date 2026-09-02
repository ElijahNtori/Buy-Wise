import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { api } from "../utils/api";

const WishlistContext = createContext(null);
const STORAGE_KEY = "bw_wishlist";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadRecentlyViewed() {
  try {
    const raw = localStorage.getItem("bw_recently_viewed");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(loadFromStorage);
  const { user, isAuthenticated, syncLocalData, updateUser } = useAuth();
  const [hydratedUserId, setHydratedUserId] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      setWishlist([]);
      setHydratedUserId(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !user || hydratedUserId === user.id) return;

    syncLocalData({
      wishlist,
      recentlyViewed: loadRecentlyViewed()
    }).then(syncedUser => {
      if (syncedUser?.wishlist) setWishlist(syncedUser.wishlist);
      if (syncedUser?.recentlyViewed) {
        localStorage.setItem("bw_recently_viewed", JSON.stringify(syncedUser.recentlyViewed));
      }
      setHydratedUserId(user.id);
    }).catch(() => {
      setHydratedUserId(user.id);
    });
  }, [hydratedUserId, isAuthenticated, syncLocalData, user, wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // Ignore local quota failures.
    }

    if (isAuthenticated && hydratedUserId === user?.id) {
      api.auth.updateWishlist(wishlist)
        .then(data => updateUser({ wishlist: data.wishlist }))
        .catch(() => {});
    }
  }, [hydratedUserId, isAuthenticated, updateUser, user, wishlist]);

  const addToWishlist = useCallback((product) => {
    if (!isAuthenticated) {
      addToast("Please sign in to save items to your wishlist.", "warning");
      return;
    }
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) {
      addToast(`"${product.title.substring(0, 25)}..." is already in your wishlist.`, "info");
      return;
    }
    setWishlist(prev => [product, ...prev]);
    addToast(`"${product.title.substring(0, 25)}..." added to wishlist!`, "success");
  }, [isAuthenticated, wishlist, addToast]);

  const removeFromWishlist = useCallback((productId) => {
    const item = wishlist.find(p => p.id === productId);
    setWishlist(prev => prev.filter(p => p.id !== productId));
    if (item) {
      addToast(`"${item.title.substring(0, 25)}..." removed from wishlist.`, "info");
    }
  }, [wishlist, addToast]);

  const toggleWishlist = useCallback((product) => {
    if (!isAuthenticated) {
      addToast("Please sign in to save items to your wishlist.", "warning");
      return;
    }
    const exists = wishlist.some(p => p.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(p => p.id !== product.id));
      addToast(`"${product.title.substring(0, 25)}..." removed from wishlist.`, "info");
    } else {
      setWishlist(prev => [product, ...prev]);
      addToast(`"${product.title.substring(0, 25)}..." added to wishlist!`, "success");
    }
  }, [isAuthenticated, wishlist, addToast]);

  const isInWishlist = useCallback(
    (productId) => wishlist.some(p => p.id === productId),
    [wishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    addToast("Wishlist cleared.", "info");
  }, [addToast]);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      count: wishlist.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
