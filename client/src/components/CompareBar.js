import { useNavigate } from "react-router-dom";
import { X, ArrowRight, Trash2, Layers } from "lucide-react";
import { useCompare } from "../context/CompareContext";
import "./CompareBar.css";

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare, MAX_COMPARE } = useCompare();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  return (
    <div className="compare-bar-wrap fade-up">
      <div className="container">
        <div className="compare-bar glass">
          <div className="compare-bar__slots">
            {Array.from({ length: MAX_COMPARE }).map((_, i) => {
              const product = compareList[i];
              return (
                <div key={i} className={`compare-bar__slot ${product ? "filled" : "empty"}`}>
                  {product ? (
                    <div className="compare-bar__item">
                      <img src={product.image} alt={product.title} />
                      <button
                        className="compare-bar__slot-remove"
                        onClick={() => removeFromCompare(product.id)}
                        aria-label="Remove"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="compare-bar__slot-plus">
                      <Layers size={14} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="compare-bar__info">
            <p className="compare-bar__count">
              <strong>{compareList.length}</strong> / {MAX_COMPARE} selected
            </p>
            <p className="compare-bar__hint">Select at least 2 to compare</p>
          </div>

          <div className="compare-bar__actions">
            <button
              className="compare-bar__clear"
              onClick={clearCompare}
              title="Clear all"
            >
              <Trash2 size={18} />
            </button>
            <button
              className="compare-bar__go"
              disabled={compareList.length < 2}
              onClick={() => navigate("/compare")}
            >
              Compare
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
