import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  CircularProgress,
  IconButton,
  Skeleton,
} from '@mui/material';
import {
  Refresh,
  TrendingUp,
  Psychology,
  Palette,
  Star,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import RecommendationService from '../services/recommendationService';
import ArtworkCard from './ArtworkCard';

const RecommendationSection = ({ 
  title, 
  subtitle, 
  icon, 
  recommendations, 
  loading, 
  onRefresh,
  type = 'artworks'
}) => {

  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h5" sx={{ ml: 1, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={24} />
                  <Skeleton variant="text" height={20} width="80%" />
                  <Skeleton variant="text" height={20} width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Box sx={{ ml: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        {onRefresh && (
          <IconButton onClick={onRefresh} size="small">
            <Refresh />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={2}>
        {type === 'artworks' ? (
          recommendations.map((artwork) => (
            <Grid item xs={12} sm={6} md={3} key={artwork._id}>
              <ArtworkCard artwork={artwork} />
            </Grid>
          ))
        ) : type === 'artists' ? (
          recommendations.map((artist) => (
            <Grid item xs={12} sm={6} md={3} key={artist._id}>
              <Card
                component={Link}
                to={`/artist/${artist._id}`}
                sx={{
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={artist.profile?.avatar}
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      fontSize: 32,
                    }}
                  >
                    {artist.profile?.firstName?.[0]}{artist.profile?.lastName?.[0]}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {artist.profile?.firstName} {artist.profile?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {artist.artworksCount} artworks
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                    {artist.categories?.slice(0, 2).map((category) => (
                      <Chip
                        key={category}
                        label={category}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  {artist.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Star sx={{ color: 'gold', fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">
                        {artist.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          recommendations.map((collection) => (
            <Grid item xs={12} sm={6} md={4} key={collection._id}>
              <Card
                component={Link}
                to={`/collection/${collection._id}`}
                sx={{
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${collection.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      color: 'white',
                      p: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {collection.title}
                    </Typography>
                    <Typography variant="body2">
                      {collection.artworksCount} pieces
                    </Typography>
                  </Box>
                </Box>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {collection.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

const Recommendations = ({ userId, artworkId, context = 'dashboard' }) => {
  const { user } = useSelector((state) => state.auth);
  
  const [personalizedRecs, setPersonalizedRecs] = useState([]);
  const [trendingRecs, setTrendingRecs] = useState([]);
  const [similarRecs, setSimilarRecs] = useState([]);
  const [artistRecs, setArtistRecs] = useState([]);
  const [collectionRecs, setCollectionRecs] = useState([]);
  
  const [loading, setLoading] = useState({
    personalized: false,
    trending: false,
    similar: false,
    artists: false,
    collections: false,
  });

  useEffect(() => {
    loadRecommendations();
  }, [userId, artworkId]);

  const loadRecommendations = async () => {
    if (context === 'dashboard' && userId) {
      await Promise.all([
        loadPersonalizedRecommendations(),
        loadTrendingRecommendations(),
        loadArtistRecommendations(),
        loadCollectionRecommendations(),
      ]);
    } else if (context === 'artwork' && artworkId) {
      await loadSimilarRecommendations();
    }
  };

  const loadPersonalizedRecommendations = async () => {
    setLoading(prev => ({ ...prev, personalized: true }));
    try {
      const data = await RecommendationService.getPersonalizedRecommendations(userId, {
        limit: 8
      });
      setPersonalizedRecs(data.recommendations || []);
    } catch (error) {
      console.error('Error loading personalized recommendations:', error);
    } finally {
      setLoading(prev => ({ ...prev, personalized: false }));
    }
  };

  const loadTrendingRecommendations = async () => {
    setLoading(prev => ({ ...prev, trending: true }));
    try {
      const data = await RecommendationService.getTrendingArtworks({
        limit: 6,
        timeframe: 'week'
      });
      setTrendingRecs(data.artworks || []);
    } catch (error) {
      console.error('Error loading trending recommendations:', error);
    } finally {
      setLoading(prev => ({ ...prev, trending: false }));
    }
  };

  const loadSimilarRecommendations = async () => {
    setLoading(prev => ({ ...prev, similar: true }));
    try {
      const data = await RecommendationService.getSimilarArtworks(artworkId, {
        limit: 8
      });
      setSimilarRecs(data.similar || []);
    } catch (error) {
      console.error('Error loading similar recommendations:', error);
    } finally {
      setLoading(prev => ({ ...prev, similar: false }));
    }
  };

  const loadArtistRecommendations = async () => {
    setLoading(prev => ({ ...prev, artists: true }));
    try {
      const data = await RecommendationService.getRecommendedArtists(userId, {
        limit: 4
      });
      setArtistRecs(data.artists || []);
    } catch (error) {
      console.error('Error loading artist recommendations:', error);
    } finally {
      setLoading(prev => ({ ...prev, artists: false }));
    }
  };

  const loadCollectionRecommendations = async () => {
    setLoading(prev => ({ ...prev, collections: true }));
    try {
      const data = await RecommendationService.getCuratedCollections({
        limit: 3
      });
      setCollectionRecs(data.collections || []);
    } catch (error) {
      console.error('Error loading collection recommendations:', error);
    } finally {
      setLoading(prev => ({ ...prev, collections: false }));
    }
  };

  if (context === 'dashboard') {
    return (
      <Box>
        {user && (
          <RecommendationSection
            title="For You"
            subtitle="Personalized recommendations based on your preferences"
            icon={<Psychology color="primary" />}
            recommendations={personalizedRecs}
            loading={loading.personalized}
            onRefresh={loadPersonalizedRecommendations}
            type="artworks"
          />
        )}

        <RecommendationSection
          title="Trending Now"
          subtitle="Popular artworks in the community"
          icon={<TrendingUp color="secondary" />}
          recommendations={trendingRecs}
          loading={loading.trending}
          onRefresh={loadTrendingRecommendations}
          type="artworks"
        />

        {user && (
          <RecommendationSection
            title="Discover Artists"
            subtitle="Talented artists you might like"
            icon={<Palette color="primary" />}
            recommendations={artistRecs}
            loading={loading.artists}
            onRefresh={loadArtistRecommendations}
            type="artists"
          />
        )}

        <RecommendationSection
          title="Curated Collections"
          subtitle="Handpicked collections by theme"
          icon={<Star color="secondary" />}
          recommendations={collectionRecs}
          loading={loading.collections}
          onRefresh={loadCollectionRecommendations}
          type="collections"
        />
      </Box>
    );
  }

  if (context === 'artwork') {
    return (
      <RecommendationSection
        title="Similar Artworks"
        subtitle="You might also like these pieces"
        icon={<Psychology color="primary" />}
        recommendations={similarRecs}
        loading={loading.similar}
        onRefresh={loadSimilarRecommendations}
        type="artworks"
      />
    );
  }

  return null;
};

export default Recommendations;
