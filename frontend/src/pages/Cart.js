import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  Alert
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCartOutlined,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart || { items: [] });
  const { user } = useSelector((state) => state.auth);

  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Redirect to checkout process
    navigate('/orders');
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 8,
            textAlign: 'center',
            backgroundColor: 'grey.50',
            borderRadius: 3
          }}
        >
          <ShoppingCartOutlined sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="text.secondary">
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start exploring our amazing collection of artworks and add them to your cart.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/gallery')}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Browse Gallery
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Shopping Cart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {items.length} item{items.length > 1 ? 's' : ''} in your cart
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Cart Items
              </Typography>
              <Button
                color="error"
                onClick={handleClearCart}
                startIcon={<Delete />}
                size="small"
              >
                Clear Cart
              </Button>
            </Box>

            <List>
              {items.map((item, index) => (
                <React.Fragment key={item._id}>
                  <ListItem sx={{ px: 0, py: 2 }}>
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        src={item.imageUrl}
                        sx={{ width: 80, height: 80, mr: 2 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight="bold">
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            by {item.artist}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                            ₹{item.price.toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          >
                            <Remove />
                          </IconButton>
                          <Typography sx={{ px: 2, minWidth: 20, textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < items.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Order Summary
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              {items.map((item) => (
                <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.title} × {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ₹{totalAmount.toLocaleString()}
              </Typography>
            </Box>

            {!user && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Please sign in to proceed with checkout
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              sx={{ borderRadius: 2, py: 1.5 }}
            >
              {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2, borderRadius: 2 }}
              onClick={() => navigate('/gallery')}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
