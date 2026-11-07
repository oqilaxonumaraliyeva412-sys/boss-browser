import React, { useState, useEffect } from 'react';
import { TabBar } from './TabBar';
import { Minus, Square, Copy, X, Shield, User, Sparkles } from 'lucide-react';
import { useBrowser } from '../../context/BrowserContext';

export const TitleBar: React.FC = () => {
  const { settings, updateSettings } = useBrowser();
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Check if electron is available
    if (window.bossAPI?.window) {
      window.bossAPI.window.isMaximized().then(setIsMaximized);
      const removeListener = window.bossAPI.window.onMaximizeChange((max: boolean) => {
        setIsMaximized(max);
      });
      return () => {
        if (typeof removeListener === 'function') removeListener();
      };
    }
  }, []);

  const handleMinimize = () => {
    if (window.bossAPI?.window) {
      window.bossAPI.window.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.bossAPI?.window) {
      window.bossAPI.window.maximize();
      setIsMaximized(!isMaximized);
    }
  };

  const handleClose = () => {
    if (window.bossAPI?.window) {
      window.bossAPI.window.close();
    }
  };

  return (
    <header className="flex items-center h-10 w-full bg-[#08090C] border-b border-white/[0.06] select-none drag-region pl-3 pr-0 z-40">
      {/* Brand Icon & Name */}
      <div className="flex items-center gap-2 mr-2 no-drag cursor-pointer group">
        <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 p-[1.5px] shadow-[0_0_12px_var(--accent-glow)] group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-[#08090C] rounded-[6px] flex items-center justify-center">
            <span className="text-white font-orbitron font-extrabold text-[11px] tracking-widest text-gradient">
              B
            </span>
          </div>
        </div>
        <span className="text-[12px] font-orbitron font-bold tracking-wider text-gray-200 hidden sm:inline-block">
          BOSS
        </span>
      </div>

      {/* Tabs Strip */}
      <TabBar />

      {/* Profile & Window Controls */}
      <div className="flex items-center no-drag h-full">
        {/* Incognito / Privacy Toggle Pill */}
        <button
          onClick={() => updateSettings({ privacyMode: !settings.privacyMode })}
          className={`flex items-center gap-1.5 px-2.5 py-1 mr-2 rounded-full text-[11px] font-medium transition-all ${
            settings.privacyMode
              ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
              : 'bg-white/[0.04] text-gray-400 hover:text-gray-200 hover:bg-white/[0.08] border border-white/[0.04]'
          }`}
          title={settings.privacyMode ? 'Private Mode Active (History & Cookies Isolated)' : 'Switch to Private Mode'}
        >
          {settings.privacyMode ? (
            <>
              <Shield className="w-3 h-3 text-purple-400 animate-pulse" />
              <span>Incognito</span>
            </>
          ) : (
            <>
              <User className="w-3 h-3 text-gray-400" />
              <span>Boss User</span>
            </>
          )}
        </button>

        {/* Native Electron Window Controls */}
        <div className="flex items-center h-full">
          <button
            onClick={handleMinimize}
            className="flex items-center justify-center w-11 h-10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleMaximize}
            className="flex items-center justify-center w-11 h-10 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <Copy className="w-3 h-3 rotate-180" />
            ) : (
              <Square className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-11 h-10 hover:bg-red-600 text-gray-400 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

