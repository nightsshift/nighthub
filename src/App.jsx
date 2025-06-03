// File: App.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => socket.off('message');
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit('message', message);
    setChat((prev) => [...prev, `You: ${message}`]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Night Hub - Anonymous Chat</h1>
      <div className="bg-gray-900 w-full max-w-xl p-4 rounded-lg shadow-lg">
        <div className="h-96 overflow-y-auto mb-4 p-2 bg-gray-800 rounded">
          {chat.map((msg, i) => (
            <div key={i} className="mb-1">{msg}</div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex">
          <input
            className="flex-1 p-2 rounded-l bg-gray-700 text-white focus:outline-none"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-blue-600 px-4 py-2 rounded-r">Send</button>
        </form>
      </div>
    </div>
  );
}
