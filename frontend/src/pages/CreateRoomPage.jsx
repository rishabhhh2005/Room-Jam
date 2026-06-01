import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
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

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 font-mono overflow-y-auto relative selection:bg-white selection:text-black">
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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-[#080808]/90 backdrop-blur-md">
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

      <main className="relative z-10 max-w-4xl mx-auto w-full px-6 pt-24 pb-24 lg:pt-28">
        {/* Header Section */}
        <div className="mb-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white inline-flex items-center gap-2 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to DashBoard
          </button>
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-600 mb-2">Workspace Initialization</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase">Create Room</h1>
        </div>

        {/* Configuration Matrix Panel - Solid Borders Added */}
        <div className="border border-white/10 bg-black/40 p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="border border-red-500/40 bg-red-500/5 p-4 text-xs text-red-400 uppercase tracking-wider">
                {error}
              </div>
            )}

            {/* Field 1: Room Title (Left text, Right input framework) */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 items-start">
              <label className="block text-[11px] uppercase tracking-[0.25em] text-zinc-400 pt-3">
                Room Title
              </label>
              <input 
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="E.G., DISTRIBUTED INDEX WORKSPACE"
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-colors uppercase tracking-wide"
              />
            </div>

            {/* Field 2: Problem Statement */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 items-start">
              <div className="pt-3">
                <label className="block text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                  Problem Statement
                </label>
                <p className="text-[9px] text-zinc-600 mt-1 uppercase tracking-widest font-bold">
                  {formData.problem_statement.length} / 1000 MAX
                </p>
              </div>
              <textarea 
                name="problem_statement"
                required
                maxLength={1000}
                value={formData.problem_statement}
                onChange={handleChange}
                rows={5}
                placeholder="DEFINE THE PLATFORM CONSTRAINTS AND OBJECTIVES..."
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-colors resize-none tracking-wide"
              />
            </div>

            {/* Field 3: Context */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 items-start">
              <label className="block text-[11px] uppercase tracking-[0.25em] text-zinc-400 pt-3">
                Context (Optional)
              </label>
              <textarea 
                name="context"
                value={formData.context}
                onChange={handleChange}
                rows={3}
                placeholder="ADDITIONAL SYSTEM PARAMETERS, RESOURCE LINKS, OR TIME COMPLEXITIES..."
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-colors resize-none tracking-wide"
              />
            </div>

            {/* Field 4: Tags */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 items-start">
              <label className="block text-[11px] uppercase tracking-[0.25em] text-zinc-400 pt-3">
                Tags
              </label>
              <input 
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="E.G., REGEX, BACKEND, ALGORITHMS"
                className="w-full bg-transparent border border-white/20 px-4 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-colors uppercase tracking-wide"
              />
            </div>

            {/* Field 5: Gateways Checkbox Option */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 items-center">
              <div className="hidden md:block" />
              <div className="flex items-center gap-3 p-4 border border-white/10 bg-zinc-900/40">
                <input 
                  type="checkbox"
                  name="is_public"
                  id="is_public"
                  checked={!formData.is_public}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_public: !e.target.checked }))}
                  className="w-3.5 h-3.5 border-white/40 bg-transparent text-white focus:ring-0 focus:ring-offset-0 accent-zinc-800 cursor-pointer"
                />
                <label htmlFor="is_public" className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-400 cursor-pointer select-none">
                  Private Room (Only visible to you)
                </label>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4" />

            {/* Action Deployment Trigger */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 items-center">
              <div className="hidden md:block" />
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white border border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Initializing Environment...'
                ) : (
                  <>Deploy Workspace →</>
                )}
              </button>
            </div>
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