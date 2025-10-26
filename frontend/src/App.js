import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import QuizPage from './pages/QuizPage'; 
import HistoryPage from './pages/HistoryPage'; 
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/quiz" element={<QuizPage />} /> {/* YENİ */}
          <Route path="/history" element={<HistoryPage />} /> {/* YENİ */}
        </Routes>
      </div>
    </div>
  );
}

export default App;