import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Pinterest,
  Share,
  Favorite,
  FavoriteBorder,
  Comment,
  Send,
  Public,
  Lock,
  People,
  PhotoCamera,
  VideoCall,
  Event,
} from '@mui/icons-material';

const SocialMediaHub = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [postDialog, setPostDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    images: [],
    privacy: 'public',
    platforms: []
  });

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        verified: true,
        isFollowing: false
      },
      content: 'Just finished this incredible piece! Mixed media on canvas, exploring themes of urban decay and renewal. What do you think? 🎨',
      images: ['/artworks/urban-decay.jpg'],
      likes: 24,
      comments: 8,
      shares: 3,
      timestamp: '2 hours ago',
      platforms: ['instagram', 'twitter'],
      privacy: 'public'
    },
    {
      id: 2,
      author: {
        name: 'Marcus Chen',
        avatar: '/avatars/marcus.jpg',
        verified: false,
        isFollowing: true
      },
      content: 'Live painting session happening now! Join me as I work on this landscape piece. Link in bio 🎥',
      images: ['/artworks/landscape-wip.jpg'],
      likes: 45,
      comments: 12,
      shares: 7,
      timestamp: '4 hours ago',
      platforms: ['facebook', 'instagram'],
      privacy: 'public'
    }
  ]);

  const connectedPlatforms = [
    { name: 'Instagram', icon: Instagram, connected: true, followers: '2.4K' },
    { name: 'Twitter', icon: Twitter, connected: true, followers: '1.8K' },
    { name: 'Facebook', icon: Facebook, connected: false, followers: '0' },
    { name: 'Pinterest', icon: Pinterest, connected: true, followers: '3.2K' },
    { name: 'LinkedIn', icon: LinkedIn, connected: false, followers: '0' },
  ];

  const handleCreatePost = () => {
    const post = {
      id: Date.now(),
      author: {
        name: 'You',
        avatar: '/avatars/current-user.jpg',
        verified: true,
        isFollowing: false
      },
      content: newPost.content,
      images: newPost.images,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Just now',
      platforms: newPost.platforms,
      privacy: newPost.privacy
    };

    setPosts([post, ...posts]);
    setNewPost({ content: '', images: [], privacy: 'public', platforms: [] });
    setPostDialog(false);

    // Here you would also post to selected social media platforms
    publishToSocialPlatforms(post);
  };

  const publishToSocialPlatforms = async (post) => {
    // Integrate with social media APIs
    for (const platform of post.platforms) {
      try {
        switch (platform) {
          case 'instagram':
            await postToInstagram(post);
            break;
          case 'twitter':
            await postToTwitter(post);
            break;
          case 'facebook':
            await postToFacebook(post);
            break;
          case 'pinterest':
            await postToPinterest(post);
            break;
        }
      } catch (error) {
        console.error(`Failed to post to ${platform}:`, error);
      }
    }
  };

  const postToInstagram = async (post) => {
    // Instagram API integration
    console.log('Posting to Instagram:', post);
  };

  const postToTwitter = async (post) => {
    // Twitter API integration
    console.log('Posting to Twitter:', post);
  };

  const postToFacebook = async (post) => {
    // Facebook API integration
    console.log('Posting to Facebook:', post);
  };

  const postToPinterest = async (post) => {
    // Pinterest API integration
    console.log('Posting to Pinterest:', post);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleShare = (post) => {
    setShareDialog(true);
    // Pre-populate share dialog with post data
  };

  const handleFollow = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, author: { ...post.author, isFollowing: !post.author.isFollowing } }
        : post
    ));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Social Media Hub
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Feed" />
          <Tab label="Create Post" />
          <Tab label="Connected Accounts" />
          <Tab label="Analytics" />
        </Tabs>

        {/* Feed Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Latest Posts
              </Typography>
              <Button
                variant="contained"
                startIcon={<PhotoCamera />}
                onClick={() => setPostDialog(true)}
              >
                Create Post
              </Button>
            </Box>

            <Grid container spacing={3}>
              {posts.map((post) => (
                <Grid item xs={12} md={6} key={post.id}>
                  <Card>
                    {/* Post Header */}
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={post.author.avatar} sx={{ mr: 2 }}>
                          {post.author.name[0]}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {post.author.name}
                            {post.author.verified && (
                              <Chip
                                label="Verified"
                                size="small"
                                color="primary"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {post.timestamp}
                          </Typography>
                        </Box>
                        {post.author.name !== 'You' && (
                          <Button
                            size="small"
                            variant={post.author.isFollowing ? "outlined" : "contained"}
                            onClick={() => handleFollow(post.id)}
                          >
                            {post.author.isFollowing ? 'Following' : 'Follow'}
                          </Button>
                        )}
                      </Box>

                      <Typography variant="body1" paragraph>
                        {post.content}
                      </Typography>

                      {/* Platform Indicators */}
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                        {post.platforms.map((platform) => {
                          const PlatformIcon = connectedPlatforms.find(p => 
                            p.name.toLowerCase() === platform
                          )?.icon || Share;
                          return (
                            <Chip
                              key={platform}
                              icon={<PlatformIcon />}
                              label={platform}
                              size="small"
                              variant="outlined"
                            />
                          );
                        })}
                      </Box>
                    </CardContent>

                    {/* Post Images */}
                    {post.images.length > 0 && (
                      <CardMedia
                        component="img"
                        height="300"
                        image={post.images[0]}
                        alt="Post image"
                      />
                    )}

                    {/* Post Actions */}
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Box>
                        <IconButton onClick={() => handleLike(post.id)}>
                          <Favorite color="error" />
                        </IconButton>
                        <Typography variant="caption" sx={{ mr: 2 }}>
                          {post.likes}
                        </Typography>

                        <IconButton>
                          <Comment />
                        </IconButton>
                        <Typography variant="caption" sx={{ mr: 2 }}>
                          {post.comments}
                        </Typography>

                        <IconButton onClick={() => handleShare(post)}>
                          <Share />
                        </IconButton>
                        <Typography variant="caption">
                          {post.shares}
                        </Typography>
                      </Box>

                      <Chip
                        icon={post.privacy === 'public' ? <Public /> : <Lock />}
                        label={post.privacy}
                        size="small"
                        variant="outlined"
                      />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Connected Accounts Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Connected Social Media Accounts
            </Typography>

            <Grid container spacing={3}>
              {connectedPlatforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <Grid item xs={12} sm={6} md={4} key={platform.name}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <IconComponent sx={{ fontSize: 40, mr: 2 }} />
                          <Box>
                            <Typography variant="h6">
                              {platform.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {platform.connected ? `${platform.followers} followers` : 'Not connected'}
                            </Typography>
                          </Box>
                        </Box>

                        <FormControlLabel
                          control={
                            <Switch
                              checked={platform.connected}
                              onChange={() => {
                                // Handle platform connection toggle
                              }}
                            />
                          }
                          label={platform.connected ? 'Connected' : 'Connect'}
                        />
                      </CardContent>
                      <CardActions>
                        {platform.connected ? (
                          <Button size="small" color="error">
                            Disconnect
                          </Button>
                        ) : (
                          <Button size="small" variant="contained">
                            Connect Account
                          </Button>
                        )}
                        <Button size="small">
                          Settings
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Auto-Posting Settings
              </Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Auto-post new artworks to connected platforms"
              />
              <FormControlLabel
                control={<Switch />}
                label="Auto-share commission updates"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Cross-post between platforms"
              />
            </Box>
          </Box>
        )}

        {/* Analytics Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Social Media Analytics
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Total Reach
                    </Typography>
                    <Typography variant="h3" color="primary">
                      12.4K
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      +15% from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Engagement Rate
                    </Typography>
                    <Typography variant="h3" color="primary">
                      8.2%
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      +3% from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Platform Performance
                    </Typography>
                    <List>
                      {connectedPlatforms.filter(p => p.connected).map((platform) => (
                        <ListItem key={platform.name}>
                          <ListItemAvatar>
                            <Avatar>
                              <platform.icon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={platform.name}
                            secondary={`${platform.followers} followers • 12% engagement`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Create Post Dialog */}
      <Dialog open={postDialog} onClose={() => setPostDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What's on your mind?"
            value={newPost.content}
            onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>
            Select Platforms:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {connectedPlatforms.filter(p => p.connected).map((platform) => (
              <Chip
                key={platform.name}
                icon={<platform.icon />}
                label={platform.name}
                clickable
                color={newPost.platforms.includes(platform.name.toLowerCase()) ? 'primary' : 'default'}
                onClick={() => {
                  const platformName = platform.name.toLowerCase();
                  setNewPost(prev => ({
                    ...prev,
                    platforms: prev.platforms.includes(platformName)
                      ? prev.platforms.filter(p => p !== platformName)
                      : [...prev.platforms, platformName]
                  }));
                }}
              />
            ))}
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Privacy:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              icon={<Public />}
              label="Public"
              clickable
              color={newPost.privacy === 'public' ? 'primary' : 'default'}
              onClick={() => setNewPost(prev => ({ ...prev, privacy: 'public' }))}
            />
            <Chip
              icon={<People />}
              label="Followers Only"
              clickable
              color={newPost.privacy === 'followers' ? 'primary' : 'default'}
              onClick={() => setNewPost(prev => ({ ...prev, privacy: 'followers' }))}
            />
            <Chip
              icon={<Lock />}
              label="Private"
              clickable
              color={newPost.privacy === 'private' ? 'primary' : 'default'}
              onClick={() => setNewPost(prev => ({ ...prev, privacy: 'private' }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPostDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SocialMediaHub;
