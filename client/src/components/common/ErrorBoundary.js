import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      const { fallback } = this.props;
      
      if (fallback) {
        return fallback(this.state.error, this.handleRetry);
      }

      return (
        <Box p={4} display="flex" justifyContent="center">
          <Alert 
            severity="error" 
            sx={{ maxWidth: 600 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={this.handleRetry}
                startIcon={<Refresh />}
              >
                Try Again
              </Button>
            }
          >
            <AlertTitle>Something went wrong</AlertTitle>
            {process.env.NODE_ENV === 'development' ? (
              <details style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>
                <summary>Error Details (Development Only)</summary>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </details>
            ) : (
              'An unexpected error occurred. Please refresh the page and try again.'
            )}
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
