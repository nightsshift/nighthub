import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TermsPage from './pages/TermsPage';
import ChatPage from './pages/ChatPage';
import './styles/main.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TermsPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;