import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Menu as MenuIcon,
  Palette,
  Home,
  PhotoLibrary,
  Dashboard,
  Logout,
  Close,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart || { items: [] });
  const { toggleTheme, isDark } = useCustomTheme();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/');
  };

  const navigationItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Gallery', path: '/gallery', icon: <PhotoLibrary /> },
    ...(user ? [
      { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> }
    ] : [])
  ];

  const isMenuOpen = Boolean(anchorEl);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 2,
          mt: 1,
          minWidth: 180,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
        <ListItemIcon><Dashboard fontSize="small" /></ListItemIcon>
        Dashboard
      </MenuItem>
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
        <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileDrawer = (
    <Drawer
      anchor="right"
      open={mobileOpen}
      onClose={handleMobileMenuToggle}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">Menu</Typography>
          <IconButton onClick={handleMobileMenuToggle}>
            <Close />
          </IconButton>
        </Box>
        
        <List>
          {navigationItems.map((item) => (
            <ListItem 
              button 
              key={item.label}
              component={Link}
              to={item.path}
              onClick={handleMobileMenuToggle}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          {user ? (
            <>
              <Box sx={{ mb: 2, p: 2, backgroundColor: 'primary.50', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">Signed in as</Typography>
                <Typography variant="subtitle1" fontWeight="bold">{user.name}</Typography>
              </Box>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{ borderRadius: 2 }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                component={Link}
                to="/login"
                onClick={handleMobileMenuToggle}
                sx={{ borderRadius: 2 }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                to="/register"
                onClick={handleMobileMenuToggle}
                sx={{ borderRadius: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: 4
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <Palette sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Artist Marketplace
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'primary.50'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle */}
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: 'text.primary',
                '&:hover': { backgroundColor: 'primary.50' }
              }}
            >
              {isDark ? <LightMode /> : <DarkMode />}
            </IconButton>

            {/* Cart */}
            <IconButton
              component={Link}
              to="/cart"
              sx={{
                color: 'text.primary',
                '&:hover': { backgroundColor: 'primary.50' }
              }}
            >
              <Badge badgeContent={cartItemCount} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* User Menu */}
            {!isMobile && (
              <>
                {user ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={user.name}
                      avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{user.name?.[0]}</Avatar>}
                      onClick={handleProfileMenuOpen}
                      sx={{
                        '&:hover': { backgroundColor: 'primary.50' }
                      }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      component={Link}
                      to="/login"
                      variant="text"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        color: 'text.primary'
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                        }
                      }}
                    >
                      Sign Up
                    </Button>
                  </Box>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="end"
                onClick={handleMobileMenuToggle}
                sx={{
                  color: 'text.primary',
                  '&:hover': { backgroundColor: 'primary.50' }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {renderMenu}
      {mobileDrawer}
    </>
  );
};

export default Navigation;
