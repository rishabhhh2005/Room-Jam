import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';

const CreateRoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    problem_statement: '',
    context: '',
    tags: '',
    is_public: true
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();

    if (location.state?.template) {
      const { template } = location.state;
      setFormData({
        title: template.title,
        problem_statement: template.problem_statement,
        context: template.context || '',
        tags: template.tags.join(', '),
        is_public: true
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== '')
      };

      const response = await api.post('/rooms', payload);
      toast.success('Workspace deployed successfully!');
      navigate(`/room/${response.data.room_key}`);
    } catch (err) {
      console.error("Error creating room:", err);
      const errorMessage = err.response?.data?.detail || 'Failed to create room. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 antialiased flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-4xl w-full mx-auto px-6 pt-24 pb-20 flex-1">
        <header className="mb-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white inline-flex items-center gap-2 mb-6 transition-colors"
          >
            ← Back to DashBoard
          </button>
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Initialization</p>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Create Workspace</h1>
          </div>
        </header>

        <div className="premium-card rounded-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 border border-red-500/20 bg-red-500/5 text-xs text-red-400 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Workspace Title
                </label>
                <input 
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Distributed System Design"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Problem Statement
                  </label>
                  <span className="text-[9px] text-zinc-600 font-mono">{formData.problem_statement.length}/1000</span>
                </div>
                <textarea 
                  name="problem_statement"
                  required
                  maxLength={1000}
                  value={formData.problem_statement}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Define the objectives and constraints..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all resize-none placeholder:text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Context (Optional)
                </label>
                <textarea 
                  name="context"
                  value={formData.context}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Additional parameters or links..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all resize-none placeholder:text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Tags
                </label>
                <input 
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., backend, scalability, algorithms"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox"
                  name="is_public"
                  id="is_public"
                  checked={!formData.is_public}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_public: !e.target.checked }))}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-white focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="is_public" className="text-xs text-zinc-400 cursor-pointer select-none">
                  Private Workspace (Only visible to you)
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
className="w-full h-12 bg-white text-black hover:bg-zinc-200 transition-colors rounded-xl text-xs uppercase tracking-[0.2em] font-bold disabled:opacity-50"              >
                {loading ? 'Deploying Environment...' : 'Deploy Workspace →'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateRoomPage;