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
  Tab,
  Tabs,
  Badge,
} from '@mui/material';
import {
  Assignment,
  AttachMoney,
  Schedule,
  CheckCircle,
  Pending,
  Cancel,
  Add,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Mock commissions data
const mockCommissions = {
  received: [
    {
      id: 'COM-001',
      client: 'Sarah Johnson',
      title: 'Custom Portrait',
      description: 'Family portrait in oil painting style',
      budget: 500,
      status: 'pending',
      deadline: '2024-02-15',
      createdAt: '2024-01-10',
    },
    {
      id: 'COM-002', 
      client: 'Mike Davis',
      title: 'Abstract Landscape',
      description: 'Modern abstract interpretation of local landscape',
      budget: 800,
      status: 'in_progress',
      deadline: '2024-02-28',
      createdAt: '2024-01-08',
    },
  ],
  sent: [
    {
      id: 'COM-003',
      artist: 'Emma Wilson',
      title: 'Wedding Illustration',
      description: 'Digital illustration for wedding invitation',
      budget: 300,
      status: 'completed',
      deadline: '2024-01-20',
      createdAt: '2024-01-05',
    },
  ]
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`commissions-tabpanel-${index}`}
      aria-labelledby={`commissions-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Commissions = () => {
  const { user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [commissions, setCommissions] = useState(mockCommissions);
  const isArtist = user?.role === 'artist';

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle />;
      case 'in_progress': return <Schedule />;
      case 'pending': return <Pending />;
      case 'cancelled': return <Cancel />;
      default: return <Assignment />;
    }
  };

  const CommissionCard = ({ commission, type }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Typography variant="h6">
            {commission.title}
          </Typography>
          <Chip
            icon={getStatusIcon(commission.status)}
            label={commission.status.replace('_', ' ').toUpperCase()}
            color={getStatusColor(commission.status)}
            size="small"
          />
        </Box>
        
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {type === 'received' ? `From: ${commission.client}` : `To: ${commission.artist}`}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {commission.description}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="textSecondary">
              Budget
            </Typography>
            <Typography variant="h6" color="primary">
              ${commission.budget}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="textSecondary">
              Deadline
            </Typography>
            <Typography variant="body1">
              {new Date(commission.deadline).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="textSecondary">
              Created
            </Typography>
            <Typography variant="body1">
              {new Date(commission.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          View Details
        </Button>
        {type === 'received' && commission.status === 'pending' && (
          <>
            <Button size="small" color="success" variant="contained">
              Accept
            </Button>
            <Button size="small" color="error">
              Decline
            </Button>
          </>
        )}
        {commission.status === 'in_progress' && (
          <Button size="small" color="primary" variant="contained">
            Update Progress
          </Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" component="h1">
          Commissions
        </Typography>
        {!isArtist && (
          <Button variant="contained" startIcon={<Add />}>
            Request Commission
          </Button>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="commission tabs">
          {isArtist ? (
            <>
              <Tab 
                label={
                  <Badge badgeContent={commissions.received.filter(c => c.status === 'pending').length} color="error">
                    Received Requests
                  </Badge>
                } 
              />
              <Tab label="Commission History" />
            </>
          ) : (
            <>
              <Tab label="My Requests" />
              <Tab label="Browse Artists" />
            </>
          )}
        </Tabs>
      </Box>

      {isArtist ? (
        <>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Commission Requests
            </Typography>
            {commissions.received.length === 0 ? (
              <Alert severity="info">
                No commission requests yet. Make sure your portfolio is up to date to attract clients!
              </Alert>
            ) : (
              commissions.received.map((commission) => (
                <CommissionCard 
                  key={commission.id} 
                  commission={commission} 
                  type="received" 
                />
              ))
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Commission History
            </Typography>
            <Alert severity="info">
              Commission history and analytics will be displayed here.
            </Alert>
          </TabPanel>
        </>
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              My Commission Requests
            </Typography>
            {commissions.sent.length === 0 ? (
              <Alert severity="info">
                You haven't requested any commissions yet. <Link to="/gallery">Browse artists</Link> to find the perfect match for your project.
              </Alert>
            ) : (
              commissions.sent.map((commission) => (
                <CommissionCard 
                  key={commission.id} 
                  commission={commission} 
                  type="sent" 
                />
              ))
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Browse Artists
            </Typography>
            <Alert severity="info">
              Artist directory for commission requests will be displayed here.
            </Alert>
            <Box mt={2}>
              <Button component={Link} to="/gallery" variant="contained">
                Browse Artist Profiles
              </Button>
            </Box>
          </TabPanel>
        </>
      )}
    </Container>
  );
};

export default Commissions;
