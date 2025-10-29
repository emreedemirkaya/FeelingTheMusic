import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const shouldShowLogoutButton = user && currentPath !== '/quiz' && currentPath !== '/history';
  const shouldShowLoginButton = !user && currentPath !== '/quiz' && currentPath !== '/history';

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="site-logo">
          <img
            src="/logo.png" // Veya logo.svg
            alt="Feeling the Music Logo"
            className="logo-image"
          />
          <span className="logo-text">Feeling The Music</span>
        </Link>
        <nav className="main-navigation">
           <ul>
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                Ana Sayfa
              </NavLink>
            </li>
            {user && (
              <>
                <li>
                  <NavLink to="/quiz" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Duygu Testi
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/history" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Geçmişim
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          {shouldShowLogoutButton && (
            <button onClick={logout} className="logout-button">
              Çıkış Yap
            </button>
          )}
          {shouldShowLoginButton && (
            <Link to="/login" className="login-button">
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;