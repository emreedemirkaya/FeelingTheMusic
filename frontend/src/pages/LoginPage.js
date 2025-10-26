import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    console.log("Google Başarılı:", credentialResponse);

    // Bu Google token'ını backend'imize gönderip doğrulayacağız
    try {
      const response = await api.post('/api/auth/google/verify', {
        credential: credentialResponse.credential,
      });

      // Backend'den gelen bizim KENDİ JWT token'ımız
      const jwtToken = response.data.access_token;

      // Giriş işlemini global state'e işle
      login(jwtToken);

      // Kullanıcıyı ana sayfaya yönlendir
      navigate('/');

    } catch (error) {
      console.error('Google giriş doğrulaması hatası:', error);
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div>
      <h1>Giriş Yap</h1>
      <p>Devam etmek için Google hesabınızla giriş yapın.</p>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap // Ekranın köşesinde "Şu hesapla giriş yap" popup'ı da gösterir
      />
    </div>
  );
}

export default LoginPage;