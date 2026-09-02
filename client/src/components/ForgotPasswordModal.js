import { useState } from "react";
import { X, Mail, ArrowRight, ShieldAlert } from "lucide-react";
import { api } from "../utils/api";
import { useToast } from "../context/ToastContext";
import "./ForgotPasswordModal.css";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.auth.forgotPassword(email);
      const msg = res.message || "A password reset link has been sent to your email.";
      setMessage(msg);
      addToast(msg, "success", 5000);
      setEmail("");
    } catch (err) {
      const errMsg = err.message || "An error occurred while requesting password reset.";
      setError(errMsg);
      addToast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-icon-wrap">
            <Mail size={22} />
          </div>
          <h2>Reset Password</h2>
          <p>Enter the email address associated with your account, and we will send you a secure link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label">
            <span>Email Address</span>
            <div className="modal-input-wrap">
              <Mail size={16} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </label>

          {message && (
            <div className="modal-feedback success">
              <p>{message}</p>
            </div>
          )}

          {error && (
            <div className="modal-feedback error">
              <ShieldAlert size={16} />
              <p>{error}</p>
            </div>
          )}

          <button type="submit" className="modal-submit-btn" disabled={loading}>
            <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
