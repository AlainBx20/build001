import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Badge,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  TextField,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Switch,
  CircularProgress,
  InputLabel,
  Select,
  FormControl,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Help as HelpIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Payment as PaymentIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { 
  auth, 
  storage, 
  onAuthStateChanged, 
  signOut, 
  updateProfile,
  ref,
  uploadBytes,
  getDownloadURL
} from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

// Styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
}));

const MainContent = styled(Box)(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: '64px', // Height of AppBar
  backgroundColor: '#f5f5f5',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 320,
    width: `calc(100% - 320px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    width: '100%',
  },
}));

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? 320 : 70,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  '& .MuiDrawer-paper': {
    width: open ? 320 : 70,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    borderRight: 'none',
  },
}));

const UserProfile = styled(Box)(({ theme, open }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  transition: theme.transitions.create(['padding', 'gap'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...(open ? {} : {
    padding: theme.spacing(1),
    justifyContent: 'center',
  }),
}));

const UserInfo = styled(Box)(({ theme, open }) => ({
  display: 'flex',
  flexDirection: 'column',
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...(open ? {} : {
    opacity: 0,
    width: 0,
  }),
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: '8px 16px',
  borderRadius: '8px',
  color: active ? theme.palette.primary.main : theme.palette.primary.contrastText,
  backgroundColor: active ? theme.palette.background.paper : 'transparent',
  '&:hover': {
    backgroundColor: active ? theme.palette.background.paper : 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiListItemIcon-root': {
    color: active ? theme.palette.primary.main : theme.palette.primary.contrastText,
    minWidth: '40px',
  },
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 400,
    fontSize: '1rem',
  },
}));

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// Content components
const ProfileContent = ({ user, onUpdateProfile }) => {
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, `profile-images/${user.uid}/${file.name}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update the user's profile with the new photo URL
      await updateProfile(user, {
        photoURL: downloadURL
      });
      
      // Call the parent component's callback to update the UI
      if (onUpdateProfile) {
        onUpdateProfile({ ...user, photoURL: downloadURL });
      }
      
      setSnackbar({
        open: true,
        message: 'Profile image updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update profile image. Please try again.',
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 2,
                  cursor: 'pointer',
                  border: '3px solid #f5f5f5',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
                alt={user?.displayName || 'User'}
                src={user?.photoURL}
                onClick={handleImageClick}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  '&:hover': {
                    backgroundColor: 'white',
                  }
                }}
                onClick={handleImageClick}
                disabled={uploading}
              >
                {uploading ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
              </IconButton>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </Box>
            <Typography variant="h5" gutterBottom>
              {user?.displayName || 'User Name'}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {user?.email || 'user@example.com'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Software Developer
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                Edit Profile
              </Button>
              <Button variant="outlined" color="primary">
                Change Password
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Full Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {user?.displayName || 'User Name'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {user?.email || 'user@example.com'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Phone
                </Typography>
                <Typography variant="body1" gutterBottom>
                  +1 234 567 8900
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Location
                </Typography>
                <Typography variant="body1" gutterBottom>
                  New York, USA
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const MessagesContent = ({ messages }) => (
  <Box sx={{ p: 3 }}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Conversations
          </Typography>
          <TextField
            fullWidth
            placeholder="Search messages..."
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          <Box sx={{ height: 'calc(100vh - 300px)', overflow: 'auto' }}>
            {messages.map((message) => (
              <Box 
                key={message.id} 
                sx={{ 
                  p: 2, 
                  mb: 1, 
                  borderRadius: 1, 
                  bgcolor: message.unread ? 'primary.light' : 'background.paper',
                  color: message.unread ? 'primary.contrastText' : 'text.primary',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: message.unread ? 'primary.light' : 'action.hover',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ mr: 2 }}>U</Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2">
                      {message.sender}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      {message.date}
                    </Typography>
                  </Box>
                  {message.unread && (
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  )}
                </Box>
                <Typography variant="body2" noWrap>
                  {message.subject}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2 }}>U</Avatar>
            <Typography variant="subtitle1">User 1</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((message) => (
              <Box 
                key={message.id} 
                sx={{ 
                  alignSelf: message.unread ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                }}
              >
                <Paper 
                  sx={{ 
                    p: 2, 
                    bgcolor: message.unread ? 'primary.main' : 'grey.100',
                    color: message.unread ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1">
                    {message.unread 
                      ? 'This is a message from you. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' 
                      : 'This is a message from the other person. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1, textAlign: 'right' }}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              size="small"
            />
            <IconButton color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

const CalendarContent = ({ events }) => (
  <Box sx={{ p: 3 }}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {new Date().toLocaleDateString([], { month: 'long', year: 'numeric' })}
            </Typography>
            <Box>
              <IconButton>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Grid container>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid item xs={12/7} key={day} sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  {day}
                </Typography>
              </Grid>
            ))}
            
            {Array.from({ length: 35 }).map((_, index) => {
              const day = index + 1;
              const isToday = day === new Date().getDate();
              const hasEvent = [5, 12, 18, 25].includes(day);
              
              return (
                <Grid item xs={12/7} key={index} sx={{ textAlign: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mx: 'auto',
                      borderRadius: '50%',
                      bgcolor: isToday ? 'primary.main' : 'transparent',
                      color: isToday ? 'primary.contrastText' : 'text.primary',
                      position: 'relative',
                    }}
                  >
                    <Typography variant="body2">
                      {day}
                    </Typography>
                    {hasEvent && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          bottom: 2, 
                          width: 4, 
                          height: 4, 
                          borderRadius: '50%', 
                          bgcolor: isToday ? 'primary.contrastText' : 'primary.main' 
                        }} 
                      />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upcoming Events
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {events.map((event) => (
              <Box key={event.id} sx={{ display: 'flex', gap: 2 }}>
                <Box 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1, 
                    bgcolor: 'primary.main', 
                    color: 'primary.contrastText',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption">
                    {new Date(event.date).getDate()}
                  </Typography>
                  <Typography variant="caption">
                    {new Date(event.date).toLocaleDateString([], { month: 'short' })}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">
                    {event.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {event.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add New Event
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Event Title"
              variant="outlined"
              size="small"
            />
            <TextField
              label="Date"
              type="date"
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Description"
              variant="outlined"
              size="small"
              multiline
              rows={3}
            />
            <Button variant="contained" color="primary">
              Add Event
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

const ReportsContent = ({ reports }) => (
  <Box sx={{ p: 3 }}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Reports Overview
            </Typography>
            <Button variant="contained" color="primary">
              Generate New Report
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Report Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={report.status === 'Completed' ? 'Completed' : 'In Progress'} 
                        color={report.status === 'Completed' ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{report.title.includes('Monthly') ? 'Monthly' : 'Annual'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small">
                        <DownloadIcon />
                      </IconButton>
                      <IconButton size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Report Types
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['Sales Report', 'User Activity', 'Performance Metrics', 'Error Logs', 'System Health'].map((type) => (
              <Paper 
                key={type} 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }}
              >
                <Typography>{type}</Typography>
                <Button variant="outlined" size="small">
                  Generate
                </Button>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Scheduled Reports
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reports.map((report) => (
              <Box key={report.id} sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">
                    {report.title}
                  </Typography>
                  <Chip 
                    label={report.id === 1 ? 'Active' : 'Paused'} 
                    color={report.id === 1 ? 'success' : 'default'} 
                    size="small" 
                  />
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {new Date(report.date).toLocaleDateString([], { month: 'short' })}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button variant="outlined" size="small">
                    Edit
                  </Button>
                  <Button variant="outlined" size="small" color="error">
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

const HelpContent = ({ faqs }) => (
  <Box sx={{ p: 3 }}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Help Categories
          </Typography>
          <List>
            {['Getting Started', 'Account Management', 'Security', 'Billing', 'Technical Issues', 'FAQs'].map((category) => (
              <ListItem 
                key={category} 
                button
                sx={{ 
                  borderRadius: 1, 
                  mb: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }}
              >
                <ListItemIcon>
                  <HelpIcon />
                </ListItemIcon>
                <ListItemText primary={category} />
              </ListItem>
            ))}
          </List>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Contact Support
          </Typography>
          <Typography variant="body2" paragraph>
            Need more help? Our support team is available 24/7.
          </Typography>
          <Button variant="contained" color="primary" fullWidth>
            Contact Us
          </Button>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Frequently Asked Questions
          </Typography>
          
          {faqs.map((faq) => (
            <Accordion key={faq.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Video Tutorials
          </Typography>
          
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} key={item}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    flexDirection: 'column',
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 120, 
                      bgcolor: 'grey.300', 
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Tutorial {item}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Learn how to use the {item === 1 ? 'dashboard' : item === 2 ? 'calendar' : item === 3 ? 'reports' : 'messages'} feature.
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

const SettingsContent = ({ settings, onSettingChange, onLanguageChange }) => (
  <Box sx={{ p: 3 }}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2 }}>
          <List>
            {['Account', 'Notifications', 'Security', 'Appearance', 'Language', 'Billing'].map((setting) => (
              <ListItem 
                key={setting} 
                button
                sx={{ 
                  borderRadius: 1, 
                  mb: 1,
                  bgcolor: setting === 'Account' ? 'primary.light' : 'transparent',
                  color: setting === 'Account' ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: setting === 'Account' ? 'primary.light' : 'action.hover',
                  }
                }}
              >
                <ListItemIcon sx={{ color: setting === 'Account' ? 'primary.contrastText' : 'inherit' }}>
                  {setting === 'Account' && <PersonIcon />}
                  {setting === 'Notifications' && <NotificationsIcon />}
                  {setting === 'Security' && <SecurityIcon />}
                  {setting === 'Appearance' && <PaletteIcon />}
                  {setting === 'Language' && <LanguageIcon />}
                  {setting === 'Billing' && <PaymentIcon />}
                </ListItemIcon>
                <ListItemText primary={setting} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={9}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Account Settings
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Profile Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  defaultValue="First Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  defaultValue="Last Name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  defaultValue="Exemple@example.com"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  defaultValue="+216 55 555 555"
                />
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Password
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Current Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirm New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Preferences
            </Typography>
            <FormGroup>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={settings.notifications} 
                    onChange={() => onSettingChange('notifications')} 
                  />
                } 
                label="Email Notifications" 
              />
              <FormControlLabel 
                control={
                  <Switch 
                    checked={settings.emailUpdates} 
                    onChange={() => onSettingChange('emailUpdates')} 
                  />
                } 
                label="Push Notifications" 
              />
              <FormControlLabel 
                control={
                  <Switch 
                    checked={settings.darkMode} 
                    onChange={() => onSettingChange('darkMode')} 
                  />
                } 
                label="Dark Mode" 
              />
            </FormGroup>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Language
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language}
                onChange={onLanguageChange}
                label="Language"
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="French">French</MenuItem>
                <MenuItem value="German">German</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined">
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

const DashboardContent = () => (
  <Box>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        <StatCard>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h4">1,234</Typography>
            <Typography color="textSecondary">
              +12% from last month
            </Typography>
          </CardContent>
        </StatCard>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <StatCard>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Sessions
            </Typography>
            <Typography variant="h4">456</Typography>
            <Typography color="textSecondary">
              +5% from last hour
            </Typography>
          </CardContent>
        </StatCard>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <StatCard>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Revenue
            </Typography>
            <Typography variant="h4">$12,345</Typography>
            <Typography color="textSecondary">
              +8% from last week
            </Typography>
          </CardContent>
        </StatCard>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <StatCard>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Conversion Rate
            </Typography>
            <Typography variant="h4">2.4%</Typography>
            <Typography color="textSecondary">
              +0.5% from last month
            </Typography>
          </CardContent>
        </StatCard>
      </Grid>
    </Grid>

    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Box sx={{ height: 300, overflow: 'auto' }}>
            {[1, 2, 3, 4, 5].map((item) => (
              <Box key={item} sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    User Activity {item}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button variant="contained" color="primary" fullWidth>
              Create New Report
            </Button>
            <Button variant="outlined" color="primary" fullWidth>
              Schedule Meeting
            </Button>
            <Button variant="outlined" color="primary" fullWidth>
              View Analytics
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [open, setOpen] = useState(!isMobile);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'John Doe', subject: 'Project Update', date: '2024-02-20', unread: true },
    { id: 2, sender: 'Jane Smith', subject: 'Meeting Notes', date: '2024-02-19', unread: true },
    { id: 3, sender: 'Mike Johnson', subject: 'New Task', date: '2024-02-18', unread: false },
  ]);
  const [events, setEvents] = useState([
    { id: 1, title: 'Team Meeting', date: '2024-02-25', time: '10:00 AM' },
    { id: 2, title: 'Project Review', date: '2024-02-26', time: '2:00 PM' },
    { id: 3, title: 'Client Call', date: '2024-02-27', time: '11:00 AM' },
  ]);
  const [reports, setReports] = useState([
    { id: 1, title: 'Monthly Sales Report', date: '2024-02-01', status: 'Completed' },
    { id: 2, title: 'Q1 Performance', date: '2024-01-15', status: 'In Progress' },
    { id: 3, title: 'Annual Review', date: '2023-12-31', status: 'Completed' },
  ]);
  const [faqs, setFaqs] = useState([
    { id: 1, question: 'How do I reset my password?', answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page.' },
    { id: 2, question: 'How do I update my profile?', answer: 'Go to the Profile section and click on the edit button to update your information.' },
    { id: 3, question: 'How do I generate reports?', answer: 'Navigate to the Reports section and select the type of report you want to generate.' },
  ]);
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: 'English',
  });

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 second timeout

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        navigate('/');
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (menuId) => {
    setActiveMenuItem(menuId);
    setActiveItem(menuId);
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleLanguageChange = (event) => {
    setSettings(prev => ({
      ...prev,
      language: event.target.value
    }));
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render the appropriate content based on the active menu item
  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <DashboardContent />;
      case 'profile':
        return <ProfileContent user={user} onUpdateProfile={handleProfileUpdate} />;
      case 'messages':
        return <MessagesContent messages={messages} />;
      case 'calendar':
        return <CalendarContent events={events} />;
      case 'reports':
        return <ReportsContent reports={reports} />;
      case 'help':
        return <HelpContent faqs={faqs} />;
      case 'settings':
        return <SettingsContent settings={settings} onSettingChange={handleSettingChange} onLanguageChange={handleLanguageChange} />;
      default:
        return <DashboardContent />;
    }
  };

  if (!user) {
    return null;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'profile', label: 'Profile', icon: <PersonIcon /> },
    { id: 'messages', label: 'Messages', icon: <EmailIcon />, badge: 3 },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { id: 'reports', label: 'Reports', icon: <AssessmentIcon /> },
    { id: 'help', label: 'Help', icon: <HelpIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <DashboardContainer>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.id === activeItem)?.label || 'Dashboard'}
          </Typography>
          <IconButton color="inherit" onClick={handleNotificationsOpen}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <Avatar
              alt={user.displayName || user.email}
              src={user.photoURL}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>

      <StyledDrawer variant={isMobile ? "temporary" : "permanent"} open={open}>
        <DrawerHeader>
          {open && (
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
              My App
            </Typography>
          )}
          <IconButton onClick={handleDrawerToggle}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
        
        <UserProfile open={open}>
          <Avatar
            alt={user.displayName || user.email}
            src={user.photoURL}
            sx={{ 
              width: open ? 50 : 40, 
              height: open ? 50 : 40,
              border: '2px solid white'
            }}
          />
          {open && (
            <UserInfo open={open}>
              <Typography variant="subtitle1" fontWeight="bold">
                {user.displayName || 'User'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {user.email}
              </Typography>
            </UserInfo>
          )}
        </UserProfile>
        
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
        
        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <Tooltip 
              title={!open ? item.label : ""} 
              placement="right" 
              key={item.id}
            >
              <StyledListItem 
                button 
                onClick={() => handleNavigation(item.id)}
                active={activeItem === item.id ? 1 : 0}
              >
                <ListItemIcon>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {open && <ListItemText primary={item.label} />}
              </StyledListItem>
            </Tooltip>
          ))}
        </List>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
        
        <List>
          <Tooltip 
            title={!open ? "Logout" : ""} 
            placement="right"
          >
            <StyledListItem 
              button 
              onClick={handleLogout}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Logout" />}
            </StyledListItem>
          </Tooltip>
        </List>
      </StyledDrawer>

      <MainContent open={open} sx={{ backgroundColor: '#f5f5f5' }}>
        {renderContent()}
      </MainContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
      >
        <MenuItem onClick={handleNotificationsClose}>
          New message from John
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          System update available
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          Your report is ready
        </MenuItem>
      </Menu>
    </DashboardContainer>
  );
};

export default Dashboard; 