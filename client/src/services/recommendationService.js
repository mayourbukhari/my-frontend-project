import { api } from './api';

class RecommendationService {
  // Get personalized artwork recommendations for a user
  static async getPersonalizedRecommendations(userId, options = {}) {
    try {
      const params = new URLSearchParams({
        userId,
        limit: options.limit || 10,
        category: options.category || '',
        priceRange: options.priceRange || '',
        excludeOwned: options.excludeOwned !== false,
        ...options
      });

      const response = await api.get(`/recommendations/personalized?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
      throw error;
    }
  }

  // Get similar artworks based on a specific artwork
  static async getSimilarArtworks(artworkId, options = {}) {
    try {
      const params = new URLSearchParams({
        limit: options.limit || 8,
        excludeSold: options.excludeSold !== false,
        sameMedium: options.sameMedium || false,
        sameArtist: options.sameArtist || false,
        ...options
      });

      const response = await api.get(`/recommendations/similar/${artworkId}?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching similar artworks:', error);
      throw error;
    }
  }

  // Get trending artworks
  static async getTrendingArtworks(options = {}) {
    try {
      const params = new URLSearchParams({
        limit: options.limit || 12,
        timeframe: options.timeframe || 'week', // 'day', 'week', 'month'
        category: options.category || '',
        ...options
      });

      const response = await api.get(`/recommendations/trending?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending artworks:', error);
      throw error;
    }
  }

  // Get recommended artists based on user preferences
  static async getRecommendedArtists(userId, options = {}) {
    try {
      const params = new URLSearchParams({
        userId,
        limit: options.limit || 6,
        excludeFollowed: options.excludeFollowed !== false,
        ...options
      });

      const response = await api.get(`/recommendations/artists?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended artists:', error);
      throw error;
    }
  }

  // Get curated collections
  static async getCuratedCollections(options = {}) {
    try {
      const params = new URLSearchParams({
        limit: options.limit || 4,
        theme: options.theme || '',
        ...options
      });

      const response = await api.get(`/recommendations/collections?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching curated collections:', error);
      throw error;
    }
  }

  // Record user interaction for recommendation improvement
  static async recordInteraction(data) {
    try {
      const response = await api.post('/recommendations/interaction', {
        userId: data.userId,
        artworkId: data.artworkId,
        artistId: data.artistId,
        action: data.action, // 'view', 'like', 'purchase', 'share', 'save'
        duration: data.duration, // time spent viewing (for 'view' action)
        metadata: data.metadata || {}
      });
      return response.data;
    } catch (error) {
      console.error('Error recording interaction:', error);
      // Don't throw error for analytics failures
    }
  }

  // Get recommendations based on search query
  static async getSearchBasedRecommendations(query, options = {}) {
    try {
      const params = new URLSearchParams({
        query,
        limit: options.limit || 10,
        ...options
      });

      const response = await api.get(`/recommendations/search?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching search recommendations:', error);
      throw error;
    }
  }

  // Get price recommendations for artists
  static async getPriceRecommendations(artworkData) {
    try {
      const response = await api.post('/recommendations/pricing', {
        category: artworkData.category,
        medium: artworkData.medium,
        dimensions: artworkData.dimensions,
        artistExperience: artworkData.artistExperience,
        complexity: artworkData.complexity,
        materials: artworkData.materials
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching price recommendations:', error);
      throw error;
    }
  }

  // Update user preferences for better recommendations
  static async updateUserPreferences(userId, preferences) {
    try {
      const response = await api.put(`/recommendations/preferences/${userId}`, {
        categories: preferences.categories,
        priceRange: preferences.priceRange,
        mediums: preferences.mediums,
        styles: preferences.styles,
        colorPreferences: preferences.colorPreferences,
        sizePreferences: preferences.sizePreferences
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // Get user's recommendation analytics
  static async getRecommendationAnalytics(userId, timeframe = 'month') {
    try {
      const response = await api.get(`/recommendations/analytics/${userId}?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendation analytics:', error);
      throw error;
    }
  }
}

export default RecommendationService;
