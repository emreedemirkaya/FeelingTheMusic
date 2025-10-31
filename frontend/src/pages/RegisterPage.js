import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './RegisterPage.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/api/auth/register', {
        username: username,
        email: email,
        password: password,
      });

      // Başarılı olursa...
      setLoading(false);
      alert('Kayıt başarılı! Lütfen giriş yapın.');
      navigate('/login'); // Kullanıcıyı giriş sayfasına yönlendir

    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Kayıt sırasında bilinmeyen bir hata oluştu.');
      }
      console.error('Kayıt hatası:', err);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card"> 
        <h2>Kayıt Ol</h2>
        <p className="register-description">
          Feeling the Music'i kullanmak için bir hesap oluşturun.
        </p>

        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
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
              minLength="6"
              required
            />
          </div>
          
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="login-link">
          <p>Zaten bir hesabınız var mı? <Link to="/login">Giriş Yap</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;