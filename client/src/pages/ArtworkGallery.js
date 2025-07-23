import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  Pagination,
  useMediaQuery,
  useTheme,
  Skeleton,
  Paper,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Backdrop
} from '@mui/material';
import {
  ViewModule,
  ViewList,
  Tune,
  Search,
  Close
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import ArtworkCard from '../components/ArtworkCard';
import ArtworkFilters from '../components/ArtworkFilters';
import { fetchArtworks } from '../store/artworkSlice';
import { addToWishlist, removeFromWishlist } from '../store/authSlice';

const ArtworkGallery = () => {
  const [filters, setFilters] = useState({
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
  });

  const [viewMode, setViewMode] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { 
    artworks, 
    isLoading, 
    error, 
    totalPages, 
    currentPage, 
    totalCount 
  } = useSelector((state) => state.artworks || {});
  
  // Ensure artworks is always an array
  const safeArtworks = artworks || [];
  
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Force refresh when component mounts to ensure latest data
    dispatch(fetchArtworks({ ...filters, timestamp: Date.now() }));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleClearFilters = () => {
    const defaultFilters = {
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
    setFilters(defaultFilters);
  };

  const handlePageChange = (event, page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWishlist = async (artworkId) => {
    if (!user) return;
    
    const isWishlisted = user.wishlist?.includes(artworkId);
    if (isWishlisted) {
      dispatch(removeFromWishlist(artworkId));
    } else {
      dispatch(addToWishlist(artworkId));
    }
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {Array.from(new Array(8)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Box>
            <Skeleton
              variant="rectangular"
              height={250}
              sx={{ borderRadius: 1, mb: 1 }}
            />
            <Skeleton variant="text" height={32} width="80%" />
            <Skeleton variant="text" height={24} width="60%" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Skeleton variant="text" height={28} width="40%" />
              <Skeleton variant="rectangular" height={32} width={100} />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Enhanced Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #e879f9 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Discover Amazing Art
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Explore our curated collection of original artworks from talented artists around the world
          </Typography>

          {/* Stats Bar */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={4} 
            justifyContent="center" 
            sx={{ mt: 4 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {totalCount || 0}+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Artworks
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                500+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Artists
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                50+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Categories
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Grid container spacing={4}>
          {/* Desktop Filters Sidebar */}
          {!isMobile && (
            <Grid item md={3}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'sticky',
                  top: 100
                }}
              >
                <ArtworkFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </Paper>
            </Grid>
          )}

          {/* Main Content */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {/* Mobile Controls */}
            {isMobile && (
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <IconButton
                    onClick={() => setFiltersOpen(true)}
                    sx={{
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2
                    }}
                  >
                    <Tune />
                  </IconButton>
                  <Chip
                    icon={<Search />}
                    label={`${totalCount || 0} artworks`}
                    sx={{ 
                      backgroundColor: 'primary.50',
                      color: 'primary.700',
                      fontWeight: 600
                    }}
                  />
                </Stack>
              </Box>
            )}

            {/* Enhanced Results Header */}
            {!isLoading && !error && (
              <Box sx={{ 
                mb: 4, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 3,
                backgroundColor: 'background.paper',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Box>
                  <Typography variant="h6" fontWeight="600">
                    {totalCount > 0 
                      ? `${totalCount} Artworks Found`
                      : 'No artworks found'
                    }
                  </Typography>
                  {totalCount > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Showing {((currentPage - 1) * filters.limit) + 1}-{Math.min(currentPage * filters.limit, totalCount)} of {totalCount}
                    </Typography>
                  )}
                </Box>

                {/* View Toggle */}
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Grid View">
                    <IconButton
                      onClick={() => setViewMode('grid')}
                      sx={{
                        backgroundColor: viewMode === 'grid' ? 'primary.main' : 'transparent',
                        color: viewMode === 'grid' ? 'white' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: viewMode === 'grid' ? 'primary.dark' : 'action.hover'
                        }
                      }}
                    >
                      <ViewModule />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="List View">
                    <IconButton
                      onClick={() => setViewMode('list')}
                      sx={{
                        backgroundColor: viewMode === 'list' ? 'primary.main' : 'transparent',
                        color: viewMode === 'list' ? 'white' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: viewMode === 'list' ? 'primary.dark' : 'action.hover'
                        }
                      }}
                    >
                      <ViewList />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            )}

            {/* Active Filters */}
            {(filters.search || filters.category.length > 0 || filters.medium.length > 0) && (
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {filters.search && (
                    <Chip
                      label={`Search: "${filters.search}"`}
                      onDelete={() => handleFilterChange('search', '')}
                      variant="outlined"
                      size="small"
                    />
                  )}
                  {filters.category.map((cat) => (
                    <Chip
                      key={cat}
                      label={`Category: ${cat}`}
                      onDelete={() => handleFilterChange('category', filters.category.filter(c => c !== cat))}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                  {filters.medium.map((med) => (
                    <Chip
                      key={med}
                      label={`Medium: ${med}`}
                      onDelete={() => handleFilterChange('medium', filters.medium.filter(m => m !== med))}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Error State */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'error.light'
                }}
              >
                {error}
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && <LoadingSkeleton />}

            {/* Enhanced Artworks Grid */}
            {!isLoading && !error && safeArtworks.length > 0 && (
              <Fade in={!isLoading}>
                <Grid container spacing={{ xs: 2, md: 3 }}>
                  {safeArtworks.map((artwork, index) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={6} 
                      md={viewMode === 'list' ? 12 : 6} 
                      lg={viewMode === 'list' ? 12 : 4} 
                      xl={viewMode === 'list' ? 12 : 3} 
                      key={artwork._id}
                    >
                      <Box
                        sx={{
                          opacity: 0,
                          animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
                        }}
                      >
                        <ArtworkCard 
                          artwork={artwork} 
                          onToggleWishlist={handleToggleWishlist}
                          variant={viewMode}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Fade>
            )}

            {/* Enhanced Empty State */}
            {!isLoading && !error && safeArtworks.length === 0 && (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: 'primary.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 4
                  }}
                >
                  <Search sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7 }} />
                </Box>
                <Typography variant="h4" gutterBottom fontWeight="600" color="text.primary">
                  No artworks found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                  We couldn't find any artworks matching your criteria. Try adjusting your filters or search terms.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Chip
                    label="Clear all filters"
                    onClick={handleClearFilters}
                    variant="outlined"
                    clickable
                  />
                </Stack>
              </Box>
            )}

            {/* Enhanced Pagination */}
            {!isLoading && !error && totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    size={isMobile ? 'small' : 'medium'}
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 600
                      }
                    }}
                  />
                </Paper>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Mobile Filters Drawer */}
        <Backdrop
          open={filtersOpen}
          onClick={() => setFiltersOpen(false)}
          sx={{ zIndex: 1200 }}
        >
          <Paper
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '90vw',
              maxWidth: 400,
              height: '100vh',
              p: 3,
              overflowY: 'auto',
              borderRadius: 0
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Filters
              </Typography>
              <IconButton onClick={() => setFiltersOpen(false)}>
                <Close />
              </IconButton>
            </Box>
            <ArtworkFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Paper>
        </Backdrop>
      </Container>
    </Box>
  );
};

export default ArtworkGallery;
