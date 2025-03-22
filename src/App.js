import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HistoryQuizApp from './components/HistoryQuizApp';
import AdminPanel from './components/AdminPanel';
import { QuizProvider } from './contexts/QuizContext';
import './App.css';

function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <div className="App">
          {/* X Logo Background */}
          <div className="x-logo-background">X</div>
          
          <nav className="bg-gray-900 text-white p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <Link to="/" className="text-xl font-bold hover:text-gray-300">
                歴史クイズ
              </Link>
              <Link to="/admin" className="px-4 py-2 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600">
                管理画面
              </Link>
            </div>
          </nav>
          
          <Routes>
            <Route path="/" element={<HistoryQuizApp />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QuizProvider>
  );
}

export default App;