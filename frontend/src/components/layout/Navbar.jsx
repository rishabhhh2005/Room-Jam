import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
    { label: 'Workspaces', path: '/workspaces', icon: WorkspacesIcon },
    { label: 'Library', path: '/problem-library', icon: LibraryIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/80 bg-black/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* 1. LEFT CONTAINER - Logo */}
        <div className="flex-1 flex justify-start">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[11px] sm:text-[13px] font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            ROOMJAM
          </button>
        </div>

        {/* 2. CENTER CONTAINER - Navigation Links */}
        <div className="flex items-center gap-1 bg-zinc-900/40 border border-zinc-800 p-1 rounded-xl">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              title={item.label}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider transition-all rounded-lg ${
                isActive(item.path)
                  ? 'text-white bg-zinc-800 border border-zinc-700/50'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              <item.icon className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </div>

        {/* 3. RIGHT CONTAINER - User & Logout */}
        <div className="flex-1 flex justify-end items-center gap-2 sm:gap-6">
          {user && (
            <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 border border-zinc-800 bg-zinc-900/30 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                {user.username}
              </span>
            </div>
          )}
          
          <button
            onClick={onLogout}
            title="Logout"
            className="flex items-center justify-center p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="hidden sm:block ml-2 text-xs font-bold uppercase tracking-widest">Logout</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

/* --- Icons --- */

const DashboardIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const WorkspacesIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const LibraryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const LogoutIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default Navbar;