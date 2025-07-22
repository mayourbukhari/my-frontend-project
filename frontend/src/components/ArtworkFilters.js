import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  FilterList,
  Clear,
  Search,
  ExpandMore,
} from '@mui/icons-material';

const FilterPanel = ({ filters, onFilterChange, onClearFilters, isMobile }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 10000]);

  const categories = [
    'painting',
    'sculpture',
    'photography',
    'drawing',
    'printmaking',
    'digital',
    'mixed-media',
    'textile',
    'ceramics',
    'jewelry',
    'other'
  ];

  const mediums = [
    'oil',
    'acrylic',
    'watercolor',
    'pencil',
    'charcoal',
    'ink',
    'pastel',
    'digital',
    'mixed',
    'bronze',
    'marble',
    'wood',
    'clay',
    'other'
  ];

  const styles = [
    'abstract',
    'realistic',
    'impressionist',
    'expressionist',
    'contemporary',
    'traditional',
    'modern',
    'surreal',
    'minimalist',
    'pop-art'
  ];

  const orientations = ['portrait', 'landscape', 'square'];

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayFilterChange = (key, value, checked) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: checked 
        ? [...(prev[key] || []), value]
        : (prev[key] || []).filter(item => item !== value)
    }));
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setLocalFilters(prev => ({
      ...prev,
      minPrice: newValue[0],
      maxPrice: newValue[1]
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      category: [],
      medium: [],
      style: [],
      orientation: [],
      minPrice: 0,
      maxPrice: 10000,
      sortBy: 'newest'
    };
    setLocalFilters(emptyFilters);
    setPriceRange([0, 10000]);
    onClearFilters();
  };

  const FilterContent = () => (
    <Box sx={{ p: 2 }}>
      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search artworks..."
          value={localFilters.search || ''}
          onChange={(e) => handleLocalFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Price Range */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Price Range
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={50}
              valueLabelFormat={(value) => `$${value}`}
              marks={[
                { value: 0, label: '$0' },
                { value: 2500, label: '$2.5K' },
                { value: 5000, label: '$5K' },
                { value: 10000, label: '$10K+' },
              ]}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <TextField
                size="small"
                label="Min"
                type="number"
                value={priceRange[0]}
                onChange={(e) => {
                  const newMin = Math.max(0, parseInt(e.target.value) || 0);
                  const newRange = [newMin, Math.max(newMin, priceRange[1])];
                  setPriceRange(newRange);
                  handlePriceChange(null, newRange);
                }}
                sx={{ width: '45%' }}
              />
              <TextField
                size="small"
                label="Max"
                type="number"
                value={priceRange[1]}
                onChange={(e) => {
                  const newMax = Math.max(priceRange[0], parseInt(e.target.value) || 10000);
                  const newRange = [priceRange[0], newMax];
                  setPriceRange(newRange);
                  handlePriceChange(null, newRange);
                }}
                sx={{ width: '45%' }}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Categories */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Categories
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={(localFilters.category || []).includes(category)}
                    onChange={(e) => handleArrayFilterChange('category', category, e.target.checked)}
                    size="small"
                  />
                }
                label={category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Medium */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Medium
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {mediums.map((medium) => (
              <FormControlLabel
                key={medium}
                control={
                  <Checkbox
                    checked={(localFilters.medium || []).includes(medium)}
                    onChange={(e) => handleArrayFilterChange('medium', medium, e.target.checked)}
                    size="small"
                  />
                }
                label={medium.charAt(0).toUpperCase() + medium.slice(1)}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Style */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Style
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {styles.map((style) => (
              <FormControlLabel
                key={style}
                control={
                  <Checkbox
                    checked={(localFilters.style || []).includes(style)}
                    onChange={(e) => handleArrayFilterChange('style', style, e.target.checked)}
                    size="small"
                  />
                }
                label={style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Orientation */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2" fontWeight={600}>
            Orientation
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {orientations.map((orientation) => (
              <FormControlLabel
                key={orientation}
                control={
                  <Checkbox
                    checked={(localFilters.orientation || []).includes(orientation)}
                    onChange={(e) => handleArrayFilterChange('orientation', orientation, e.target.checked)}
                    size="small"
                  />
                }
                label={orientation.charAt(0).toUpperCase() + orientation.slice(1)}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Sort By */}
      <Box sx={{ mt: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={localFilters.sortBy || 'newest'}
            onChange={(e) => handleLocalFilterChange('sortBy', e.target.value)}
            label="Sort By"
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="priceAsc">Price: Low to High</MenuItem>
            <MenuItem value="priceDesc">Price: High to Low</MenuItem>
            <MenuItem value="titleAsc">Title: A to Z</MenuItem>
            <MenuItem value="titleDesc">Title: Z to A</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
        <Button
          variant="outlined"
          onClick={clearFilters}
          startIcon={<Clear />}
        >
          Clear
        </Button>
      </Box>

      {/* Active Filters */}
      {Object.values(localFilters).some(value => 
        (Array.isArray(value) && value.length > 0) || 
        (typeof value === 'string' && value !== '') ||
        (typeof value === 'number' && value !== 0 && value !== 10000)
      ) && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {localFilters.search && (
              <Chip
                label={`Search: ${localFilters.search}`}
                size="small"
                onDelete={() => handleLocalFilterChange('search', '')}
              />
            )}
            {(localFilters.category || []).map(cat => (
              <Chip
                key={cat}
                label={cat}
                size="small"
                onDelete={() => handleArrayFilterChange('category', cat, false)}
              />
            ))}
            {(localFilters.medium || []).map(med => (
              <Chip
                key={med}
                label={med}
                size="small"
                onDelete={() => handleArrayFilterChange('medium', med, false)}
              />
            ))}
            {(localFilters.style || []).map(sty => (
              <Chip
                key={sty}
                label={sty}
                size="small"
                onDelete={() => handleArrayFilterChange('style', sty, false)}
              />
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 10000) && (
              <Chip
                label={`$${priceRange[0]} - $${priceRange[1]}`}
                size="small"
                onDelete={() => {
                  setPriceRange([0, 10000]);
                  handlePriceChange(null, [0, 10000]);
                }}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return FilterContent();
  }

  return (
    <Paper sx={{ height: 'fit-content', position: 'sticky', top: 24 }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={600}>
          Filters
        </Typography>
      </Box>
      <FilterContent />
    </Paper>
  );
};

const ArtworkFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!isMobile) {
    return (
      <FilterPanel
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        isMobile={false}
      />
    );
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setDrawerOpen(true)}
          fullWidth
        >
          Filters & Sort
        </Button>
      </Box>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { maxHeight: '80vh', borderRadius: '16px 16px 0 0' }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Filters & Sort
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Clear />
          </IconButton>
        </Box>
        <FilterPanel
          filters={filters}
          onFilterChange={(newFilters) => {
            onFilterChange(newFilters);
            setDrawerOpen(false);
          }}
          onClearFilters={() => {
            onClearFilters();
            setDrawerOpen(false);
          }}
          isMobile={true}
        />
      </Drawer>
    </>
  );
};

export default ArtworkFilters;
