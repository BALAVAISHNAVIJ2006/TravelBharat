import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import StateList from './pages/StateList';
import PlaceDetails from './pages/PlaceDetails';
import Search from './pages/Search';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';

// Protected Route Component
const ProtectedRoute = ({ element, isAuthenticated, userRole }) => {
  return isAuthenticated && userRole === 'admin' ? element : <Navigate to="/login" replace />;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  // Listen for storage changes (handles login from other tabs/windows)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/state/:state" element={<StateList />} />
          <Route path="/place/:id" element={<PlaceDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={token ? <UserProfile /> : <Navigate to="/login" replace />} />
          <Route 
            path="/admin" 
            element={<ProtectedRoute element={<AdminDashboard />} isAuthenticated={!!token} userRole={role} />} 
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
