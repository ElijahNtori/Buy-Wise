import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useToast } from "./ToastContext";
import { api } from "../utils/api";

const CurrencyContext = createContext(null);
const FALLBACK_GHS_PER_USD = parseFloat(import.meta.env.VITE_EXCHANGE_RATE) || 14.50;

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(
    () => localStorage.getItem("bw_currency") || "GHS"
  );
  const [ghsPerUsd, setGhsPerUsd] = useState(FALLBACK_GHS_PER_USD);
  const { addToast } = useToast();

  useEffect(() => {
    let alive = true;
    api.exchangeRates()
      .then(data => {
        if (alive && Number(data.usdToGhs)) setGhsPerUsd(Number(data.usdToGhs));
      })
      .catch(() => {
        if (alive) setGhsPerUsd(FALLBACK_GHS_PER_USD);
      });
    return () => {
      alive = false;
    };
  }, []);

  const toggleCurrency = useCallback(() => {
    const next = currency === "GHS" ? "USD" : "GHS";
    setCurrency(next);
    localStorage.setItem("bw_currency", next);
    addToast(`Currency switched to ${next}`, "success");
  }, [currency, addToast]);

  const formatPrice = useCallback((ghsPrice) => {
    const n = Number(ghsPrice) || 0;
    if (currency === "USD") {
      const usd = n / ghsPerUsd;
      return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `GH₵ ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency, ghsPerUsd]);

  const toActiveCurrency = useCallback((ghsPrice) => {
    const n = Number(ghsPrice) || 0;
    return currency === "USD" ? n / ghsPerUsd : n;
  }, [currency, ghsPerUsd]);

  return (
    <CurrencyContext.Provider value={{
      currency,
      toggleCurrency,
      formatPrice,
      toActiveCurrency,
      ghsPerUsd,
      symbol: currency === "GHS" ? "GH₵" : "$"
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
