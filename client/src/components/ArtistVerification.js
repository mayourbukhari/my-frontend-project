import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Verified,
  CloudUpload,
  CheckCircle,
  Cancel,
  Schedule,
  Info,
  Upload,
  Close,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';

const ArtistVerification = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    artistName: '',
    realName: '',
    bio: '',
    experience: '',
    education: '',
    exhibitions: '',
    awards: '',
    socialProfiles: {
      website: '',
      instagram: '',
      twitter: '',
      facebook: '',
    },
    documents: []
  });
  
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch('/api/verification/status', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setVerificationStatus(data);
        if (data.formData) {
          setFormData(data.formData);
        }
      }
    } catch (error) {
      console.error('Error fetching verification status:', error);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const onDrop = (acceptedFiles) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10485760, // 10MB
  });

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (key === 'socialProfiles') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'documents') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append files
      uploadedFiles.forEach(file => {
        formDataToSend.append('documents', file);
      });

      const response = await fetch('/api/verification/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationStatus(data);
        setDialogOpen(true);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle color="success" />;
      case 'rejected':
        return <Cancel color="error" />;
      case 'pending':
        return <Schedule color="warning" />;
      default:
        return <Info color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  if (verificationStatus?.status === 'verified') {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Verified sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Verified Artist
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Your artist profile has been successfully verified!
          </Typography>
          <Chip
            icon={<Verified />}
            label="Verified Artist"
            color="success"
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Status Card */}
      {verificationStatus && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {getStatusIcon(verificationStatus.status)}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {verificationStatus.status === 'pending' ? 'Verification Pending' : 
                 verificationStatus.status === 'approved' ? 'Verified' : 
                 verificationStatus.status === 'rejected' ? 'Verification Rejected' : 'Unknown Status'}
              </Typography>
            </Box>
            
            <Alert 
              severity={getStatusColor(verificationStatus.status)}
              sx={{ mb: 2 }}
            >
              {verificationStatus.status === 'pending' ? 'Your verification request is being reviewed.' : 
               verificationStatus.status === 'approved' ? 'Congratulations! You are now a verified artist.' : 
               verificationStatus.status === 'rejected' ? 'Your verification request was rejected. Please review the feedback and resubmit.' : 'Status unknown'}
            </Alert>

            {verificationStatus.status === 'rejected' && verificationStatus.feedback && (
              <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Feedback
                </Typography>
                <Typography variant="body2">
                  {verificationStatus.feedback}
                </Typography>
              </Paper>
            )}

            {verificationStatus.submittedAt && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Submitted on: {new Date(verificationStatus.submittedAt).toLocaleDateString()}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* Verification Form */}
      {(!verificationStatus || verificationStatus.status === 'rejected') && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Artist Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Complete this form to get verified as a professional artist on our platform.
            </Typography>

            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Artist Name"
                  value={formData.artistName}
                  onChange={(e) => handleInputChange('artistName', e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Real Name"
                  value={formData.realName}
                  onChange={(e) => handleInputChange('realName', e.target.value)}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Artist Bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  required
                />
              </Grid>

              {/* Professional Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Professional Information
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    value={formData.experience}
                    label="Experience Level"
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                  >
                    <MenuItem value="beginner">Beginner (0-2 years)</MenuItem>
                    <MenuItem value="intermediate">Intermediate (3-5 years)</MenuItem>
                    <MenuItem value="advanced">Advanced (6-10 years)</MenuItem>
                    <MenuItem value="professional">Professional (10+ years)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Education & Training"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="List your art education, workshops, certifications..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Exhibitions & Shows"
                  value={formData.exhibitions}
                  onChange={(e) => handleInputChange('exhibitions', e.target.value)}
                  placeholder="List exhibitions, art shows, galleries where you've displayed work..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Awards & Recognition"
                  value={formData.awards}
                  onChange={(e) => handleInputChange('awards', e.target.value)}
                  placeholder="List any awards, competitions won, press mentions..."
                />
              </Grid>

              {/* Social Profiles */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Social Media & Online Presence
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Website/Portfolio"
                  value={formData.socialProfiles.website}
                  onChange={(e) => handleInputChange('socialProfiles.website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Instagram"
                  value={formData.socialProfiles.instagram}
                  onChange={(e) => handleInputChange('socialProfiles.instagram', e.target.value)}
                  placeholder="@yourusername"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Twitter"
                  value={formData.socialProfiles.twitter}
                  onChange={(e) => handleInputChange('socialProfiles.twitter', e.target.value)}
                  placeholder="@yourusername"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Facebook"
                  value={formData.socialProfiles.facebook}
                  onChange={(e) => handleInputChange('socialProfiles.facebook', e.target.value)}
                  placeholder="facebook.com/yourpage"
                />
              </Grid>

              {/* Document Upload */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Supporting Documents
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Upload certificates, press clippings, or other documentation to support your application.
                </Typography>

                <Paper
                  {...getRootProps()}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: 2,
                    borderStyle: 'dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.400',
                    bgcolor: isDragActive ? 'action.hover' : 'background.default',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    {isDragActive ? 'Drop files here' : 'Drag & drop files or click to select'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported formats: PDF, JPG, PNG, DOC, DOCX (max 10MB each)
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 2 }}>
                    Select Files
                  </Button>
                </Paper>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Uploaded Files
                    </Typography>
                    <List>
                      {uploadedFiles.map((file, index) => (
                        <ListItem
                          key={index}
                          secondaryAction={
                            <IconButton edge="end" onClick={() => removeFile(index)}>
                              <Close />
                            </IconButton>
                          }
                        >
                          <ListItemIcon>
                            <Upload />
                          </ListItemIcon>
                          <ListItemText
                            primary={file.name}
                            secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    disabled={loading || !formData.artistName || !formData.realName || !formData.bio}
                    startIcon={loading ? <CircularProgress size={20} /> : <Verified />}
                    sx={{ minWidth: 200 }}
                  >
                    {loading ? 'Submitting...' : 'Submit Verification'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Success Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
          <Typography variant="h5">
            Verification Submitted!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Your verification request has been submitted successfully. We'll review your application and get back to you soon.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can expect to hear from us within 3-5 business days.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => setDialogOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArtistVerification;
