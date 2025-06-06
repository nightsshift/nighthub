import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';

const TermsPage = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleAgree = () => {
    if (agreed) {
      localStorage.setItem('termsAgreed', 'true');
      navigate('/chat');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <img src="/logo.png" alt="NightHub Logo" className="logo" />
        <h1>Welcome to NightHub</h1>
      </header>
      <main className="main-content">
        <h2>Terms of Service</h2>
        <p>
          By using NightHub, you agree to maintain respectful communication. 
          You are responsible for your actions. Do not share personal information.
          Violation may result in bans. [Add your full terms here].
        </p>
        <label>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          I agree to the Terms of Service
        </label>
        <button
          onClick={handleAgree}
          disabled={!agreed}
          className="btn primary"
        >
          Continue
        </button>
      </main>
    </div>
  );
};

export default TermsPage;