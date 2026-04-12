import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

// Auth Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Dashboard Internal Pages
import Overview from './pages/Overview';
import Profile from './pages/Profile';
import Products from './pages/Products';
import Warranty from './pages/Warranty';
import ServiceRequest from './pages/ServiceRequest';
import ServiceTracking from './pages/ServiceTracking';
import History from './pages/History';
import Payment from './pages/Payment';
import Feedback from './pages/Feedback';

// Route Protection Component
const ProtectedRoute = ({ children }) => {
  const role = localStorage.getItem('userRole');
  if (!role) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

// Protect against logged-in users visiting auth pages
const AuthRoute = ({ children }) => {
  const role = localStorage.getItem('userRole');
  if (role) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AuthRoute><Landing /></AuthRoute>} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />

          {/* Protected Internal Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Overview /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/warranty" element={<ProtectedRoute><Warranty /></ProtectedRoute>} />
          <Route path="/request-service" element={<ProtectedRoute><ServiceRequest /></ProtectedRoute>} />
          <Route path="/tracking" element={<ProtectedRoute><ServiceTracking /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
