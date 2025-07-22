import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';
import Navigation from './Navigation';
import LanguageSelector from './LanguageSelector';

const Layout = ({ children, maxWidth = 'lg' }) => {

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth={maxWidth}>
          {children}
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: 'background.paper',
          py: 3,
          mt: 'auto',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Artist Marketplace
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Discover and collect unique artworks from talented artists worldwide
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 4,
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Explore
                </Typography>
                <Link href="/gallery" color="inherit" underline="hover" display="block">
                  Gallery
                </Link>
                <Link href="/artists" color="inherit" underline="hover" display="block">
                  Artists
                </Link>
                <Link href="/collections" color="inherit" underline="hover" display="block">
                  Collections
                </Link>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Support
                </Typography>
                <Link href="/help" color="inherit" underline="hover" display="block">
                  Help Center
                </Link>
                <Link href="/contact" color="inherit" underline="hover" display="block">
                  Contact Us
                </Link>
                <Link href="/faq" color="inherit" underline="hover" display="block">
                  FAQ
                </Link>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Legal
                </Typography>
                <Link href="/privacy" color="inherit" underline="hover" display="block">
                  Privacy Policy
                </Link>
                <Link href="/terms" color="inherit" underline="hover" display="block">
                  Terms of Service
                </Link>
              </Box>
            </Box>

            <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Typography variant="subtitle2" gutterBottom>
                Language
              </Typography>
              <LanguageSelector size="small" />
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © 2024 Artist Marketplace. All rights reserved.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Made with ❤️
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
