import React, { useState, useEffect } from 'react';
import api from '../services/api'; // API servisimizi import ediyoruz

function HomePage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Bileşen yüklendiğinde backend'deki '/hello' rotasına istek at
    api.get('/api/hello')
      .then(response => {
        setMessage(response.data); // Gelen "Backend çalışıyor!" mesajını state'e ata
      })
      .catch(error => {
        console.error('Backend ile bağlantı hatası!', error);
        setMessage('Backend\'e bağlanılamadı. (Sunucunun çalıştığından emin misin?)');
      });
  }, []); // [] boş dependency array, bu etkinin sadece bir kez çalışmasını sağlar

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