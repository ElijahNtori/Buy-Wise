import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, getAuthToken, setAuthToken } from "../utils/api";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getAuthToken()));
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    let alive = true;
    if (!getAuthToken()) return;

    api.auth.me()
      .then(data => {
        if (alive) setUser(data.user);
      })
      .catch(() => {
        setAuthToken(null);
        if (alive) setUser(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const finishAuth = useCallback(async (request) => {
    setError(null);
    const data = await request();
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback((payload) => (
    api.auth.register(payload)
      .then((res) => {
        addToast("Verification link sent! Check your email.", "success", 5000);
        return res;
      })
      .catch(err => {
        setError(err.message);
        addToast(err.message || "Registration failed.", "error");
        throw err;
      })
  ), [addToast]);

  const login = useCallback((payload) => (
    finishAuth(() => api.auth.login(payload))
      .then((res) => {
        addToast("Welcome back! Signed in successfully.", "success");
        return res;
      })
      .catch(err => {
        setError(err.message);
        addToast(err.message || "Login failed.", "error");
        throw err;
      })
  ), [finishAuth, addToast]);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    addToast("Signed out successfully.", "info");
  }, [addToast]);

  const syncLocalData = useCallback(async (payload) => {
    if (!getAuthToken()) return null;
    const data = await api.auth.sync(payload);
    setUser(data.user);
    return data.user;
  }, []);

  const updateUser = useCallback((patch) => {
    setUser(prev => prev ? { ...prev, ...patch } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      register,
      login,
      logout,
      syncLocalData,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
