import React from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { Folder, Globe, Sparkles, Plus, ExternalLink } from 'lucide-react';

export const BookmarkBar: React.FC = () => {
  const { bookmarks, bookmarkFolders, navigateActiveTab, createTab, setActiveModal } = useBrowser();

  // Show top bookmarks
  const displayBookmarks = bookmarks.slice(0, 8);

  return (
    <div className="flex items-center h-7 px-3 bg-[#0A0C13] border-b border-white/[0.04] text-[11px] text-gray-400 gap-1 overflow-x-auto no-scrollbar">
      {/* Bookmark Folders */}
      {bookmarkFolders.map(folder => (
        <button
          key={folder.id}
          onClick={() => setActiveModal('bookmarks')}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-white/[0.06] hover:text-gray-200 transition-colors flex-shrink-0"
        >
          <Folder className="w-3 h-3 text-accent" />
          <span>{folder.name}</span>
        </button>
      ))}

      <div className="w-[1px] h-3 bg-white/10 mx-1 flex-shrink-0" />

      {/* Direct Bookmarks */}
      {displayBookmarks.map(bm => (
        <button
          key={bm.id}
          onClick={() => navigateActiveTab(bm.url)}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-white/[0.06] hover:text-gray-200 transition-colors flex-shrink-0 max-w-[150px]"
          title={bm.url}
        >
          {bm.url.startsWith('boss://') ? (
            <Sparkles className="w-3 h-3 text-cyan-400 flex-shrink-0" />
          ) : (
            <Globe className="w-3 h-3 text-gray-400 flex-shrink-0" />
          )}
          <span className="truncate">{bm.title}</span>
        </button>
      ))}

      {/* Manage Bookmarks Button */}
      <button
        onClick={() => setActiveModal('bookmarks')}
        className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] flex-shrink-0"
        title="Open Bookmarks Manager"
      >
        <Plus className="w-3 h-3" />
        <span className="text-[10px]">All Bookmarks</span>
      </button>
    </div>
  );
};

