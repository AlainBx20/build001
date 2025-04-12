import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from './firebaseConfig';
import LoginRegister from './components/LoginRegister';
import Dashboard from './components/Dashboard';
import { CircularProgress, Box, Typography, Paper } from '@mui/material';

// Placeholder components for each route
const Profile = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Profile Page</Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>This is the profile page content.</Typography>
    </Paper>
  </Box>
);

const Messages = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Messages Page</Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>This is the messages page content.</Typography>
    </Paper>
  </Box>
);

const Calendar = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Calendar Page</Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>This is the calendar page content.</Typography>
    </Paper>
  </Box>
);

const Reports = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Reports Page</Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>This is the reports page content.</Typography>
    </Paper>
  </Box>
);

const Help = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Help Page</Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>This is the help page content.</Typography>
    </Paper>
  </Box>
);

const Settings = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Settings Page</Typography>
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography>This is the settings page content.</Typography>
    </Paper>
  </Box>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <LoginRegister />
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard /> : <Navigate to="/" />
          }
        />
        <Route
          path="/profile"
          element={
            user ? <Profile /> : <Navigate to="/" />
          }
        />
        <Route
          path="/messages"
          element={
            user ? <Messages /> : <Navigate to="/" />
          }
        />
        <Route
          path="/calendar"
          element={
            user ? <Calendar /> : <Navigate to="/" />
          }
        />
        <Route
          path="/reports"
          element={
            user ? <Reports /> : <Navigate to="/" />
          }
        />
        <Route
          path="/help"
          element={
            user ? <Help /> : <Navigate to="/" />
          }
        />
        <Route
          path="/settings"
          element={
            user ? <Settings /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
