import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { AccentColor } from '../../types';
import {
  Settings as SettingsIcon,
  Palette,
  Search,
  Shield,
  Download,
  Cpu,
  Sparkles,
  Keyboard,
  Info,
  Check,
  Eye,
  EyeOff,
  Flame,
  Zap,
  Globe,
  Trash2
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, setAccentColor, clearHistory } = useBrowser();
  const [activeSection, setActiveSection] = useState<
    'appearance' | 'search' | 'privacy' | 'downloads' | 'performance' | 'ai' | 'shortcuts' | 'about'
  >('appearance');

  const [showApiKey, setShowApiKey] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [clearedDataSuccess, setClearedDataSuccess] = useState(false);

  const testAIConnection = () => {
    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 2500);
  };

  const handleClearData = () => {
    clearHistory();
    setClearedDataSuccess(true);
    setTimeout(() => setClearedDataSuccess(false), 2500);
  };

  return (
    <div className="flex w-full h-full bg-[#08090C] text-gray-200 overflow-hidden select-none">
      {/* Settings Navigation Sidebar */}
      <div className="w-64 border-r border-white/10 bg-[#0C0E16] flex flex-col p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center">
            <SettingsIcon className="w-4 h-4 text-accent" />
          </div>
          <span className="font-orbitron font-bold text-sm tracking-wider text-white">
            SETTINGS
          </span>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveSection('appearance')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'appearance'
                ? 'bg-accent/20 text-white border border-accent/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Appearance & Themes</span>
          </button>

          <button
            onClick={() => setActiveSection('search')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'search'
                ? 'bg-accent/20 text-white border border-accent/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Search Engine</span>
          </button>

          <button
            onClick={() => setActiveSection('privacy')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'privacy'
                ? 'bg-accent/20 text-white border border-accent/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Privacy & Security</span>
          </button>

          <button
            onClick={() => setActiveSection('downloads')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'downloads'
                ? 'bg-accent/20 text-white border border-accent/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Downloads</span>
          </button>

          <button
            onClick={() => setActiveSection('performance')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'performance'
                ? 'bg-accent/20 text-white border border-accent/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>Performance & 3D</span>
          </button>

          <button
            onClick={() => setActiveSection('ai')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'ai'
                ? 'bg-accent/20 text-white border border-accent/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>BOSS AI Assistant</span>
          </button>

          <button
            onClick={() => setActiveSection('shortcuts')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'shortcuts'
                ? 'bg-accent/20 text-white border border-accent/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Keyboard className="w-4 h-4 text-pink-400" />
            <span>Keyboard Shortcuts</span>
          </button>

          <button
            onClick={() => setActiveSection('about')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSection === 'about'
                ? 'bg-accent/20 text-white border border-accent/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Info className="w-4 h-4 text-gray-400" />
            <span>About BOSS</span>
          </button>
        </nav>
      </div>

      {/* Main Settings Content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl">
        {/* APPEARANCE */}
        {activeSection === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-orbitron font-bold text-xl text-white mb-1">
                Appearance & Visual Identity
              </h2>
              <p className="text-xs text-gray-400">
                Customize colors, glass panels, and cybernetic aesthetics
              </p>
            </div>

            {/* Accent Color Palette */}
            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
              <span className="text-xs font-semibold text-white block">
                Primary Futuristic Accent
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  { id: 'purple', name: 'Cyber Violet', hex: '#8B5CF6' },
                  { id: 'cyan', name: 'Electric Cyan', hex: '#06B6D4' },
                  { id: 'blue', name: 'Neon Blue', hex: '#3B82F6' },
                  { id: 'emerald', name: 'Emerald Grid', hex: '#10B981' },
                  { id: 'gold', name: 'Solar Gold', hex: '#F59E0B' },
                  { id: 'rose', name: 'Crimson Void', hex: '#F43F5E' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setAccentColor(item.id as AccentColor)}
                    className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                      settings.accentColor === item.id
                        ? 'border-white bg-white/10 shadow-lg scale-105'
                        : 'border-white/5 hover:border-white/20 bg-black/20'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full mb-2 shadow-md flex items-center justify-center text-white"
                      style={{ backgroundColor: item.hex }}
                    >
                      {settings.accentColor === item.id && <Check className="w-4 h-4" />}
                    </div>
                    <span className="text-[11px] font-medium text-gray-300">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Mode */}
            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
              <span className="text-xs font-semibold text-white block">Theme Mode</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateSettings({ theme: 'cyber-dark' })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    settings.theme === 'cyber-dark'
                      ? 'border-accent bg-accent/10 shadow-md'
                      : 'border-white/10 hover:border-white/20 bg-black/20'
                  }`}
                >
                  <span className="font-semibold text-sm text-white block mb-1">
                    Cyber Obsidian (Default)
                  </span>
                  <span className="text-xs text-gray-400">
                    Deep black with glowing neon accents and glassmorphism.
                  </span>
                </button>
                <button
                  onClick={() => updateSettings({ theme: 'oled' })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    settings.theme === 'oled'
                      ? 'border-accent bg-accent/10 shadow-md'
                      : 'border-white/10 hover:border-white/20 bg-black/20'
                  }`}
                >
                  <span className="font-semibold text-sm text-white block mb-1">
                    Pure OLED Stealth
                  </span>
                  <span className="text-xs text-gray-400">
                    True #000000 blacks with zero backlight bleed for OLED monitors.
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH ENGINE */}
        {activeSection === 'search' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-orbitron font-bold text-xl text-white mb-1">Search Engine</h2>
              <p className="text-xs text-gray-400">
                Choose the default search provider for the address bar and New Tab page
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="space-y-2">
                {[
                  { id: 'google', name: 'Google (Default)', url: 'https://google.com/search?q=%s' },
                  { id: 'duckduckgo', name: 'DuckDuckGo (Privacy Focused)', url: 'https://duckduckgo.com/?q=%s' },
                  { id: 'brave', name: 'Brave Search (Independent Index)', url: 'https://search.brave.com/search?q=%s' },
                  { id: 'bing', name: 'Microsoft Bing (Copilot Integrated)', url: 'https://bing.com/search?q=%s' },
                  { id: 'ecosia', name: 'Ecosia (Eco Friendly)', url: 'https://ecosia.org/search?q=%s' }
                ].map(eng => (
                  <label
                    key={eng.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      settings.searchEngine === eng.id
                        ? 'border-accent bg-accent/10 text-white'
                        : 'border-white/5 hover:border-white/15 bg-black/20 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="searchEngine"
                        checked={settings.searchEngine === eng.id}
                        onChange={() => updateSettings({ searchEngine: eng.id as any })}
                        className="accent-purple-500"
                      />
                      <div>
                        <span className="font-semibold text-xs text-white block">
                          {eng.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">{eng.url}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRIVACY & SECURITY */}
        {activeSection === 'privacy' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-orbitron font-bold text-xl text-white mb-1">Privacy & Security</h2>
              <p className="text-xs text-gray-400">
                Control telemetry, tracking protection, and browsing session data
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Send "Do Not Track" Header
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Requests websites to not track your browsing activities
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.doNotTrack}
                  onChange={e => updateSettings({ doNotTrack: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Clear Browsing Data on Exit
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Automatically clears session cookies, cache, and history when BOSS BROWSER closes
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.clearOnExit}
                  onChange={e => updateSettings({ clearOnExit: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Clear Cached Data Now
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Removes all stored browsing history, cache, and local storage immediately
                  </span>
                </div>
                <button
                  onClick={handleClearData}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium border border-red-500/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{clearedDataSuccess ? 'Cleared!' : 'Clear Now'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DOWNLOADS */}
        {activeSection === 'downloads' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-orbitron font-bold text-xl text-white mb-1">Downloads</h2>
              <p className="text-xs text-gray-400">
                Configure destination directory and file download prompts
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Default Download Location
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={settings.downloadsPath}
                    onChange={e => updateSettings({ downloadsPath: e.target.value })}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent font-mono"
                  />
                  <button
                    onClick={() => {
                      if (window.bossAPI?.native) {
                        window.bossAPI.native.openPath(settings.downloadsPath);
                      }
                    }}
                    className="px-4 py-2 bg-white/[0.06] hover:bg-white/10 text-xs font-medium rounded-xl text-gray-200 border border-white/10"
                  >
                    Browse...
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Ask where to save each file before downloading
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Shows native file save dialog for every download
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.askDownloadPath}
                  onChange={e => updateSettings({ askDownloadPath: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* PERFORMANCE & 3D */}
        {activeSection === 'performance' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-orbitron font-bold text-xl text-white mb-1">Performance & 3D</h2>
              <p className="text-xs text-gray-400">
                Tune GPU hardware acceleration, Three.js shaders, and memory allocation
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Hardware Acceleration
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Use discrete GPU for rasterization and WebGL rendering
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.hardwareAcceleration}
                  onChange={e => updateSettings({ hardwareAcceleration: e.target.checked })}
                  className="w-4 h-4 accent-purple-500 rounded"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-white block mb-2">
                  Three.js 3D Background Quality
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'high', label: 'Ultra (1400 pts)' },
                    { id: 'medium', label: 'Balanced (700 pts)' },
                    { id: 'low', label: 'Battery Saver' },
                    { id: 'off', label: 'Disabled (Static)' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      onClick={() => updateSettings({ threeAnimations: lvl.id as any })}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        settings.threeAnimations === lvl.id
                          ? 'border-accent bg-accent/20 text-white shadow-sm'
                          : 'border-white/5 bg-black/20 text-gray-400 hover:text-white'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI ASSISTANT CONFIGURATION */}
        {activeSection === 'ai' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-orbitron font-bold text-xl text-white mb-1">
                BOSS AI Configuration
              </h2>
              <p className="text-xs text-gray-400">
                Configure your API key for Google Gemini, OpenAI, or local Ollama.
                Keys are stored securely on your local device only.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="text-xs font-semibold text-white block mb-2">
                  AI Intelligence Engine Provider
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'gemini', name: 'Google Gemini', desc: 'Recommended (Fast & Smart)' },
                    { id: 'openai', name: 'OpenAI GPT-4o', desc: 'Powerful reasoning' },
                    { id: 'demo', name: 'Offline Demo Mode', desc: 'Built-in intelligent mocks' }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => updateSettings({ aiProvider: p.id as any })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        settings.aiProvider === p.id
                          ? 'border-accent bg-accent/20 text-white shadow-sm'
                          : 'border-white/5 hover:border-white/20 bg-black/20 text-gray-400'
                      }`}
                    >
                      <span className="font-semibold text-xs text-white block mb-0.5">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-gray-400">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Key */}
              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  API Key ({settings.aiProvider.toUpperCase()})
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.aiApiKey}
                    onChange={e => updateSettings({ aiApiKey: e.target.value })}
                    placeholder={
                      settings.aiProvider === 'gemini'
                        ? 'AIzaSy...'
                        : settings.aiProvider === 'openai'
                        ? 'sk-proj-...'
                        : 'No API key needed in Demo Mode'
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent font-mono pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-1 text-gray-400 hover:text-white"
                      title="Toggle Visibility"
                    >
                      {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={testAIConnection}
                      className="px-2 py-1 bg-accent/20 hover:bg-accent/40 text-accent text-[10px] font-semibold rounded-lg"
                    >
                      {testSuccess ? 'Verified!' : 'Test'}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Never exposed in frontend bundles. Stored in encrypted client storage.
                </p>
              </div>

              {/* Model Choice */}
              <div>
                <label className="text-xs font-semibold text-white block mb-1">Model</label>
                <select
                  value={settings.aiModel}
                  onChange={e => updateSettings({ aiModel: e.target.value })}
                  className="w-full bg-[#0E1017] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultra Fast)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Code Analysis)</option>
                  <option value="gpt-4o">GPT-4o (Omni Reasoning)</option>
                  <option value="gpt-4o-mini">GPT-4o Mini (Speed)</option>
                </select>
              </div>

              {/* System Prompt Customization */}
              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  AI System Instruction / Persona
                </label>
                <textarea
                  rows={3}
                  value={settings.aiSystemPrompt}
                  onChange={e => updateSettings({ aiSystemPrompt: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        )}

        {/* KEYBOARD SHORTCUTS */}
        {activeSection === 'shortcuts' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-orbitron font-bold text-xl text-white mb-1">Keyboard Shortcuts</h2>
              <p className="text-xs text-gray-400">Master BOSS BROWSER at terminal velocity</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 divide-y divide-white/[0.06] text-xs">
              {[
                { key: 'Ctrl + T', desc: 'Open a new tab' },
                { key: 'Ctrl + W', desc: 'Close active tab' },
                { key: 'Ctrl + Shift + T', desc: 'Restore last closed tab' },
                { key: 'Ctrl + Tab', desc: 'Switch to next tab' },
                { key: 'Ctrl + R / F5', desc: 'Reload active tab' },
                { key: 'Ctrl + L / Alt + D', desc: 'Focus address bar' },
                { key: 'Ctrl + D', desc: 'Bookmark current page' },
                { key: 'Ctrl + H', desc: 'Open Browsing History' },
                { key: 'Ctrl + J', desc: 'Open Download Manager' },
                { key: 'Ctrl + Space', desc: 'Toggle BOSS AI Sidebar' },
                { key: 'Alt + Left / Right', desc: 'Navigate Back / Forward' },
                { key: 'Alt + Home', desc: 'Go to Boss New Tab Page' }
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between py-2.5">
                  <span className="text-gray-300">{s.desc}</span>
                  <kbd className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px] text-cyan-300 shadow-sm">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABOUT */}
        {activeSection === 'about' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-orbitron font-bold text-xl text-white mb-1">
                About BOSS BROWSER
              </h2>
              <p className="text-xs text-gray-400">
                Next-Generation Desktop Web Platform
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 p-[2px] shadow-[0_0_30px_var(--accent-glow)]">
                <div className="w-full h-full bg-[#0A0D14] rounded-[14px] flex items-center justify-center">
                  <span className="font-orbitron font-black text-2xl text-gradient">B</span>
                </div>
              </div>

              <div>
                <h3 className="font-orbitron font-extrabold text-xl text-white tracking-widest">
                  BOSS BROWSER 2.0
                </h3>
                <p className="text-xs text-accent font-semibold tracking-wider uppercase mt-0.5">
                  Browse Beyond Limits
                </p>
              </div>

              <div className="w-full max-w-md bg-black/30 rounded-xl p-3 border border-white/[0.06] text-left text-xs space-y-1.5 font-mono text-gray-400">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="text-white">1.0.0-production (x64)</span>
                </div>
                <div className="flex justify-between">
                  <span>Chromium Engine:</span>
                  <span className="text-white">114.0.5735.289</span>
                </div>
                <div className="flex justify-between">
                  <span>Electron Kernel:</span>
                  <span className="text-white">24.15.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Three.js 3D Engine:</span>
                  <span className="text-white">r170 (WebGL2)</span>
                </div>
                <div className="flex justify-between">
                  <span>Architecture:</span>
                  <span className="text-cyan-400">ContextIsolated + WebContentsView</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 max-w-sm">
                Crafted for creators, power users, and engineers who demand ultra-high visual quality and uncompromising browsing speed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
