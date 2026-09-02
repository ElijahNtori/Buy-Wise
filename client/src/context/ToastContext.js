import { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from "lucide-react";
import "../components/Toast.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const recentToasts = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const now = Date.now();
    const lastSeen = recentToasts.current.get(message);

    // Prevent double toasts of the exact same message within 1.5 seconds
    if (lastSeen && now - lastSeen < 1500) {
      return;
    }

    recentToasts.current.set(message, now);
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      removeToast(id);
      recentToasts.current.delete(message);
    }, duration);
  }, [removeToast]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="toast-icon toast-icon--success" size={20} />;
      case "error":
        return <AlertCircle className="toast-icon toast-icon--error" size={20} />;
      case "warning":
        return <Info className="toast-icon toast-icon--warning" size={20} />;
      default:
        return <Sparkles className="toast-icon toast-icon--info" size={20} />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="assertive" aria-instant="true">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-item toast-item--${toast.type} fade-in-right`}
            role="alert"
          >
            <div className="toast-content-wrapper">
              {getIcon(toast.type)}
              <div className="toast-message">{toast.message}</div>
              <button
                className="toast-close-btn"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                <X size={15} />
              </button>
            </div>
            <div
              className="toast-progress-bar"
              style={{ animationDuration: `${toast.duration}ms` }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
