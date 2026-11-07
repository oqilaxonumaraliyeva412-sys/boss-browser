import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { Tab } from '../../types';
import {
  X,
  Plus,
  Pin,
  Volume2,
  VolumeX,
  Globe,
  Loader2,
  Sparkles,
  ExternalLink,
  Copy,
  Trash2
} from 'lucide-react';

export const TabBar: React.FC = () => {
  const {
    tabs,
    activeTabId,
    createTab,
    closeTab,
    switchTab,
    duplicateTab,
    pinTab,
    muteTab
  } = useBrowser();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    tabId: string;
  } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      tabId
    });
  };

  const closeContextMenu = () => setContextMenu(null);

  return (
    <div
      className="flex items-center flex-1 h-10 px-2 overflow-x-auto no-scrollbar gap-1 drag-region select-none"
      onClick={closeContextMenu}
    >
      {tabs.map(tab => {
        const isActive = tab.id === activeTabId;
        const isInternal = tab.url.startsWith('boss://');

        return (
          <div
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            onContextMenu={e => handleContextMenu(e, tab.id)}
            className={`group relative flex items-center h-8 transition-all duration-150 rounded-lg cursor-pointer no-drag border ${
              tab.isPinned ? 'px-2.5 min-w-[38px] max-w-[38px] justify-center' : 'px-3 min-w-[130px] max-w-[220px] flex-1'
            } ${
              isActive
                ? 'bg-[#181C28]/90 text-white border-white/10 shadow-lg shadow-black/40'
                : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-white/[0.04] border-transparent'
            }`}
          >
            {/* Active glowing underline */}
            {isActive && (
              <div
                className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-accent shadow-[0_0_8px_var(--accent-glow)] transition-all"
              />
            )}

            {/* Favicon or Loading Spinner */}
            <div className="flex-shrink-0 mr-2 flex items-center justify-center">
              {tab.isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
              ) : tab.favicon ? (
                <img
                  src={tab.favicon}
                  alt=""
                  className="w-3.5 h-3.5 rounded-sm object-contain"
                  onError={e => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : isInternal ? (
                <Sparkles className="w-3.5 h-3.5 text-accent" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-300" />
              )}
            </div>

            {/* Tab Title (hidden if pinned) */}
            {!tab.isPinned && (
              <span className="text-xs font-medium truncate flex-1 tracking-tight">
                {tab.title || 'New Tab'}
              </span>
            )}

            {/* Muted Indicator */}
            {tab.isMuted && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  muteTab(tab.id);
                }}
                className="ml-1 text-gray-400 hover:text-white"
                title="Unmute Tab"
              >
                <VolumeX className="w-3 h-3 text-red-400" />
              </button>
            )}

            {/* Pin Badge */}
            {tab.isPinned && (
              <Pin className="w-2.5 h-2.5 absolute top-1 right-1 text-accent opacity-75" />
            )}

            {/* Close Button */}
            {!tab.isPinned && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className={`ml-1.5 p-0.5 rounded-md hover:bg-white/10 transition-opacity ${
                  isActive ? 'opacity-80 hover:opacity-100' : 'opacity-0 group-hover:opacity-80'
                }`}
                title="Close Tab (Ctrl+W)"
              >
                <X className="w-3 h-3 hover:text-red-400" />
              </button>
            )}
          </div>
        );
      })}

      {/* New Tab Button */}
      <button
        onClick={() => createTab()}
        className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 no-drag transition-colors flex-shrink-0 ml-0.5"
        title="New Tab (Ctrl+T)"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Context Menu Modal */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-[#12151F] border border-white/10 rounded-xl shadow-2xl py-1 w-48 text-xs text-gray-300 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => {
              duplicateTab(contextMenu.tabId);
              closeContextMenu();
            }}
            className="w-full flex items-center px-3 py-2 hover:bg-white/10 hover:text-white gap-2 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-accent" />
            <span>Duplicate Tab</span>
          </button>
          <button
            onClick={() => {
              pinTab(contextMenu.tabId);
              closeContextMenu();
            }}
            className="w-full flex items-center px-3 py-2 hover:bg-white/10 hover:text-white gap-2 transition-colors"
          >
            <Pin className="w-3.5 h-3.5 text-accent" />
            <span>Pin / Unpin Tab</span>
          </button>
          <button
            onClick={() => {
              muteTab(contextMenu.tabId);
              closeContextMenu();
            }}
            className="w-full flex items-center px-3 py-2 hover:bg-white/10 hover:text-white gap-2 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-accent" />
            <span>Mute / Unmute Audio</span>
          </button>
          <div className="h-[1px] bg-white/10 my-1" />
          <button
            onClick={() => {
              closeTab(contextMenu.tabId);
              closeContextMenu();
            }}
            className="w-full flex items-center px-3 py-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Close Tab</span>
          </button>
        </div>
      )}
    </div>
  );
};
