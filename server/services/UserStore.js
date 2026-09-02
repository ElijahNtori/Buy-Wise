const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");

const MAX_RECENT = 20;

class UserStore {
  publicUser(user) {
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isVerified: user.is_verified,
      wishlist: user.wishlist || [],
      recentlyViewed: user.recently_viewed || []
    };
  }

  async createUser({ name, email, password, verificationToken }) {
    const normalizedEmail = email.trim().toLowerCase();
    
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .single();
    
    if (existing) {
      const err = new Error("An account with this email already exists");
      err.status = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        verification_token: verificationToken,
        is_verified: false,
        wishlist: [],
        recently_viewed: []
      })
      .select()
      .single();

    if (error) throw error;
    return this.publicUser(user);
  }

  async validateUser(email, password) {
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .single();
    
    if (!user || !(await bcrypt.compare(password, user.password_hash))) return null;
    return user;
  }

  async getUser(id) {
    try {
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
      return user ? this.publicUser(user) : null;
    } catch {
      return null;
    }
  }

  async verifyUser(token) {
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("verification_token", token)
      .single();
    
    if (!user) return null;

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({
        is_verified: true,
        verification_token: null
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return this.publicUser(updatedUser);
  }

  async setResetToken(email, token, expires) {
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .single();
    
    if (!user) return null;

    const { error } = await supabase
      .from("users")
      .update({
        reset_password_token: token,
        reset_password_expires: expires
      })
      .eq("id", user.id);

    if (error) throw error;
    return user;
  }

  async validateResetToken(token) {
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("reset_password_token", token)
      .gt("reset_password_expires", new Date().toISOString())
      .single();
    
    return user;
  }

  async resetPassword(token, newPassword) {
    const user = await this.validateResetToken(token);
    if (!user) return null;

    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({
        password_hash: passwordHash,
        reset_password_token: null,
        reset_password_expires: null
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return this.publicUser(updatedUser);
  }

  async mergeSyncData(id, { wishlist = [], recentlyViewed = [] }) {
    try {
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
      
      if (!user) return null;

      const mergedWishlist = this.mergeById(user.wishlist || [], wishlist);
      const mergedRecentlyViewed = this.mergeById(recentlyViewed, user.recently_viewed || []).slice(0, MAX_RECENT);

      const { data: updatedUser, error } = await supabase
        .from("users")
        .update({
          wishlist: mergedWishlist,
          recently_viewed: mergedRecentlyViewed
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return this.publicUser(updatedUser);
    } catch {
      return null;
    }
  }

  async updateWishlist(id, wishlist) {
    try {
      const mergedWishlist = this.mergeById(wishlist, []).slice(0, 100);
      
      const { data: user, error } = await supabase
        .from("users")
        .update({ wishlist: mergedWishlist })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return this.publicUser(user);
    } catch {
      return null;
    }
  }

  async updateRecentlyViewed(id, recentlyViewed) {
    try {
      const mergedRecentlyViewed = this.mergeById(recentlyViewed, []).slice(0, MAX_RECENT);
      
      const { data: user, error } = await supabase
        .from("users")
        .update({ recently_viewed: mergedRecentlyViewed })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return this.publicUser(user);
    } catch {
      return null;
    }
  }

  async updateProfile(id, { name }) {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .update({ name: name.trim() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return this.publicUser(user);
    } catch {
      return null;
    }
  }

  async changePassword(id, currentPassword, newPassword) {
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      const err = new Error("Incorrect current password");
      err.status = 400;
      throw err;
    }
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    const { error } = await supabase
      .from("users")
      .update({ password_hash: passwordHash })
      .eq("id", id);

    if (error) throw error;
    return this.publicUser(user);
  }

  mergeById(primary, secondary) {
    const seen = new Set();
    return [...primary, ...secondary].filter(item => {
      if (!item?.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }
}

module.exports = new UserStore();
