import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ArtworkDetail = () => {
  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Artwork Detail
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Artwork detail page coming soon! This will display artwork details, artist info, and purchase options.
        </Typography>
        <Button component={Link} to="/gallery" variant="contained">
          Back to Gallery
        </Button>
      </Box>
    </Container>
  );
};

export default ArtworkDetail;
