import React from 'react';
import { Container, Typography, Box, Alert, Button } from '@mui/material';
import { Construction } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ComingSoon = ({ pageName, description }) => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center">
        <Construction sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          {pageName}
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Coming Soon!
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          {description}
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          This feature is currently under development. We're working hard to bring you an amazing experience!
        </Alert>
        <Button component={Link} to="/dashboard" variant="contained" size="large">
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default ComingSoon;
