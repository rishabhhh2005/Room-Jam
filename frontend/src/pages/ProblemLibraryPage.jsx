import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../api/axios';

const ProblemLibraryPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);

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
  }, []);

  const problems = [
    {
  id: 'p1',
  title: 'Slow API Response During Traffic Spikes',
  difficulty: 'Medium',
  problem_statement: 'Your company’s customer dashboard becomes extremely slow whenever traffic increases during peak hours.',
  context: 'Users are reporting 8-10 second response times. Database CPU usage is high and multiple API endpoints perform repeated queries. Propose a solution to improve performance while maintaining data consistency.',
  tags: ['Backend', 'Performance', 'Databases']
},
{
  id: 'p2',
  title: 'Real-Time Collaboration Lag',
  difficulty: 'Hard',
  problem_statement: 'A collaborative document editing platform experiences synchronization delays when multiple users edit simultaneously.',
  context: 'Users frequently see conflicting updates and lost changes. Design an architecture that provides near real-time collaboration while minimizing conflicts.',
  tags: ['System Design', 'WebSockets', 'Realtime']
},
{
  id: 'p3',
  title: 'API Abuse and Traffic Spikes',
  difficulty: 'Hard',
  problem_statement: 'A public API is being overwhelmed by excessive requests from a small group of clients.',
  context: 'The platform must remain available for legitimate users while preventing abuse. Design a scalable protection strategy.',
  tags: ['Scalability', 'Security', 'Backend']
},
{
  id: 'p4',
  title: 'Failed Payment Investigation',
  difficulty: 'Medium',
  problem_statement: 'Customers report intermittent payment failures during checkout.',
  context: 'Failures occur only during high traffic periods. Logs show timeout errors between internal services and the payment provider. Identify possible causes and propose solutions.',
  tags: ['Microservices', 'Debugging', 'Payments']
},
{
  id: 'p5',
  title: 'Microservice Communication Strategy',
  difficulty: 'Hard',
  problem_statement: 'An engineering team is splitting a monolithic application into microservices.',
  context: 'Services need to exchange data reliably while remaining loosely coupled. Evaluate synchronous and asynchronous communication approaches and recommend an architecture.',
  tags: ['System Design', 'Microservices', 'Architecture']
},
{
  id: 'p6',
  title: 'Production Database Scaling',
  difficulty: 'Hard',
  problem_statement: 'A rapidly growing SaaS product is approaching the limits of its primary database.',
  context: 'Read traffic has increased 10x in six months. Design a scaling strategy while minimizing downtime and preserving data integrity.',
  tags: ['Databases', 'Scaling', 'Architecture']
},
{
  id: 'p7',
  title: 'Design an Internal Notification Platform',
  difficulty: 'Medium',
  problem_statement: 'Multiple teams need a unified system for sending emails, SMS, and push notifications.',
  context: 'The platform should support retries, delivery tracking, and future channel expansion.',
  tags: ['Backend', 'System Design', 'Messaging']
},
{
  id: 'p8',
  title: 'Incident: Service Outage After Deployment',
  difficulty: 'Medium',
  problem_statement: 'A new deployment caused a major outage affecting thousands of users.',
  context: 'Investigate the incident, identify root causes, and propose improvements to deployment and rollback processes.',
  tags: ['DevOps', 'Incident Response', 'Reliability']
}
  ];

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (problem) => {
    navigate('/create-room', { state: { template: problem } });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 antialiased flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl w-full mx-auto px-6 pt-24 pb-20 flex-1">
        {/* Header Section with bottom border split */}
        <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-800 pb-8">
          <div className="space-y-2">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Blueprints</p>
            <h1 className="text-4xl font-bold text-white tracking-tight">Problem Library</h1>
            <p className="text-sm text-zinc-500">Select a template to provision a new workspace instantly.</p>
          </div>
          
          {/* Refined Search Box with Zinc Borders */}
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-zinc-600 transition-all placeholder:text-zinc-600"
            />
          </div>
        </header>

        {/* Dynamic Problem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((p) => (
            <button 
              key={p.id}
              onClick={() => handleSelect(p)}
              className="group bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 p-8 rounded-2xl text-left flex flex-col h-full transition-all"
            >
          
              
              <h3 className="text-lg font-bold text-zinc-300 mb-3 group-hover:text-white transition-colors">
                {p.title}
              </h3>
              
              <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4 mb-8 flex-1">
                {p.problem_statement}
              </p>
              
              {/* Footer Tags Container */}
              <div className="flex flex-wrap gap-2 pt-6 border-t border-zinc-800/80 w-full">
                {p.tags.map(t => (
                  <span 
                    key={t} 
                    className="text-[10px] font-bold text-zinc-400 bg-zinc-800 border border-zinc-700/50 px-2 py-1 rounded-md uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Refined Empty Border State */}
        {filteredProblems.length === 0 && (
          <div className="py-32 border border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center bg-zinc-900/10">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.25em]">
              No matching blueprints found
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