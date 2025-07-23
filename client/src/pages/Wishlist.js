import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  Chip,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  RemoveCircleOutline,
  ShoppingCart,
  Palette,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Mock wishlist data
const mockWishlist = [
  {
    id: 1,
    title: 'Mountain Serenity',
    artist: 'Alice Brown',
    price: 320.00,
    image: '/api/placeholder/300/200',
    category: 'Landscape',
    liked: true,
    available: true,
  },
  {
    id: 2,
    title: 'Urban Dreams',
    artist: 'Tom Green',
    price: 195.00,
    image: '/api/placeholder/300/200',
    category: 'Abstract',
    liked: true,
    available: true,
  },
  {
    id: 3,
    title: 'Silent Waters',
    artist: 'Emma Davis',
    price: 250.00,
    image: '/api/placeholder/300/200',
    category: 'Realism',
    liked: true,
    available: false,
  },
];

const Wishlist = () => {
  const { user } = useSelector((state) => state.auth);
  const [wishlistItems, setWishlistItems] = useState(mockWishlist);

  const handleRemoveFromWishlist = (artworkId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== artworkId));
  };

  const handleToggleLike = (artworkId) => {
    setWishlistItems(prev => 
      prev.map(item => 
        item.id === artworkId 
          ? { ...item, liked: !item.liked }
          : item
      )
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" component="h1">
          My Wishlist
        </Typography>
        <Button component={Link} to="/gallery" variant="contained">
          Browse Gallery
        </Button>
      </Box>

      {wishlistItems.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Palette sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Discover amazing artworks and add them to your wishlist to keep track of your favorites.
          </Typography>
          <Button component={Link} to="/gallery" variant="contained" size="large">
            Explore Artworks
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            {wishlistItems.length} {wishlistItems.length === 1 ? 'artwork' : 'artworks'} in your wishlist
          </Typography>
          
          <Grid container spacing={3}>
            {wishlistItems.map((artwork) => (
              <Grid item xs={12} sm={6} md={4} key={artwork.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={artwork.image}
                    alt={artwork.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" component="h2" noWrap>
                        {artwork.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleLike(artwork.id)}
                        color={artwork.liked ? 'error' : 'default'}
                      >
                        {artwork.liked ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      by {artwork.artist}
                    </Typography>
                    
                    <Chip 
                      label={artwork.category} 
                      size="small" 
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                    
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${artwork.price.toFixed(2)}
                    </Typography>
                    
                    {!artwork.available && (
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        Currently unavailable
                      </Alert>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      component={Link}
                      to={`/artwork/${artwork.id}`}
                      size="small"
                    >
                      View Details
                    </Button>
                    
                    {artwork.available && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<ShoppingCart />}
                      >
                        Add to Cart
                      </Button>
                    )}
                    
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFromWishlist(artwork.id)}
                      color="error"
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Wishlist;
