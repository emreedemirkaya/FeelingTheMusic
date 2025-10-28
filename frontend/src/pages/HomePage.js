import React, { useState, useEffect } from 'react';
import api from '../services/api';

function HomePage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/api/hello')
      .then(response => {
        setMessage(response.data); 
      })
      .catch(error => {
        console.error('Backend ile bağlantı hatası!', error);
        setMessage('Backend\'e bağlanılamadı. (Sunucunun çalıştığından emin misin?)');
      });
  }, []); 

  return (
    <div>
      <h1>Ana Sayfa</h1>
      <p>Projenize hoş geldiniz.</p>
      <p>
        <strong>Backend'den gelen mesaj:</strong> {message}
      </p>
    </div>
  );
}

export default HomePage;