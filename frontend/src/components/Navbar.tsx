import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#333',
      color: 'white',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
          🍬 Sweet Shop
        </Link>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', marginLeft: '20px' }}>Home</Link>
        <Link to="/sweets" style={{ color: 'white', textDecoration: 'none', marginLeft: '15px' }}>Sweets</Link>
        {isAdmin && (
          <Link to="/admin" style={{ color: 'white', textDecoration: 'none', marginLeft: '15px' }}>Admin</Link>
        )}
      </div>
      
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '15px' }}>
              Welcome, {user.name}
              {isAdmin && <span style={{ background: 'red', padding: '2px 6px', borderRadius: '3px', marginLeft: '8px' }}>ADMIN</span>}
            </span>
            <button 
              onClick={handleLogout}
              style={{
                background: 'transparent',
                color: 'white',
                border: '1px solid white',
                padding: '5px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;