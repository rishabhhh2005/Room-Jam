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
      tags: ['Data Structures', 'Hash Map', 'Linked List'],
      icon: '🧠'
    },
    {
      id: 'p2',
      title: 'Snake Game Logic',
      difficulty: 'Medium',
      problem_statement: 'Implement the core logic for a classic Snake game.',
      context: 'Focus on grid management, collision detection, and growth mechanics.',
      tags: ['Games', 'Algorithms', 'Logic'],
      icon: '🐍'
    },
    {
      id: 'p3',
      title: 'Rate Limiter Service',
      difficulty: 'Hard',
      problem_statement: 'Design a scalable rate limiter for an API gateway.',
      context: 'Consider Token Bucket or Leaky Bucket algorithms. Must handle distributed traffic.',
      tags: ['System Design', 'Backend', 'Scalability'],
      icon: '🚦'
    },
    {
      id: 'p4',
      title: 'Markdown Parser',
      difficulty: 'Medium',
      problem_statement: 'Create a lightweight markdown to HTML parser.',
      context: 'Support headers, bold, italics, and lists using regex or a custom lexer.',
      tags: ['Frontend', 'Regex', 'Parsing'],
      icon: '📝'
    },
    {
      id: 'p5',
      title: 'Job Scheduler',
      difficulty: 'Hard',
      problem_statement: 'Implement a distributed job scheduler with priority support.',
      context: 'Jobs should have retry logic and status tracking across multiple workers.',
      tags: ['Distributed Systems', 'Backend', 'Queue'],
      icon: '⏰'
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
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">R</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">Problem Library</span>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-24 max-w-5xl">
        <div className="mb-12">
           <h1 className="text-4xl font-bold text-white mb-4">Choose a Challenge</h1>
           <p className="text-zinc-500 text-lg">Select a problem statement from our library to start your collaborative workspace.</p>
           
           <div className="mt-8 relative max-w-md">
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problems or tags..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((p) => (
            <button 
              key={p.id}
              onClick={() => handleSelect(p)}
              className="group p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-indigo-500/30 transition-all text-left flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  p.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                }`}>
                  {p.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{p.title}</h3>
              <p className="text-sm text-zinc-500 line-clamp-3 mb-6 flex-1">{p.problem_statement}</p>
              
              <div className="flex flex-wrap gap-2">
                {p.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-zinc-400">
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-24">
             <p className="text-zinc-500 text-lg">No problems found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default ProblemLibraryPage;
