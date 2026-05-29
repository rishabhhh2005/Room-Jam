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
      navigate(`/room/${response.data.room_key}`);
    } catch (err) {
      console.error("Error creating room:", err);
      setError(err.response?.data?.detail || 'Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 font-mono overflow-hidden relative selection:bg-white selection:text-black">
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080808]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-bold tracking-widest uppercase text-white hover:text-zinc-300 transition-colors"
          >
            RoomJam
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Dashboard
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto w-full px-6 pt-28 pb-24">
        {/* Header Section */}
        <div className="mb-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-xs uppercase tracking-widest text-zinc-600 hover:text-white inline-flex items-center gap-2 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Terminal
          </button>
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-600 mb-2">Workspace Initialization</p>
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase">Create Room</h1>
        </div>

        {/* Configuration Matrix Panel */}
        <div className="border border-white/[0.06] bg-black/20 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 uppercase tracking-wider">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                Room Title
              </label>
              <input 
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="E.G., DISTRIBUTED INDEX WORKSPACE"
                className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-white/30 transition-colors uppercase tracking-wide"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                Problem Statement
              </label>
              <textarea 
                name="problem_statement"
                required
                value={formData.problem_statement}
                onChange={handleChange}
                rows={4}
                placeholder="DEFINE THE PLATFORM CONSTRAINTS AND OBJECTIVES..."
                className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-white/30 transition-colors resize-none tracking-wide"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                Context (Optional)
              </label>
              <textarea 
                name="context"
                value={formData.context}
                onChange={handleChange}
                rows={3}
                placeholder="ADDITIONAL SYSTEM PARAMETERS, RESOURCE LINKS, OR TIME COMPLEXITIES..."
                className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-white/30 transition-colors resize-none tracking-wide"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                Tags (Comma Separated)
              </label>
              <input 
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="E.G., REGEX, BACKEND, ALGORITHMS"
                className="w-full bg-transparent border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-white/30 transition-colors uppercase tracking-wide"
              />
            </div>

            <div className="flex items-center gap-3 p-4 border border-white/[0.06] bg-zinc-900/20">
              <input 
                type="checkbox"
                name="is_public"
                id="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="w-3.5 h-3.5 border-white/[0.15] bg-transparent text-white focus:ring-0 focus:ring-offset-0 accent-white"
              />
              <label htmlFor="is_public" className="text-xs uppercase tracking-widest text-zinc-400 cursor-pointer select-none">
                Public Gateway (Visible inside public lookup nodes)
              </label>
            </div>

            <div className="border-t border-white/[0.06] pt-4" />

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3.5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white border border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Initializing Environment...'
              ) : (
                <>Deploy Workspace →</>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

/* --- Icons --- */

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default CreateRoomPage;