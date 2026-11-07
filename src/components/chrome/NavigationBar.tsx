import React from 'react';
import { AddressBar } from './AddressBar';
import { useBrowser } from '../../context/BrowserContext';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  X,
  Home,
  Star,
  Download,
  Puzzle,
  Settings,
  Sparkles,
  Layers
} from 'lucide-react';

export const NavigationBar: React.FC = () => {
  const {
    activeTab,
    goBack,
    goForward,
    reload,
    stopLoading,
    navigateActiveTab,
    isBookmarked,
    toggleBookmarkCurrentPage,
    isAISidebarOpen,
    setIsAISidebarOpen,
    activeModal,
    setActiveModal,
    downloads
  } = useBrowser();

  const isCurrentBookmarked = activeTab ? isBookmarked(activeTab.url) : false;
  const activeDownloadsCount = downloads.filter(d => d.state === 'progressing').length;

  return (
    <nav className="flex items-center h-12 px-3 gap-2 bg-[#0C0E15] border-b border-white/[0.06] select-none z-30">
      {/* Navigation History Controls */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={goBack}
          disabled={!activeTab?.canGoBack}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
          title="Back (Alt+Left)"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={goForward}
          disabled={!activeTab?.canGoForward}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
          title="Forward (Alt+Right)"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        {activeTab?.isLoading ? (
          <button
            onClick={stopLoading}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition-colors"
            title="Stop Loading (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={reload}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Reload (Ctrl+R / F5)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => navigateActiveTab('boss://newtab')}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Boss Home (Alt+Home)"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* Centered URL & Search Omnibox */}
      <AddressBar />

      {/* Right Browser Tools */}
      <div className="flex items-center gap-1">
        {/* Bookmark Star Toggle */}
        <button
          onClick={toggleBookmarkCurrentPage}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
            isCurrentBookmarked
              ? 'text-yellow-400 bg-yellow-400/10 shadow-[0_0_12px_rgba(250,204,21,0.3)]'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/10'
          }`}
          title={isCurrentBookmarked ? 'Remove Bookmark' : 'Bookmark This Page (Ctrl+D)'}
        >
          <Star className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-yellow-400' : ''}`} />
        </button>

        {/* Downloads */}
        <button
          onClick={() => setActiveModal(activeModal === 'downloads' ? null : 'downloads')}
          className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
            activeModal === 'downloads'
              ? 'text-white bg-white/15'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title="Downloads (Ctrl+J)"
        >
          <Download className="w-4 h-4" />
          {activeDownloadsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
              {activeDownloadsCount}
            </span>
          )}
        </button>

        {/* Extensions Hub */}
        <button
          onClick={() => setActiveModal(activeModal === 'extensions' ? null : 'extensions')}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
            activeModal === 'extensions'
              ? 'text-white bg-white/15'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title="Extensions Center"
        >
          <Puzzle className="w-4 h-4" />
        </button>

        {/* History Hub */}
        <button
          onClick={() => setActiveModal(activeModal === 'history' ? null : 'history')}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
            activeModal === 'history'
              ? 'text-white bg-white/15'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title="Browsing History (Ctrl+H)"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveModal(activeModal === 'settings' ? null : 'settings')}
          className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
            activeModal === 'settings'
              ? 'text-white bg-white/15'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title="Browser Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-white/10 mx-1" />

        {/* BOSS AI Assistant Sidebar Toggle */}
        <button
          onClick={() => setIsAISidebarOpen(prev => !prev)}
          className={`flex items-center gap-1.5 px-3 h-8 rounded-lg font-medium text-xs transition-all duration-200 border ${
            isAISidebarOpen
              ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white border-cyan-400/50 shadow-[0_0_15px_var(--accent-glow)]'
              : 'bg-white/[0.05] text-purple-300 hover:text-white hover:bg-purple-600/20 border-purple-500/30'
          }`}
          title="Toggle BOSS AI Assistant (Ctrl+Space)"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span className="font-orbitron font-semibold tracking-wide">BOSS AI</span>
        </button>
      </div>
    </nav>
  );
};
