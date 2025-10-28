import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth(); 

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">Feeling the Music</Link>
      <ul className="nav-menu">
        <li className="nav-item">
          <Link to="/" className="nav-link">Ana Sayfa</Link>
        </li>

        {user ? (
          <>
            <li className="nav-item">
              <Link to="/quiz" className="nav-link">Duygu Testi</Link>
            </li>
            <li className="nav-item">
              <Link to="/history" className="nav-link">Geçmişim</Link>
            </li>
            <li className="nav-item">
              <button onClick={logout} className="nav-link-button">
                Çıkış Yap
              </button>
            </li>
          </>
        ) : (
          // Kullanıcı giriş yapmamışsa
          <li className="nav-item">
            <Link to="/login" className="nav-link">Giriş Yap</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;