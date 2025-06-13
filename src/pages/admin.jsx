import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => setIsAuthenticated(true))
        .catch(() => localStorage.removeItem('adminToken'));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/login`, {
        username,
        password,
      });
      localStorage.setItem('adminToken', data.token);
      setIsAuthenticated(true);
      setError('');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center p-8 font-montserrat">
        <div className="bg-[#2A2A2A] rounded-2xl p-8 max-w-sm w-full shadow-lg">
          <h1 className="text-3xl font-bold text-[#00BFFF] mb-6">Admin Login</h1>
          {error && <p className="text-[#FF69B4] mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-[#00BFFF] mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#3A3A3A] text-white border border-[#00BFFF] focus:outline-none"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-[#00BFFF] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#3A3A3A] text-white border border-[#00BFFF] focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#00BFFF] text-white p-3 rounded-xl font-bold hover:bg-[#A100F2] transition-transform transform hover:scale-105"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-8 font-montserrat">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-[#00BFFF]">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-[#FF69B4] text-white p-3 rounded-xl font-bold hover:bg-[#A100F2]"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#2A2A2A] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#00BFFF] mb-4">User Activities</h2>
            <p>Monitor chats, posts, and hub messages. [Placeholder]</p>
          </div>
          <div className="bg-[#2A2A2A] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#00BFFF] mb-4">Reports</h2>
            <p>View and resolve user reports. [Placeholder]</p>
          </div>
          <div className="bg-[#2A2A2A] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#00BFFF] mb-4">Bans</h2>
            <p>Ban users with custom durations. [Placeholder]</p>
          </div>
          <div className="bg-[#2A2A2A] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#00BFFF] mb-4">Alerts</h2>
            <p>Send site-wide or user-specific alerts. [Placeholder]</p>
          </div>
        </div>
      </div>
    </div>
  );
}
