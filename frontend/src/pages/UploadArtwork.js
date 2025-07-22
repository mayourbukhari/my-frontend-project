import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload,
  Publish,
  Delete,
  AddPhotoAlternate,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { createArtwork, fetchArtworks } from '../store/artworkSlice';
import toast from 'react-hot-toast';

const steps = ['Basic Information', 'Artwork Details', 'Pricing & Availability', 'Preview & Upload'];

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
  'Oil Paint',
  'Acrylic Paint',
  'Watercolor',
  'Digital',
  'Pencil',
  'Charcoal',
  'Ink',
  'Mixed Media',
  'Photography',
  'Sculpture',
];

const UploadArtwork = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [artworkData, setArtworkData] = useState({
    title: '',
    description: '',
    category: '',
    medium: '',
    dimensions: {
      width: '',
      height: '',
      depth: '',
    },
    price: '',
    isForSale: true,
    isCommissionable: false,
    tags: [],
    images: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // File handling functions
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    // Validate file count
    if (selectedFiles.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Add files to state
    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreviews(prev => [...prev, {
          file: file,
          url: e.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitArtwork = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    if (!artworkData.title.trim()) {
      toast.error('Please enter an artwork title');
      return;
    }

    if (!artworkData.description.trim() || artworkData.description.trim().length < 10) {
      toast.error('Please enter a description of at least 10 characters');
      return;
    }

    if (!artworkData.category) {
      toast.error('Please select a category');
      return;
    }

    if (artworkData.isForSale && (!artworkData.price || artworkData.price <= 0)) {
      toast.error('Please enter a valid price for artwork marked for sale');
      return;
    }

    setUploading(true);

    try {
      const uploadData = {
        ...artworkData,
        images: selectedFiles,
        // Ensure price is always a number
        price: artworkData.isForSale ? Number(artworkData.price) : 0,
        // Set availability based on isForSale
        availability: artworkData.isForSale ? 'available' : 'not-for-sale',
        // Ensure status and isPublic are set correctly
        status: 'published',
        isPublic: true,
        // Format dimensions as numbers
        dimensions: {
          width: artworkData.dimensions.width ? Number(artworkData.dimensions.width) : undefined,
          height: artworkData.dimensions.height ? Number(artworkData.dimensions.height) : undefined,
          depth: artworkData.dimensions.depth ? Number(artworkData.dimensions.depth) : undefined,
        }
      };

      console.log('Upload data being sent:', uploadData);

      // Use Redux action to create artwork and update state
      const resultAction = await dispatch(createArtwork(uploadData));
      
      if (createArtwork.fulfilled.match(resultAction)) {
        toast.success('Artwork uploaded successfully!');
        
        // Refresh the artworks list to include the new artwork
        dispatch(fetchArtworks({}));
        
        // Reset form
        setArtworkData({
          title: '',
          description: '',
          category: '',
          medium: '',
          dimensions: {
            width: '',
            height: '',
            depth: ''
          },
          price: '',
          isForSale: true,
          isCommissionable: false,
          tags: [],
          images: [],
        });
        setSelectedFiles([]);
        setFilePreviews([]);
        setActiveStep(0);
        
        // Navigate to gallery to see the uploaded artwork
        setTimeout(() => {
          navigate('/gallery');
        }, 1000);
      } else {
        throw new Error(resultAction.error?.message || 'Upload failed');
      }
      
    } catch (error) {
      console.error('Upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error
      });
      
      // Extract meaningful error message
      let errorMessage = 'Failed to upload artwork';
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Handle validation errors
        const validationErrors = error.response.data.errors.map(err => err.msg || err.message).join(', ');
        errorMessage = `Validation errors: ${validationErrors}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setArtworkData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setArtworkData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleTagAdd = (tag) => {
    if (tag && !artworkData.tags.includes(tag)) {
      setArtworkData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setArtworkData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Artwork Title"
                value={artworkData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={artworkData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your artwork, inspiration, techniques used..."
                required
                helperText="Minimum 10 characters required"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={artworkData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Medium</InputLabel>
                <Select
                  value={artworkData.medium}
                  onChange={(e) => handleInputChange('medium', e.target.value)}
                  label="Medium"
                >
                  {mediums.map((medium) => (
                    <MenuItem key={medium} value={medium}>
                      {medium}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Dimensions
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Width (cm)"
                type="number"
                value={artworkData.dimensions.width}
                onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                value={artworkData.dimensions.height}
                onChange={(e) => handleInputChange('dimensions.height', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Depth (cm)"
                type="number"
                value={artworkData.dimensions.depth}
                onChange={(e) => handleInputChange('dimensions.depth', e.target.value)}
                placeholder="Optional"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {artworkData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleTagRemove(tag)}
                    color="primary"
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                label="Add Tags"
                placeholder="Press Enter to add tags (e.g., modern, colorful, nature)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleTagAdd(e.target.value.trim());
                    e.target.value = '';
                  }
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={artworkData.isForSale}
                    onChange={(e) => handleInputChange('isForSale', e.target.checked)}
                  />
                }
                label="Available for Sale"
              />
            </Grid>
            {artworkData.isForSale && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price ($)"
                  type="number"
                  value={artworkData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={artworkData.isCommissionable}
                    onChange={(e) => handleInputChange('isCommissionable', e.target.checked)}
                  />
                }
                label="Accept Similar Commissions"
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  • Platform fee: 10% of sale price
                  • You'll receive: ${artworkData.price ? (artworkData.price * 0.9).toFixed(2) : '0.00'}
                  • Payment processed within 2-3 business days after delivery confirmation
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Artwork Preview
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    {/* File Upload Area */}
                    <Box
                      sx={{
                        border: `2px dashed ${selectedFiles.length > 0 ? '#1976d2' : '#ccc'}`,
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        minHeight: 200,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: selectedFiles.length > 0 ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                        '&:hover': {
                          borderColor: '#1976d2',
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        }
                      }}
                      onClick={handleUploadClick}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                      />
                      
                      {selectedFiles.length === 0 ? (
                        <>
                          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="body1" color="textSecondary" gutterBottom>
                            Click to upload or drag and drop images
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Max 5 images, JPG/PNG, up to 10MB each
                          </Typography>
                          <Button
                            variant="outlined"
                            startIcon={<AddPhotoAlternate />}
                            sx={{ mt: 2 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUploadClick();
                            }}
                          >
                            Select Images
                          </Button>
                        </>
                      ) : (
                        <Box>
                          <Typography variant="body1" color="primary" gutterBottom>
                            {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} selected
                          </Typography>
                          <Button
                            variant="outlined"
                            startIcon={<AddPhotoAlternate />}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUploadClick();
                            }}
                          >
                            Add More
                          </Button>
                        </Box>
                      )}
                    </Box>

                    {/* Image Previews */}
                    {filePreviews.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Selected Images:
                        </Typography>
                        <Grid container spacing={1}>
                          {filePreviews.map((preview, index) => (
                            <Grid item xs={6} sm={4} key={index}>
                              <Box
                                sx={{
                                  position: 'relative',
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  aspectRatio: '1',
                                }}
                              >
                                <img
                                  src={preview.url}
                                  alt={`Preview ${index + 1}`}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    color: 'white',
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                    }
                                  }}
                                  onClick={() => handleRemoveFile(index)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>{artworkData.title || 'Untitled'}</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      by {user?.artistProfile?.name || user?.profile?.firstName + ' ' + user?.profile?.lastName}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {artworkData.description || 'No description provided'}
                    </Typography>
                    <Box display="flex" gap={1} mb={1}>
                      {artworkData.category && <Chip label={artworkData.category} size="small" />}
                      {artworkData.medium && <Chip label={artworkData.medium} size="small" />}
                    </Box>
                    {artworkData.dimensions.width && artworkData.dimensions.height && (
                      <Typography variant="body2" color="textSecondary">
                        {artworkData.dimensions.width} × {artworkData.dimensions.height}
                        {artworkData.dimensions.depth && ` × ${artworkData.dimensions.depth}`} cm
                      </Typography>
                    )}
                    {artworkData.isForSale && artworkData.price && (
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        ${artworkData.price}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return 'Unknown step';
    }
  };

  if (user?.role !== 'artist') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Only verified artists can upload artworks. 
          <Link to="/register"> Register as an artist</Link> to start showcasing your work.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Upload New Artwork
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {renderStepContent(activeStep)}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmitArtwork}
              startIcon={uploading ? <CircularProgress size={20} /> : <Publish />}
              disabled={uploading || selectedFiles.length === 0}
              size="large"
            >
              {uploading ? 'Uploading...' : 'Upload Artwork'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default UploadArtwork;
