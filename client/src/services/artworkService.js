import api from './api';

const artworkService = {
  // Get all artworks with filters
  getArtworks: (params = {}) => {
    return api.get('/artworks', { params });
  },

  // Get artwork by ID
  getArtworkById: (id) => {
    return api.get(`/artworks/${id}`);
  },

  // Create new artwork
  createArtwork: (artworkData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(artworkData).forEach(key => {
      if (key !== 'images') {
        if (typeof artworkData[key] === 'object') {
          formData.append(key, JSON.stringify(artworkData[key]));
        } else {
          formData.append(key, artworkData[key]);
        }
      }
    });
    
    // Append image files
    if (artworkData.images) {
      artworkData.images.forEach(image => {
        formData.append('artwork', image);
      });
    }
    
    return api.post('/artworks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update artwork
  updateArtwork: (id, artworkData) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(artworkData).forEach(key => {
      if (key !== 'images') {
        if (typeof artworkData[key] === 'object') {
          formData.append(key, JSON.stringify(artworkData[key]));
        } else {
          formData.append(key, artworkData[key]);
        }
      }
    });
    
    // Append new image files if any
    if (artworkData.images) {
      artworkData.images.forEach(image => {
        if (image instanceof File) {
          formData.append('artwork', image);
        }
      });
    }
    
    return api.put(`/artworks/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete artwork
  deleteArtwork: (id) => {
    return api.delete(`/artworks/${id}`);
  },

  // Toggle like
  toggleLike: (id) => {
    return api.post(`/artworks/${id}/like`);
  },

  // Remove image
  removeImage: (artworkId, imageId) => {
    return api.delete(`/artworks/${artworkId}/images/${imageId}`);
  },

  // Set main image
  setMainImage: (artworkId, imageId) => {
    return api.put(`/artworks/${artworkId}/images/${imageId}/main`);
  },

  // Get related artworks
  getRelatedArtworks: (id, limit = 6) => {
    return api.get(`/artworks/${id}/related`, { params: { limit } });
  },
};

export default artworkService;
