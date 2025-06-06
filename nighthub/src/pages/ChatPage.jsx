import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { GiphyFetch } from '@giphy/js-fetch-api';
import GifPicker from '../components/GifPicker';
import ReportModal from '../components/ReportModal';
import { socket } from '../socket';
import '../styles/main.css';

const giphy = new GiphyFetch('QSNw09um5JwDRXN38T1kSqwrz1DNV1hh');

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [peer, setPeer] = useState(null);
  const [tags, setTags] = useState([]);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem('termsAgreed')) {
      navigate('/');
    }

    // Initialize WebRTC
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    const dc = pc.createDataChannel('chat');
    dc.onmessage = (e) => {
      setMessages((prev) => [...prev, { sender: 'them', content: e.data }]);
    };
    setPeer(pc);

    // Socket.IO for pairing
    socket.emit('join', { tags });

    socket.on('paired', async ({ offer, userId }) => {
      if (offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { answer, userId });
      }
    });

    socket.on('offer', async ({ offer, userId }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { answer, userId });
    });

    socket.on('answer', ({ answer }) => {
      pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', ({ candidate }) => {
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) socket.emit('ice-candidate', { candidate });
    };

    socket.on('banned', () => {
      alert('You have been banned due to multiple reports.');
      navigate('/');
    });

    return () => {
      pc.close();
      socket.disconnect();
    };
  }, [tags, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message && peer?.signalingState === 'stable') {
      peer.datachannel.send(message);
      setMessages((prev) => [...prev, { sender: 'me', content: message }]);
      setMessage('');
    }
  };

  const handleTagSubmit = (e) => {
    e.preventDefault();
    const tagInput = e.target.elements.tags.value.split(',').map(t => t.trim()).filter(t => t);
    setTags(tagInput);
    socket.emit('update-tags', tagInput);
  };

  const handleReport = (reason) => {
    socket.emit('report', { reason });
    setShowReportModal(false);
  };

  return (
    <div className="container">
      <header className="header">
        <img src="/logo.png" alt="NightHub Logo" className="logo" />
        <h1>NightHub Chat</h1>
      </header>
      <main className="main-content">
        <form onSubmit={handleTagSubmit} className="tag-form">
          <input
            type="text"
            name="tags"
            placeholder="Enter tags (e.g., gaming, music)"
            className="input"
          />
          <button type="submit" className="btn">Update Tags</button>
        </form>
        <div className="chat-window">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              {msg.content.startsWith('https://media.giphy.com') ? (
                <img src={msg.content} alt="GIF" className="gif" />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="input"
          />
          <button onClick={() => setShowGifPicker(!showGifPicker)} className="btn">
            GIF
          </button>
          <button onClick={sendMessage} className="btn primary">
            Send
          </button>
          <button onClick={() => setShowReportModal(true)} className="btn danger">
            Report
          </button>
        </div>
        {showGifPicker && (
          <GifPicker
            giphy={giphy}
            onSelect={(gif) => {
              peer.datachannel.send(gif.url);
              setMessages((prev) => [...prev, { sender: 'me', content: gif.url }]);
              setShowGifPicker(false);
            }}
          />
        )}
        {showReportModal && (
          <ReportModal
            onSubmit={handleReport}
            onClose={() => setShowReportModal(false)}
          />
        )}
      </main>
    </div>
  );
};

export default ChatPage;