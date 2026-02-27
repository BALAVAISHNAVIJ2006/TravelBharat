import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const UserProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      // Decode JWT to get user info (basic approach)
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        setUser({
          username: payload.username || username,
          role: localStorage.getItem('role') || 'user',
          createdAt: payload.createdAt || new Date().toLocaleDateString()
        });
      }
    } catch (error) {
      console.error('Error decoding user info:', error);
      setUser({ username, role: localStorage.getItem('role') || 'user' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
    window.location.reload();
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!user) {
    return (
      <div className="container text-center" style={{ padding: '60px 20px' }}>
        <h2>Unable to load profile</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '40px auto' }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ marginBottom: '32px', textAlign: 'center' }}>{t('profile') || 'My Profile'}</h1>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '16px'
            }}>
              👤
            </div>
            <h2 style={{ marginBottom: '8px' }}>{user.username}</h2>
            <p style={{ color: '#666', marginBottom: '4px' }}>
              <strong>Role:</strong> {user.role === 'admin' ? 'Administrator' : 'User'}
            </p>
            {user.createdAt && (
              <p style={{ color: '#999', fontSize: '14px' }}>
                Member since {user.createdAt}
              </p>
            )}
          </div>

          <div style={{
            background: '#f9fafb',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h3 style={{ marginBottom: '16px' }}>Account Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Username</p>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>{user.username}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Account Type</p>
                <p style={{ fontSize: '16px', fontWeight: '500' }}>
                  {user.role === 'admin' ? '🛡️ Administrator' : '👤 Regular User'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            {t('logout') || 'Logout'}
          </button>

          <Link
            to="/"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '12px',
              background: '#f3f4f6',
              color: '#333',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
