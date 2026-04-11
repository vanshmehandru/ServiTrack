import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

// Route Protection Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const role = localStorage.getItem('userRole');
  if (role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Also protect against logged-in users visiting auth pages
const AuthRoute = ({ children }) => {
  const role = localStorage.getItem('userRole');
  if (role === 'admin') return <Navigate to="/admin-dashboard" replace />;
  if (role === 'customer') return <Navigate to="/dashboard" replace />;
  return children;
};

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={
          <AuthRoute>
            <Landing />
          </AuthRoute>
        } />
        
        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        
        <Route path="/signup" element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="customer">
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
