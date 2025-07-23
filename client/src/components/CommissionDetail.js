import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Divider,
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Message,
  AttachFile,
  Send,
  CheckCircle,
  Schedule,
  Payment,
  Work,
  Star,
  Verified,
  Upload,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const CommissionDetail = () => {
  const { id } = useParams();
  const [commission, setCommission] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [quoteDialog, setQuoteDialog] = useState(false);
  const [progressDialog, setProgressDialog] = useState(false);
  const [quote, setQuote] = useState({
    proposedPrice: '',
    estimatedDays: '',
    milestones: [],
    terms: ''
  });

  const { user } = useSelector(state => state.auth);
  const isArtist = user?.role === 'artist';
  const isClient = user?.role === 'user';

  useEffect(() => {
    // Fetch commission details
    fetchCommissionDetails();
  }, [id]);

  const fetchCommissionDetails = async () => {
    try {
      const response = await fetch(`/api/commissions/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCommission(data.commission);
    } catch (error) {
      console.error('Error fetching commission:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      reviewing: 'info',
      quoted: 'primary',
      negotiating: 'secondary',
      accepted: 'success',
      in_progress: 'info',
      review: 'warning',
      completed: 'success',
      delivered: 'success',
      cancelled: 'error',
      rejected: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusSteps = () => {
    const steps = [
      'Request Submitted',
      'Quote Provided',
      'Quote Accepted',
      'Work In Progress',
      'Review & Feedback',
      'Completed'
    ];
    return steps;
  };

  const getCurrentStep = () => {
    const stepMap = {
      pending: 0,
      reviewing: 0,
      quoted: 1,
      negotiating: 1,
      accepted: 2,
      in_progress: 3,
      review: 4,
      revision: 4,
      completed: 5,
      delivered: 5
    };
    return stepMap[commission?.status] || 0;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/commissions/${id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: newMessage })
      });

      if (response.ok) {
        setNewMessage('');
        fetchCommissionDetails();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSubmitQuote = async () => {
    try {
      const response = await fetch(`/api/commissions/${id}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(quote)
      });

      if (response.ok) {
        setQuoteDialog(false);
        fetchCommissionDetails();
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
    }
  };

  const handleAcceptQuote = async () => {
    try {
      const response = await fetch(`/api/commissions/${id}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        fetchCommissionDetails();
      }
    } catch (error) {
      console.error('Error accepting quote:', error);
    }
  };

  if (!commission) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {commission.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {commission.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                label={commission.status.replace('_', ' ').toUpperCase()} 
                color={getStatusColor(commission.status)}
                variant="filled"
              />
              <Typography variant="body2" color="text.secondary">
                Created {new Date(commission.metadata.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Budget Range
                </Typography>
                <Typography variant="h4" color="primary">
                  ${commission.budget.min} - ${commission.budget.max}
                </Typography>
                {commission.proposedPrice && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Quoted: ${commission.proposedPrice}
                  </Typography>
                )}
                {commission.agreedPrice && (
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    Agreed: ${commission.agreedPrice}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Progress Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Commission Progress
        </Typography>
        <Stepper activeStep={getCurrentStep()} alternativeLabel>
          {getStatusSteps().map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
              <Tab label="Messages" />
              <Tab label="Progress" />
              <Tab label="Requirements" />
              <Tab label="Payment" />
            </Tabs>

            {/* Messages Tab */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <List sx={{ maxHeight: 400, overflow: 'auto', mb: 2 }}>
                  {commission.communication.map((msg, index) => (
                    <ListItem key={index} alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          {msg.sender === user.id ? user.profile.firstName[0] : 
                           (isArtist ? commission.client.profile.firstName[0] : commission.artist.profile.firstName[0])}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2">
                              {msg.sender === user.id ? 'You' : 
                               (isArtist ? `${commission.client.profile.firstName} ${commission.client.profile.lastName}` : 
                                `${commission.artist.profile.firstName} ${commission.artist.profile.lastName}`)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(msg.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {msg.message}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                {/* Message Input */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <IconButton onClick={handleSendMessage} color="primary">
                    <Send />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* Progress Tab */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                {commission.workInProgress.length > 0 ? (
                  <Timeline>
                    {commission.workInProgress.map((progress, index) => (
                      <TimelineItem key={index}>
                        <TimelineSeparator>
                          <TimelineDot color="primary">
                            <Work />
                          </TimelineDot>
                          {index < commission.workInProgress.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="h6">{progress.title}</Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {new Date(progress.uploadDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {progress.description}
                          </Typography>
                          <Grid container spacing={1}>
                            {progress.images.map((image, imgIndex) => (
                              <Grid item xs={6} sm={4} md={3} key={imgIndex}>
                                <img
                                  src={image}
                                  alt={`Progress ${imgIndex + 1}`}
                                  style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4 }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    No progress updates yet
                  </Typography>
                )}
              </Box>
            )}

            {/* Requirements Tab */}
            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Requirements</Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Style:</strong> {commission.requirements.style || 'Not specified'}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Medium:</strong> {commission.requirements.medium || 'Not specified'}
                    </Typography>
                    {commission.requirements.dimensions && (
                      <Typography variant="body2" paragraph>
                        <strong>Dimensions:</strong> {commission.requirements.dimensions.width}" × {commission.requirements.dimensions.height}"
                        {commission.requirements.dimensions.depth && ` × ${commission.requirements.dimensions.depth}"`}
                      </Typography>
                    )}
                    {commission.requirements.deadline && (
                      <Typography variant="body2" paragraph>
                        <strong>Deadline:</strong> {new Date(commission.requirements.deadline).toLocaleDateString()}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Preferences</Typography>
                    {commission.requirements.colorPreferences && commission.requirements.colorPreferences.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>Colors:</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {commission.requirements.colorPreferences.map((color, index) => (
                            <Chip key={index} label={color} size="small" />
                          ))}
                        </Box>
                      </Box>
                    )}
                    {commission.requirements.themes && commission.requirements.themes.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>Themes:</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {commission.requirements.themes.map((theme, index) => (
                            <Chip key={index} label={theme} size="small" />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Payment Tab */}
            {activeTab === 3 && (
              <Box sx={{ p: 3 }}>
                {commission.payment.paymentSchedule.length > 0 ? (
                  <Box>
                    <Typography variant="h6" gutterBottom>Payment Schedule</Typography>
                    {commission.payment.paymentSchedule.map((payment, index) => (
                      <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="h6">${payment.amount}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Due: {new Date(payment.dueDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Chip 
                            label={payment.paid ? 'Paid' : 'Pending'} 
                            color={payment.paid ? 'success' : 'warning'}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Payment schedule will be available after quote acceptance
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Participants */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Participants</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ mr: 2 }}>
                {commission.client.profile.firstName[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle2">
                  {commission.client.profile.firstName} {commission.client.profile.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">Client</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge
                badgeContent={<Verified sx={{ fontSize: 16 }} />}
                color="primary"
                invisible={commission.artist.verification?.status !== 'approved'}
              >
                <Avatar sx={{ mr: 2 }}>
                  {commission.artist.profile.firstName[0]}
                </Avatar>
              </Badge>
              <Box>
                <Typography variant="subtitle2">
                  {commission.artist.profile.firstName} {commission.artist.profile.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">Artist</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Actions</Typography>
            
            {isArtist && commission.status === 'pending' && (
              <Button
                fullWidth
                variant="contained"
                sx={{ mb: 1 }}
                onClick={() => setQuoteDialog(true)}
              >
                Submit Quote
              </Button>
            )}

            {isClient && commission.status === 'quoted' && (
              <Button
                fullWidth
                variant="contained"
                color="success"
                sx={{ mb: 1 }}
                onClick={handleAcceptQuote}
              >
                Accept Quote
              </Button>
            )}

            {isArtist && ['accepted', 'in_progress'].includes(commission.status) && (
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 1 }}
                onClick={() => setProgressDialog(true)}
                startIcon={<Upload />}
              >
                Upload Progress
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Quote Dialog */}
      <Dialog open={quoteDialog} onClose={() => setQuoteDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Submit Quote</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Proposed Price"
                type="number"
                value={quote.proposedPrice}
                onChange={(e) => setQuote(prev => ({ ...prev, proposedPrice: e.target.value }))}
                InputProps={{ startAdornment: '$' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Days"
                type="number"
                value={quote.estimatedDays}
                onChange={(e) => setQuote(prev => ({ ...prev, estimatedDays: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Terms & Conditions"
                value={quote.terms}
                onChange={(e) => setQuote(prev => ({ ...prev, terms: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuoteDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitQuote} variant="contained">Submit Quote</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommissionDetail;
