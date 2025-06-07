import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (agreed) {
      navigate('/chat');
    }
  };

  return (
    <div className="home">
      <h1 className="logo">NightHub</h1>
      <p className="welcome">Welcome to NightHub, your anonymous 1-on-1 chat platform.</p>
      <div className="terms">
        <p>
          By using NightHub, you agree to our{' '}
          <Link to="/terms">Terms of Service</Link>. NightHub is not responsible for
          user interactions or content shared. You must be 18+ to use this platform.
        </p>
        <label>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          I agree to the Terms of Service
        </label>
      </div>
      <button
        className="start-chat"
        onClick={handleStartChat}
        disabled={!agreed}
      >
        Start Chat
      </button>
    </div>
  );
}

export default Home;