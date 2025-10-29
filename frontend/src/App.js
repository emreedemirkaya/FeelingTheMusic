import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage'; 
import HistoryPage from './pages/HistoryPage'; 
import './App.css';

function App() {
  return (
    <div className="App"> {/* Ana kapsayıcı */}
      <Navbar /> {/* Header (Üst Bilgi) */}
      
      {/* Ana içerik alanı */}
      <main className="main-content"> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          <Route path="/quiz" element={<QuizPage />} /> 
          <Route path="/history" element={<HistoryPage />} /> 
        </Routes>
      </main>

      <Footer /> {/* Footer (Alt Bilgi) */}
    </div>
  );
}

export default App;