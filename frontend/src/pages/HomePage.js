// frontend/src/pages/HomePage.js (Bölümlere Ayrılmış Tasarım)

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css'; 
// İkonları kullanmak için (opsiyonel, FontAwesome gibi bir kütüphane ekleyebilirsiniz)
// import { FaMusic, FaChartPie, FaQuestionCircle } from 'react-icons/fa'; 

function HomePage() {
  const { user } = useAuth(); 
  const navigate = useNavigate(); 

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleQuizRedirect = () => {
    navigate('/quiz');
  };

  return (
    <div className="home-page"> 
      {/* Hero Bölümü */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Feeling the Music</h1>
          <p className="slogan">Müziği Hisset, Ruhunu Keşfet.</p>
          <p className="description">
            O anki duygu durumunuza en uygun şarkıları ve çalma listelerini 
            keşfetmek için kişiselleştirilmiş testimizi çözün.
          </p>
          {user ? (
            <button className="cta-button hero-cta" onClick={handleQuizRedirect}>
              Duygu Testine Başla
            </button>
          ) : (
            <button className="cta-button hero-cta google" onClick={handleLoginRedirect}>
              Google ile Giriş Yap ve Başla
            </button>
          )}
        </div>
        {/* İsteğe bağlı: Sağ tarafa bir görsel eklenebilir */}
        {/* <div className="hero-image"> <img src="/path/to/image.svg" alt="Music illustration"/> </div> */}
      </section>

      {/* Özellikler Bölümü */}
      <section className="features-section">
        <h2>Uygulamanın Sundukları</h2>
        <div className="features-grid">
          <div className="feature-item">
            {/* <FaQuestionCircle className="feature-icon" /> */}
            <i className="feature-icon">❓</i> {/* İkon yerine emoji */}
            <h3>Kişiselleştirilmiş Test</h3>
            <p>Birkaç basit soruyla o anki duygu durumunuzu analiz edin.</p>
          </div>
          <div className="feature-item">
            {/* <FaChartPie className="feature-icon" /> */}
            <i className="feature-icon">📊</i> {/* İkon yerine emoji */}
            <h3>Duygu Geçmişi</h3>
            <p>Zaman içindeki duygu değişimlerinizi grafiklerle takip edin.</p>
          </div>
          <div className="feature-item">
            {/* <FaMusic className="feature-icon" /> */}
            <i className="feature-icon">🎵</i> {/* İkon yerine emoji */}
            <h3>Müzik Önerileri</h3>
            <p>Analiz sonuçlarına göre size özel şarkı önerileri alın.</p>
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır Bölümü (Opsiyonel) */}
      {/* <section className="how-it-works-section">
        <h2>Nasıl Çalışır?</h2>
        <div className="steps">
           <div className="step">Adım 1: Testi Çöz</div>
           <div className="step">Adım 2: Sonucu Gör</div>
           <div className="step">Adım 3: Müziği Keşfet</div>
        </div>
      </section> 
      */}

    </div> // home-page sonu
  );
}

export default HomePage;