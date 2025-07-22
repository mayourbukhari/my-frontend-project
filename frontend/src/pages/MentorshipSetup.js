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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
  Paper,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  School,
  Star,
  Schedule,
  AttachMoney,
  VideoCall,
  Person,
  Add,
  Save,
  Visibility,
} from '@mui/icons-material';

const steps = [
  'Basic Information',
  'Expertise & Pricing',
  'Availability & Format',
  'Profile Review',
];

const specializations = [
  'Oil Painting',
  'Watercolor',
  'Digital Art',
  'Sculpture',
  'Photography',
  'Illustration',
  'Abstract Art',
  'Portrait Art',
  'Landscape',
  'Character Design',
];

const MentorshipSetup = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [mentorshipData, setMentorshipData] = useState({
    title: '',
    description: '',
    specializations: [],
    experience: '',
    hourlyRate: '',
    sessionFormats: [],
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    timeSlots: [],
    maxStudents: 5,
    sessionDuration: 60,
    isActive: false,
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (field, value) => {
    setMentorshipData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecializationToggle = (specialization) => {
    setMentorshipData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleAvailabilityChange = (day) => {
    setMentorshipData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day]
      }
    }));
  };

  const handleSessionFormatToggle = (format) => {
    setMentorshipData(prev => ({
      ...prev,
      sessionFormats: prev.sessionFormats.includes(format)
        ? prev.sessionFormats.filter(f => f !== format)
        : [...prev.sessionFormats, format]
    }));
  };

  const handleSubmit = () => {
    // TODO: Implement API call to create mentorship program
    console.log('Mentorship program data:', mentorshipData);
    // Show success message and redirect
  };

  const renderBasicInfo = () => (
    <Box>
      <TextField
        fullWidth
        label="Mentorship Program Title"
        value={mentorshipData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        placeholder="e.g., Digital Art Mastery Program"
        sx={{ mb: 3 }}
      />
      
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Program Description"
        value={mentorshipData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        placeholder="Describe your mentorship program, what students will learn, and your teaching approach..."
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        label="Years of Experience"
        type="number"
        value={mentorshipData.experience}
        onChange={(e) => handleInputChange('experience', e.target.value)}
        placeholder="5"
        sx={{ mb: 3 }}
      />
    </Box>
  );

  const renderExpertisePricing = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Your Specializations
      </Typography>
      <Box sx={{ mb: 3 }}>
        {specializations.map((spec) => (
          <Chip
            key={spec}
            label={spec}
            onClick={() => handleSpecializationToggle(spec)}
            color={mentorshipData.specializations.includes(spec) ? 'primary' : 'default'}
            sx={{ mr: 1, mb: 1 }}
            clickable
          />
        ))}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Hourly Rate (USD)"
            type="number"
            value={mentorshipData.hourlyRate}
            onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
            placeholder="50"
            InputProps={{
              startAdornment: <AttachMoney />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Session Duration (minutes)</InputLabel>
            <Select
              value={mentorshipData.sessionDuration}
              onChange={(e) => handleInputChange('sessionDuration', e.target.value)}
            >
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={60}>60 minutes</MenuItem>
              <MenuItem value={90}>90 minutes</MenuItem>
              <MenuItem value={120}>120 minutes</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );

  const renderAvailabilityFormat = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Session Formats
      </Typography>
      <Box sx={{ mb: 3 }}>
        {['One-on-One', 'Group Sessions', 'Online', 'In-Person', 'Workshop Style'].map((format) => (
          <Chip
            key={format}
            label={format}
            onClick={() => handleSessionFormatToggle(format)}
            color={mentorshipData.sessionFormats.includes(format) ? 'primary' : 'default'}
            sx={{ mr: 1, mb: 1 }}
            clickable
          />
        ))}
      </Box>

      <Typography variant="h6" gutterBottom>
        Weekly Availability
      </Typography>
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {Object.keys(mentorshipData.availability).map((day) => (
          <Grid item xs={12} sm={6} md={3} key={day}>
            <FormControlLabel
              control={
                <Switch
                  checked={mentorshipData.availability[day]}
                  onChange={() => handleAvailabilityChange(day)}
                />
              }
              label={day.charAt(0).toUpperCase() + day.slice(1)}
            />
          </Grid>
        ))}
      </Grid>

      <TextField
        fullWidth
        label="Maximum Students per Program"
        type="number"
        value={mentorshipData.maxStudents}
        onChange={(e) => handleInputChange('maxStudents', e.target.value)}
        placeholder="5"
        helperText="Recommended: 3-10 students for optimal attention"
      />
    </Box>
  );

  const renderReview = () => (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Program Preview
        </Typography>
        
        <Typography variant="h5" gutterBottom>
          {mentorshipData.title || 'Your Mentorship Program'}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {mentorshipData.description || 'Program description will appear here...'}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Specializations:</Typography>
          {mentorshipData.specializations.map((spec) => (
            <Chip key={spec} label={spec} size="small" sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Experience:</Typography>
            <Typography variant="body2">{mentorshipData.experience} years</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Hourly Rate:</Typography>
            <Typography variant="body2">${mentorshipData.hourlyRate}/hour</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Session Duration:</Typography>
            <Typography variant="body2">{mentorshipData.sessionDuration} minutes</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Max Students:</Typography>
            <Typography variant="body2">{mentorshipData.maxStudents} students</Typography>
          </Grid>
        </Grid>
      </Paper>

      <FormControlLabel
        control={
          <Switch
            checked={mentorshipData.isActive}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
          />
        }
        label="Make this program active and visible to students"
      />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Mentorship Setup
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Create and manage your mentorship programs
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Visibility />}>
          View My Programs
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      {index === 0 && renderBasicInfo()}
                      {index === 1 && renderExpertisePricing()}
                      {index === 2 && renderAvailabilityFormat()}
                      {index === 3 && renderReview()}
                      
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                          startIcon={index === steps.length - 1 ? <Save /> : <Add />}
                        >
                          {index === steps.length - 1 ? 'Create Program' : 'Continue'}
                        </Button>
                        {index > 0 && (
                          <Button onClick={handleBack} sx={{ ml: 1 }}>
                            Back
                          </Button>
                        )}
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                Mentorship Benefits
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <AttachMoney />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Earn Extra Income"
                    secondary="Share your expertise and earn money teaching others"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Build Your Community"
                    secondary="Connect with aspiring artists and grow your network"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <Star />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Enhance Your Profile"
                    secondary="Showcase your teaching skills and build credibility"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Tips
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Pro Tip:</strong> Start with a lower rate to build reviews, then increase as you gain experience.
                </Typography>
              </Alert>
              <Alert severity="success">
                <Typography variant="body2">
                  <strong>Best Practice:</strong> Keep sessions interactive and provide actionable feedback.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MentorshipSetup;
