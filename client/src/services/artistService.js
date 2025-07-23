import api from './api';

const artistService = {
  // Get all artists
  getArtists: (params = {}) => {
    return api.get('/artists', { params });
  },

  // Get artist by ID
  getArtistById: (id) => {
    return api.get(`/artists/${id}`);
  },

  // Follow/unfollow artist
  toggleFollowArtist: (id) => {
    return api.post(`/artists/${id}/follow`);
  },

  // Update artist profile
  updateArtistProfile: (profileData) => {
    return api.put('/artists/profile', profileData);
  },

  // Request verification
  requestVerification: (verificationData) => {
    return api.post('/artists/verify', verificationData);
  },

  // Get artist dashboard stats
  getArtistStats: () => {
    return api.get('/artists/dashboard/stats');
  },

  // Admin: Update verification status
  updateVerificationStatus: (id, statusData) => {
    return api.put(`/artists/${id}/verification`, statusData);
  },
};

export default artistService;
