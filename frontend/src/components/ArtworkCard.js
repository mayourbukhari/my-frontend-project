import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  Zoom,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Stack,
  Paper
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ZoomIn,
  Share,
  ShoppingCart,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
  Link as LinkIcon,
  Verified,
  Palette,
  TrendingUp
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';

const ArtworkCard = ({ artwork, onToggleWishlist, variant = 'default' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart || { items: [] });

  const isInCart = cartItems.some(item => item.artworkId === artwork._id);
  const isWishlisted = user?.wishlist?.includes(artwork._id);

  const artworkUrl = `${window.location.origin}/artwork/${artwork._id}`;
  const shareText = `Check out this amazing artwork: ${artwork.title} by ${artwork.artist.profile.firstName}`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInCart) {
      dispatch(addToCart({
        artworkId: artwork._id,
        title: artwork.title,
        price: artwork.price,
        image: artwork.images[0],
        artistName: artwork.artist.profile.firstName + ' ' + artwork.artist.profile.lastName,
        quantity: 1,
      }));
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(artwork._id);
    }
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShareMenuAnchor(e.currentTarget);
  };

  const handleShareClose = () => {
    setShareMenuAnchor(null);
  };

  const shareOnPlatform = (platform) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(artworkUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(artworkUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(artworkUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + artworkUrl)}`;
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: artwork.title,
            text: shareText,
            url: artworkUrl,
          });
          return;
        }
        // fallthrough
      case 'copy':
      default:
        navigator.clipboard.writeText(artworkUrl);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    handleShareClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          background: 'white',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
            borderColor: 'primary.300',
            '& .artwork-image': {
              transform: 'scale(1.05)'
            },
            '& .artwork-overlay': {
              opacity: 1
            }
          }
        }}
      >
        {/* Image Section with Enhanced Interaction */}
        <Box 
          component={Link} 
          to={`/artwork/${artwork._id}`}
          sx={{ 
            textDecoration: 'none',
            position: 'relative', 
            paddingTop: '75%',
            overflow: 'hidden'
          }}
        >
          {!imageError ? (
            <CardMedia
              component="img"
              image={artwork.images?.[0] || '/placeholder-artwork.jpg'}
              alt={artwork.title}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className="artwork-image"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: imageLoaded ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          ) : (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'neutral.100',
                color: 'neutral.500',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Palette sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
                <Typography variant="body2">Image not available</Typography>
              </Box>
            </Box>
          )}

          {/* Gradient Overlay */}
          <Box
            className="artwork-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.6) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease'
            }}
          />

          {/* Floating Action Buttons */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
              transition: 'all 0.3s ease',
            }}
          >
            <Tooltip title="Quick View" placement="left">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setZoomOpen(true);
                }}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  '&:hover': { 
                    backgroundColor: 'white',
                    transform: 'scale(1.1)'
                  },
                }}
              >
                <ZoomIn fontSize="small" />
              </IconButton>
            </Tooltip>

            {user && (
              <Tooltip title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} placement="left">
                <IconButton
                  size="small"
                  onClick={handleWishlistToggle}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    '&:hover': { 
                      backgroundColor: 'white',
                      transform: 'scale(1.1)'
                    },
                  }}
                >
                  {isWishlisted ? (
                    <Favorite fontSize="small" sx={{ color: 'error.main' }} />
                  ) : (
                    <FavoriteBorder fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Share" placement="left">
              <IconButton
                size="small"
                onClick={handleShareClick}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  '&:hover': { 
                    backgroundColor: 'white',
                    transform: 'scale(1.1)'
                  },
                }}
              >
                <Share fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Status Badges */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            {artwork.status === 'sold' && (
              <Chip
                label="SOLD"
                size="small"
                sx={{ 
                  backgroundColor: 'error.main',
                  color: 'white',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
              />
            )}
            {artwork.featured && (
              <Chip
                label="FEATURED"
                size="small"
                sx={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                }}
              />
            )}
            {artwork.trending && (
              <Chip
                icon={<TrendingUp />}
                label="TRENDING"
                size="small"
                sx={{ 
                  backgroundColor: 'success.main',
                  color: 'white',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
              />
            )}
          </Box>

          {/* Artist Badge */}
          {artwork.artist?.verified && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.3s ease',
              }}
            >
              <Paper
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.5,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3
                }}
              >
                <Avatar
                  src={artwork.artist.profile?.avatar}
                  sx={{ width: 24, height: 24 }}
                >
                  {artwork.artist.profile?.firstName?.[0]}
                </Avatar>
                <Typography variant="caption" fontWeight={600}>
                  {artwork.artist.profile?.firstName} {artwork.artist.profile?.lastName}
                </Typography>
                <Verified sx={{ fontSize: 16, color: 'primary.main' }} />
              </Paper>
            </Box>
          )}
        </Box>

        {/* Enhanced Content Section */}
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box component={Link} to={`/artwork/${artwork._id}`} sx={{ textDecoration: 'none' }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: 'text.primary',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              {artwork.title}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 500 }}
          >
            by {artwork.artist?.profile?.firstName} {artwork.artist?.profile?.lastName}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
            <Chip
              label={artwork.category}
              size="small"
              sx={{ 
                backgroundColor: 'primary.50',
                color: 'primary.700',
                textTransform: 'capitalize',
                fontWeight: 600
              }}
            />
            {artwork.medium && (
              <Chip
                label={artwork.medium}
                size="small"
                sx={{ 
                  backgroundColor: 'neutral.100',
                  color: 'neutral.700',
                  textTransform: 'capitalize'
                }}
              />
            )}
          </Stack>

          {artwork.dimensions && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block',
                mb: 1,
                p: 1,
                backgroundColor: 'neutral.50',
                borderRadius: 1,
                fontFamily: 'mono'
              }}
            >
              {artwork.dimensions.width}" × {artwork.dimensions.height}"
              {artwork.dimensions.depth && ` × ${artwork.dimensions.depth}"`}
            </Typography>
          )}

          {/* Price with enhanced styling */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2
            }}
          >
            <Typography
              variant="h5"
              component="span"
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {formatPrice(artwork.price)}
            </Typography>

            {artwork.originalPrice && artwork.originalPrice > artwork.price && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                {formatPrice(artwork.originalPrice)}
              </Typography>
            )}
          </Box>
        </CardContent>

        {/* Enhanced Actions Section */}
        {artwork.status !== 'sold' && user && user.role !== 'artist' && (
          <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
            <Button
              fullWidth
              variant={isInCart ? "outlined" : "contained"}
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={isInCart}
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                background: isInCart ? 'transparent' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: isInCart ? 'none' : '0 4px 15px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: isInCart ? 'none' : '0 6px 20px rgba(99, 102, 241, 0.4)'
                }
              }}
            >
              {isInCart ? 'Added to Cart' : 'Add to Cart'}
            </Button>
          </CardActions>
        )}
      </Card>

      {/* Enhanced Zoom Dialog */}
      <Dialog
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            borderRadius: 3,
            overflow: 'hidden'
          },
        }}
      >
        <DialogContent sx={{ p: 2, textAlign: 'center', position: 'relative' }}>
          <IconButton
            onClick={() => setZoomOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { backgroundColor: 'white' },
              zIndex: 1
            }}
          >
            <ZoomIn />
          </IconButton>
          <Zoom in={zoomOpen}>
            <Box>
              <img
                src={artwork.images?.[0]}
                alt={artwork.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  mt: 2,
                  textAlign: 'center'
                }}
              >
                {artwork.title}
              </Typography>
            </Box>
          </Zoom>
        </DialogContent>
      </Dialog>

      {/* Enhanced Share Menu */}
      <Menu
        anchorEl={shareMenuAnchor}
        open={Boolean(shareMenuAnchor)}
        onClose={handleShareClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            mt: 1,
            minWidth: 180,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        {navigator.share && (
          <MenuItem onClick={() => shareOnPlatform('native')}>
            <ListItemIcon>
              <Share fontSize="small" />
            </ListItemIcon>
            Share
          </MenuItem>
        )}
        <MenuItem onClick={() => shareOnPlatform('facebook')}>
          <ListItemIcon>
            <Facebook fontSize="small" sx={{ color: '#1877f2' }} />
          </ListItemIcon>
          Facebook
        </MenuItem>
        <MenuItem onClick={() => shareOnPlatform('twitter')}>
          <ListItemIcon>
            <Twitter fontSize="small" sx={{ color: '#1da1f2' }} />
          </ListItemIcon>
          Twitter
        </MenuItem>
        <MenuItem onClick={() => shareOnPlatform('linkedin')}>
          <ListItemIcon>
            <LinkedIn fontSize="small" sx={{ color: '#0a66c2' }} />
          </ListItemIcon>
          LinkedIn
        </MenuItem>
        <MenuItem onClick={() => shareOnPlatform('whatsapp')}>
          <ListItemIcon>
            <WhatsApp fontSize="small" sx={{ color: '#25d366' }} />
          </ListItemIcon>
          WhatsApp
        </MenuItem>
        <MenuItem onClick={() => shareOnPlatform('copy')}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          Copy Link
        </MenuItem>
      </Menu>
    </>
  );
};

export default ArtworkCard;
