import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
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
      toast.error('Passwords do not match.');
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
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to create account.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 font-mono overflow-y-auto lg:overflow-hidden relative">

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

      <main className="relative z-10 min-h-screen flex items-center px-6 pt-24 pb-12 lg:pt-14">

        <div className="max-w-7xl mx-auto w-full">

          <div className="grid grid-cols-1 lg:grid-cols-[460px_auto_1fr] gap-12 lg:gap-20 items-center">

            {/* LEFT SIDE */}
            <div className="order-2 lg:order-1">

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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

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
                  Already in the community?{' '}
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
            <div className="hidden lg:block h-[600px] w-px bg-white/[0.06] order-2" />

            {/* RIGHT SIDE */}
            <div className="order-1 lg:order-3">

              <p className="text-xs tracking-[0.35em] uppercase text-zinc-600 mb-6 lg:mb-10">
                All rights reserved — RoomJam
              </p>

              <h1 className="text-5xl md:text-7xl xl:text-8xl font-bold leading-[0.92] tracking-tight text-white mb-6 lg:mb-8">
                Join
                <br />
                <span className="text-zinc-600">
                   community.
                </span>
              </h1>

              <p className="text-base lg:text-lg text-zinc-500 leading-relaxed max-w-xl mb-6 lg:mb-12">
                Create your workspace and start
                collaborating on  problems and
                ideas with your
                team in real time.
              </p>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default RegisterPage;