import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      console.error('Login error:', err);
      setError(
        err.response?.data?.detail ||
          'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 font-mono overflow-hidden relative">

      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080808]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
  onClick={() => navigate('/')}
  className="text-sm font-bold tracking-widest uppercase text-white hover:text-zinc-300 transition-colors"
>
  RoomJam
</button>

          <button
            onClick={() => navigate('/')}
            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Back
          </button>
        </div>
      </nav>

      <main className="relative z-10 min-h-screen flex items-center px-6 pt-14">
  <div className="max-w-7xl mx-auto w-full">

    <div className="grid lg:grid-cols-[450px_auto_1fr] gap-20 items-center">

      {/* LEFT LOGIN */}
      <div>

        <div className="border border-white/[0.06] bg-black/20">
         <div className="border border-white/[0.06] bg-black/20">
  <form
    onSubmit={handleSubmit}
    className="p-6 space-y-6"
  >

    {error && (
      <div className="border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400">
        {error}
      </div>
    )}

    <div>
      <label className="block mb-3 text-[11px] uppercase tracking-[0.25em] text-zinc-600">
        Email Address
      </label>

      <input
        type="email"
        name="email"
        required
        value={formData.email}
        onChange={handleChange}
        placeholder="name@company.com"
        className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 transition-colors"
      />
    </div>

    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-[11px] uppercase tracking-[0.25em] text-zinc-600">
          Password
        </label>

        <button
          type="button"
          className="text-[11px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
        >
          Forgot
        </button>
      </div>

      <input
        type="password"
        name="password"
        required
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 transition-colors"
      />
    </div>

    <div className="border-t border-white/[0.06]" />

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-white text-black py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white border border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Authenticating...' : 'Sign In →'}
    </button>

  </form>
</div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-zinc-600">
            New to RoomJam?{" "}
            <Link
              to="/register"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Create an account.
            </Link>
          </p>
        </div>

      </div>

      {/* CENTER DIVIDER */}
      <div className="hidden lg:block h-[550px] w-px bg-white/[0.06]" />

      {/* RIGHT HERO */}
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-zinc-600 mb-8">
          Authentication — RoomJam
        </p>

        <h1 className="text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight text-white mb-8">
          Enter
          <br />
          <span className="text-zinc-600">
            the room.
          </span>
        </h1>

        <p className="text-lg text-zinc-500 max-w-xl leading-relaxed">
          Continue collaborating on problems,
          systems, projects and ideas with your team in real time.
        </p>
      </div>

    </div>

  </div>
</main>
    </div>
  );
};

export default LoginPage;