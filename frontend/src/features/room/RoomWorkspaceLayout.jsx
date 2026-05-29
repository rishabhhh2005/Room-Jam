import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function RoomWorkspaceLayout({
  roomId,
  participants,
  activeTab,
  setActiveTab,
  roomData,
  children,
}) {
  const navigate = useNavigate();
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320);
  const isResizingLeft = useRef(false);
  const isResizingRight = useRef(false);

  const startResizingLeft = (e) => {
    isResizingLeft.current = true;
    document.addEventListener("mousemove", handleMouseMoveLeft);
    document.addEventListener("mouseup", stopResizing);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const startResizingRight = (e) => {
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

  // Extract components from children
  const mainContent = React.Children.toArray(children).find(child => child.props.className?.includes('flex-1'));
  const chatContent = React.Children.toArray(children).find(child => child.props.className?.includes('w-80'));

  return (
    <div className="h-screen bg-[#080808] text-zinc-100 flex flex-col font-mono overflow-hidden relative selection:bg-white selection:text-black">
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
      <header className="h-14 border-b border-white/[0.06] bg-[#080808]/90 backdrop-blur-md px-6 flex items-center justify-between relative z-50 shrink-0">
        <div className="flex items-center gap-4 w-1/4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <span className="text-sm font-bold tracking-widest uppercase text-white">RoomJam</span>
          </div>
          <div className="h-4 w-px bg-white/[0.08] hidden md:block" />
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/40">NODE_ID</span>
            <span className="text-xs text-zinc-400 tracking-wider font-bold">{roomId}</span>
          </div>
        </div>

        {/* Center: Workspace Matrix Tool Selection */}
        <div className="flex-1 flex justify-center items-center gap-1.5">
          <TabButton 
            active={activeTab === "editor"} 
            onClick={() => setActiveTab("editor")}
            icon={<CodeIcon />}
            label="EDITOR"
          />
          <TabButton 
            active={activeTab === "whiteboard"} 
            onClick={() => setActiveTab("whiteboard")}
            icon={<PenIcon />}
            label="WHITEBOARD"
          />
          <TabButton 
            active={activeTab === "notes"} 
            onClick={() => setActiveTab("notes")}
            icon={<FileTextIcon />}
            label="NOTES"
          />
        </div>

        <div className="flex items-center justify-end gap-6 w-1/4">
          <div className="hidden lg:block text-[10px] font-bold text-emerald-400 tracking-widest uppercase border border-emerald-500/20 bg-emerald-500/[0.02] px-2.5 py-1">
            [SYS_ONLINE]
          </div>

          <button 
            onClick={handleLeave}
            className="px-4 py-1.5 border border-red-500/30 text-red-400 bg-red-500/[0.02] hover:bg-red-500 hover:text-black transition-colors text-xs uppercase tracking-widest font-bold"
          >
            Leave
          </button>
        </div>
      </header>

      {/* Body Area Layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left Sidebar: Index Specs & Peers */}
        <aside 
          style={{ width: `${sidebarWidth}px` }}
          className="border-r border-white/[0.06] bg-[#080808]/40 backdrop-blur-sm flex flex-col shrink-0 relative group/sidebar"
        >
          {/* Section: Problem Metadata Specs */}
          <div className="p-6 border-b border-white/[0.06] overflow-hidden bg-black/10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600 mb-4">
              // SPECIFICATION_INDEX
            </h2>
            <div className="space-y-4">
               <h3 className="font-bold text-white text-md uppercase tracking-wide leading-tight">
                 {roomData?.title || 'LOADING...'}
               </h3>
               <div className="max-h-52 overflow-y-auto pr-2 text-zinc-500 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                  {roomData?.problem_statement || 'No problem statement provided.'}
               </div>
               {roomData?.tags && (
                 <div className="flex flex-wrap gap-1.5 pt-2">
                    {roomData.tags.map(tag => (
                      <span key={tag} className="text-[9px] text-zinc-400 bg-zinc-900 border border-white/[0.08] px-2 py-0.5 uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* Section: Peer Nodes Connection Stack */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600 mb-4">
              // PEER_NODES ({participants.length})
            </h2>

            <div className="space-y-2">
              {participants.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 border border-white/[0.04] bg-black/5 hover:border-white/20 transition-all cursor-default"
                >
                  <div className="w-7 h-7 border border-white/10 bg-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-400">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-xs uppercase tracking-wide text-zinc-300 truncate">{user.name}</span>
                  <span className="ml-auto text-[9px] text-emerald-500/80 font-bold tracking-widest">[OK]</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Environment Status Flag Footer */}
          <div className="p-4 border-t border-white/[0.06] bg-black/20">
             <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Environment Pipeline</span>
                <span className="text-[10px] text-zinc-400 text-ellipsis overflow-hidden whitespace-nowrap uppercase tracking-wider">PROD_ENV // {roomId}</span>
             </div>
          </div>

          {/* Drag Resizer Interactive Node */}
          <div 
            onMouseDown={startResizingLeft}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-white/30 transition-colors z-50"
          />
        </aside>

        {/* Main Interface Core Area (Center & Right Sidebar Combo) */}
        <main className="flex-1 flex overflow-hidden min-h-0 bg-[#0c0c0c]">
           <div className="flex-1 overflow-hidden min-w-0 h-full">
              {mainContent}
           </div>

           {/* Vertical Right Split Node Resizer Handle */}
           <div 
             onMouseDown={startResizingRight}
             className="w-px h-full cursor-col-resize hover:bg-white/30 transition-colors z-50 bg-white/[0.06] shrink-0"
           />

           {/* Right Workspace Context Panel: Stream Channel Chat */}
           <div 
             style={{ width: `${rightSidebarWidth}px` }}
             className="shrink-0 bg-[#080808] border-l border-white/[0.06] flex flex-col h-full overflow-hidden relative"
           >
              {chatContent && React.cloneElement(chatContent, { 
                style: { width: '100%', height: '100%' }, 
                className: chatContent.props.className.replace('w-80', '') 
              })}
           </div>
        </main>
      </div>
    </div>
  );
}

/* --- Modular Layout Components --- */

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 h-9 border text-xs font-bold tracking-widest uppercase transition-all ${
      active
        ? "bg-white text-black border-white"
        : "text-zinc-500 border-transparent hover:text-white hover:bg-white/[0.02]"
    }`}
  >
    <span className="transition-colors shrink-0">
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

/* --- Minimalist Vector Geometry Pack --- */

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

export default RoomWorkspaceLayout;