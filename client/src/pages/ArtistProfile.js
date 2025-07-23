import React, { useState, useEffect } from 'react';
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
  Avatar,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Switch,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit,
  PhotoCamera,
  Palette,
  School,
  Language,
  LocationOn,
  Phone,
  Email,
  Instagram,
  Twitter,
  Facebook,
  LinkedIn,
  YouTube,
  Save,
  Cancel,
  Add,
  Delete,
  Verified,
  Star,
  TrendingUp,
} from '@mui/icons-material';

const ArtistProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    // Basic Info
    displayName: user?.name || '',
    bio: '',
    avatar: '',
    coverImage: '',
    location: '',
    phone: '',
    email: user?.email || '',
    website: '',
    
    // Artist Info
    artisticStyle: [],
    mediums: [],
    yearsOfExperience: '',
    education: [],
    exhibitions: [],
    awards: [],
    
    // Social Media
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      youtube: '',
    },
    
    // Settings
    isProfilePublic: true,
    showContactInfo: true,
    allowCommissions: true,
    allowMentorship: false,
    emailNotifications: true,
  });

  const [educationDialog, setEducationDialog] = useState(false);
  const [exhibitionDialog, setExhibitionDialog] = useState(false);
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    year: '',
  });
  const [newExhibition, setNewExhibition] = useState({
    title: '',
    venue: '',
    type: '',
    year: '',
    description: '',
  });

  useEffect(() => {
    // TODO: Load profile data from API
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    // Mock data for now
    const mockProfile = {
      displayName: 'Syed Mohsin Bukhari',
      bio: 'Contemporary digital artist specializing in surreal landscapes and abstract compositions. My work explores the intersection of technology and nature, creating immersive visual experiences that challenge perception.',
      avatar: '/api/placeholder/150/150',
      coverImage: '/api/placeholder/800/300',
      location: 'San Francisco, CA',
      phone: '+1 (555) 123-4567',
      email: 'syedmohsinb786@gmail.com',
      website: 'https://mayourbukhari.github.io/Personal-Portfolio/',
      artisticStyle: ['Digital Art', 'Surrealism', 'Abstract', 'Landscape'],
      mediums: ['Digital Painting', 'Mixed Media', 'Photography', '3D Art'],
      yearsOfExperience: '8',
      education: [
        {
          institution: 'Lovely Professional University',
          degree: 'MTech',
          field: 'Artificial Intelligence and Machine Learning',
          year: '2026',
        },
        {
          institution: 'IUST Awantipora',
          degree: 'BTech',
          field: 'Electronics and Communication Engineering',
          year: '2023',
        },
      ],
      exhibitions: [
        {
          title: 'Digital Horizons',
          venue: 'SFMOMA',
          type: 'Group Exhibition',
          year: '2023',
          description: 'Contemporary digital art showcase',
        },
        {
          title: 'Nature Reimagined',
          venue: 'Gallery 49',
          type: 'Solo Exhibition',
          year: '2022',
          description: 'Personal exploration of digital landscapes',
        },
      ],
      awards: [
        'Digital Artist of the Year 2023',
        'Best Emerging Artist 2022',
        'Innovation in Digital Art Award 2021',
      ],
      socialMedia: {
        instagram: '@mayour_bukhari',
        twitter: '@drabdotme',
        linkedin: 'syed-mohsin-bukhari',
        youtube: 'PossibleCode',
      },
      isProfilePublic: true,
      showContactInfo: true,
      allowCommissions: true,
      allowMentorship: true,
      emailNotifications: true,
    };
    setProfileData(mockProfile);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSave = async () => {
    try {
      // TODO: Save profile data to API
      console.log('Saving profile data:', profileData);
      setEditMode(false);
      // Show success message
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    loadProfileData(); // Reload original data
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addEducation = () => {
    setProfileData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
    setNewEducation({ institution: '', degree: '', field: '', year: '' });
    setEducationDialog(false);
  };

  const addExhibition = () => {
    setProfileData(prev => ({
      ...prev,
      exhibitions: [...prev.exhibitions, newExhibition]
    }));
    setNewExhibition({ title: '', venue: '', type: '', year: '', description: '' });
    setExhibitionDialog(false);
  };

  const removeEducation = (index) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const removeExhibition = (index) => {
    setProfileData(prev => ({
      ...prev,
      exhibitions: prev.exhibitions.filter((_, i) => i !== index)
    }));
  };

  const artisticStyles = [
    'Abstract', 'Realism', 'Impressionism', 'Surrealism', 'Digital Art',
    'Street Art', 'Pop Art', 'Minimalism', 'Contemporary', 'Traditional'
  ];

  const mediums = [
    'Oil Painting', 'Watercolor', 'Acrylic', 'Digital Painting', 'Photography',
    'Sculpture', 'Mixed Media', 'Pencil Drawing', 'Charcoal', 'Pastel', '3D Art'
  ];

  const renderBasicInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Box position="relative" display="inline-block">
              <Avatar
                src={profileData.avatar}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />
              {editMode && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                  size="small"
                >
                  <PhotoCamera />
                </IconButton>
              )}
            </Box>
            
            {editMode ? (
              <TextField
                fullWidth
                label="Display Name"
                value={profileData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                sx={{ mb: 2 }}
              />
            ) : (
              <Typography variant="h5" gutterBottom>
                {profileData.displayName}
                <Verified sx={{ ml: 1, color: 'primary.main', fontSize: 20 }} />
              </Typography>
            )}
            
            <Box display="flex" justifyContent="center" gap={1} mb={2}>
              <Chip icon={<Star />} label="Verified Artist" color="primary" size="small" />
              <Chip icon={<TrendingUp />} label="Rising Star" color="secondary" size="small" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              About Me
            </Typography>
            
            {editMode ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                sx={{ mb: 3 }}
              />
            ) : (
              <Typography variant="body1" paragraph>
                {profileData.bio}
              </Typography>
            )}
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Location"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    InputProps={{ startAdornment: <LocationOn sx={{ mr: 1 }} /> }}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>{profileData.location}</Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Website"
                    value={profileData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    InputProps={{ startAdornment: <Language sx={{ mr: 1 }} /> }}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <Language sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>{profileData.website}</Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    InputProps={{ startAdornment: <Phone sx={{ mr: 1 }} /> }}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>{profileData.phone}</Typography>
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    InputProps={{ startAdornment: <Email sx={{ mr: 1 }} /> }}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography>{profileData.email}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderArtistInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Artistic Style
            </Typography>
            
            {editMode ? (
              <FormControl fullWidth>
                <InputLabel>Select Styles</InputLabel>
                <Select
                  multiple
                  value={profileData.artisticStyle}
                  onChange={(e) => handleArrayChange('artisticStyle', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {artisticStyles.map((style) => (
                    <MenuItem key={style} value={style}>
                      {style}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Box>
                {profileData.artisticStyle.map((style) => (
                  <Chip key={style} label={style} sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
        
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Mediums
            </Typography>
            
            {editMode ? (
              <FormControl fullWidth>
                <InputLabel>Select Mediums</InputLabel>
                <Select
                  multiple
                  value={profileData.mediums}
                  onChange={(e) => handleArrayChange('mediums', e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {mediums.map((medium) => (
                    <MenuItem key={medium} value={medium}>
                      {medium}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Box>
                {profileData.mediums.map((medium) => (
                  <Chip key={medium} label={medium} sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Experience
            </Typography>
            
            {editMode ? (
              <TextField
                fullWidth
                label="Years of Experience"
                type="number"
                value={profileData.yearsOfExperience}
                onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
              />
            ) : (
              <Typography variant="h4" color="primary">
                {profileData.yearsOfExperience} years
              </Typography>
            )}
          </CardContent>
        </Card>
        
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Awards & Recognition
            </Typography>
            
            {editMode ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Awards (one per line)"
                value={profileData.awards.join('\n')}
                onChange={(e) => handleArrayChange('awards', e.target.value.split('\n').filter(a => a.trim()))}
              />
            ) : (
              <List dense>
                {profileData.awards.map((award, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        <Star />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={award} />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderEducationExhibitions = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Education
              </Typography>
              {editMode && (
                <IconButton onClick={() => setEducationDialog(true)}>
                  <Add />
                </IconButton>
              )}
            </Box>
            
            <List>
              {profileData.education.map((edu, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <School />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${edu.degree} in ${edu.field}`}
                      secondary={`${edu.institution} • ${edu.year}`}
                    />
                    {editMode && (
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => removeEducation(index)}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  {index < profileData.education.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Exhibitions
              </Typography>
              {editMode && (
                <IconButton onClick={() => setExhibitionDialog(true)}>
                  <Add />
                </IconButton>
              )}
            </Box>
            
            <List>
              {profileData.exhibitions.map((exhibition, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <Palette />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={exhibition.title}
                      secondary={`${exhibition.venue} • ${exhibition.type} • ${exhibition.year}`}
                    />
                    {editMode && (
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => removeExhibition(index)}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  {index < profileData.exhibitions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSocialMedia = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Social Media Links
        </Typography>
        
        <Grid container spacing={2}>
          {Object.entries(profileData.socialMedia).map(([platform, handle]) => {
            const icons = {
              instagram: <Instagram />,
              twitter: <Twitter />,
              facebook: <Facebook />,
              linkedin: <LinkedIn />,
              youtube: <YouTube />,
            };
            
            return (
              <Grid item xs={12} sm={6} key={platform}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    value={handle}
                    onChange={(e) => handleInputChange(`socialMedia.${platform}`, e.target.value)}
                    InputProps={{ startAdornment: icons[platform] }}
                  />
                ) : (
                  <Box display="flex" alignItems="center">
                    {icons[platform]}
                    <Typography sx={{ ml: 1 }}>{handle || 'Not connected'}</Typography>
                  </Box>
                )}
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Profile Settings
        </Typography>
        
        <List>
          <ListItem>
            <ListItemText
              primary="Public Profile"
              secondary="Make your profile visible to everyone"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={profileData.isProfilePublic}
                onChange={(e) => handleInputChange('isProfilePublic', e.target.checked)}
                disabled={!editMode}
              />
            </ListItemSecondaryAction>
          </ListItem>
          
          <ListItem>
            <ListItemText
              primary="Show Contact Information"
              secondary="Display your email and phone number"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={profileData.showContactInfo}
                onChange={(e) => handleInputChange('showContactInfo', e.target.checked)}
                disabled={!editMode}
              />
            </ListItemSecondaryAction>
          </ListItem>
          
          <ListItem>
            <ListItemText
              primary="Accept Commissions"
              secondary="Allow clients to commission artwork from you"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={profileData.allowCommissions}
                onChange={(e) => handleInputChange('allowCommissions', e.target.checked)}
                disabled={!editMode}
              />
            </ListItemSecondaryAction>
          </ListItem>
          
          <ListItem>
            <ListItemText
              primary="Offer Mentorship"
              secondary="Provide mentorship services to other artists"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={profileData.allowMentorship}
                onChange={(e) => handleInputChange('allowMentorship', e.target.checked)}
                disabled={!editMode}
              />
            </ListItemSecondaryAction>
          </ListItem>
          
          <ListItem>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive notifications via email"
            />
            <ListItemSecondaryAction>
              <Switch
                checked={profileData.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                disabled={!editMode}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Artist Profile
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage your artistic identity and professional information
          </Typography>
        </Box>
        
        <Box>
          {editMode ? (
            <>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Basic Info" />
          <Tab label="Artist Info" />
          <Tab label="Education & Exhibitions" />
          <Tab label="Social Media" />
          <Tab label="Settings" />
        </Tabs>
      </Box>

      {tabValue === 0 && renderBasicInfo()}
      {tabValue === 1 && renderArtistInfo()}
      {tabValue === 2 && renderEducationExhibitions()}
      {tabValue === 3 && renderSocialMedia()}
      {tabValue === 4 && renderSettings()}

      {/* Education Dialog */}
      <Dialog open={educationDialog} onClose={() => setEducationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Education</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Institution"
                value={newEducation.institution}
                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Degree"
                value={newEducation.degree}
                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Field of Study"
                value={newEducation.field}
                onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={newEducation.year}
                onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEducationDialog(false)}>Cancel</Button>
          <Button onClick={addEducation} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Exhibition Dialog */}
      <Dialog open={exhibitionDialog} onClose={() => setExhibitionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Exhibition</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Exhibition Title"
                value={newExhibition.title}
                onChange={(e) => setNewExhibition({ ...newExhibition, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Venue"
                value={newExhibition.venue}
                onChange={(e) => setNewExhibition({ ...newExhibition, venue: e.target.value })}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={newExhibition.year}
                onChange={(e) => setNewExhibition({ ...newExhibition, year: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newExhibition.type}
                  onChange={(e) => setNewExhibition({ ...newExhibition, type: e.target.value })}
                >
                  <MenuItem value="Solo Exhibition">Solo Exhibition</MenuItem>
                  <MenuItem value="Group Exhibition">Group Exhibition</MenuItem>
                  <MenuItem value="Art Fair">Art Fair</MenuItem>
                  <MenuItem value="Gallery Show">Gallery Show</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newExhibition.description}
                onChange={(e) => setNewExhibition({ ...newExhibition, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExhibitionDialog(false)}>Cancel</Button>
          <Button onClick={addExhibition} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ArtistProfile;
