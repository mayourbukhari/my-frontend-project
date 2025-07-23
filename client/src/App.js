import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { store } from './store';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider as CustomThemeProvider, useTheme } from './contexts/ThemeContext';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ArtworkGallery from './pages/ArtworkGallery';
import ArtworkDetail from './pages/ArtworkDetail';
import ArtistProfile from './pages/ArtistProfile';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import MentorshipPrograms from './pages/MentorshipPrograms';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Commissions from './pages/Commissions';
import UploadArtwork from './pages/UploadArtwork';
import Analytics from './pages/Analytics';
import NFTMarketplace from './pages/NFTMarketplace';
import ArtistVerification from './pages/ArtistVerification';
import MentorshipSetup from './pages/MentorshipSetup';

// Components
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/Layout';

// Component that uses the theme context to create MUI theme
function ThemedApp() {
  const { theme, isDark } = useTheme();
  
  // Create MUI theme based on custom theme
  const muiTheme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: theme.colors.primary,
      },
      secondary: {
        main: theme.colors.secondary,
      },
      background: {
        default: theme.colors.background,
        paper: theme.colors.surface,
      },
      text: {
        primary: theme.colors.text,
        secondary: theme.colors.textSecondary,
      },
      error: {
        main: theme.colors.error,
      },
      warning: {
        main: theme.colors.warning,
      },
      info: {
        main: theme.colors.info,
      },
      success: {
        main: theme.colors.success,
      },
      divider: theme.colors.border,
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/gallery" element={<ArtworkGallery />} />
              <Route path="/artwork/:id" element={<ArtworkDetail />} />
              <Route path="/artist/:id" element={<ArtistProfile />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/commissions" element={<Commissions />} />
              <Route path="/mentorships" element={<MentorshipPrograms />} />
              <Route path="/mentorship-programs" element={<MentorshipPrograms />} />
              <Route path="/upload-artwork" element={<UploadArtwork />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/nft-marketplace" element={<NFTMarketplace />} />
              {/* New feature pages */}
              <Route path="/verification" element={<ArtistVerification />} />
              <Route path="/mentorship-setup" element={<MentorshipSetup />} />
              <Route path="/artist-profile" element={<ArtistProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>

        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerStyle={{
            top: 80,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: muiTheme.palette.background.paper,
              color: muiTheme.palette.text.primary,
              border: `1px solid ${muiTheme.palette.divider}`,
              borderRadius: 8,
              boxShadow: muiTheme.shadows[4],
            },
            success: {
              iconTheme: {
                primary: muiTheme.palette.success.main,
                secondary: muiTheme.palette.success.contrastText,
              },
            },
            error: {
              iconTheme: {
                primary: muiTheme.palette.error.main,
                secondary: muiTheme.palette.error.contrastText,
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <CustomThemeProvider>
          <ThemedApp />
        </CustomThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
