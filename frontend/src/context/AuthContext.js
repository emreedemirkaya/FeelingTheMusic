import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Token varsa, tüm API isteklerine bu token'ı ekle
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Şimdilik token'ın varlığını "giriş yapıldı" olarak kabul ediyoruz
      setUser({ token: token });
    }
    setLoading(false);
  }, [token]);

  const login = (jwtToken) => {
    localStorage.setItem('token', jwtToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    setToken(jwtToken);
    setUser({ token: jwtToken });
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const authContextValue = {
    user,
    token,
    loading,
    login,
    logout,
  };

  // loading bitene kadar alt bileşenleri render etme
  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Kendi hook'umuzu yapıyoruz
export const useAuth = () => {
  return useContext(AuthContext);
};