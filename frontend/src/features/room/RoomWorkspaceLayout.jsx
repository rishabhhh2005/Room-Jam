function RoomWorkspaceLayout({
  roomId,
  participants,
  children,
}) {
  return (
    <div className="h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-zinc-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">
            RoomJam
          </h1>

          <div className="text-sm text-zinc-400">
            Room: {roomId}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-emerald-400">
            Connected
          </div>

          <button className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-sm">
            Leave
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-5 border-b border-zinc-800">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Participants ({participants.length})
            </h2>

            <div className="mt-4 space-y-3">
              {participants.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 space-y-3">
            <button className="w-full text-left px-4 py-3 rounded bg-zinc-800 hover:bg-zinc-700">
              Code Editor
            </button>

            <button className="w-full text-left px-4 py-3 rounded bg-zinc-800 hover:bg-zinc-700">
              Whiteboard
            </button>

            <button className="w-full text-left px-4 py-3 rounded bg-zinc-800 hover:bg-zinc-700">
              Notes
            </button>

            <button className="w-full text-left px-4 py-3 rounded bg-zinc-800 hover:bg-zinc-700">
              Chat
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default RoomWorkspaceLayout;