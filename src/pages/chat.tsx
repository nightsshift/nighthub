import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Gif } from '@giphy/react-components';

const giphy = new GiphyFetch('QSNw09um5JwDRXN38T1kSqwrz1DNV1hh');

interface Message {
  id: string;
  text?: string;
  gifId?: string;
  sender: 'you' | 'stranger';
}

const Chat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [tags, setTags] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifs, setGifs] = useState<any[]>([]);
  const chatLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io('https://nighthub-backend.onrender.com', {
      transports: ['websocket'],
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join', tags.split(',').map((t) => t.trim()).filter((t) => t));
      new Audio('/assets/Notification.mp3').play();
    });

    newSocket.on('paired', () => {
      setMessages([]);
      setIsConnected(true);
      new Audio('/assets/Notification.mp3').play();
    });

    newSocket.on('message', (data: { text?: string; gifId?: string }) => {
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), ...data, sender: 'stranger' },
      ]);
      new Audio('/assets/Notification.mp3').play();
    });

    newSocket.on('typing', (typing: boolean) => {
      setIsTyping(typing);
    });

    newSocket.on('disconnected', () => {
      setIsConnected(false);
      setMessages([]);
      newSocket.emit('join', tags.split(',').map((t) => t.trim()).filter((t) => t));
    });

    newSocket.on('error', (msg: string) => {
      alert(`Error: ${msg}`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [tags]);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && socket) {
      socket.emit('message', { text: input });
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), text: input, sender: 'you' },
      ]);
      setInput('');
      socket.emit('typing', false);
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', true);
      clearTimeout(window.typingTimeout);
      window.typingTimeout = setTimeout(() => {
        socket.emit('typing', false);
      }, 1000);
    }
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.emit('leave');
    }
  };

  const handleReport = () => {
    if (socket) {
      socket.emit('report', { reason: prompt('Reason for report:') });
    }
  };

  const fetchGifs = async () => {
    const { data } = await giphy.trending({ limit: 10 });
    setGifs(data);
  };

  const sendGif = (gif: any) => {
    if (socket) {
      socket.emit('message', { gifId: gif.id });
      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), gifId: gif.id, sender: 'you' },
      ]);
      setShowGifPicker(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4 md:p-8">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold font-poppins">NightHub Chat</h1>
        <div className="flex gap-2">
          <button
            onClick={handleDisconnect}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
            title="Disconnect"
          >
            Disconnect
          </button>
          <button
            onClick={handleReport}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            title="Report User"
          >
            Report
          </button>
          <button
            onClick={() => {
              setShowGifPicker(!showGifPicker);
              if (!showGifPicker) fetchGifs();
            }}
            className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600"
            title="Send GIF"
          >
            GIF
          </button>
        </div>
      </header>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Enter tags (comma-separated, optional)"
          className="w-full max-w-md bg-gray-800 text-white p-3 rounded-lg border border-cyan-500 focus:outline-none focus:border-cyan-300"
        />
        <div
          ref={chatLogRef}
          className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-200px)]"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 ${msg.sender === 'you' ? 'text-right' : 'text-left'}`}
            >
              {msg.text && (
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === 'you' ? 'bg-cyan-500' : 'bg-gray-700'
                  }`}
                >
                  {msg.text}
                </span>
              )}
              {msg.gifId && <Gif gif={{ id: msg.gifId }} width={200} />}
            </div>
          ))}
          {isTyping && (
            <div className="text-gray-400 text-sm">Stranger is typing...</div>
          )}
        </div>
        {showGifPicker && (
          <div className="grid grid-cols-2 gap-2 bg-gray-800 p-4 rounded-lg">
            {gifs.map((gif) => (
              <button key={gif.id} onClick={() => sendGif(gif)}>
                <Gif gif={gif} width={100} />
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 text-white p-3 rounded-lg border border-cyan-500 focus:outline-none focus:border-cyan-300"
          />
          <button
            onClick={handleSend}
            className="bg-cyan-500 text-white px-4 py-3 rounded-lg hover:bg-cyan-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;