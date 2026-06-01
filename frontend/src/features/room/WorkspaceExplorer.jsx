import React, { useState, useEffect, useCallback } from "react";
import * as Y from "yjs";

const FolderIcon = () => (
  <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const FileIcon = () => (
  <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const FolderPlusIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ChevronRightIcon = ({ open }) => (
  <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default function WorkspaceExplorer({ ydoc, onFileSelect, activeFileId }) {
  const [workspace, setWorkspace] = useState({});
  const [expandedFolders, setExpandedFolders] = useState({ 'root': true });
  const [isAdding, setIsAdding] = useState(null); // { parentId, type: 'file' | 'folder' }
  const [newName, setNewName] = useState("");

  const workspaceMap = ydoc.getMap("workspace");

  useEffect(() => {
    if (!ydoc) return;

    const updateWorkspace = () => {
      const data = workspaceMap.toJSON();
      
      // Ensure root exists
      if (Object.keys(data).length === 0) {
        workspaceMap.set("root", {
          id: "root",
          name: "workspace",
          type: "folder",
          parentId: null,
        });
        
        // Add a default file
        const defaultFileId = `file-${Date.now()}`;
        workspaceMap.set(defaultFileId, {
          id: defaultFileId,
          name: "main.js",
          type: "file",
          parentId: "root",
        });
        
        // Initialize content if it's a new room
        const yText = ydoc.getText(defaultFileId);
        if (yText.length === 0) {
           yText.insert(0, "// Welcome to RoomJam Workspace\n// Start coding here!");
        }
      }
      
      setWorkspace(workspaceMap.toJSON());
    };

    updateWorkspace();
    workspaceMap.observe(updateWorkspace);
    return () => workspaceMap.unobserve(updateWorkspace);
  }, [ydoc, workspaceMap]);

  const addNode = (parentId, type, name) => {
    if (!name) return;
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    workspaceMap.set(id, {
      id,
      name,
      type,
      parentId,
    });
    
    if (type === 'file') {
      // Initialize empty text for new file
      const yText = ydoc.getText(id);
      if (yText.length === 0) {
         yText.insert(0, `// New ${name} file\n`);
      }
      onFileSelect(id);
    }
    
    setExpandedFolders(prev => ({ ...prev, [parentId]: true }));
    setIsAdding(null);
    setNewName("");
  };

  const deleteNode = (id) => {
    if (id === 'root') return;
    
    // Find all children and delete them too (recursive)
    const deleteRecursive = (nodeId) => {
      Object.values(workspace).forEach(node => {
        if (node.parentId === nodeId) {
          deleteRecursive(node.id);
        }
      });
      workspaceMap.delete(nodeId);
      // Also delete the Y.Text if it's a file
      // ydoc.getText(nodeId).delete(0, ydoc.getText(nodeId).length); // maybe too much?
    };

    deleteRecursive(id);
    if (activeFileId === id) {
       // Find another file to select
       const otherFiles = Object.values(workspace).filter(n => n.type === 'file' && n.id !== id);
       if (otherFiles.length > 0) {
          onFileSelect(otherFiles[0].id);
       } else {
          onFileSelect(null);
       }
    }
  };

  const toggleFolder = (id) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTree = (parentId = null, depth = 0) => {
    const children = Object.values(workspace)
      .filter(node => node.parentId === parentId)
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

    return (
      <div className="flex flex-col">
        {children.map(node => (
          <div key={node.id} className="flex flex-col">
            <div 
              className={`
                group flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-white/[0.04] transition-colors
                ${activeFileId === node.id ? 'bg-white/[0.08] text-white' : 'text-zinc-400'}
              `}
              style={{ paddingLeft: `${depth * 12 + 12}px` }}
              onClick={(e) => {
                e.stopPropagation();
                if (node.type === 'folder') {
                  toggleFolder(node.id);
                } else {
                  onFileSelect(node.id);
                }
              }}
            >
              {node.type === 'folder' ? (
                <>
                  <ChevronRightIcon open={expandedFolders[node.id]} />
                  <FolderIcon />
                </>
              ) : (
                <>
                  <div className="w-3" /> {/* Spacer for chevron */}
                  <FileIcon />
                </>
              )}
              <span className="text-[11px] font-medium truncate flex-1">{node.name}</span>
              
              <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                {node.type === 'folder' && (
                  <>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setIsAdding({ parentId: node.id, type: 'file' }); }}
                      className="p-1 hover:text-white" title="New File"
                    >
                      <PlusIcon />
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setIsAdding({ parentId: node.id, type: 'folder' }); }}
                      className="p-1 hover:text-white" title="New Folder"
                    >
                      <FolderPlusIcon />
                    </button>
                  </>
                )}
                {node.id !== 'root' && (
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                    className="p-1 hover:text-red-400" title="Delete"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            </div>

            {node.type === 'folder' && expandedFolders[node.id] && (
              <div className="flex flex-col">
                {isAdding?.parentId === node.id && (
                  <div className="px-3 py-1 flex items-center gap-2" style={{ paddingLeft: `${(depth + 1) * 12 + 24}px` }}>
                    {isAdding.type === 'folder' ? <FolderIcon /> : <FileIcon />}
                    <input
                      autoFocus
                      className="bg-transparent border-b border-white/20 text-[11px] text-white focus:outline-none w-full"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addNode(node.id, isAdding.type, newName);
                        if (e.key === 'Escape') setIsAdding(null);
                      }}
                      onBlur={() => setIsAdding(null)}
                    />
                  </div>
                )}
                {renderTree(node.id, depth + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full select-none">
      <div className="px-4 py-2 flex items-center justify-between border-b border-white/[0.04]">
         <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
           // WORKSPACE
         </h2>
         <div className="flex items-center gap-1">
            <button 
              type="button"
              onClick={() => setIsAdding({ parentId: 'root', type: 'file' })}
              className="p-1 text-zinc-500 hover:text-white" title="New File"
            >
              <PlusIcon />
            </button>
            <button 
              type="button"
              onClick={() => setIsAdding({ parentId: 'root', type: 'folder' })}
              className="p-1 text-zinc-500 hover:text-white" title="New Folder"
            >
              <FolderPlusIcon />
            </button>
         </div>
      </div>
      <div className="flex-1 overflow-y-auto py-2 no-scrollbar">
        {renderTree(null)}
      </div>
    </div>
  );
}
