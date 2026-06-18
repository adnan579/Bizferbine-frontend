// src/App.jsx
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import InsightsPage from './pages/InsightsPage';
import SearchPage from './pages/SearchPage';
import DealsPage from './pages/DealsPage';
import EventsPage from './pages/EventsPage';
import MessagesPage from './pages/MessagesPage';
import NetworkPage from './pages/NetworkPage';
import MentorshipPage from './pages/MentorshipPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import AdminPanelPage from './pages/AdminPanelPage';
import AdminLoginPage from './pages/AdminLoginPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


function App() {

  // --- NEW: GLOBAL WEBSOCKET LISTENER ---
  useEffect(() => {
    // Connect to the backend
    const socket = io('https://bizferbine-backend.onrender.com');

    // Listen for the Overseer Broadcast!
    socket.on('system_broadcast', (message) => {
      // In a real production app, you might use a toast library like react-toastify here.
      // For now, an instant native browser alert proves the speed!
      alert(`🚨 REAL-TIME ALERT: ${message}`);
    });

    // Cleanup the connection when the app closes
    return () => socket.disconnect();
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'fallback_id'}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:userId?" element={<ProfilePage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/mentorship" element={<MentorshipPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
        <Analytics />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;