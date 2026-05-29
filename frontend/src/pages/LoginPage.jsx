import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col justify-center items-center px-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8">
           <button 
             onClick={() => navigate('/')}
             className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
           >
              <ArrowLeftIcon className="w-4 h-4" /> Back to Home
           </button>
        </div>

        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-xl">R</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">RoomJam</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-zinc-400 mt-2">Enter your credentials to access your workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email Address</label>
            <input 
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <button type="button" className="text-xs text-indigo-400 hover:underline">Forgot password?</button>
            </div>
            <input 
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-zinc-500 mt-8 text-sm">
          Don't have an account? <Link to="/register" className="text-indigo-400 hover:underline">Create one for free</Link>
        </p>
      </div>
    </div>
  );
};

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default LoginPage;
