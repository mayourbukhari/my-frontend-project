import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const artwork = action.payload;
      const existingItem = state.items.find(item => item._id === artwork._id);
      
      if (!existingItem) {
        state.items.push({ ...artwork, quantity: 1 });
        state.total += artwork.price;
      }
    },
    removeFromCart: (state, action) => {
      const artworkId = action.payload;
      const item = state.items.find(item => item._id === artworkId);
      
      if (item) {
        state.total -= item.price * item.quantity;
        state.items = state.items.filter(item => item._id !== artworkId);
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item._id === id);
      
      if (item && quantity > 0) {
        state.total = state.total - (item.price * item.quantity) + (item.price * quantity);
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;
