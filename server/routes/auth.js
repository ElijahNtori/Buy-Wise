const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  me,
  mergeSyncData,
  updateWishlist,
  updateRecentlyViewed,
  updateProfile,
  changePassword
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", requireAuth, me);
router.post("/sync", requireAuth, mergeSyncData);
router.put("/wishlist", requireAuth, updateWishlist);
router.put("/recently-viewed", requireAuth, updateRecentlyViewed);
router.put("/profile", requireAuth, updateProfile);
router.put("/change-password", requireAuth, changePassword);

module.exports = router;
