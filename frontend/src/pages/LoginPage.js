// frontend/src/pages/LoginPage.js (Yeniden Tasarlandı)

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './LoginPage.css'; // Yeni stil dosyamızı import ediyoruz

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post('/api/auth/google/verify', {
        credential: credentialResponse.credential,
      });
      const jwtToken = response.data.access_token;
      login(jwtToken);
      navigate('/'); // Giriş başarılıysa ana sayfaya yönlendir
    } catch (error) {
      console.error('Google giriş doğrulaması hatası:', error);
      // Kullanıcıya bir hata mesajı gösterebiliriz
      alert('Google ile giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
    alert('Google ile giriş başarısız oldu.');
  };

  return (
    <div className="login-page-container"> {/* Sayfayı ortalamak için dış kapsayıcı */}
      <div className="login-card"> {/* İçerik kartı */}
        <h2>Giriş Yap</h2>
        <p className="login-description">
          Devam etmek ve duygu analizine başlamak için Google hesabınızla giriş yapın.
        </p>
        
        {/* Google Login Butonu */}
        <div className="google-login-button-container">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap // Ekranın köşesinde popup da gösterir (isteğe bağlı)
            theme="filled_blue" // Buton temasını ayarla (filled_black, outline)
            size="large" // Buton boyutunu ayarla (medium, small)
            shape="rectangular" // Buton şekli (pill, circle, square)
          />
        </div>

        {/* İsteğe bağlı: Alternatif giriş yöntemleri veya notlar buraya eklenebilir */}
        {/* <div className="login-alternatives">
          <p>Veya</p>
          <button>E-posta ile Giriş Yap (Henüz Aktif Değil)</button>
        </div> */}
      </div>
    </div>
  );
}

export default LoginPage;