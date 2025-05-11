import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Функция для отображения имени пользователя
  const getUserDisplayName = () => {
    if (!currentUser) return 'My Profile';
    
    // Try to find username in different fields
    return currentUser.username || currentUser.name || currentUser.email.split('@')[0];
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="logo-text">
            <span>Find</span>
            <span>My</span>
            <span className="pet">Pet</span>
          </span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pets">Pet Post</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/map">Pet Map</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shop">Pet Shop</Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            <div className="search-bar me-3">
              <input 
                type="text" 
                placeholder="Search" 
                className="border-0 bg-transparent"
                style={{ outline: 'none' }}
              />
              <button className="btn btn-sm bg-transparent">
                <i className="bi bi-search"></i>
              </button>
            </div>
            
            {isAuthenticated() ? (
              <div className="d-flex align-items-center">
                {/* Иконка уведомлений */}
                <div className="dropdown me-3">
                  <button className="btn btn-sm btn-outline-secondary position-relative" type="button">
                    <i className="bi bi-bell"></i>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      3
                    </span>
                  </button>
                </div>
                
                {/* Меню пользователя */}
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center" 
                    type="button" 
                    id="userDropdown" 
                    data-bs-toggle="dropdown"
                  >
                    <span className="me-2 d-none d-md-inline">{getUserDisplayName()}</span>
                    <div className="rounded-circle bg-light text-center" style={{width: '32px', height: '32px', lineHeight: '32px'}}>
                      <i className="bi bi-person"></i>
                    </div>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>Profile</Link></li>
                    <li><Link className="dropdown-item" to="/my-pets"><i className="bi bi-clipboard-check me-2"></i>My Posts</Link></li>
                    <li><Link className="dropdown-item" to="/settings"><i className="bi bi-gear me-2"></i>Settings</Link></li>
                    <li><Link className="dropdown-item" to="/notifications"><i className="bi bi-bell me-2"></i>Notifications</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <Link to="/login" className="btn btn-outline-secondary me-2">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 