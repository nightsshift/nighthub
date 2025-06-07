import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io('https://nighthub-backend.onrender.com', {
  withCredentials: true,
});

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isNSFW, setIsNSFW] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join', { nsfw: isNSFW });
    });

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, { text: msg, isSelf: false }]);
    });

    socket.on('partnerDisconnected', () => {
      setMessages([]);
      socket.emit('join', { nsfw: isNSFW });
    });

    return () => {
      socket.off('connect');
      socket.off('message');
      socket.off('partnerDisconnected');
      document.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, [isNSFW]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('message', message);
      setMessages((prev) => [...prev, { text: message, isSelf: true }]);
      setMessage('');
    }
  };

  const handleDisconnect = () => {
    socket.emit('disconnectRequest');
    setMessages([]);
    socket.emit('join', { nsfw: isNSFW });
  };

  const toggleNSFW = () => {
    setIsNSFW((prev) => !prev);
    setMessages([]);
    socket.emit('join', { nsfw: !isNSFW });
  };

  if (!isConnected) {
    return (
      <div className="chat loading">
        <div className="spinner"></div>
        <p>Connecting to a partner...</p>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chat-header">
        <h2>Chat</h2>
        <button className={`nsfw-toggle ${isNSFW ? 'nsfw-enabled' : ''}`} onClick={toggleNSFW}>
          {isNSFW ? 'NSFW On' : 'NSFW Off'}
        </button>
        <button className="report-btn">Report</button>
        <button className="disconnect-btn" onClick={handleDisconnect}>
          Disconnect
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isSelf ? 'self' : 'other'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;