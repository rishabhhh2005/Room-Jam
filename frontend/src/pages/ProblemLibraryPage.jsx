import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProblemLibraryPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const problems = [
    {
      id: 'p1',
      title: 'LRU Cache Implementation',
      difficulty: 'Medium',
      problem_statement: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
      context: 'Implement the LRUCache class with get and put methods in O(1) time complexity.',
      tags: ['Data Structures', 'Hash Map', 'Linked List']
    },
    {
      id: 'p2',
      title: 'Snake Game Logic',
      difficulty: 'Medium',
      problem_statement: 'Implement the core logic for a classic Snake game.',
      context: 'Focus on grid management, collision detection, and growth mechanics.',
      tags: ['Games', 'Algorithms', 'Logic']
    },
    {
      id: 'p3',
      title: 'Rate Limiter Service',
      difficulty: 'Hard',
      problem_statement: 'Design a scalable rate limiter for an API gateway.',
      context: 'Consider Token Bucket or Leaky Bucket algorithms. Must handle distributed traffic.',
      tags: ['System Design', 'Backend', 'Scalability']
    },
    {
      id: 'p4',
      title: 'Markdown Parser',
      difficulty: 'Medium',
      problem_statement: 'Create a lightweight markdown to HTML parser.',
      context: 'Support headers, bold, italics, and lists using regex or a custom lexer.',
      tags: ['Frontend', 'Regex', 'Parsing']
    },
    {
      id: 'p5',
      title: 'Job Scheduler',
      difficulty: 'Hard',
      problem_statement: 'Implement a distributed job scheduler with priority support.',
      context: 'Jobs should have retry logic and status tracking across multiple workers.',
      tags: ['Distributed Systems', 'Backend', 'Queue']
    }
  ];

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (problem) => {
    navigate('/create-room', { state: { template: problem } });
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
           
          >
            RoomJam Problem Library
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 pt-28 pb-24">
        {/* Header Section */}
        <div className="mb-14 border border-white/[0.06] bg-black/20 p-8">
       
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">CHOOSE A PROBLEM</h1>
          <p className="text-zinc-500 text-sm max-w-2xl leading-relaxed font-sans">
            Select a base core architecture or problem statement from the index below to instantly deploy a Workspace.
          </p>
          
          <div className="mt-8 relative max-w-md">
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH PROBLEMS OR TAGS..."
              className="w-full bg-transparent border border-white/[0.08] px-4 py-3 pl-12 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 transition-colors uppercase tracking-wider"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          </div>
        </div>

        {/* Problems Grid Component */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((p) => (
            <button 
              key={p.id}
              onClick={() => handleSelect(p)}
              className="group p-6 border border-white/[0.06] bg-black/10 hover:bg-white/[0.02] hover:border-white/20 transition-all text-left flex flex-col h-full relative"
            >
              <div className="flex items-center justify-between mb-6 w-full">
                <span className="text-[20px] font-mono tracking-widest text-zinc-600 uppercase">
                  {p.id}
                </span>
                <span className={`px-2 py-0.5 border text-[10px] tracking-widest uppercase ${
                  p.difficulty === 'Hard' 
                    ? 'border-red-500/30 text-red-400 bg-red-500/[0.02]' 
                    : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/[0.02]'
                }`}>
                  {p.difficulty}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide group-hover:text-zinc-300 transition-colors">
                {p.title}
              </h3>
              
              <p className="text-xs text-zinc-500 line-clamp-3 mb-6 flex-1 font-sans leading-relaxed">
                {p.problem_statement}
              </p>
              
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.04] w-full">
                {p.tags.map(t => (
                  <span 
                    key={t} 
                    className="text-[9px] text-zinc-400 border border-white/[0.08] px-2 py-0.5 uppercase tracking-wider bg-zinc-900/40"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Empty State Component */}
        {filteredProblems.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/[0.08] bg-black/10">
            <p className="text-xs tracking-[0.2em] uppercase text-zinc-600">
              Zero query matches. Refine parameter terms.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default ProblemLibraryPage;