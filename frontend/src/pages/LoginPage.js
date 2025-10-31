import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './LoginPage.css'; 

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleLocalLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', {
        email: email,
        password: password,
      });
      
      const jwtToken = response.data.access_token;
      login(jwtToken);
      navigate('/');

    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Giriş sırasında bilinmeyen bir hata oluştu.');
      }
      console.error('Yerel giriş hatası:', err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post('/api/auth/google/verify', {
        credential: credentialResponse.credential,
      });
      const jwtToken = response.data.access_token;
      login(jwtToken);
      navigate('/');
    } catch (error) {
      console.error('Google giriş doğrulaması hatası:', error);
      alert('Google ile giriş yapılırken bir hata oluştu.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    alert('Google ile giriş başarısız oldu.');
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        
        <h2>Giriş Yap</h2>
        <p className="login-description">
          Hesabınıza giriş yapın veya Google ile devam edin.
        </p>

        <form onSubmit={handleLocalLogin} className="local-login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">E-posta Adresi</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button-local" disabled={loading}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        {/* AYIRICI (OR) */}
        <div className="divider">
          <span>VEYA</span>
        </div>

        {/* Google Login Butonu */}
        <div className="google-login-button-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_blue"
            size="large"
            shape="rectangular"
          />
        </div>
        <div className="register-link">
          <p>Hesabınız yok mu? <Link to="/register">Hemen Kayıt Ol</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;