import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Alert,
} from '@mui/material';
import {
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  AttachMoney,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 150.00,
    artworks: [
      { id: 1, title: 'Abstract Sunset', artist: 'John Doe', price: 150.00, image: '/api/placeholder/100/100' }
    ]
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'shipped',
    total: 200.00,
    artworks: [
      { id: 2, title: 'City Lights', artist: 'Jane Smith', price: 200.00, image: '/api/placeholder/100/100' }
    ]
  },
  {
    id: 'ORD-003',
    date: '2024-01-05',
    status: 'processing',
    total: 180.00,
    artworks: [
      { id: 3, title: 'Ocean Waves', artist: 'Bob Wilson', price: 180.00, image: '/api/placeholder/100/100' }
    ]
  },
];

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState(mockOrders);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'processing': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle />;
      case 'shipped': return <LocalShipping />;
      case 'processing': return <ShoppingBag />;
      case 'cancelled': return <Cancel />;
      default: return <ShoppingBag />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" component="h1">
          My Orders
        </Typography>
        <Button component={Link} to="/gallery" variant="contained">
          Continue Shopping
        </Button>
      </Box>

      {orders.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          You haven't placed any orders yet. <Link to="/gallery">Browse our gallery</Link> to discover amazing artworks.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">
                      Order #{order.id}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      color={getStatusColor(order.status)}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </Typography>

                  <List>
                    {order.artworks.map((artwork, index) => (
                      <React.Fragment key={artwork.id}>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar
                              variant="square"
                              src={artwork.image}
                              sx={{ width: 60, height: 60 }}
                            >
                              <ShoppingBag />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={artwork.title}
                            secondary={`by ${artwork.artist}`}
                          />
                          <Typography variant="h6">
                            ${artwork.price.toFixed(2)}
                          </Typography>
                        </ListItem>
                        {index < order.artworks.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="h6">
                      Total: ${order.total.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                  {order.status === 'delivered' && (
                    <Button size="small" color="secondary">
                      Leave Review
                    </Button>
                  )}
                  {order.status === 'processing' && (
                    <Button size="small" color="error">
                      Cancel Order
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Orders;
