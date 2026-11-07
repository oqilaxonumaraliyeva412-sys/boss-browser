import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { Bookmark, BookmarkFolder } from '../../types';
import {
  Bookmark as BookmarkIcon,
  Folder,
  FolderPlus,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Search,
  Download,
  Upload,
  Globe,
  Sparkles,
  Check,
  X
} from 'lucide-react';

export const BookmarksView: React.FC = () => {
  const {
    bookmarks,
    bookmarkFolders,
    addBookmark,
    removeBookmark,
    addBookmarkFolder,
    navigateActiveTab,
    createTab
  } = useBrowser();

  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // New Bookmark state
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [folderInput, setFolderInput] = useState('Favorites');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Filter bookmarks
  const filteredBookmarks = bookmarks.filter(b => {
    const matchesFolder = selectedFolder === 'All' || b.folder === selectedFolder;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addBookmarkFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleInput.trim() && urlInput.trim()) {
      addBookmark(titleInput.trim(), urlInput.trim(), folderInput);
      setTitleInput('');
      setUrlInput('');
      setIsAddingBookmark(false);
    }
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'boss_bookmarks_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        if (Array.isArray(imported)) {
          imported.forEach((bm: any) => {
            if (bm.title && bm.url) {
              addBookmark(bm.title, bm.url, bm.folder || 'Imported');
            }
          });
        }
      } catch (err) {
        console.error('Failed to import bookmarks JSON', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex w-full h-full bg-[#08090C] text-gray-200 overflow-hidden select-none">
      {/* Sidebar Folders */}
      <div className="w-64 border-r border-white/10 bg-[#0C0E16] flex flex-col p-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center">
            <BookmarkIcon className="w-4 h-4 text-accent" />
          </div>
          <span className="font-orbitron font-bold text-sm tracking-wider text-white">
            BOOKMARKS
          </span>
        </div>

        {/* Action Buttons: Import / Export */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-gray-300 transition-colors border border-white/[0.06]"
            title="Export as JSON"
          >
            <Download className="w-3.5 h-3.5 text-accent" />
            <span>Export</span>
          </button>
          <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-gray-300 transition-colors border border-white/[0.06] cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>

        {/* Folders List */}
        <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-2 px-1">
          <span>Folders</span>
          <button
            onClick={() => setIsCreatingFolder(true)}
            className="p-1 hover:text-white rounded hover:bg-white/10"
            title="Create Folder"
          >
            <FolderPlus className="w-3.5 h-3.5 text-accent" />
          </button>
        </div>

        {isCreatingFolder && (
          <form onSubmit={handleCreateFolder} className="mb-2 flex gap-1">
            <input
              type="text"
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              className="w-full text-xs bg-black/40 border border-white/20 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-accent"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-1 bg-accent text-white rounded-lg text-xs"
            >
              OK
            </button>
          </form>
        )}

        <div className="flex-1 overflow-y-auto space-y-1">
          <button
            onClick={() => setSelectedFolder('All')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              selectedFolder === 'All'
                ? 'bg-accent/20 text-white border border-accent/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Folder className="w-4 h-4 text-cyan-400" />
            <span className="flex-1 text-left">All Bookmarks</span>
            <span className="text-[10px] text-gray-500">{bookmarks.length}</span>
          </button>

          {bookmarkFolders.map(folder => {
            const count = bookmarks.filter(b => b.folder === folder.name).length;
            const isSelected = selectedFolder === folder.name;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.name)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-accent/20 text-white border border-accent/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Folder className="w-4 h-4 text-accent" />
                <span className="flex-1 text-left truncate">{folder.name}</span>
                <span className="text-[10px] text-gray-500">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Top bar: Search + Add Bookmark */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search bookmarks by title or URL..."
              className="w-full bg-[#121622] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent"
            />
          </div>

          <button
            onClick={() => setIsAddingBookmark(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:brightness-110 shadow-lg shadow-purple-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bookmark</span>
          </button>
        </div>

        {/* Add Bookmark Modal */}
        {isAddingBookmark && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#121624] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <BookmarkIcon className="w-4 h-4 text-accent" />
                Add New Bookmark
              </h3>
              <form onSubmit={handleAddBookmark} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Title</label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={e => setTitleInput(e.target.value)}
                    placeholder="e.g. GitHub: Let's build"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">URL</label>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Folder</label>
                  <select
                    value={folderInput}
                    onChange={e => setFolderInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E1017] border border-white/10 text-xs text-white focus:outline-none focus:border-accent"
                  >
                    {bookmarkFolders.map(f => (
                      <option key={f.id} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingBookmark(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bookmarks Grid / List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <BookmarkIcon className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No bookmarks found</p>
              <p className="text-xs text-gray-600 mt-1">Press Ctrl+D on any page to bookmark it</p>
            </div>
          ) : (
            filteredBookmarks.map(bm => (
              <div
                key={bm.id}
                className="glass-card flex items-center justify-between p-3.5 rounded-xl group hover:border-accent/40 transition-all"
              >
                <div
                  onClick={() => navigateActiveTab(bm.url)}
                  className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                    {bm.url.startsWith('boss://') ? (
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Globe className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-gray-200 group-hover:text-white truncate">
                      {bm.title}
                    </span>
                    <span className="text-[11px] text-gray-500 truncate">{bm.url}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-gray-400 border border-white/[0.04]">
                    {bm.folder}
                  </span>
                  <button
                    onClick={() => createTab(bm.url, bm.title)}
                    className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeBookmark(bm.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 hover:text-red-400"
                    title="Delete bookmark"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
