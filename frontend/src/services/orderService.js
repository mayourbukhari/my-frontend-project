import api from './api';

const orderService = {
  // Create new order
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },

  // Get user orders
  getUserOrders: (params = {}) => {
    return api.get('/orders', { params });
  },

  // Get artist orders
  getArtistOrders: (params = {}) => {
    return api.get('/orders/artist/orders', { params });
  },

  // Get order by ID
  getOrderById: (id) => {
    return api.get(`/orders/${id}`);
  },

  // Update order status
  updateOrderStatus: (id, statusData) => {
    return api.put(`/orders/${id}/status`, statusData);
  },

  // Confirm payment
  confirmPayment: (id, paymentIntentId) => {
    return api.post(`/orders/${id}/confirm-payment`, { paymentIntentId });
  },

  // Cancel order
  cancelOrder: (id, reason) => {
    return api.put(`/orders/${id}/cancel`, { reason });
  },

  // Get order statistics
  getOrderStats: () => {
    return api.get('/orders/stats');
  },
};

export default orderService;
