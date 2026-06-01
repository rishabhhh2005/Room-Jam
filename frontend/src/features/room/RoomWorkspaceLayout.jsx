import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RoomWorkspaceLayout({
  roomId,
  participants = [],
  activeTab,
  setActiveTab,
  roomData,
  children,
  currentUser,
  onKick,
  workspaceExplorer,
}) {
  const navigate = useNavigate();
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(310);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    workspace: true,
    participants: true
  });
  
  const isResizingLeft = useRef(false);
  const isResizingRight = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setShowLeftSidebar(false);
        setShowRightSidebar(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startResizingLeft = () => {
    if (isMobile) return;
    isResizingLeft.current = true;
    document.addEventListener("mousemove", handleMouseMoveLeft);
    document.addEventListener("mouseup", stopResizing);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const startResizingRight = () => {
    if (isMobile) return;
    isResizingRight.current = true;
    document.addEventListener("mousemove", handleMouseMoveRight);
    document.addEventListener("mouseup", stopResizing);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMoveLeft = (e) => {
    if (!isResizingLeft.current) return;
    const newWidth = e.clientX;
    if (newWidth > 200 && newWidth < 500) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseMoveRight = (e) => {
    if (!isResizingRight.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > 200 && newWidth < 500) {
      setRightSidebarWidth(newWidth);
    }
  };

  const stopResizing = () => {
    isResizingLeft.current = false;
    isResizingRight.current = false;
    document.removeEventListener("mousemove", handleMouseMoveLeft);
    document.removeEventListener("mousemove", handleMouseMoveRight);
    document.removeEventListener("mouseup", stopResizing);
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  };

  const handleLeave = () => {
    navigate("/dashboard");
  };

  // Robust Child Extraction
  const childrenArray = React.Children.toArray(children);
  
  // Find main content (editor/whiteboard/notes) and chat panel
  // On mobile, we want to ensure they are rendered correctly even if extraction logic is slightly off
  const mainContent = childrenArray[0];
  const chatContent = childrenArray[1];
  const mobileDrawerWidth = "min(20rem, calc(100dvw - 2rem))";
  const leftSidebarStyle = isMobile
    ? { width: mobileDrawerWidth, maxWidth: mobileDrawerWidth }
    : { width: `${sidebarWidth}px`, maxWidth: "500px" };
  const rightSidebarStyle = isMobile
    ? { width: mobileDrawerWidth, maxWidth: mobileDrawerWidth }
    : { width: `${rightSidebarWidth}px`, maxWidth: "500px" };

  return (
    <div className="h-dvh w-full max-w-full min-w-0 bg-[#080808] text-zinc-100 flex flex-col font-mono relative selection:bg-white selection:text-black">
      {/* Grid Background Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.01) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Header */}
      <header className="min-h-14 border-b border-white/[0.06] bg-[#080808]/90 backdrop-blur-md px-2 sm:px-4 md:px-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1 sm:gap-3 relative z-50 shrink-0 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 min-w-0">
          <button 
            type="button"
            onClick={() => setShowLeftSidebar(!showLeftSidebar)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0 touch-manipulation"
            aria-label="Open room details"
          >
            <MenuIcon />
          </button>
          <div className="flex items-center gap-2 cursor-pointer min-w-0" >
            <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-white truncate">RoomJam</span>
          </div>
          <div className="h-4 w-px bg-white/[0.08] hidden lg:block" />
          <div className="hidden lg:flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/40">ROOM ID</span>
            <span className="text-xs text-zinc-400 tracking-wider font-bold truncate max-w-40">{roomId}</span>
          </div>
        </div>

        {/* Center: Workspace Matrix Tool Selection */}
        <div className="min-w-0 flex justify-center items-center gap-1 md:gap-1.5 px-1 sm:px-2">
          <TabButton 
            active={activeTab === "editor"} 
            onClick={() => { setActiveTab("editor"); setShowLeftSidebar(false); setShowRightSidebar(false); }}
            icon={<CodeIcon />}
            label={isMobile ? "" : "EDITOR"}
          />
          <TabButton 
            active={activeTab === "whiteboard"} 
            onClick={() => { setActiveTab("whiteboard"); setShowLeftSidebar(false); setShowRightSidebar(false); }}
            icon={<PenIcon />}
            label={isMobile ? "" : "WHITEBOARD"}
          />
          <TabButton 
            active={activeTab === "notes"} 
            onClick={() => { setActiveTab("notes"); setShowLeftSidebar(false); setShowRightSidebar(false); }}
            icon={<FileTextIcon />}
            label={isMobile ? "" : "NOTES"}
          />
        </div>

        <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-6 min-w-0">
          <div className="hidden xl:block text-[10px] font-bold text-emerald-400 tracking-widest uppercase border border-emerald-500/20 bg-emerald-500/[0.02] px-2.5 py-1">
            [CONNECTED]
          </div>

          <button 
            type="button"
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0 touch-manipulation"
            aria-label="Open chat"
          >
            <ChatIcon />
          </button>

          <button 
            type="button"
            onClick={handleLeave}
            className="px-2 md:px-4 h-9 border border-red-500/30 text-red-400 bg-red-500/[0.02] hover:bg-red-500 hover:text-black transition-colors text-[10px] md:text-xs uppercase tracking-widest font-bold shrink-0 touch-manipulation"
          >
            Leave
          </button>
        </div>
      </header>

      {/* Body Area Layout */}
      <div className="flex-1 flex min-w-0 overflow-hidden relative z-10 w-full h-full">
        {/* Left Sidebar Overlay for Mobile */}
        {isMobile && showLeftSidebar && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={() => setShowLeftSidebar(false)}
          />
        )}

        {/* Left Sidebar: Index Specs & Peers */}
        <aside 
          style={leftSidebarStyle}
          className={`
            border-r border-white/[0.06] bg-[#080808] lg:bg-[#080808]/40 backdrop-blur-sm flex-col shrink-0 relative transition-transform duration-300 z-[70] h-full min-w-0
            ${isMobile ? (showLeftSidebar ? 'flex fixed inset-y-0 left-0 pt-14 translate-x-0' : 'hidden') : 'flex translate-x-0'}
          `}
        >
          {isMobile && (
            <button 
              type="button"
              onClick={() => setShowLeftSidebar(false)}
              className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white touch-manipulation"
              aria-label="Close room details"
            >
              <CloseIcon />
            </button>
          )}

          {/* Section: Problem Metadata Specs (TOP, ALWAYS EXPANDED) */}
          <div className="flex flex-col min-h-0 border-b border-white/[0.08] bg-white/[0.02] shrink-0">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                // PROBLEM STATEMENT
              </h2>
            </div>
            <div className="p-5 sm:p-7 space-y-5 overflow-y-auto no-scrollbar max-h-[35vh]">
              <h3 className="font-black text-white text-lg uppercase tracking-tight leading-tight">
                {roomData?.title || 'LOADING...'}
              </h3>
              <div className="text-zinc-300 text-[13px] leading-relaxed whitespace-pre-wrap break-words font-sans selection:bg-emerald-500/30">
                  {roomData?.problem_statement || 'No problem statement provided.'}
              </div>
              
              {roomData?.context && (
                <div className="pt-4 border-t border-white/[0.04]">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                    // SYSTEM CONTEXT
                  </h4>
                  <div className="text-zinc-400 text-[12px] leading-relaxed whitespace-pre-wrap break-words font-sans selection:bg-emerald-500/30 italic bg-white/[0.01] p-3 border-l-2 border-white/10">
                    {roomData.context}
                  </div>
                </div>
              )}

              {roomData?.tags && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {roomData.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-zinc-300 bg-white/[0.05] border border-white/[0.1] px-2.5 py-1 uppercase tracking-widest font-bold">
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Section: Workspace (COLLAPSIBLE) */}
          {workspaceExplorer && (
            <div className={`flex flex-col min-h-0 border-b border-white/[0.06] ${expandedSections.workspace ? 'flex-[2]' : 'flex-none'}`}>
              <div 
                className="flex items-center justify-between p-5 border-b border-white/[0.04] bg-black/20 cursor-pointer hover:bg-white/[0.02] transition-colors shrink-0"
                onClick={() => setExpandedSections(prev => ({ ...prev, workspace: !prev.workspace }))}
              >
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                  // WORKSPACE
                </h2>
                <ChevronRightIcon open={expandedSections.workspace} />
              </div>
              {expandedSections.workspace && (
                <div className="flex-1 overflow-hidden">
                  {workspaceExplorer}
                </div>
              )}
            </div>
          )}

          {/* Section: Peer Nodes Connection Stack (COLLAPSIBLE) */}
          <div className={`flex-1 flex flex-col min-h-0 ${expandedSections.participants ? '' : 'flex-none'}`}>
            <div 
              className="flex items-center justify-between p-5 border-b border-white/[0.04] bg-black/10 cursor-pointer hover:bg-white/[0.02] transition-colors shrink-0"
              onClick={() => setExpandedSections(prev => ({ ...prev, participants: !prev.participants }))}
            >
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                // PARTICIPANTS ({participants.length})
              </h2>
              <ChevronRightIcon open={expandedSections.participants} />
            </div>
            
            {expandedSections.participants && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 no-scrollbar">
                {participants.map((user) => {
                  const isAdmin = user.id === roomData?.owner_id;
                  const isCurrentUserAdmin = currentUser?.id === roomData?.owner_id;
                  const isMe = user.id === currentUser?.id;

                  return (
                    <div
                      key={user.id}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-4 p-4 border border-white/[0.05] bg-white/[0.01] hover:border-white/20 transition-all cursor-default min-w-0 group"
                    >
                      <div className="w-8 h-8 border border-white/10 bg-zinc-900 flex items-center justify-center text-sm font-bold text-zinc-400 shrink-0 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
                        {user.name ? user.name[0].toUpperCase() : "P"}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] uppercase tracking-wider text-zinc-200 truncate font-medium">
                          {user.name || "User"} {isMe && "(YOU)"}
                        </span>
                        {isAdmin && (
                          <span className="text-[9px] font-black text-emerald-500 tracking-[0.25em] uppercase mt-0.5">
                            ADMIN_NODE
                          </span>
                        )}
                      </div>
                      
                      <div className="ml-auto flex items-center gap-3">
                        {isCurrentUserAdmin && !isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onKick && onKick(user.id); }}
                            className="px-2.5 py-1 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black transition-all text-[9px] uppercase font-bold tracking-[0.2em]"
                            title="Kick participant"
                          >
                            KICK
                          </button>
                        )}
                        <span className="text-[10px] text-emerald-500/80 font-bold tracking-[0.2em] shrink-0">[ONLINE]</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Environment Status Flag Footer */}
          <div className="p-4 border-t border-white/[0.06] bg-black/20 shrink-0">
             <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Roomjam By Rishabh </span>
             </div>
          </div>

          {!isMobile && (
            <div 
              onMouseDown={startResizingLeft}
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-white/30 transition-colors z-50"
            />
          )}
        </aside>

        {/* Main Interface Area */}
        <main className="flex-1 min-w-0 flex overflow-hidden bg-[#0c0c0c] relative z-10 w-full h-full">
           <div className="flex-1 min-w-0 w-full h-full max-w-full">
              {mainContent}
           </div>

           {/* Chat Panel Overlay for Mobile */}
           {isMobile && showRightSidebar && (
             <div 
               className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
               onClick={() => setShowRightSidebar(false)}
             />
           )}

           {chatContent && (
             <>
               {!isMobile && (
                 <div 
                   onMouseDown={startResizingRight}
                   className="w-px h-full cursor-col-resize hover:bg-white/30 transition-colors z-50 bg-white/[0.06] shrink-0"
                 />
               )}
               <div 
                 style={rightSidebarStyle}
                 className={`
                    shrink-0 bg-[#080808] lg:border-l lg:border-white/[0.06] flex-col h-full overflow-hidden relative transition-transform duration-300 z-[70] min-w-0
                    ${isMobile ? (showRightSidebar ? 'flex translate-x-0 fixed inset-y-0 right-0 pt-14' : 'hidden') : 'flex translate-x-0'}
                 `}
               >
                  {isMobile && (
                    <button 
                      type="button"
                      onClick={() => setShowRightSidebar(false)}
                      className="absolute top-2 left-2 w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white z-20 touch-manipulation"
                      aria-label="Close chat"
                    >
                      <CloseIcon />
                    </button>
                  )}
                  {chatContent}
               </div>
             </>
           )}
        </main>
      </div>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-center gap-2 w-10 md:w-auto md:px-4 h-9 border text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all shrink-0 touch-manipulation ${
      active
        ? "bg-white text-black border-white"
        : "text-zinc-500 border-transparent hover:text-white hover:bg-white/[0.02]"
    }`}
  >
    <span className="transition-colors shrink-0">
      {icon}
    </span>
    {label && <span>{label}</span>}
  </button>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const PenIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronRightIcon = ({ open }) => (
  <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default RoomWorkspaceLayout;
