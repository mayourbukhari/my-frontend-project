import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  Button,
  TextField,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  Edit,
  Email,
  Phone,
  LocationOn,
  Palette,
  Work,
  School,
  Instagram,
  Facebook,
  Twitter,
  Verified
} from '@mui/icons-material';
import { updateProfile } from '../store/authSlice';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    specialization: '',
    experience: '',
    education: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Initialize profile data with user data
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      location: user.location || '',
      website: user.website || '',
      specialization: user.specialization || '',
      experience: user.experience || '',
      education: user.education || '',
      socialMedia: {
        instagram: user.socialMedia?.instagram || '',
        facebook: user.socialMedia?.facebook || '',
        twitter: user.socialMedia?.twitter || ''
      }
    });
  }, [user, navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  const handleSaveProfile = () => {
    dispatch(updateProfile(profileData));
    setEditDialogOpen(false);
  };

  if (!user) {
    return null;
  }

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={user.profileImage}
              sx={{
                width: 120,
                height: 120,
                fontSize: '3rem',
                bgcolor: 'primary.main'
              }}
            >
              {user.name?.[0]}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {user.name}
              </Typography>
              {user.isVerified && (
                <Verified sx={{ color: 'primary.main', fontSize: 28 }} />
              )}
            </Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {user.role === 'artist' ? 'Artist' : 'Art Enthusiast'}
            </Typography>
            {user.bio && (
              <Typography variant="body1" paragraph>
                {user.bio}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<Email />}
                label={user.email}
                variant="outlined"
                size="small"
              />
              {user.location && (
                <Chip
                  icon={<LocationOn />}
                  label={user.location}
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditDialogOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Profile Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Personal Info" />
            <Tab label="Professional" />
            <Tab label="Social Media" />
            {user.role === 'artist' && <Tab label="Artist Dashboard" />}
          </Tabs>
        </Box>

        {/* Personal Info Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Contact Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Email /></ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={user.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Phone /></ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={user.phone || 'Not provided'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LocationOn /></ListItemIcon>
                    <ListItemText
                      primary="Location"
                      secondary={user.location || 'Not provided'}
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Account Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Account Type"
                      secondary={user.role === 'artist' ? 'Artist Account' : 'Buyer Account'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Member Since"
                      secondary={new Date(user.createdAt).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Verification Status"
                      secondary={
                        <Chip
                          label={user.isVerified ? 'Verified' : 'Unverified'}
                          color={user.isVerified ? 'success' : 'default'}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Professional Tab */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card elevation={0} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Professional Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><Palette /></ListItemIcon>
                    <ListItemText
                      primary="Specialization"
                      secondary={user.specialization || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Work /></ListItemIcon>
                    <ListItemText
                      primary="Experience"
                      secondary={user.experience || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><School /></ListItemIcon>
                    <ListItemText
                      primary="Education"
                      secondary={user.education || 'Not specified'}
                    />
                  </ListItem>
                </List>
                {user.website && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Social Media Tab */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card elevation={0} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Social Media Links
                </Typography>
                <List>
                  {user.socialMedia?.instagram && (
                    <ListItem>
                      <ListItemIcon><Instagram /></ListItemIcon>
                      <ListItemText
                        primary="Instagram"
                        secondary={
                          <Button
                            href={`https://instagram.com/${user.socialMedia.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            @{user.socialMedia.instagram}
                          </Button>
                        }
                      />
                    </ListItem>
                  )}
                  {user.socialMedia?.facebook && (
                    <ListItem>
                      <ListItemIcon><Facebook /></ListItemIcon>
                      <ListItemText
                        primary="Facebook"
                        secondary={
                          <Button
                            href={user.socialMedia.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {user.socialMedia.facebook}
                          </Button>
                        }
                      />
                    </ListItem>
                  )}
                  {user.socialMedia?.twitter && (
                    <ListItem>
                      <ListItemIcon><Twitter /></ListItemIcon>
                      <ListItemText
                        primary="Twitter"
                        secondary={
                          <Button
                            href={`https://twitter.com/${user.socialMedia.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            @{user.socialMedia.twitter}
                          </Button>
                        }
                      />
                    </ListItem>
                  )}
                </List>
                {!user.socialMedia?.instagram && !user.socialMedia?.facebook && !user.socialMedia?.twitter && (
                  <Alert severity="info">
                    No social media links added yet. Update your profile to add social media links.
                  </Alert>
                )}
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Artist Dashboard Tab */}
        {user.role === 'artist' && (
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/upload-artwork')}
                      fullWidth
                    >
                      Upload New Artwork
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/dashboard')}
                      fullWidth
                    >
                      View Dashboard
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/analytics')}
                      fullWidth
                    >
                      View Analytics
                    </Button>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Artist Tools
                  </Typography>
                  <List>
                    <ListItem button onClick={() => navigate('/commissions')}>
                      <ListItemText
                        primary="Manage Commissions"
                        secondary="View and manage commission requests"
                      />
                    </ListItem>
                    <ListItem button onClick={() => navigate('/mentorships')}>
                      <ListItemText
                        primary="Mentorship Programs"
                        secondary="Offer mentorship to aspiring artists"
                      />
                    </ListItem>
                    {!user.isVerified && (
                      <ListItem button onClick={() => navigate('/verification')}>
                        <ListItemText
                          primary="Get Verified"
                          secondary="Submit documents for artist verification"
                        />
                      </ListItem>
                    )}
                  </List>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        )}
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                value={profileData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </Grid>
            {user.role === 'artist' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Specialization"
                    value={profileData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Experience"
                    value={profileData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Education"
                    value={profileData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Social Media</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Instagram Username"
                value={profileData.socialMedia.instagram}
                onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Facebook URL"
                value={profileData.socialMedia.facebook}
                onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Twitter Username"
                value={profileData.socialMedia.twitter}
                onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
