import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import './QuizPage.css'; 

const questions = [
  { text: "Şu an hayattan keyif alıyorum.", emotion: "happiness" },
  { text: "Geleceğe dair iyimser ve umutluyum.", emotion: "happiness" },
  { text: "Kendimi biraz keyifsiz ve içe kapanık hissediyorum.", emotion: "sadness" },
  { text: "Son zamanlarda kolayca duygusallaşıyorum.", emotion: "sadness" },
  { text: "Yerimde duramıyorum, hareket etmek istiyorum.", emotion: "energy" },
  { text: "Yeni bir şeyler başarmak için kendimi motive hissediyorum.", emotion: "energy" },
  { text: "Zihnim berrak ve kendimi rahatlamış hissediyorum.", emotion: "calmness" },
  { text: "Şu anda gürültüden uzak, sakin bir ortamı tercih ederim.", emotion: "calmness" },
  { text: "Kolayca sinirleniyorum veya geriliyorum.", emotion: "anger" },
  { text: "İçimde bir huzursuzluk veya gerginlik var.", emotion: "anger" },
];

const options = [
  { text: "Kesinlikle Katılmıyorum", value: 1 },
  { text: "Katılmıyorum", value: 2 },
  { text: "Nötrüm", value: 3 },
  { text: "Katılıyorum", value: 4 },
  { text: "Kesinlikle Katılıyorum", value: 5 },
];

function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const calculateAndSubmit = async (finalAnswers) => {
    setLoading(true)
    let rawScores = { happiness: 0, sadness: 0, anger: 0, calmness: 0, energy: 0 };
    questions.forEach((q, index) => {
      const score = finalAnswers[index];
      rawScores[q.emotion] += score;
    });

    let totalRawScore = 0;
    for (const emotion in rawScores) {
      totalRawScore += rawScores[emotion];
    }
    
    let finalPercentages = {};
    if (totalRawScore === 0) {
        const numEmotions = Object.keys(rawScores).length;
        for (const emotion in rawScores) {
            finalPercentages[emotion] = 100 / numEmotions;
        }
    } else {
        for (const emotion in rawScores) {
            finalPercentages[emotion] = Math.round((rawScores[emotion] / totalRawScore) * 100);
        }
    }
    
    try {
      await api.post('/api/quiz/save_results', finalPercentages);
      navigate('/history');

    } catch (error) {
      console.error('Sonuçları kaydederken HATA:', error);
      let alertMesaji = 'Sonuçlar kaydedilemedi. Lütfen tekrar deneyin.';
      if (error.response) {
        const backendError = error.response.data?.error || JSON.stringify(error.response.data);
        alertMesaji = `Sunucudan Hata Alındı (Kod: ${error.response.status})\n\Mesaj: ${backendError}`;
      } else if (error.request) {
        alertMesaji = 'Sunucuya ulaşılamadı. Lütfen internet bağlantınızı veya CORS ayarlarınızı kontrol edin.';
      } else {
        alertMesaji = `Bir hata oluştu: ${error.message}`;
      }
      alert(alertMesaji);
      setLoading(false);
    }
  };

  const handleAnswerClick = (value) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateAndSubmit(newAnswers);
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <h1>Analiz ediliyor...</h1>
        <p>Duygu durumunuz hesaplanıyor ve profilinize kaydediliyor. Lütfen bekleyin.</p>
        <div className="loader"></div> 
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>Duygu Testi</h1>
        <span>Soru {currentQuestionIndex + 1} / {questions.length}</span>
      </div>
      <div className="quiz-question">
        <h2>{currentQuestion.text}</h2>
      </div>
      <div className="quiz-options">
        {options.map((option) => (
          <button
            key={option.value}
            className="quiz-option-btn"
            onClick={() => handleAnswerClick(option.value)}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizPage;