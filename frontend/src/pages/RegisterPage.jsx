import { useState } from 'react';
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
    <div className="min-h-screen bg-black text-zinc-100 antialiased flex flex-col relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-900 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-900 rounded-full blur-[120px]" />
      </div>

      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.08] bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-[11px] font-bold tracking-[0.3em] uppercase text-white"
          >
            ROOMJAM
          </button>

          <button
            onClick={() => navigate('/')}
            className="text-[10px] font-bold tracking-widest text-zinc-500 hover:text-white transition-colors uppercase"
          >
            Back
          </button>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-600 uppercase">Onboarding</p>
              <h1 className="text-5xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1]">
                Join the <span className="text-zinc-500">community.</span>
              </h1>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
              Create your workspace and start collaborating on problems and ideas with your team in real time.
            </p>
          </div>

          <div className="premium-card rounded-2xl p-8 md:p-10 max-w-md w-full ml-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 border border-red-500/20 bg-red-500/5 text-xs text-red-400 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Confirm
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 premium-button-primary rounded-xl text-xs uppercase tracking-[0.2em] font-bold disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account →'}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[11px] text-zinc-600">
                Already have an account?{" "}
                <Link to="/login" className="text-zinc-400 hover:text-white transition-colors font-medium underline underline-offset-4">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;