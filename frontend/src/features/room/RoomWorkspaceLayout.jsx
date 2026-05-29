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
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl px-6 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-4 w-1/4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-lg">R</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white hidden md:block">RoomJam</span>
          </div>
          <div className="h-4 w-px bg-white/10 mx-1 hidden md:block" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold leading-tight">Session</span>
            <span className="text-xs font-mono text-indigo-400 font-bold tracking-tight">{roomId}</span>
          </div>
        </div>

        {/* Center: Tool Selection */}
        <div className="flex-1 flex justify-center items-center gap-2">
          <TabButton 
            active={activeTab === "editor"} 
            onClick={() => setActiveTab("editor")}
            icon={<CodeIcon />}
            label="Editor"
          />
          <TabButton 
            active={activeTab === "whiteboard"} 
            onClick={() => setActiveTab("whiteboard")}
            icon={<PenIcon />}
            label="Whiteboard"
          />
          <TabButton 
            active={activeTab === "notes"} 
            onClick={() => setActiveTab("notes")}
            icon={<FileTextIcon />}
            label="Notes"
          />
        </div>

        <div className="flex items-center justify-end gap-6 w-1/4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Connected</span>
          </div>

          <button 
            onClick={handleLeave}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold transition-all whitespace-nowrap"
          >
            Leave
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left Sidebar: Problem & Participants */}
        <aside 
          style={{ width: `${sidebarWidth}px` }}
          className="border-r border-white/5 bg-[#0a0a0a] flex flex-col shrink-0 relative group/sidebar"
        >
          <div className="p-6 border-b border-white/5 overflow-hidden">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-indigo-500"></span>
              Problem Statement
            </h2>
            <div className="space-y-4">
               <h3 className="font-bold text-white text-lg leading-tight">{roomData?.title || 'Loading...'}</h3>
               <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2 text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {roomData?.problem_statement || 'No problem statement provided.'}
               </div>
               {roomData?.tags && (
                 <div className="flex flex-wrap gap-2 pt-2">
                    {roomData.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider border border-white/5">
                        {tag}
                      </span>
                    ))}
                 </div>
               )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-indigo-500"></span>
              Participants ({participants.length})
            </h2>

            <div className="space-y-3">
              {participants.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-default group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 group-hover:scale-110 transition-transform">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-zinc-200 truncate">{user.name}</span>
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 border-t border-white/5 bg-white/5">
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Environment</span>
                <span className="text-xs text-zinc-400 font-mono text-ellipsis overflow-hidden whitespace-nowrap">Production • {roomId}</span>
             </div>
          </div>

          {/* Left Resizer Handle */}
          <div 
            onMouseDown={startResizingLeft}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-indigo-500/50 transition-colors z-50"
          />
        </aside>

        {/* Main Workspace (Middle) */}
        <main className="flex-1 flex overflow-hidden min-h-0 bg-zinc-950/50">
           <div className="flex-1 overflow-hidden min-w-0 h-full">
              {mainContent}
           </div>

           {/* Right Resizer Handle */}
           <div 
             onMouseDown={startResizingRight}
             className="w-1 h-full cursor-col-resize hover:bg-indigo-500/50 transition-colors z-50 bg-white/5 shrink-0"
           />

           {/* Right Sidebar: Chat */}
           <div 
             style={{ width: `${rightSidebarWidth}px` }}
             className="shrink-0 bg-[#0a0a0a] flex flex-col h-full overflow-hidden"
           >
              {chatContent && React.cloneElement(chatContent, { style: { width: '100%', height: '100%' }, className: chatContent.props.className.replace('w-80', '') })}
           </div>
        </main>
      </div>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all group ${
      active
        ? "bg-white/10 text-white border border-white/10 shadow-lg"
        : "text-zinc-500 hover:text-white hover:bg-white/5"
    }`}
  >
    <span className={`${active ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400"} transition-colors`}>
      {icon}
    </span>
    {label}
  </button>
);

const CodeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const PenIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default RoomWorkspaceLayout;
