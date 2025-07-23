import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Visibility,
  AttachMoney,
  People,
  Favorite,
} from '@mui/icons-material';

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalViews: 12450,
    totalSales: 15,
    totalRevenue: 3200,
    totalFollowers: 245,
    avgRating: 4.8,
    conversionRate: 2.3,
  },
  trends: {
    views: { value: 12450, change: 15.3, trend: 'up' },
    sales: { value: 15, change: -5.2, trend: 'down' },
    revenue: { value: 3200, change: 22.1, trend: 'up' },
    followers: { value: 245, change: 8.7, trend: 'up' },
  },
  topArtworks: [
    { id: 1, title: 'Sunset Dreams', views: 450, likes: 32, sales: 3, revenue: 600 },
    { id: 2, title: 'City Rhythm', views: 380, likes: 28, sales: 2, revenue: 300 },
    { id: 3, title: 'Nature\'s Call', views: 320, likes: 25, sales: 4, revenue: 720 },
    { id: 4, title: 'Abstract Mind', views: 290, likes: 22, sales: 1, revenue: 150 },
    { id: 5, title: 'Ocean Waves', views: 260, likes: 19, sales: 2, revenue: 360 },
  ],
  demographics: {
    ageGroups: [
      { range: '18-24', percentage: 15 },
      { range: '25-34', percentage: 35 },
      { range: '35-44', percentage: 28 },
      { range: '45-54', percentage: 15 },
      { range: '55+', percentage: 7 },
    ],
    locations: [
      { country: 'United States', percentage: 45 },
      { country: 'United Kingdom', percentage: 20 },
      { country: 'Canada', percentage: 12 },
      { country: 'Australia', percentage: 10 },
      { country: 'Others', percentage: 13 },
    ],
  },
};

const Analytics = () => {
  const { user } = useSelector((state) => state.auth);
  const [timeRange, setTimeRange] = useState('30days');

  const StatCard = ({ title, value, change, trend, icon, prefix = '', suffix = '' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </Typography>
            {change !== undefined && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend === 'up' ? (
                  <TrendingUp color="success" sx={{ mr: 0.5 }} />
                ) : (
                  <TrendingDown color="error" sx={{ mr: 0.5 }} />
                )}
                <Typography
                  variant="body2"
                  color={trend === 'up' ? 'success.main' : 'error.main'}
                >
                  {Math.abs(change).toFixed(1)}% vs last period
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (user?.role !== 'artist') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Analytics are only available for artists. Register as an artist to access detailed performance metrics.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" component="h1">
          Analytics Dashboard
        </Typography>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Time Range"
          >
            <MenuItem value="7days">Last 7 Days</MenuItem>
            <MenuItem value="30days">Last 30 Days</MenuItem>
            <MenuItem value="90days">Last 3 Months</MenuItem>
            <MenuItem value="1year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overview Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Views"
            value={mockAnalytics.trends.views.value}
            change={mockAnalytics.trends.views.change}
            trend={mockAnalytics.trends.views.trend}
            icon={<Visibility fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value={mockAnalytics.trends.sales.value}
            change={mockAnalytics.trends.sales.change}
            trend={mockAnalytics.trends.sales.trend}
            icon={<AttachMoney fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value={mockAnalytics.trends.revenue.value}
            change={mockAnalytics.trends.revenue.change}
            trend={mockAnalytics.trends.revenue.trend}
            prefix="$"
            icon={<AttachMoney fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Followers"
            value={mockAnalytics.trends.followers.value}
            change={mockAnalytics.trends.followers.change}
            trend={mockAnalytics.trends.followers.trend}
            icon={<People fontSize="large" />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top Performing Artworks */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Artworks
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Artwork</TableCell>
                      <TableCell align="right">Views</TableCell>
                      <TableCell align="right">Likes</TableCell>
                      <TableCell align="right">Sales</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockAnalytics.topArtworks.map((artwork, index) => (
                      <TableRow key={artwork.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Chip
                              label={index + 1}
                              size="small"
                              color="primary"
                              sx={{ mr: 1, minWidth: 24 }}
                            />
                            {artwork.title}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{artwork.views.toLocaleString()}</TableCell>
                        <TableCell align="right">{artwork.likes}</TableCell>
                        <TableCell align="right">{artwork.sales}</TableCell>
                        <TableCell align="right">${artwork.revenue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="body2" color="textSecondary">
                      Average Rating
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {mockAnalytics.overview.avgRating}/5.0
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Conversion Rate
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {mockAnalytics.overview.conversionRate}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Audience Demographics
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Top Age Groups
                  </Typography>
                  {mockAnalytics.demographics.ageGroups.slice(0, 3).map((group, index) => (
                    <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{group.range}</Typography>
                      <Typography variant="body2" color="primary">
                        {group.percentage}%
                      </Typography>
                    </Box>
                  ))}
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Top Locations
                  </Typography>
                  {mockAnalytics.demographics.locations.slice(0, 3).map((location, index) => (
                    <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">{location.country}</Typography>
                      <Typography variant="body2" color="primary">
                        {location.percentage}%
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Chart Placeholder */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Performance Trends
          </Typography>
          <Box
            sx={{
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.50',
              borderRadius: 1,
            }}
          >
            <Typography variant="body1" color="textSecondary">
              Interactive charts will be displayed here
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Analytics;
