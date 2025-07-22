import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  Tab,
  Tabs,
  Badge,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  Favorite,
  Palette,
  AttachMoney,
  Visibility,
  MoreVert,
  Add,
  Edit,
  Analytics,
  Star,
  School,
  Verified,
  Notifications,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

// Sample data - in real app, this would come from API
const mockStats = {
  user: {
    totalPurchases: 12,
    totalSpent: 2450,
    wishlistItems: 8,
    recentOrders: [
      { id: 1, title: 'Abstract Sunset', artist: 'John Doe', price: 150, date: '2024-01-15', status: 'delivered' },
      { id: 2, title: 'City Lights', artist: 'Jane Smith', price: 200, date: '2024-01-10', status: 'shipped' },
      { id: 3, title: 'Ocean Waves', artist: 'Bob Wilson', price: 180, date: '2024-01-05', status: 'processing' },
    ],
    recommendations: [
      { id: 1, title: 'Mountain View', artist: 'Alice Brown', price: 120, image: '/api/placeholder/150/150' },
      { id: 2, title: 'Forest Path', artist: 'Tom Green', price: 95, image: '/api/placeholder/150/150' },
    ]
  },
  artist: {
    totalSales: 15,
    totalRevenue: 3200,
    totalViews: 1250,
    averageRating: 4.8,
    recentSales: [
      { id: 1, title: 'Modern Abstract', buyer: 'Sarah Johnson', price: 250, date: '2024-01-16', commission: 225 },
      { id: 2, title: 'Landscape Series #3', buyer: 'Mike Davis', price: 180, date: '2024-01-14', commission: 162 },
      { id: 3, title: 'Portrait Study', buyer: 'Emma Wilson', price: 120, date: '2024-01-12', commission: 108 },
    ],
    topArtworks: [
      { id: 1, title: 'Sunset Dreams', views: 450, likes: 32, price: 200 },
      { id: 2, title: 'City Rhythm', views: 380, likes: 28, price: 150 },
      { id: 3, title: 'Nature\'s Call', views: 320, likes: 25, price: 180 },
    ],
    pendingCommissions: 3,
    activeMentorships: 5,
  }
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const isArtist = user?.role === 'artist';
  const stats = isArtist ? mockStats.artist : mockStats.user;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4" component="h2" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main` }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const UserDashboard = () => (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Purchases"
            value={stats.totalPurchases}
            icon={<ShoppingCart />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Spent"
            value={`$${stats.totalSpent}`}
            icon={<AttachMoney />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Wishlist Items"
            value={stats.wishlistItems}
            icon={<Favorite />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Orders"
            value={stats.recentOrders.filter(o => o.status !== 'delivered').length}
            icon={<Visibility />}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <List>
                {stats.recentOrders.map((order, index) => (
                  <React.Fragment key={order.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Palette />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={order.title}
                        secondary={`by ${order.artist} • ${order.date}`}
                      />
                      <Box textAlign="right">
                        <Typography variant="h6">${order.price}</Typography>
                        <Chip
                          label={order.status}
                          size="small"
                          color={
                            order.status === 'delivered'
                              ? 'success'
                              : order.status === 'shipped'
                              ? 'primary'
                              : 'warning'
                          }
                        />
                      </Box>
                    </ListItem>
                    {index < stats.recentOrders.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <CardActions>
                <Button component={Link} to="/orders" fullWidth>
                  View All Orders
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recommended for You
              </Typography>
              <List dense>
                {stats.recommendations.map((artwork) => (
                  <ListItem key={artwork.id} button onClick={() => navigate(`/artwork/${artwork.id}`)}>
                    <ListItemAvatar>
                      <Avatar variant="square" src={artwork.image}>
                        <Palette />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={artwork.title}
                      secondary={`by ${artwork.artist} • $${artwork.price}`}
                    />
                  </ListItem>
                ))}
              </List>
              <CardActions>
                <Button component={Link} to="/gallery" fullWidth>
                  Browse Gallery
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  const ArtistDashboard = () => (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value={stats.totalSales}
            icon={<TrendingUp />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value={`$${stats.totalRevenue}`}
            icon={<AttachMoney />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Profile Views"
            value={stats.totalViews}
            icon={<Visibility />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rating"
            value={stats.averageRating}
            icon={<Star />}
            color="warning"
            subtitle="Average rating"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="artist dashboard tabs">
          <Tab label="Recent Sales" />
          <Tab label="Top Artworks" />
          <Tab label={`Commissions ${stats.pendingCommissions > 0 ? `(${stats.pendingCommissions})` : ''}`} />
          <Tab label={`Mentorships ${stats.activeMentorships > 0 ? `(${stats.activeMentorships})` : ''}`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Sales
              </Typography>
              <List>
                {stats.recentSales.map((sale, index) => (
                  <React.Fragment key={sale.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <AttachMoney />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={sale.title}
                        secondary={`Sold to ${sale.buyer} • ${sale.date}`}
                      />
                      <Box textAlign="right">
                        <Typography variant="h6">${sale.price}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Commission: ${sale.commission}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < stats.recentSales.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Artworks
              </Typography>
              <List>
                {stats.topArtworks.map((artwork, index) => (
                  <React.Fragment key={artwork.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Palette />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={artwork.title}
                        secondary={`${artwork.views} views • ${artwork.likes} likes`}
                      />
                      <Box textAlign="right">
                        <Typography variant="h6">${artwork.price}</Typography>
                        <IconButton onClick={handleMenuClick}>
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < stats.topArtworks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Commission Requests
                </Typography>
                <Badge badgeContent={stats.pendingCommissions} color="primary">
                  <Notifications />
                </Badge>
              </Box>
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                You have {stats.pendingCommissions} pending commission requests
              </Typography>
              <Button component={Link} to="/commissions" fullWidth variant="contained">
                Manage Commissions
              </Button>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Active Mentorships
                </Typography>
                <Badge badgeContent={stats.activeMentorships} color="primary">
                  <School />
                </Badge>
              </Box>
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                You are currently mentoring {stats.activeMentorships} students
              </Typography>
              <Button component={Link} to="/mentorships" fullWidth variant="contained">
                Manage Mentorships
              </Button>
            </CardContent>
          </Card>
        </TabPanel>
      </Box>
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            {isArtist ? 'Artist Dashboard' : 'My Dashboard'}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Welcome back, {user?.profile?.firstName || user?.email}!
          </Typography>
        </Box>
        <Box>
          {isArtist && (
            <>
              <Button
                component={Link}
                to="/upload-artwork"
                variant="contained"
                startIcon={<Add />}
                sx={{ mr: 1 }}
              >
                Upload Artwork
              </Button>
              <Button
                component={Link}
                to="/artist-profile"
                variant="outlined"
                startIcon={<Edit />}
              >
                Edit Profile
              </Button>
            </>
          )}
          {!isArtist && (
            <Button
              component={Link}
              to="/gallery"
              variant="contained"
              startIcon={<Palette />}
            >
              Browse Gallery
            </Button>
          )}
        </Box>
      </Box>

      {/* Dashboard Content */}
      {isArtist ? <ArtistDashboard /> : <UserDashboard />}

      {/* Quick Actions */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {isArtist ? (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/analytics"
                  fullWidth
                  variant="outlined"
                  startIcon={<Analytics />}
                >
                  View Analytics
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/verification"
                  fullWidth
                  variant="outlined"
                  startIcon={<Verified />}
                >
                  Get Verified
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/mentorship-setup"
                  fullWidth
                  variant="outlined"
                  startIcon={<School />}
                >
                  Setup Mentorship
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/nft-marketplace"
                  fullWidth
                  variant="outlined"
                  startIcon={<TrendingUp />}
                >
                  Create NFT
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/wishlist"
                  fullWidth
                  variant="outlined"
                  startIcon={<Favorite />}
                >
                  My Wishlist
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/orders"
                  fullWidth
                  variant="outlined"
                  startIcon={<ShoppingCart />}
                >
                  Order History
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  component={Link}
                  to="/mentorship-programs"
                  fullWidth
                  variant="outlined"
                  startIcon={<School />}
                >
                  Find Mentors
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Edit Artwork</MenuItem>
        <MenuItem onClick={handleMenuClose}>View Analytics</MenuItem>
        <MenuItem onClick={handleMenuClose}>Promote</MenuItem>
        <MenuItem onClick={handleMenuClose}>Archive</MenuItem>
      </Menu>
    </Container>
  );
};

export default Dashboard;
