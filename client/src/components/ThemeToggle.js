import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useToast } from "../context/ToastContext";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const { addToast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    addToast(`Theme switched to ${next} mode`, "success");
  };

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="theme-toggle__track">
        <div className={`theme-toggle__thumb ${theme}`}>
          {theme === "light" ? <Sun size={14} /> : <Moon size={14} />}
        </div>
      </div>
    </button>
  );
}
