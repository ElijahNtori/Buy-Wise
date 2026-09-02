const userStore = require("../services/UserStore");
const { signToken } = require("../middleware/auth");
const EmailService = require("../services/EmailService");
const crypto = require("crypto");

function validateCredentials({ email, password }) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address";
  }
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return null;
}

exports.register = async (req, res) => {
  try {
    const { name = "", email, password } = req.body;
    const credentialError = validateCredentials({ email, password });
    if (credentialError) {
      return res.status(400).json({ success: false, message: credentialError });
    }
    if (!name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const user = await userStore.createUser({ name, email, password });

    res.status(201).json({
      success: true,
      message: "Account created successfully! You can now log in."
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.status ? err.message : "Could not create account"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const credentialError = validateCredentials({ email, password });
    if (credentialError) {
      return res.status(400).json({ success: false, message: credentialError });
    }

    const userDoc = await userStore.validateUser(email, password);
    if (!userDoc) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const user = userStore.publicUser(userDoc);
    res.json({ success: true, user, token: signToken(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not sign in" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userStore.verifyUser(token);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    if (!user) {
      return res.redirect(`${frontendUrl}/account?verified=error`);
    }

    res.redirect(`${frontendUrl}/account?verified=success`);
  } catch (err) {
    console.error("Email verification failed:", err);
    res.status(500).send("Error verifying email.");
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    const user = await userStore.setResetToken(email, token, expires);
    if (user) {
      EmailService.sendResetPasswordEmail(user.email, token).catch(err => {
        console.error(`Failed to send password reset email to ${user.email}:`, err.message);
      });
    }

    // Always return success to prevent user enumeration
    res.json({
      success: true,
      message: "If an account exists with that email, a password reset link has been sent."
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ success: false, message: "Error initiating password reset" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Reset token is required" });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters" });
    }

    const user = await userStore.resetPassword(token, password);
    if (!user) {
      return res.status(400).json({ success: false, message: "Password reset link is invalid or has expired" });
    }

    res.json({
      success: true,
      message: "Your password has been successfully reset. You can now sign in."
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Error resetting password" });
  }
};

exports.me = async (req, res) => {
  const user = await userStore.getUser(req.auth.sub);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user });
};

exports.mergeSyncData = async (req, res) => {
  const user = await userStore.mergeSyncData(req.auth.sub, req.body || {});
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user });
};

exports.updateWishlist = async (req, res) => {
  const user = await userStore.updateWishlist(req.auth.sub, req.body?.wishlist || []);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, wishlist: user.wishlist });
};

exports.updateRecentlyViewed = async (req, res) => {
  const user = await userStore.updateRecentlyViewed(req.auth.sub, req.body?.recentlyViewed || []);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, recentlyViewed: user.recentlyViewed });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    const user = await userStore.updateProfile(req.auth.sub, { name });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new passwords are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" });
    }
    const user = await userStore.changePassword(req.auth.sub, currentPassword, newPassword);
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(err.status || 500).json({ success: false, message: err.status ? err.message : "Error changing password" });
  }
};
