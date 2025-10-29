import React from 'react';
import './Footer.css'; 

function Footer() {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <p>&copy; {currentYear} Feeling the Music. Tüm hakları saklıdır.</p>
        {}
        {}
      </div>
    </footer>
  );
}

export default Footer;