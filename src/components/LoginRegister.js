import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Divider, 
  Checkbox, 
  FormControlLabel, 
  CircularProgress, 
  InputAdornment, 
  IconButton, 
  Alert, 
  Snackbar,
  Paper,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { 
  auth, 
  googleProvider, 
  githubProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

// Main container
const AuthContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '1200px',
  maxWidth: '95vw',
  height: '800px',
  maxHeight: '95vh',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
  position: 'relative',
  margin: '0 auto',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    height: 'auto',
    maxHeight: '95vh',
  },
}));

// Left panel (forms container)
const FormsPanel = styled(Box)(({ theme }) => ({
  flex: '1 1 50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '60px',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#f8f9fa',
  transition: 'all 0.5s ease',
  '@media (max-width: 768px)': {
    padding: '40px 30px',
  },
}));

// Right panel (info container)
const InfoPanel = styled(Box)(({ theme }) => ({
  flex: '1 1 50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '60px',
  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  color: 'white',
  textAlign: 'center',
  position: 'relative',
  transition: 'all 0.5s ease',
  '@media (max-width: 768px)': {
    padding: '40px 30px',
  },
}));

// Form container
const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '500px',
  margin: '0 auto',
  transition: 'all 0.5s ease',
  transform: 'translateX(0)',
  opacity: 1,
  '&.slide-out': {
    transform: 'translateX(-100%)',
    opacity: 0,
  },
  '&.slide-in': {
    transform: 'translateX(100%)',
    opacity: 0,
  },
}));

// Form title
const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: '40px',
  fontWeight: 700,
  color: '#333',
  fontSize: '2.5rem',
}));

// Social button
const SocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginBottom: '20px',
  padding: '12px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1.1rem',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
}));

// Primary button
const PrimaryButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '14px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1.1rem',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
}));

// Info title
const InfoTitle = styled(Typography)(({ theme }) => ({
  marginBottom: '30px',
  fontWeight: 700,
  fontSize: '2.5rem',
}));

// Info text
const InfoText = styled(Typography)(({ theme }) => ({
  marginBottom: '40px',
  opacity: 0.9,
  fontSize: '1.2rem',
}));

// Chatbot container
const ChatbotContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '350px',
  height: '500px',
  borderRadius: '15px',
  overflow: 'hidden',
  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000,
  transform: 'translateY(100px) scale(0.95)',
  opacity: 0,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&.visible': {
    transform: 'translateY(0) scale(1)',
    opacity: 1,
  },
  '&.hiding': {
    transform: 'translateY(100px) scale(0.95)',
    opacity: 0,
  },
}));

// Chat header
const ChatHeader = styled(Box)(({ theme }) => ({
  padding: '15px',
  background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
  '&:hover': {
    background: 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)',
  },
}));

// Chat messages container
const ChatMessages = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: '15px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
}));

// Message bubble
const MessageBubble = styled(Box)(({ theme, isBot }) => ({
  maxWidth: '80%',
  padding: '10px 15px',
  borderRadius: '15px',
  backgroundColor: isBot ? '#f0f0f0' : '#6a11cb',
  color: isBot ? '#333' : 'white',
  alignSelf: isBot ? 'flex-start' : 'flex-end',
}));

// Chat input container
const ChatInput = styled(Box)(({ theme }) => ({
  padding: '15px',
  borderTop: '1px solid #eee',
  display: 'flex',
  gap: '10px',
}));

// Chat menu button
const ChatMenuButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  backgroundColor: '#6a11cb',
  color: 'white',
  width: '50px',
  height: '50px',
  borderRadius: '25px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  '&:hover': {
    backgroundColor: '#2575fc',
    transform: 'scale(1.1)',
  },
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'scale(0)',
  opacity: 0,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&.visible': {
    transform: 'scale(1)',
    opacity: 1,
  },
}));

