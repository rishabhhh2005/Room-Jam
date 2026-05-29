import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const CreateRoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    problem_statement: '',
    context: '',
    tags: '',
    is_public: true
  });

  useEffect(() => {
    if (location.state?.template) {
      const { template } = location.state;
      setFormData({
        title: template.title,
        problem_statement: template.problem_statement,
        context: template.context,
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
      navigate(`/room/${response.data.room_key}`);
    } catch (err) {
      console.error("Error creating room:", err);
      setError(err.response?.data?.detail || 'Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-indigo-500/30 font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-indigo-500/10 rounded-full blur-[120px] opacity-50" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-lg">R</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">RoomJam</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Dashboard</button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button onClick={() => navigate('/dashboard')} className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-zinc-800 transition-all">
              <UserIcon className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-24 max-w-2xl">
        <div className="mb-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-zinc-500 hover:text-white flex items-center gap-2 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Create Room</h1>
          <p className="text-zinc-400">Set up your collaborative workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Room Title</label>
            <input 
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., System Design Interview Prep"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Problem Statement</label>
            <textarea 
              name="problem_statement"
              required
              value={formData.problem_statement}
              onChange={handleChange}
              rows={4}
              placeholder="What are you trying to solve?"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Context (Optional)</label>
            <textarea 
              name="context"
              value={formData.context}
              onChange={handleChange}
              rows={3}
              placeholder="Additional details, constraints, or resources..."
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Tags (comma separated)</label>
            <input 
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., react, backend, architecture"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
            <input 
              type="checkbox"
              name="is_public"
              id="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="w-4 h-4 rounded border-white/10 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/30"
            />
            <label htmlFor="is_public" className="text-sm text-zinc-300 cursor-pointer">
              Public Room (anyone with the key can join)
            </label>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create Workspace <ArrowRightIcon className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default CreateRoomPage;
