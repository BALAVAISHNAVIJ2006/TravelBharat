import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const res = await axios.post(`${process.env.REACT_APP_API_URL}${endpoint}`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', formData.username);
      
      // Navigate to appropriate page and reload to ensure auth state is updated
      if (res.data.role === 'admin') {
        window.location.href = '/admin';
      } else {
        // force reload so App picks up new token state
        window.location.href = '/';
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to right, #667eea, #764ba2)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '24px', color: '#333' }}>
          {isRegister ? 'Register to TravelBharat' : 'Login to Explore India'}
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '6px', border: '1px solid #ddd' }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '6px', border: '1px solid #ddd' }}
          />
          {isRegister && (
            <div style={{ marginBottom: '10px' }}>
              <select
                name="role"
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', marginTop: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
              >
                <option value="user">User</option>
              </select>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                💡 Admin accounts are created by existing administrators only
              </p>
            </div>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        <button
          onClick={() => setIsRegister(!isRegister)}
          style={{
            marginTop: '16px',
            background: 'none',
            border: 'none',
            color: '#4f46e5',
            cursor: 'pointer'
          }}
        >
          {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
};

export default Login;