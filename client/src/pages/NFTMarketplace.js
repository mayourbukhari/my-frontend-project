import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart,
  AccountBalanceWallet,
  Verified,
  TrendingUp,
  Share,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';

const NFTMarketplace = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceMin: '',
    priceMax: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'art', label: 'Art' },
    { value: 'photography', label: 'Photography' },
    { value: 'digital', label: 'Digital Art' },
    { value: 'collectibles', label: 'Collectibles' },
    { value: 'music', label: 'Music' },
    { value: 'video', label: 'Video' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price' },
    { value: 'name', label: 'Name' },
    { value: 'popularity', label: 'Most Popular' },
  ];

  useEffect(() => {
    fetchNFTs();
  }, [filters, pagination.currentPage]);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...filters
      });

      const response = await fetch(`/api/nfts?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setNfts(data.nfts);
        setPagination(data.pagination);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      showSnackbar('Failed to fetch NFTs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const handlePurchase = async () => {
    if (!selectedNFT || !user) return;

    try {
      setPurchasing(true);
      const response = await fetch(`/api/nfts/${selectedNFT._id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar('NFT purchased successfully!', 'success');
        setPurchaseDialogOpen(false);
        fetchNFTs(); // Refresh the list
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      showSnackbar(error.message || 'Purchase failed', 'error');
    } finally {
      setPurchasing(false);
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatEthPrice = (price) => {
    // Convert USD to ETH (mock conversion rate)
    const ethPrice = price / 2000; // Assuming 1 ETH = $2000
    return `${ethPrice.toFixed(4)} ETH`;
  };

  return (
    <Layout>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            NFT Marketplace
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Discover and collect unique digital artworks
          </Typography>

          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {nfts.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total NFTs
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  125
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Artists
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  $2.4M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Volume Traded
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  15.2 ETH
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Floor Price
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Filters */}
        <Card sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search NFTs"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={1.5}>
              <TextField
                fullWidth
                label="Min Price"
                type="number"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={1.5}>
              <TextField
                fullWidth
                label="Max Price"
                type="number"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setFilters({
                  search: '',
                  category: 'all',
                  priceMin: '',
                  priceMax: '',
                  sortBy: 'createdAt',
                  sortOrder: 'desc'
                })}
                size="small"
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* NFT Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : nfts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No NFTs found matching your criteria
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {nfts.map((nft) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={nft._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.shadows[8],
                    },
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* NFT Image */}
                  <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                    <CardMedia
                      component="img"
                      image={nft.image || nft.artwork?.images?.[0] || '/placeholder-nft.jpg'}
                      alt={nft.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    
                    {/* Overlay Actions */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        opacity: 0,
                        transition: 'opacity 0.2s ease-in-out',
                        '.MuiCard-root:hover &': {
                          opacity: 1,
                        },
                      }}
                    >
                      <Tooltip title="Share">
                        <IconButton
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': { backgroundColor: 'white' },
                          }}
                        >
                          <Share fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add to Favorites">
                        <IconButton
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': { backgroundColor: 'white' },
                          }}
                        >
                          <FavoriteBorder fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Verified Badge */}
                    {nft.creator.verified && (
                      <Chip
                        icon={<Verified />}
                        label="Verified"
                        size="small"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          fontWeight: 'bold',
                        }}
                      />
                    )}
                  </Box>

                  {/* Content */}
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      noWrap
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {nft.name}
                    </Typography>

                    {/* Creator Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={nft.creator.profile?.avatar}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {nft.creator.profile?.firstName} {nft.creator.profile?.lastName}
                      </Typography>
                    </Box>

                    {/* Category */}
                    <Chip
                      label={nft.category}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1, textTransform: 'capitalize' }}
                    />

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {nft.description}
                    </Typography>
                  </CardContent>

                  {/* Actions */}
                  <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Price
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {formatEthPrice(nft.price)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatPrice(nft.price)}
                        </Typography>
                      </Box>

                      {user && nft.currentOwner._id !== user.id && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<AccountBalanceWallet />}
                          onClick={() => {
                            setSelectedNFT(nft);
                            setPurchaseDialogOpen(true);
                          }}
                        >
                          Buy Now
                        </Button>
                      )}
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={(event, value) => setPagination(prev => ({ ...prev, currentPage: value }))}
              color="primary"
            />
          </Box>
        )}
      </Container>

      {/* Purchase Dialog */}
      <Dialog
        open={purchaseDialogOpen}
        onClose={() => setPurchaseDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Purchase NFT</DialogTitle>
        <DialogContent>
          {selectedNFT && (
            <Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <img
                  src={selectedNFT.image || selectedNFT.artwork?.images?.[0]}
                  alt={selectedNFT.name}
                  style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
                />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedNFT.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {selectedNFT.creator.profile?.firstName} {selectedNFT.creator.profile?.lastName}
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    {formatEthPrice(selectedNFT.price)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPrice(selectedNFT.price)}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Confirm your purchase. This transaction will be processed on the blockchain.
              </Typography>

              {/* Transaction Details */}
              <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, border: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Purchase Breakdown
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Item Price</Typography>
                  <Typography variant="body2">{formatEthPrice(selectedNFT.price)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Service Fee</Typography>
                  <Typography variant="body2">0.005 ETH</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <Typography variant="body2">Total</Typography>
                  <Typography variant="body2">{formatEthPrice(selectedNFT.price + 10)}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPurchaseDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            variant="contained"
            disabled={purchasing}
            startIcon={purchasing ? <CircularProgress size={20} /> : <AccountBalanceWallet />}
          >
            {purchasing ? 'Processing...' : 'Confirm Purchase'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default NFTMarketplace;
