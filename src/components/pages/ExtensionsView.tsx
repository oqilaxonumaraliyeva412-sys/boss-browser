import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { Extension } from '../../types';
import {
  Puzzle,
  Shield,
  Moon,
  Sparkles,
  Cpu,
  Key,
  Languages,
  Check,
  Plus,
  Trash2,
  Info,
  ExternalLink,
  Search
} from 'lucide-react';

export const ExtensionsView: React.FC = () => {
  const { extensions, toggleExtension, installExtension, removeExtension } = useBrowser();
  const [activeTab, setActiveTab] = useState<'installed' | 'store'>('installed');
  const [searchQuery, setSearchQuery] = useState('');

  const installedList = extensions.filter(e => e.isInstalled);
  const storeList = extensions.filter(e => !e.isInstalled);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'Moon': return <Moon className="w-5 h-5 text-purple-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'Key': return <Key className="w-5 h-5 text-amber-400" />;
      case 'Languages': return <Languages className="w-5 h-5 text-pink-400" />;
      default: return <Puzzle className="w-5 h-5 text-accent" />;
    }
  };

  const listToShow = activeTab === 'installed' ? installedList : storeList;
  const filtered = listToShow.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full bg-[#08090C] text-gray-200 p-8 select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Puzzle className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-lg text-white tracking-wider">
              EXTENSION CENTER
            </h2>
            <p className="text-xs text-gray-400">
              Manage installed add-ons and explore the BOSS Store
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#121622] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('installed')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'installed'
                ? 'bg-accent text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Installed ({installedList.length})
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'store'
                ? 'bg-accent text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Extension Store ({storeList.length})
          </button>
        </div>
      </div>

      {/* Info notice */}
      <div className="glass-panel px-4 py-3 rounded-xl mb-6 flex items-start gap-3 border border-white/10 text-xs text-gray-400">
        <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Electron Extension Architecture:</span> Native content scripts, declarative ad-blocking rules, and custom Chrome WebExtension APIs are supported in BOSS BROWSER through session webRequest listeners and content isolation.
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mb-6">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search extensions by name or functionality..."
          className="w-full bg-[#121622] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent"
        />
      </div>

      {/* Grid of Extensions */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 pr-2">
        {filtered.map(ext => (
          <div
            key={ext.id}
            className="glass-card flex flex-col justify-between p-5 rounded-2xl border border-white/10 hover:border-accent/40 transition-all gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center flex-shrink-0">
                {getIcon(ext.icon)}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-white truncate">
                    {ext.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-gray-400">
                    v{ext.version}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                  {ext.description}
                </p>
                <span className="text-[10px] text-gray-500 mt-1">By {ext.author}</span>
              </div>
            </div>

            {/* Permissions Pills */}
            <div className="flex flex-wrap gap-1">
              {ext.permissions.map(perm => (
                <span
                  key={perm}
                  className="text-[9px] px-2 py-0.5 rounded-md bg-white/[0.04] text-gray-400 font-mono"
                >
                  {perm}
                </span>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              {ext.isInstalled ? (
                <>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ext.enabled}
                      onChange={() => toggleExtension(ext.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent relative"></div>
                    <span className="text-xs text-gray-300">
                      {ext.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>

                  <button
                    onClick={() => removeExtension(ext.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    title="Uninstall"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => installExtension(ext.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:brightness-110 shadow-lg shadow-purple-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Install to BOSS BROWSER</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

