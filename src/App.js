import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HistoryQuizApp from './components/HistoryQuizApp';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav className="bg-indigo-800 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold hover:text-amber-300">
              歴史クイズ
            </Link>
            <Link to="/admin" className="px-4 py-2 bg-amber-500 text-indigo-900 rounded-lg font-bold hover:bg-amber-400">
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
  );
}

export default App;