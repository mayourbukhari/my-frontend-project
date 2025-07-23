import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Stack,
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Palette as PaletteIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Groups as GroupsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Brush as BrushIcon
} from '@mui/icons-material';

const Home = () => {
  const features = [
    {
      icon: <PaletteIcon sx={{ fontSize: 40 }} />,
      title: 'For Artists',
      description: 'Create stunning portfolios, manage your artwork collection, and reach a global audience of art enthusiasts.',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: '#6366f1'
    },
    {
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      title: 'For Collectors', 
      description: 'Discover unique pieces, build meaningful collections, and connect directly with talented artists worldwide.',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #e879f9 100%)',
      color: '#8b5cf6'
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      title: 'Advanced Tools',
      description: 'Leverage AI-powered recommendations, virtual tours, and professional analytics to enhance your experience.',
      gradient: 'linear-gradient(135deg, #e879f9 0%, #6366f1 100%)',
      color: '#e879f9'
    }
  ];

  const stats = [
    { label: 'Active Artists', value: '10K+', icon: <BrushIcon /> },
    { label: 'Artworks Listed', value: '50K+', icon: <PaletteIcon /> },
    { label: 'Happy Collectors', value: '25K+', icon: <PersonIcon /> },
    { label: 'Countries Served', value: '120+', icon: <GroupsIcon /> }
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Chip 
                  label="✨ New Platform Features Available" 
                  sx={{ 
                    mb: 3, 
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    color: 'primary.main',
                    fontWeight: 600
                  }} 
                />
                <Typography 
                  variant="h1" 
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #e879f9 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 3
                  }}
                >
                  Artist Marketplace
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 4,
                    fontSize: { xs: '1.1rem', md: '1.4rem' },
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}
                >
                  Where creativity meets opportunity. Discover exceptional artwork, connect with talented artists, and be part of a thriving creative community.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    component={Link}
                    to="/gallery"
                    variant="contained"
                    size="large"
                    sx={{
                      py: 2,
                      px: 4,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(99, 102, 241, 0.4)'
                      }
                    }}
                  >
                    Explore Gallery
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    size="large"
                    sx={{
                      py: 2,
                      px: 4,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Join as Artist
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    width: { xs: 280, md: 400 },
                    height: { xs: 280, md: 400 },
                    mx: 'auto',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #e879f9 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -4,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #e879f9 100%)',
                      opacity: 0.3,
                      animation: 'pulse 3s ease-in-out infinite'
                    }
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '4rem', md: '6rem' },
                      background: 'white',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    🎨
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'transparent',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 1 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Why Choose Artist Marketplace?
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Experience the future of art discovery with our innovative platform designed for creators and collectors alike.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'white',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                    '&::before': {
                      opacity: 0.1
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: feature.gradient,
                    opacity: 0.7,
                    transition: 'opacity 0.3s ease'
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      color: feature.color,
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Additional Features Section */}
      <Box sx={{ backgroundColor: 'rgba(99, 102, 241, 0.05)', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Advanced Features
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7 }}>
                Our platform leverages cutting-edge technology to provide an unparalleled experience for artists and collectors.
              </Typography>
              <Stack spacing={3}>
                {[
                  { icon: <AutoAwesomeIcon />, title: 'AI-Powered Recommendations', description: 'Discover artwork tailored to your taste' },
                  { icon: <SecurityIcon />, title: 'Secure Transactions', description: 'Safe and encrypted payment processing' },
                  { icon: <TrendingUpIcon />, title: 'Analytics Dashboard', description: 'Comprehensive insights and performance metrics' }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ color: 'primary.main', mt: 0.5 }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="semibold" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: 4,
                  p: 4,
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Ready to Get Started?
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Join thousands of artists and collectors in our thriving marketplace community.
                </Typography>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    py: 2,
                    px: 4,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'grey.100',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Start Your Journey
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
