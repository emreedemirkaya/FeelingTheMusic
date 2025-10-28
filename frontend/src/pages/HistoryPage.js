import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ResponsiveContainer, 
  PieChart,
  Pie,
  Cell,
  Tooltip, 
  Legend 
} from 'recharts';
import './HistoryPage.css';

const emotionTranslations = {
  happiness: 'Mutluluk',
  sadness: 'Hüzün',
  anger: 'Öfke',
  calmness: 'Sakinlik',
  energy: 'Enerji',
};
const COLORS = {
  happiness: '#4CAF50', 
  sadness: '#2196F3',   
  anger: '#F44336',     
  calmness: '#03A9F4',  
  energy: '#FFC107',    
};
const formatDataForChart = (moodData) => {
  return Object.keys(moodData)
    .map(key => ({
      name: emotionTranslations[key] || key, 
      value: moodData[key],                 
      key: key                              
    }))
    .filter(entry => entry.value > 0); 
};
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  if ((percent * 100) < 5) {
    return null;
  }
  const radius = outerRadius * 1.15;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontSize: '13px', fontWeight: '500' }}
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preference, setPreference] = useState(null); 
  const [musicLoading, setMusicLoading] = useState({});
  const [musicResults, setMusicResults] = useState({});

  const handlePreferenceChange = async (e) => {
    const newPref = e.target.value;
    try {
      setPreference(newPref); 
      await api.post('/api/user/preference', { preference: newPref });
    } catch (error) {
      console.error('Tercih güncellenirken hata:', error);
      alert('Tercihiniz kaydedilemedi, lütfen tekrar deneyin.');
    }
  };

  const fetchMusicRecommendations = async (historyEntry) => {
    const entryId = historyEntry.id;
    setMusicLoading(prev => ({ ...prev, [entryId]: true }));
    setMusicResults(prev => ({ ...prev, [entryId]: null })); 

    let moodData = historyEntry.mood_data;
    if (typeof moodData === 'string') {
        try { moodData = JSON.parse(moodData); } 
        catch (e) { moodData = {}; }
    }

    try {
      const response = await api.post('/api/music/recommendations', moodData);
      setMusicResults(prev => ({ ...prev, [entryId]: response.data || [] }));
    } catch (error) {
      console.error('Müzik önerisi alınırken hata:', error);
      setMusicResults(prev => ({ ...prev, [entryId]: 'error' }));
    } finally {
      setMusicLoading(prev => ({ ...prev, [entryId]: false }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const historyPromise = api.get('/api/quiz/get_history');
        const preferencePromise = api.get('/api/user/preference');

        const [historyResponse, preferenceResponse] = await Promise.all([
          historyPromise,
          preferencePromise
        ]);

        setHistory(historyResponse.data);
        setPreference(preferenceResponse.data.preference); 
        
      } catch (error) {
        console.error('Veri alınırken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  if (loading) {
    return <div className="history-container"><h2>Geçmiş yükleniyor...</h2></div>;
  }
  
  return (
    <div className="history-container">
      <h2>Duygu Geçmişim</h2>
      
      <div className="preference-selector">
        <h4>Müzik Öneri Tercihi</h4>
        <p>Grafik sonuçlarına göre yapılacak müzik önerileri için varsayılan tercihinizi seçin.</p>
        
        {preference !== null && (
          <div className="preference-options">
            <label className={preference === 'local' ? 'active' : ''}>
              <input 
                type="radio" 
                name="preference"
                value="local" 
                checked={preference === 'local'} 
                onChange={handlePreferenceChange} 
              /> 
              <span>Yerli</span>
            </label>
            <label className={preference === 'foreign' ? 'active' : ''}>
              <input 
                type="radio" 
                name="preference"
                value="foreign" 
                checked={preference === 'foreign'} 
                onChange={handlePreferenceChange} 
              /> 
              <span>Yabancı</span>
            </label>
            <label className={preference === 'mixed' ? 'active' : ''}>
              <input 
                type="radio" 
                name="preference"
                value="mixed" 
                checked={preference === 'mixed'} 
                onChange={handlePreferenceChange} 
              /> 
              <span>Karışık</span>
            </label>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <p>Henüz tamamlanmış bir duygu testiniz bulunmuyor.</p>
      ) : (
        <>
          <p style={{marginTop: '2rem'}}>İşte tamamladığınız testlerin sonuçları:</p>
          <div className="history-list">
            {history.map(entry => {
              
              const chartData = formatDataForChart(entry.mood_data);
              const entryDate = new Date(entry.timestamp + 'Z').toLocaleString('tr-TR', {
                dateStyle: 'long',
                timeStyle: 'short',
                timeZone: 'Europe/Istanbul',
              });
              const isLoadingMusic = musicLoading[entry.id];
              const tracks = musicResults[entry.id];

              return (
                <div key={entry.id} className="history-card">
                  <h3 className="card-date">{entryDate}</h3>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={renderCustomizedLabel}
                          outerRadius={100} 
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((dataEntry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[dataEntry.key] || '#8884d8'} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend /> 
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="music-recommendation-section">
                    <button 
                      className="recommend-btn"
                      onClick={() => fetchMusicRecommendations(entry)}
                      disabled={isLoadingMusic}
                    >
                      {isLoadingMusic ? 'Şarkılar Aranıyor...' : 'Bu Duyguya Uygun Müzik Bul'}
                    </button>

                    {isLoadingMusic && (
                      <div className="loader small-loader"></div>
                    )}

                    {tracks === 'error' && (
                      <p className="error-message">Müzik önerileri alınamadı. Lütfen tekrar deneyin.</p>
                    )}

                    {Array.isArray(tracks) && tracks.length > 0 && (
                      <div className="track-list">
                        <h4>İşte Sana Özel Öneriler:</h4>
                        {tracks.map(track => (
                          <div key={track.id} className="track-item">
                            <img src={track.album_art} alt={track.name} className="track-album-art" />
                            <div className="track-info">
                              <span className="track-name">{track.name}</span>
                              <span className="track-artist">{track.artist}</span>
                            </div>
                            {track.preview_url && (
                              <audio controls src={track.preview_url} className="track-preview"></audio>
                            )}
                            <a href={track.url} target="_blank" rel="noopener noreferrer" className="spotify-link">
                              Spotify'da Aç
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {Array.isArray(tracks) && tracks.length === 0 && (
                      <p>Bu duyguya uygun öneri bulunamadı.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default HistoryPage;