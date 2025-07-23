import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Verified,
  CheckCircle,
  Upload,
  Person,
  School,
  WorkOutline,
  Star,
  CloudUpload,
  Description,
  Assignment,
} from '@mui/icons-material';

const steps = ['Personal Information', 'Professional Background', 'Portfolio Review', 'Documentation', 'Review & Submit'];

const verificationBenefits = [
  'Verified badge on your profile',
  'Higher search ranking',
  'Access to premium features',
  'Commission priority',
  'Mentorship program eligibility',
  'NFT marketplace access',
  'Promotional opportunities',
  'Professional networking events',
];

const ArtistVerification = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [verificationData, setVerificationData] = useState({
    personalInfo: {
      fullName: '',
      artistName: '',
      phoneNumber: '',
      address: '',
      city: '',
      country: '',
      website: '',
      socialMedia: {
        instagram: '',
        twitter: '',
        facebook: '',
      },
    },
    professional: {
      yearsOfExperience: '',
      primaryMedium: '',
      artStyle: [],
      education: '',
      exhibitions: '',
      awards: '',
      publications: '',
    },
    portfolio: {
      selectedWorks: [],
      artistStatement: '',
      influences: '',
    },
    documentation: {
      identityProof: null,
      artworkProofs: [],
      certificates: [],
      references: '',
    },
  });

  const artStyles = [
    'Abstract', 'Realism', 'Impressionism', 'Expressionism', 'Cubism', 
    'Surrealism', 'Pop Art', 'Contemporary', 'Digital Art', 'Mixed Media'
  ];

  const mediums = [
    'Oil Paint', 'Acrylic Paint', 'Watercolor', 'Digital', 'Pencil', 
    'Charcoal', 'Ink', 'Photography', 'Sculpture', 'Mixed Media'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (section, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setVerificationData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [parent]: {
            ...prev[section][parent],
            [child]: value,
          },
        },
      }));
    } else {
      setVerificationData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Legal Name"
                value={verificationData.personalInfo.fullName}
                onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Artist/Professional Name"
                value={verificationData.personalInfo.artistName}
                onChange={(e) => handleInputChange('personalInfo', 'artistName', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={verificationData.personalInfo.phoneNumber}
                onChange={(e) => handleInputChange('personalInfo', 'phoneNumber', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website/Portfolio URL"
                value={verificationData.personalInfo.website}
                onChange={(e) => handleInputChange('personalInfo', 'website', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={verificationData.personalInfo.address}
                onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                value={verificationData.personalInfo.city}
                onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Country"
                value={verificationData.personalInfo.country}
                onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Social Media Profiles
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Instagram"
                value={verificationData.personalInfo.socialMedia.instagram}
                onChange={(e) => handleInputChange('personalInfo', 'socialMedia.instagram', e.target.value)}
                placeholder="@username"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Twitter"
                value={verificationData.personalInfo.socialMedia.twitter}
                onChange={(e) => handleInputChange('personalInfo', 'socialMedia.twitter', e.target.value)}
                placeholder="@username"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Facebook"
                value={verificationData.personalInfo.socialMedia.facebook}
                onChange={(e) => handleInputChange('personalInfo', 'socialMedia.facebook', e.target.value)}
                placeholder="Profile URL"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Years of Experience</InputLabel>
                <Select
                  value={verificationData.professional.yearsOfExperience}
                  onChange={(e) => handleInputChange('professional', 'yearsOfExperience', e.target.value)}
                  label="Years of Experience"
                >
                  <MenuItem value="1-2">1-2 years</MenuItem>
                  <MenuItem value="3-5">3-5 years</MenuItem>
                  <MenuItem value="6-10">6-10 years</MenuItem>
                  <MenuItem value="11-15">11-15 years</MenuItem>
                  <MenuItem value="15+">15+ years</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Primary Medium</InputLabel>
                <Select
                  value={verificationData.professional.primaryMedium}
                  onChange={(e) => handleInputChange('professional', 'primaryMedium', e.target.value)}
                  label="Primary Medium"
                >
                  {mediums.map((medium) => (
                    <MenuItem key={medium} value={medium}>
                      {medium}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Art Styles (Select all that apply)
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {artStyles.map((style) => (
                  <Chip
                    key={style}
                    label={style}
                    clickable
                    color={verificationData.professional.artStyle.includes(style) ? 'primary' : 'default'}
                    onClick={() => {
                      const currentStyles = verificationData.professional.artStyle;
                      const newStyles = currentStyles.includes(style)
                        ? currentStyles.filter(s => s !== style)
                        : [...currentStyles, style];
                      handleInputChange('professional', 'artStyle', newStyles);
                    }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Education & Training"
                value={verificationData.professional.education}
                onChange={(e) => handleInputChange('professional', 'education', e.target.value)}
                placeholder="Art schools, workshops, degrees, certifications..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Exhibitions & Shows"
                value={verificationData.professional.exhibitions}
                onChange={(e) => handleInputChange('professional', 'exhibitions', e.target.value)}
                placeholder="List your exhibitions, art shows, gallery displays..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Awards & Recognition"
                value={verificationData.professional.awards}
                onChange={(e) => handleInputChange('professional', 'awards', e.target.value)}
                placeholder="Art competitions, grants, awards, honors..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Publications & Media"
                value={verificationData.professional.publications}
                onChange={(e) => handleInputChange('professional', 'publications', e.target.value)}
                placeholder="Art magazines, newspapers, online features..."
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Select 5-10 of your best artworks from your existing portfolio. These will be reviewed by our verification team.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Artist Statement"
                value={verificationData.portfolio.artistStatement}
                onChange={(e) => handleInputChange('portfolio', 'artistStatement', e.target.value)}
                placeholder="Describe your artistic vision, philosophy, and what drives your creativity..."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Artistic Influences"
                value={verificationData.portfolio.influences}
                onChange={(e) => handleInputChange('portfolio', 'influences', e.target.value)}
                placeholder="Artists, movements, or experiences that have influenced your work..."
              />
            </Grid>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'primary.main',
                  backgroundColor: 'background.default',
                }}
              >
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Select Portfolio Artworks
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Choose your best works that represent your artistic skills and style
                </Typography>
                <Button variant="contained" startIcon={<Upload />}>
                  Browse Your Artworks
                </Button>
              </Paper>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="warning" sx={{ mb: 3 }}>
                Please upload clear, high-quality images of the required documents. All information will be kept confidential.
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Person sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Identity Verification
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Government-issued ID (passport, driver's license)
                </Typography>
                <Button variant="outlined" startIcon={<Upload />}>
                  Upload ID Document
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Artwork Authenticity
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Photos of you creating artwork or certificates
                </Typography>
                <Button variant="outlined" startIcon={<Upload />}>
                  Upload Proof
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <School sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Credentials
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Diplomas, certificates, workshop completions
                </Typography>
                <Button variant="outlined" startIcon={<Upload />}>
                  Upload Certificates
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Star sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Professional References
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Contact info for galleries, collectors, or peers
                </Typography>
                <Button variant="outlined" startIcon={<Description />}>
                  Add References
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Professional References"
                value={verificationData.documentation.references}
                onChange={(e) => handleInputChange('documentation', 'references', e.target.value)}
                placeholder="Name, title, contact information of professional references..."
              />
            </Grid>
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Review your application before submitting. Our verification team will review your application within 5-7 business days.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Application Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Artist Name:</Typography>
                    <Typography variant="body1" gutterBottom>
                      {verificationData.personalInfo.artistName || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Experience:</Typography>
                    <Typography variant="body1" gutterBottom>
                      {verificationData.professional.yearsOfExperience || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Primary Medium:</Typography>
                    <Typography variant="body1" gutterBottom>
                      {verificationData.professional.primaryMedium || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2">Art Styles:</Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {verificationData.professional.artStyle.map((style) => (
                        <Chip key={style} label={style} size="small" />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Next Steps
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Application Review"
                      secondary="Our team will review your submission within 5-7 business days"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Verification Decision"
                      secondary="You'll receive an email with the verification decision"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Profile Update"
                      secondary="If approved, your verified badge will appear immediately"
                    />
                  </ListItem>
                </List>
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
          Artist verification is only available for registered artists. 
          Please register as an artist to apply for verification.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Header */}
        <Grid item xs={12}>
          <Box textAlign="center" mb={4}>
            <Verified sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" component="h1" gutterBottom>
              Artist Verification
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Get verified to build trust and unlock premium features
            </Typography>
          </Box>
        </Grid>

        {/* Benefits */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Verification Benefits
              </Typography>
              <List dense>
                {verificationBenefits.map((benefit, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Application Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 4 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={(activeStep / (steps.length - 1)) * 100} 
                />
              </Box>

              {renderStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
                      onClick={() => {
                        alert('Application submitted successfully! You will receive an email confirmation shortly.');
                      }}
                      startIcon={<Verified />}
                    >
                      Submit Application
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ArtistVerification;
