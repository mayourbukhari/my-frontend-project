import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Avatar,
  Rating,
  IconButton,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Star as StarIcon,
  VideoCall as VideoCallIcon,
  Group as GroupIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MentorshipPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    level: 'all',
    format: 'all',
    priceMin: '',
    priceMax: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const categories = [
    'painting',
    'sculpture',
    'photography',
    'digital-art',
    'drawing',
    'mixed-media',
    'business',
    'marketing',
    'portfolio-development'
  ];

  const levels = ['beginner', 'intermediate', 'advanced'];
  const formats = ['one-on-one', 'group', 'workshop', 'online', 'in-person', 'hybrid'];

  useEffect(() => {
    fetchPrograms();
  }, [filters, pagination.currentPage]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        page: pagination.currentPage,
        limit: 12
      });

      const response = await axios.get(`/api/mentorships?${params}`);
      setPrograms(response.data.mentorships);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching mentorship programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      level: 'all',
      format: 'all',
      priceMin: '',
      priceMax: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'one-on-one':
        return <PersonIcon />;
      case 'group':
        return <GroupIcon />;
      case 'online':
        return <VideoCallIcon />;
      default:
        return <SchoolIcon />;
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  const ProgramCard = ({ program }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar
            src={program.mentor.profile.avatar}
            alt={program.mentor.profile.name}
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              {program.mentor.profile.name}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {program.mentor.verificationStatus === 'verified' && (
                <Chip
                  label="Verified"
                  color="primary"
                  size="small"
                  icon={<StarIcon />}
                />
              )}
              <Typography variant="body2" color="text.secondary">
                {program.mentor.profile.specialties?.slice(0, 2).join(', ')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {program.program.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {program.program.description.length > 120 
            ? `${program.program.description.substring(0, 120)}...`
            : program.program.description
          }
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          <Chip
            label={program.program.level}
            color={getLevelColor(program.program.level)}
            size="small"
          />
          <Chip
            label={`${program.program.duration} weeks`}
            icon={<ScheduleIcon />}
            variant="outlined"
            size="small"
          />
          <Chip
            label={program.program.format}
            icon={getFormatIcon(program.program.format)}
            variant="outlined"
            size="small"
          />
        </Box>

        <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
          {program.program.categories.slice(0, 3).map((category) => (
            <Chip
              key={category}
              label={category.replace('-', ' ')}
              variant="outlined"
              size="small"
            />
          ))}
          {program.program.categories.length > 3 && (
            <Chip
              label={`+${program.program.categories.length - 3} more`}
              variant="outlined"
              size="small"
            />
          )}
        </Box>

        {program.averageRating > 0 && (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Rating value={program.averageRating} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              ({program.averageRating.toFixed(1)})
            </Typography>
          </Box>
        )}
      </CardContent>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary">
            ${program.program.price}
          </Typography>
          <Button
            component={Link}
            to={`/mentorship/${program._id}`}
            variant="contained"
            size="small"
          >
            View Details
          </Button>
        </Box>
      </Box>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Artist Mentorship Programs
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Learn from experienced artists and grow your skills
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search programs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                label="Level"
              >
                <MenuItem value="all">All Levels</MenuItem>
                {levels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select
                value={filters.format}
                onChange={(e) => handleFilterChange('format', e.target.value)}
                label="Format"
              >
                <MenuItem value="all">All Formats</MenuItem>
                {formats.map((format) => (
                  <MenuItem key={format} value={format}>
                    {format.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                label="Min Price"
                type="number"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              />
              <TextField
                fullWidth
                label="Max Price"
                type="number"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              />
            </Box>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Button onClick={clearFilters} variant="outlined" size="small">
            Clear Filters
          </Button>
          
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              label="Sort By"
            >
              <MenuItem value="createdAt">Newest</MenuItem>
              <MenuItem value="program.price">Price</MenuItem>
              <MenuItem value="program.title">Title</MenuItem>
              <MenuItem value="averageRating">Rating</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Results Count */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="body1">
          {loading ? 'Loading...' : `${pagination.total} programs found`}
        </Typography>
      </Box>

      {/* Programs Grid */}
      <Grid container spacing={3}>
        {loading ? (
          // Loading skeletons
          Array.from({ length: 12 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: 400 }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={24} width="60%" />
                  <Box mt={2}>
                    <Skeleton variant="rectangular" height={32} width="40%" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : programs.length > 0 ? (
          programs.map((program) => (
            <Grid item xs={12} sm={6} md={4} key={program._id}>
              <ProgramCard program={program} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No mentorship programs found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search terms
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(event, page) => setPagination(prev => ({ ...prev, currentPage: page }))}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default MentorshipPrograms;