// Login/Register component
const LoginRegister = () => {
  const navigate = useNavigate();
  // State for form toggle
  const [isLogin, setIsLogin] = useState(true);
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: false,
  });
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // State for loading
  const [loading, setLoading] = useState(false);
  
  // State for error
  const [error, setError] = useState('');
  
  // State for success message
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI assistant. How can I help you today?", isBot: true }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatbotHidden, setIsChatbotHidden] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isChatbotHidden) {
      const timer = setTimeout(() => {
        setShowChatbot(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isChatbotHidden]);

  // Handle form input change
  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    setFormData({
      ...formData,
      rememberMe: event.target.checked,
    });
  };

  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle between login and register
  const toggleForm = () => {
    setIsAnimating(true);
    const formContainer = document.querySelector('.form-container');
    formContainer.classList.add(isLogin ? 'slide-out' : 'slide-in');
    
    setTimeout(() => {
      setIsLogin(!isLogin);
      setError('');
      formContainer.classList.remove('slide-out', 'slide-in');
      setIsAnimating(false);
    }, 300);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAuthError('');
    
    try {
      if (isLogin) {
        // Sign in
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        // Register
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        // Update profile with name
        await updateProfile(userCredential.user, {
          displayName: formData.name
        });
      }
      
      setSuccess(isLogin ? 'Login successful!' : 'Registration successful!');
      setOpenSnackbar(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        rememberMe: false,
      });

      // Navigate to dashboard after successful login/registration
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setAuthError('');
    
    try {
      await signInWithPopup(auth, provider);
      setSuccess('Login successful!');
      setOpenSnackbar(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, isBot: false }]);
      setNewMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "I'm a demo chatbot. I can help you with general questions about our platform!", 
          isBot: true 
        }]);
      }, 1000);
    }
  };

  const handleToggleChatbot = () => {
    if (showChatbot) {
      setIsHiding(true);
      setTimeout(() => {
        setIsChatbotHidden(true);
        setShowChatbot(false);
        setIsHiding(false);
      }, 300); // Match the transition duration
    } else {
      setIsChatbotHidden(false);
      setShowChatbot(true);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f5f5f5'
      }}
    >
      <AuthContainer elevation={3}>
        <FormsPanel>
          <FormContainer 
            component="form" 
            onSubmit={handleSubmit}
            className={`form-container ${isAnimating ? (isLogin ? 'slide-out' : 'slide-in') : ''}`}
          >
            <Fade in={true} timeout={800}>
              <Box>
                <FormTitle variant="h4" align="center">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </FormTitle>
                
                {!isLogin && (
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  margin="normal"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                {isLogin && (
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={formData.rememberMe}
                        onChange={handleCheckboxChange}
                        color="primary"
                      />
                    }
                    label="Remember me"
                    sx={{ mt: 1 }}
                  />
                )}
                
                {(error || authError) && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error || authError}
                  </Alert>
                )}
                
                <PrimaryButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || isLoading}
                  sx={{ mt: 3, mb: 4 }}
                >
                  {loading || isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    isLogin ? 'Sign In' : 'Sign Up'
                  )}
                </PrimaryButton>
                
                <SocialButton
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={() => handleSocialLogin(googleProvider)}
                  disabled={loading || isLoading}
                  sx={{ mt: 2 }}
                >
                  Google
                </SocialButton>
                
                <SocialButton
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  onClick={() => handleSocialLogin(githubProvider)}
                  disabled={loading || isLoading}
                >
                  GitHub
                </SocialButton>
              </Box>
            </Fade>
          </FormContainer>
        </FormsPanel>
        
        <InfoPanel>
          <Fade in={true} timeout={1000}>
            <Box>
              <InfoTitle variant="h4">
                {isLogin ? 'New here?' : 'Welcome Back!'}
              </InfoTitle>
              
              <InfoText variant="body1">
                {isLogin 
                  ? "Sign up and discover great amount of new opportunities!" 
                  : "To keep connected with us please login with your personal info"}
              </InfoText>
              
              <PrimaryButton
                variant="outlined"
                color="inherit"
                onClick={toggleForm}
                sx={{
                  borderColor: 'white', 
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </PrimaryButton>
            </Box>
          </Fade>
        </InfoPanel>
        
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success">
            {success}
          </Alert>
        </Snackbar>
      </AuthContainer>

      {!isChatbotHidden && (
        <ChatbotContainer className={`${showChatbot ? 'visible' : ''} ${isHiding ? 'hiding' : ''}`}>
          <ChatHeader onClick={handleToggleChatbot}>
            <SmartToyIcon />
            <Typography variant="h6">AI Assistant</Typography>
          </ChatHeader>
          
          <ChatMessages>
            {messages.map((message, index) => (
              <MessageBubble key={index} isBot={message.isBot}>
                <Typography variant="body1">{message.text}</Typography>
              </MessageBubble>
            ))}
          </ChatMessages>
          
          <ChatInput>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <IconButton 
              color="primary" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </ChatInput>
        </ChatbotContainer>
      )}

      {isChatbotHidden && (
        <ChatMenuButton 
          onClick={handleToggleChatbot}
          className={isChatbotHidden ? 'visible' : ''}
        >
          <SmartToyIcon />
        </ChatMenuButton>
      )}
    </Box>
  );
};

export default LoginRegister; 