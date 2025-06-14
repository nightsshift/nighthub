import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import ParticleBackground from './common/ParticleBackground';
import Button from './common/Button';

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
      <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center p-8 font-montserrat relative overflow-hidden">
        <ParticleBackground />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#2A2A2A] rounded-2xl p-8 max-w-sm w-full glassmorphism shadow-2xl z-10"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-bold text-[#00BFFF] mb-6"
          >
            Admin Login
          </motion.h1>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#FF69B4] mb-4"
            >
              {error}
            </motion.p>
          )}
          <form onSubmit={handleLogin}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <label className="block text-[#00BFFF] mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#3A3A3A] text-white border border-[#00BFFF] focus:outline-none focus:border-[#A100F2]"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <label className="block text-[#00BFFF] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#3A3A3A] text-white border border-[#00BFFF] focus:outline-none focus:border-[#A100F2]"
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                type="submit"
                className="w-full bg-[#00BFFF] text-white hover:bg-[#A100F2]"
              >
                Login
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-8 font-montserrat relative overflow-hidden">
      <ParticleBackground />
      <div className="max-w-4xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-[#00BFFF]"
          >
            Admin Dashboard
          </motion.h1>
          <Button
            onClick={handleLogout}
            className="bg-[#FF69B4] text-white hover:bg-[#A100F2]"
          >
            Logout
          </Button>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#2A2A2A] rounded-2xl p-6 glassmorphism"
          >
            <h2 className="text-2xl font-bold text-[#00BFFF] mb-4">User Activities</h2>
            <p>Monitor chats, posts, and hub messages. [Placeholder]</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#2A2A2A] rounded-2xl p-6 glassmorphism"
          >
            <h2 className="text-2xl font-bold text-[#00BFFF] mb-4">Reports</h2>
            <p>View and resolve user reports. [Placeholder]</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#2A2A2A] rounded-2xl p-6 glassmorphism"
          >
            <h2 className="text-2xl font-bold text-[#00BFFF] mb-4">Bans</h2>
            <p>Ban users with custom durations. [Placeholder]</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#2A2A2A] rounded-2xl p-6 glassmorphism"
          >
            <h2 className="text-2xl font-bold text-[#00BFFF] mb-4">Alerts</h2>
            <p>Send site-wide or user-specific alerts. [Placeholder]</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
