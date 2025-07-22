import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import artworkService from '../services/artworkService';

// Async thunks
export const fetchArtworks = createAsyncThunk(
  'artworks/fetchArtworks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await artworkService.getArtworks(params);
      // Ensure we always return a valid structure
      return response.data || { artworks: [], pagination: { totalPages: 1, currentPage: 1, totalItems: 0 } };
    } catch (error) {
      console.error('fetchArtworks error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch artworks');
    }
  }
);

export const fetchArtworkById = createAsyncThunk(
  'artworks/fetchArtworkById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await artworkService.getArtworkById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch artwork');
    }
  }
);

export const createArtwork = createAsyncThunk(
  'artworks/createArtwork',
  async (artworkData, { rejectWithValue }) => {
    try {
      const response = await artworkService.createArtwork(artworkData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create artwork');
    }
  }
);

export const updateArtwork = createAsyncThunk(
  'artworks/updateArtwork',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await artworkService.updateArtwork(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update artwork');
    }
  }
);

export const deleteArtwork = createAsyncThunk(
  'artworks/deleteArtwork',
  async (id, { rejectWithValue }) => {
    try {
      await artworkService.deleteArtwork(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete artwork');
    }
  }
);

export const toggleLike = createAsyncThunk(
  'artworks/toggleLike',
  async (id, { rejectWithValue }) => {
    try {
      const response = await artworkService.toggleLike(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

const initialState = {
  artworks: [],
  currentArtwork: null,
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  totalCount: 0,
  filters: {
    search: '',
    category: [],
    medium: [],
    style: [],
    orientation: [],
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'newest',
    page: 1,
    limit: 20,
  },
};

const artworkSlice = createSlice({
  name: 'artworks',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        category: [],
        medium: [],
        style: [],
        orientation: [],
        minPrice: 0,
        maxPrice: 10000,
        sortBy: 'newest',
        page: 1,
        limit: 20,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentArtwork: (state) => {
      state.currentArtwork = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch artworks
      .addCase(fetchArtworks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload || {};
        state.artworks = payload.artworks || payload.data || [];
        state.totalPages = payload.pagination?.totalPages || payload.totalPages || 1;
        state.currentPage = payload.pagination?.currentPage || payload.currentPage || 1;
        state.totalCount = payload.pagination?.totalItems || payload.totalCount || payload.total || 0;
      })
      .addCase(fetchArtworks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Ensure artworks array is never undefined
        if (!state.artworks) {
          state.artworks = [];
        }
      })
      // Fetch artwork by ID
      .addCase(fetchArtworkById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArtworkById.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload || {};
        state.currentArtwork = payload.artwork || payload;
      })
      .addCase(fetchArtworkById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create artwork
      .addCase(createArtwork.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createArtwork.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!state.artworks) {
          state.artworks = [];
        }
        const payload = action.payload || {};
        if (payload.artwork) {
          state.artworks.unshift(payload.artwork);
        }
      })
      .addCase(createArtwork.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update artwork
      .addCase(updateArtwork.fulfilled, (state, action) => {
        if (!state.artworks) {
          state.artworks = [];
        }
        const payload = action.payload || {};
        if (payload.artwork) {
          const index = state.artworks.findIndex(art => art._id === payload.artwork._id);
          if (index !== -1) {
            state.artworks[index] = payload.artwork;
          }
          if (state.currentArtwork && state.currentArtwork._id === payload.artwork._id) {
            state.currentArtwork = payload.artwork;
          }
        }
      })
      // Delete artwork
      .addCase(deleteArtwork.fulfilled, (state, action) => {
        if (!state.artworks) {
          state.artworks = [];
        }
        state.artworks = state.artworks.filter(art => art._id !== action.payload);
        if (state.currentArtwork && state.currentArtwork._id === action.payload) {
          state.currentArtwork = null;
        }
      })
      // Toggle like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { id, liked, likeCount } = action.payload;
        if (!state.artworks) {
          state.artworks = [];
        }
        const artwork = state.artworks.find(art => art._id === id);
        if (artwork) {
          artwork.liked = liked;
          artwork.likeCount = likeCount;
        }
        if (state.currentArtwork && state.currentArtwork._id === id) {
          state.currentArtwork.liked = liked;
          state.currentArtwork.likeCount = likeCount;
        }
      });
  },
});

export const { setFilters, clearFilters, clearError, clearCurrentArtwork } = artworkSlice.actions;
export default artworkSlice.reducer;
