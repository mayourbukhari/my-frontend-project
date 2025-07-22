import api from './api';

const authService = {
  // Register user
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // Login user
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  // Get user profile
  getProfile: () => {
    return api.get('/auth/profile');
  },

  // Update profile
  updateProfile: (profileData) => {
    return api.put('/auth/profile', profileData);
  },

  // Change password
  changePassword: (passwordData) => {
    return api.post('/auth/change-password', passwordData);
  },

  // Verify email
  verifyEmail: (token) => {
    return api.post('/auth/verify-email', { token });
  },

  // Request password reset
  requestPasswordReset: (email) => {
    return api.post('/auth/request-password-reset', { email });
  },

  // Reset password
  resetPassword: (token, newPassword) => {
    return api.post('/auth/reset-password', { token, newPassword });
  },

  // Add to wishlist
  addToWishlist: (artworkId) => {
    return api.post('/auth/wishlist', { artworkId });
  },

  // Remove from wishlist
  removeFromWishlist: (artworkId) => {
    return api.delete(`/auth/wishlist/${artworkId}`);
  },
};

export default authService;
