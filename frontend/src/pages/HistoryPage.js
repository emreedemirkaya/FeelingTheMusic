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
  happiness: '#4CAF50', // Yeşil
  sadness: '#2196F3',   // Mavi
  anger: '#F44336',     // Kırmızı
  calmness: '#03A9F4',  // Açık Mavi
  energy: '#FFC107',    // Sarı (Amber)
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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/quiz/get_history');
        setHistory(response.data);
      } catch (error) {
        console.error('Geçmiş verisi alınırken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []); 

  if (loading) {
    return <div className="history-container"><h2>Geçmiş yükleniyor...</h2></div>;
  }
  if (history.length === 0) {
    return (
      <div className="history-container">
        <h2>Duygu Geçmişim</h2>
        <p>Henüz tamamlanmış bir duygu testiniz bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>Duygu Geçmişim</h2>
      <p>İşte tamamladığınız testlerin sonuçları:</p>
      <div className="history-list">
        {history.map(entry => {
          
          let moodData = entry.mood_data;
          if (typeof moodData === 'string') {
            try { moodData = JSON.parse(moodData); } 
            catch (e) { moodData = {}; }
          }
          
          const chartData = formatDataForChart(moodData);
          const entryDate = new Date(entry.timestamp + 'Z').toLocaleString('tr-TR', {
            dateStyle: 'long',
            timeStyle: 'short',
            timeZone: 'Europe/Istanbul',
          });
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryPage;