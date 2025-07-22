import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import artworkReducer from './artworkSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    artworks: artworkReducer,
    cart: cartReducer,
  },
});
