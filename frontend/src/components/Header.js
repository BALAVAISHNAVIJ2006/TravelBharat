import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('username') || 'User');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
    setMenuOpen(false);
    setProfileMenuOpen(false);
    window.location.reload();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setProfileMenuOpen(false);
    setMenuOpen(false);
  };

  return (
    <header>
      <div className="header-content">
        <Link to="/" className="logo">
          TravelBharat
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#333'
          }}
          className="mobile-menu-btn"
        >
          ☰
        </button>

        <nav style={{ display: menuOpen ? 'flex' : 'flex' }} className={menuOpen ? 'mobile-open' : ''}>
          <Link to="/" onClick={() => setMenuOpen(false)}>{t('home')}</Link>
          <Link to="/search" onClick={() => setMenuOpen(false)}>{t('search')}</Link>
          {token && role === 'admin' && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}>{t('admin')}</Link>
          )}
          {token ? (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {role !== 'admin' && (
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                  title={userName}
                >
                  👤
                </button>
              )}
              {profileMenuOpen && role !== 'admin' && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: '150px',
                  zIndex: 1000
                }}>
                  <div style={{ padding: '12px', borderBottom: '1px solid #eee', fontSize: '14px', fontWeight: '600' }}>
                    {userName}
                  </div>
                  <button
                    onClick={handleProfileClick}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={logout}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#ef4444',
                      borderTop: '1px solid #eee'
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
              {role === 'admin' && (
                <button 
                  onClick={logout}
                  style={{
                    padding: '8px 16px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {t('logout')}
                </button>
              )}
            </div>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>{t('login')}</Link>
          )}
          <LanguageSwitcher />
        </nav>
      </div>

      <style jsx="true">{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          
          header nav {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          
          header nav.mobile-open {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
