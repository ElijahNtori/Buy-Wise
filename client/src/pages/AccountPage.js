import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  LogIn, LogOut, UserPlus, Heart, Clock, ShieldCheck, Sparkles,
  ArrowRight, Mail, Lock, User, ExternalLink, Settings,
  LayoutDashboard, Trash2, KeyRound, CheckCircle2, AlertCircle,
  PanelLeft, X, Pencil
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { useCurrency } from "../context/CurrencyContext";
import { useWishlist } from "../context/WishlistContext";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { useToast } from "../context/ToastContext";
import { api } from "../utils/api";
import "./AccountPage.css";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext fill='%23aaa' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo image%3C/text%3E%3C/svg%3E";

export default function AccountPage() {
  const { user, isAuthenticated, login, register, logout, error, updateUser } = useAuth();
  const { currency, toggleCurrency, formatPrice } = useCurrency();
  const { toggleWishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();
  
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  
  const [forgotOpen, setForgotOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Password reset state
  const [resetForm, setResetForm] = useState({ password: "", confirmPassword: "" });
  const [resetFeedback, setResetFeedback] = useState({ success: "", error: "" });

  // Settings States
  const [profileName, setProfileName] = useState("");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (user?.name) {
      setProfileName(user.name);
    }
  }, [user]);

  useEffect(() => {
    const handleToggle = () => setSidebarOpen(prev => !prev);
    window.addEventListener("toggle-account-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-account-sidebar", handleToggle);
  }, []);

  const handleProfileNameChange = (e) => {
    setProfileName(e.target.value);
  };

  const handlePasswordFormChange = (e) => {
    setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      addToast("Name cannot be empty", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.auth.updateProfile(profileName);
      updateUser({ name: res.user.name });
      addToast("Profile name updated successfully!", "success");
    } catch (err) {
      addToast(err.message || "Failed to update profile name", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      addToast("New passwords do not match", "error");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      addToast("New password must be at least 8 characters", "error");
      return;
    }
    setSubmitting(true);
    try {
      await api.auth.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      addToast("Password changed successfully!", "success");
    } catch (err) {
      addToast(err.message || "Failed to change password", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = searchParams.get("resetToken");
  const verifiedStatus = searchParams.get("verified");
  const intent = searchParams.get("intent");
  const isCompareIntent = intent === "compare";

  usePageTitle(resetToken ? "Reset Password" : isAuthenticated ? "Account Dashboard" : "Sign In");

  // Sync mode if state passed
  useEffect(() => {
    if (location.state?.message || isCompareIntent) {
      setMode("login");
    }
  }, [location, isCompareIntent]);

  // Handle email verification redirect status
  useEffect(() => {
    if (verifiedStatus === "success") {
      addToast("Your email has been successfully verified! You can now log in.", "success", 5000);
      setSearchParams({});
    } else if (verifiedStatus === "error") {
      addToast("The verification link was invalid or has expired.", "error");
      setSearchParams({});
    }
  }, [verifiedStatus, addToast, setSearchParams]);

  const handleChange = (event) => {
    setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleResetChange = (event) => {
    setResetForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      if (mode === "register") {
        await register(form);
        setMessage("Account created successfully! You can now log in.");
      } else {
        await login({ email: form.email, password: form.password });
        setMessage("Signed in successfully.");
        if (location.state?.from) {
          setTimeout(() => navigate(location.state.from, { replace: true }), 700);
        } else if (isCompareIntent) {
          setTimeout(() => navigate("/search", { replace: true }), 700);
        }
      }
    } catch {
      // Errors are set in AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    if (resetForm.password !== resetForm.confirmPassword) {
      setResetFeedback({ success: "", error: "Passwords do not match." });
      addToast("Passwords do not match.", "error");
      return;
    }
    setSubmitting(true);
    setResetFeedback({ success: "", error: "" });
    try {
      const res = await api.auth.resetPassword(resetToken, resetForm.password);
      setResetFeedback({ success: res.message, error: "" });
      addToast(res.message || "Password reset successfully!", "success");
      setResetForm({ password: "", confirmPassword: "" });
      setTimeout(() => {
        setSearchParams({});
      }, 2500);
    } catch (err) {
      setResetFeedback({ success: "", error: err.message });
      addToast(err.message || "Failed to reset password.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Tab Render Methods ──────────────────────────────────────────────────
  const renderDashboard = () => {
    const recentWishlist = (user.wishlist || []).slice(-3).reverse();
    const recentViewed = (user.recentlyViewed || []).slice(-3).reverse();

    return (
      <div className="account-tab-content fade-in">
        <div className="account-welcome-banner dashboard-banner">
          <div className="banner-content">
            <span className="banner-pill">
              <Sparkles size={12} /> Sync System Online
            </span>
            <h2>Welcome back, {user.name}! 👋</h2>
            <p>Your comparative shopping dashboard is active. Track real-time prices across major marketplaces, manage your wishlist highlights, and explore synced browsing history.</p>
          </div>
          <div className="banner-visual">
            <div className="banner-blob blob-1"></div>
            <div className="banner-blob blob-2"></div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="account-stats-grid">
          <div className="account-stat-card" onClick={() => setActiveTab("wishlist")}>
            <div className="account-stat-icon-wrap wishlist">
              <Heart size={20} fill="var(--accent-3)" color="var(--accent-3)" />
            </div>
            <div className="account-stat-content">
              <strong>{user.wishlist?.length || 0}</strong>
              <span>Wishlist Items Synced</span>
            </div>
            <ArrowRight className="account-stat-arrow" size={16} />
          </div>

          <div className="account-stat-card" onClick={() => setActiveTab("history")}>
            <div className="account-stat-icon-wrap recent">
              <Clock size={20} />
            </div>
            <div className="account-stat-content">
              <strong>{user.recentlyViewed?.length || 0}</strong>
              <span>Recent Items Synced</span>
            </div>
            <ArrowRight className="account-stat-arrow" size={16} />
          </div>
        </div>

        {/* Activity Preview Grid (Saved Deals & Recent Activity) */}
        <div className="account-activity-grid">
          {/* Wishlist Column */}
          <div className="account-activity-column">
            <h3>
              <Heart size={16} />
              <span>Wishlist Highlights</span>
            </h3>
            <div className="account-activity-list">
              {recentWishlist.length > 0 ? (
                recentWishlist.map(product => (
                  <div key={product.id} className="mini-product-card" onClick={() => window.open(product.url, "_blank")}>
                    <div className="mini-product-img-wrap">
                      <img src={product.image || product.images?.[0] || PLACEHOLDER_IMAGE} alt={product.title} onError={e => { e.target.src = PLACEHOLDER_IMAGE; }} />
                    </div>
                    <div className="mini-product-info">
                      <h4 title={product.title}>{product.title}</h4>
                      <div className="mini-product-meta">
                        <span className="mini-product-price">{formatPrice(product.price)}</span>
                        <span className={`mini-product-tag ${product.marketplace}`}>{product.marketplace}</span>
                      </div>
                    </div>
                    <ExternalLink size={14} className="mini-card-icon" />
                  </div>
                ))
              ) : (
                <div className="empty-activity-card">
                  <Heart size={24} />
                  <p>No wishlist items synced yet</p>
                  <button className="btn-text-action" onClick={() => navigate("/search")}>Explore Deals</button>
                </div>
              )}
            </div>
          </div>

          {/* Recently Viewed Column */}
          <div className="account-activity-column">
            <h3>
              <Clock size={16} />
              <span>Recently Viewed</span>
            </h3>
            <div className="account-activity-list">
              {recentViewed.length > 0 ? (
                recentViewed.map(product => (
                  <div key={product.id} className="mini-product-card" onClick={() => window.open(product.url, "_blank")}>
                    <div className="mini-product-img-wrap">
                      <img src={product.image || product.images?.[0] || PLACEHOLDER_IMAGE} alt={product.title} onError={e => { e.target.src = PLACEHOLDER_IMAGE; }} />
                    </div>
                    <div className="mini-product-info">
                      <h4 title={product.title}>{product.title}</h4>
                      <div className="mini-product-meta">
                        <span className="mini-product-price">{formatPrice(product.price)}</span>
                        <span className={`mini-product-tag ${product.marketplace}`}>{product.marketplace}</span>
                      </div>
                    </div>
                    <ExternalLink size={14} className="mini-card-icon" />
                  </div>
                ))
              ) : (
                <div className="empty-activity-card">
                  <Clock size={24} />
                  <p>No search history on this account</p>
                  <button className="btn-text-action" onClick={() => navigate("/search")}>Start Searching</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sync & Security Note */}
        <div className="account-security-card">
          <ShieldCheck size={28} className="security-icon" />
          <div>
            <h4>Encrypted Synchronization</h4>
            <p>Your search history and wishlist items are linked securely to your account credentials. Any changes made here are instantly synced to your other devices.</p>
          </div>
        </div>
      </div>
    );
  };

  const renderWishlistTab = () => {
    const wishlist = user.wishlist || [];

    return (
      <div className="account-tab-content fade-in">
        <div className="account-welcome-banner wishlist-banner">
          <div className="banner-content">
            <span className="banner-pill">
              <Heart size={12} fill="currentColor" /> MongoDB Synced Storage
            </span>
            <h2>Wishlist Manager</h2>
            <p>You have {wishlist.length} saved products securely synced to your cloud account. Click any card to load the marketplace deal, or delete items you no longer track.</p>
          </div>
          <div className="banner-visual">
            <div className="banner-blob blob-wishlist"></div>
          </div>
        </div>

        <div className="account-full-list">
          {wishlist.length > 0 ? (
            wishlist.map(product => (
              <div key={product.id} className="mini-product-card" onClick={() => window.open(product.url, "_blank")}>
                <div className="mini-product-img-wrap">
                  <img src={product.image || product.images?.[0] || PLACEHOLDER_IMAGE} alt={product.title} onError={e => { e.target.src = PLACEHOLDER_IMAGE; }} />
                </div>
                <div className="mini-product-info">
                  <h4 title={product.title}>{product.title}</h4>
                  <div className="mini-product-meta">
                    <span className="mini-product-price">{formatPrice(product.price)}</span>
                    <span className={`mini-product-tag ${product.marketplace}`}>{product.marketplace}</span>
                  </div>
                </div>
                <div className="mini-card-actions">
                  <button
                    className="btn-delete-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                  <ExternalLink size={14} className="mini-card-icon visible" />
                </div>
              </div>
            ))
          ) : (
            <div className="empty-activity-card">
              <Heart size={32} />
              <p>Your wishlist is empty</p>
              <button className="btn-primary" style={{ minHeight: "40px", marginTop: "10px" }} onClick={() => navigate("/search")}>
                Search Deals
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHistoryTab = () => {
    const history = user.recentlyViewed || [];

    return (
      <div className="account-tab-content fade-in">
        <div className="account-welcome-banner history-banner">
          <div className="banner-content">
            <span className="banner-pill">
              <Clock size={12} /> Sync Log: {history.length} items
            </span>
            <h2>Browsing History</h2>
            <p>Jump back into your recent comparison finds. Your browsing sessions are backed up automatically across every device you sign in to.</p>
          </div>
          <div className="banner-visual">
            <div className="banner-blob blob-history"></div>
          </div>
        </div>

        <div className="account-full-list">
          {history.length > 0 ? (
            history.map(product => (
              <div key={product.id} className="mini-product-card" onClick={() => window.open(product.url, "_blank")}>
                <div className="mini-product-img-wrap">
                  <img src={product.image || product.images?.[0] || PLACEHOLDER_IMAGE} alt={product.title} onError={e => { e.target.src = PLACEHOLDER_IMAGE; }} />
                </div>
                <div className="mini-product-info">
                  <h4 title={product.title}>{product.title}</h4>
                  <div className="mini-product-meta">
                    <span className="mini-product-price">{formatPrice(product.price)}</span>
                    <span className={`mini-product-tag ${product.marketplace}`}>{product.marketplace}</span>
                  </div>
                </div>
                <ExternalLink size={14} className="mini-card-icon visible" />
              </div>
            ))
          ) : (
            <div className="empty-activity-card">
              <Clock size={32} />
              <p>No recently viewed items yet</p>
              <button className="btn-primary" style={{ minHeight: "40px", marginTop: "10px" }} onClick={() => navigate("/")}>
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettingsTab = () => {
    return (
      <div className="account-tab-content fade-in">
        <div className="account-welcome-banner settings-banner">
          <div className="banner-content">
            <span className="banner-pill">
              <ShieldCheck size={12} /> Encrypted Session
            </span>
            <h2>Account Preferences</h2>
            <p>Manage your profile credentials, secure your cloud account with a new password, or set your preferred default currency view.</p>
          </div>
          <div className="banner-visual">
            <div className="banner-blob blob-settings"></div>
          </div>
        </div>

        {/* Profile Settings */}
        <form onSubmit={handleUpdateProfile} className="settings-section-card">
          <h3>Profile Credentials</h3>
          <div className="settings-form-row">
            <label className="settings-input-label">
              <span>Full Name</span>
              <div className="account-input">
                <User size={17} />
                <input
                  type="text"
                  value={profileName}
                  onChange={handleProfileNameChange}
                  required
                  disabled={submitting}
                />
              </div>
            </label>
            <label className="settings-input-label">
              <span>Email Address (Read-Only)</span>
              <div className="account-input disabled-input">
                <Mail size={17} />
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  disabled
                />
              </div>
            </label>
          </div>
          <div className="settings-action-row">
            <button className="btn-settings-save" type="submit" disabled={submitting || profileName === user.name}>
              Save Profile Name
            </button>
          </div>
        </form>

        {/* Currency Settings */}
        <div className="settings-section-card">
          <h3>Preferences</h3>
          <div className="settings-field" style={{ borderBottom: "none", paddingBottom: "0" }}>
            <div className="settings-preference-info">
              <span className="field-label" style={{ fontSize: "14px", fontWeight: "700" }}>Preferred Currency</span>
              <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--ink-soft)", textTransform: "none", letterSpacing: "normal" }}>
                Select your preferred currency for comparing product prices.
              </p>
            </div>
            <div className="currency-selector-group">
              <button
                type="button"
                className={`currency-btn-item ${currency === "GHS" ? "active" : ""}`}
                onClick={() => { if (currency !== "GHS") toggleCurrency(); }}
              >
                GH₵ (GHS)
              </button>
              <button
                type="button"
                className={`currency-btn-item ${currency === "USD" ? "active" : ""}`}
                onClick={() => { if (currency !== "USD") toggleCurrency(); }}
              >
                $ (USD)
              </button>
            </div>
          </div>
        </div>

        {/* Password Update */}
        <form onSubmit={handleChangePassword} className="settings-section-card">
          <h3>Security & Password</h3>
          <div className="settings-form-row">
            <label className="settings-input-label">
              <span>Current Password</span>
              <div className="account-input">
                <Lock size={17} />
                <input
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordFormChange}
                  required
                  disabled={submitting}
                />
              </div>
            </label>
            <label className="settings-input-label">
              <span>New Password</span>
              <div className="account-input">
                <Lock size={17} />
                <input
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordFormChange}
                  minLength={8}
                  required
                  disabled={submitting}
                />
              </div>
            </label>
            <label className="settings-input-label">
              <span>Confirm New Password</span>
              <div className="account-input">
                <Lock size={17} />
                <input
                  name="confirmNewPassword"
                  type="password"
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordFormChange}
                  minLength={8}
                  required
                  disabled={submitting}
                />
              </div>
            </label>
          </div>
          <div className="settings-action-row">
            <button className="btn-settings-save" type="submit" disabled={submitting}>
              Update Password
            </button>
          </div>
        </form>

        <div className="settings-section-card">
          <h3>Cloud Data Status</h3>
          <p style={{ fontSize: "13px", color: "var(--ink-soft)", margin: "0 0 16px" }}>
            Your account is hosted on a secure MongoDB cloud environment, guaranteeing real-time replication of your wishlist and search history.
          </p>
          <div className="settings-field">
            <span className="field-label">Database Engine</span>
            <span className="field-value">MongoDB Atlas</span>
          </div>
          <div className="settings-field">
            <span className="field-label">Replication Mode</span>
            <span className="field-value">Auto-Sync Enabled</span>
          </div>
        </div>
      </div>
    );
  };

  // ─── Password Reset Screen ────────────────────────────────────────────────
  if (resetToken) {
    return (
      <div className="account-page account-page--auth">
        <div className="container account-auth-shell single-card">
          <section className="account-card">
            <div className="account-card__header">
              <div className="auth-icon-circle">
                <KeyRound size={22} />
              </div>
              <h2>Set New Password</h2>
              <p>Choose a secure password of at least 8 characters to recover your account.</p>
            </div>

            <form onSubmit={handleResetSubmit} className="account-form">
              <label>
                <span>New Password</span>
                <div className="account-input">
                  <Lock size={17} />
                  <input
                    name="password"
                    type="password"
                    value={resetForm.password}
                    onChange={handleResetChange}
                    required
                    disabled={submitting}
                  />
                </div>
              </label>

              <label>
                <span>Confirm New Password</span>
                <div className="account-input">
                  <Lock size={17} />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={resetForm.confirmPassword}
                    onChange={handleResetChange}
                    required
                    disabled={submitting}
                  />
                </div>
              </label>

              {resetFeedback.error && (
                <div className="account-feedback error">
                  <AlertCircle size={15} />
                  <p>{resetFeedback.error}</p>
                </div>
              )}

              {resetFeedback.success && (
                <div className="account-feedback success">
                  <CheckCircle2 size={15} />
                  <p>{resetFeedback.success}</p>
                </div>
              )}

              <button className="account-submit" type="submit" disabled={submitting}>
                <span>{submitting ? "Resetting..." : "Save Password"}</span>
                <ArrowRight size={17} />
              </button>
            </form>
          </section>
        </div>
      </div>
    );
  }

  // ─── Dashboard Sidebar Layout (Authenticated) ────────────────────────────
  if (isAuthenticated) {
    return (
      <div className="account-page account-page--dashboard">
        <div className="container account-sidebar-layout">
          {/* Sidebar Backdrop Overlay on Mobile */}
          {sidebarOpen && (
            <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Sidebar */}
          <aside className={`account-sidebar ${sidebarOpen ? "open" : ""}`}>
            <div className="account-sidebar-profile">
              <div className="account-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="account-sidebar-profile-info">
                <h4
                  onClick={() => handleTabClick("settings")}
                  className="sidebar-profile-name"
                  title="Click to edit name"
                >
                  <span>{user.name}</span>
                  <Pencil size={12} className="username-edit-icon" />
                </h4>
                <span>{user.email}</span>
              </div>
              {/* Close Button on Mobile */}
              <button
                className="btn-sidebar-close"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="account-sidebar-nav">
              <button
                className={activeTab === "dashboard" ? "active" : ""}
                onClick={() => handleTabClick("dashboard")}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>
              <button
                className={activeTab === "wishlist" ? "active" : ""}
                onClick={() => handleTabClick("wishlist")}
              >
                <Heart size={18} />
                <span>Wishlist ({user.wishlist?.length || 0})</span>
              </button>
              <button
                className={activeTab === "history" ? "active" : ""}
                onClick={() => handleTabClick("history")}
              >
                <Clock size={18} />
                <span>History ({user.recentlyViewed?.length || 0})</span>
              </button>
              <button
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => handleTabClick("settings")}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </nav>

            <button className="btn-sidebar-signout" onClick={() => { logout(); setSidebarOpen(false); }}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="account-sidebar-content">
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "wishlist" && renderWishlistTab()}
            {activeTab === "history" && renderHistoryTab()}
            {activeTab === "settings" && renderSettingsTab()}
          </main>
        </div>
      </div>
    );
  }

  // ─── Authentication Forms Layout (Sign In / Register) ───────────────────
  return (
    <div className="account-page account-page--auth">
      <div className="container account-auth-shell">
        <section className="account-showcase">
          <div className="account-showcase__badge">
            <Sparkles size={16} /> Buy smarter everywhere
          </div>
          <h1>{isCompareIntent ? "Compare with your account." : "Keep your best finds close."}</h1>
          <p>{isCompareIntent ? "Sign in or create an account before building a product comparison." : "Save products, compare later, and keep your shopping history synced across every device you use."}</p>
          <div className="account-benefits">
            <span><Heart size={16} /> Wishlist sync</span>
            <span><Clock size={16} /> Recently viewed</span>
            <span><ShieldCheck size={16} /> Secure session</span>
          </div>
        </section>

        <section className="account-card">
          <div className="account-card__header">
            <p className="account-eyebrow">Account</p>
            <h2>{mode === "register" ? "Create your account" : isCompareIntent ? "Sign in to compare" : "Welcome back"}</h2>
            <p>{mode === "register" ? "Create an account and start comparing products immediately." : isCompareIntent ? "You need an account before selecting products for comparison." : "Sign in to save and sync your deals."}</p>
          </div>

          {/* Email verification result banner */}
          {verifiedStatus === "success" && (
            <div className="account-notice success" role="status">
              <CheckCircle2 size={16} />
              <span>Your email has been successfully verified! You can now log in.</span>
            </div>
          )}

          {verifiedStatus === "error" && (
            <div className="account-notice error" role="status">
              <AlertCircle size={16} />
              <span>The verification link was invalid or has expired.</span>
            </div>
          )}

          {error && (
            <div className="account-notice error" role="status">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="account-notice success" role="status">
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          <div className="account-switcher" role="tablist" aria-label="Account mode">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">
              <LogIn size={15} /> Sign In
            </button>
            <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")} type="button">
              <UserPlus size={15} /> Register
            </button>
          </div>

          <form className="account-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <label>
                <span>Name</span>
                <div className="account-input">
                  <User size={17} />
                  <input name="name" value={form.name} onChange={handleChange} autoComplete="name" required />
                </div>
              </label>
            )}
            <label>
              <span>Email</span>
              <div className="account-input">
                <Mail size={17} />
                <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />
              </div>
            </label>
            <label>
              <div className="account-form-password-header">
                <span>Password</span>
                {mode === "login" && (
                  <button type="button" className="btn-forgot-password-trigger" onClick={() => setForgotOpen(true)}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="account-input">
                <Lock size={17} />
                <input name="password" type="password" value={form.password} onChange={handleChange} autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={8} required />
              </div>
            </label>

            <button className="account-submit" type="submit" disabled={submitting}>
              <span>{submitting ? "Please wait..." : mode === "register" ? "Create Account" : "Sign In"}</span>
              <ArrowRight size={17} />
            </button>
          </form>
        </section>
      </div>

      <ForgotPasswordModal isOpen={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
}
