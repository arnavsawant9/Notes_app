import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Notes App</Link>
      </div>
      <div className="navbar-links">
        {currentUser ? (
          <React.Fragment>
            <Link to="/" className="nav-link">My Notes</Link>
            <Link to="/create" className="nav-link">Create Note</Link>
            <span className="welcome-message">Welcome, {currentUser.name}</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </React.Fragment>
        )}
      </div>
    </nav>
  );
};

export default Navbar;