import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const response = await api.post('/auth/register', payload);

      localStorage.setItem('token', response.data.access_token);

      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);

      setError(
        err.response?.data?.detail ||
        'Failed to create account.'
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

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080808]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

          <Link
            to="/"
            className="text-sm font-bold tracking-widest uppercase text-white hover:text-zinc-300 transition-colors"
          >
            RoomJam
          </Link>

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

          <div className="grid lg:grid-cols-[460px_auto_1fr] gap-20 items-center">

            {/* LEFT SIDE */}
            <div>

              <div className="border border-white/[0.06] bg-black/20">

                <div className="border-b border-white/[0.06] px-6 py-4">
                  <h2 className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                    Create Account
                  </h2>
                </div>

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
                      Username
                    </label>

                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

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

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <label className="block mb-3 text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                        Password
                      </label>

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

                    <div>
                      <label className="block mb-3 text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                        Confirm
                      </label>

                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>

                  </div>

                  <div className="border-t border-white/[0.06]" />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black py-3 text-xs uppercase tracking-[0.2em] font-bold border border-white hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? 'Creating Account...'
                      : 'Create Account →'}
                  </button>

                </form>

              </div>

              <div className="mt-8">
                <p className="text-sm text-zinc-600">
                  Already in the room?{' '}
                  <Link
                    to="/login"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Sign in.
                  </Link>
                </p>
              </div>

            </div>

            {/* Divider */}
            <div className="hidden lg:block h-[600px] w-px bg-white/[0.06]" />

            {/* RIGHT SIDE */}
            <div>

              <p className="text-xs tracking-[0.35em] uppercase text-zinc-600 mb-10">
                Prototype 01 — RoomJam
              </p>

              <h1 className="text-7xl xl:text-8xl font-bold leading-[0.92] tracking-tight text-white mb-8">
                Join
                <br />
                <span className="text-zinc-600">
                  the room.
                </span>
              </h1>

              <p className="text-lg text-zinc-500 leading-relaxed max-w-xl mb-12">
                Create your workspace and start
                collaborating on coding problems,
                system designs and ideas with your
                team in real time.
              </p>

              <div className="grid grid-cols-2 gap-8 max-w-lg">

                <div className="border-t border-white/[0.06] pt-5">
                  <p className="text-white text-sm mb-2">
                    Problem-Centric
                  </p>
                  <p className="text-zinc-600 text-sm leading-relaxed">
                    Every room begins with a problem
                    and keeps all context together.
                  </p>
                </div>

                <div className="border-t border-white/[0.06] pt-5">
                  <p className="text-white text-sm mb-2">
                    Real-Time
                  </p>
                  <p className="text-zinc-600 text-sm leading-relaxed">
                    Collaborate instantly with shared
                    code, notes, whiteboards and chat.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default RegisterPage;