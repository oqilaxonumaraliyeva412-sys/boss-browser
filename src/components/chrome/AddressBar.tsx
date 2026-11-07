import React, { useState, useEffect, useRef } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import {
  Lock,
  Search,
  Globe,
  Sparkles,
  ShieldCheck,
  X,
  Copy,
  Check,
  Clock,
  Bookmark as BookmarkIcon,
  Compass,
  ArrowRight
} from 'lucide-react';

export const AddressBar: React.FC = () => {
  const {
    activeTab,
    navigateActiveTab,
    settings,
    updateSettings,
    history,
    bookmarks,
    setActiveModal
  } = useBrowser();

  const [inputVal, setInputVal] = useState(activeTab?.url || 'boss://newtab');
  const [isFocused, setIsFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFocused && activeTab) {
      setInputVal(activeTab.url === 'boss://newtab' ? '' : activeTab.url);
    }
  }, [activeTab?.url, isFocused]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) {
      navigateActiveTab('boss://newtab');
    } else {
      navigateActiveTab(inputVal);
    }
    inputRef.current?.blur();
    setIsFocused(false);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTab?.url) {
      navigator.clipboard.writeText(activeTab.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const isInternal = activeTab?.url?.startsWith('boss://');
  const isSecure = activeTab?.url?.startsWith('https://');

  // Filter history & bookmarks for suggestions
  const filterQuery = inputVal.toLowerCase().trim();
  const historySuggestions = filterQuery
    ? history
        .filter(h => h.title.toLowerCase().includes(filterQuery) || h.url.toLowerCase().includes(filterQuery))
        .slice(0, 4)
    : history.slice(0, 3);

  const bookmarkSuggestions = filterQuery
    ? bookmarks
        .filter(b => b.title.toLowerCase().includes(filterQuery) || b.url.toLowerCase().includes(filterQuery))
        .slice(0, 3)
    : [];

  const handleSelectSuggestion = (url: string) => {
    setInputVal(url);
    navigateActiveTab(url);
    setIsFocused(false);
  };

  return (
    <div className="relative flex-1 max-w-3xl mx-auto" ref={dropdownRef}>
      <form
        onSubmit={handleSubmit}
        className={`flex items-center h-8 px-2.5 rounded-lg border transition-all duration-200 ${
          isFocused
            ? 'bg-[#0E1119] border-purple-500/60 shadow-[0_0_15px_-2px_var(--accent-glow)]'
            : 'bg-[#141824]/80 border-white/[0.08] hover:border-white/[0.16] hover:bg-[#181D2C]'
        }`}
      >
        {/* Security / Scheme Badge */}
        <div className="flex items-center mr-2 text-xs flex-shrink-0">
          {isInternal ? (
            <div className="flex items-center gap-1 text-accent font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-bold tracking-wider">BOSS</span>
            </div>
          ) : isSecure ? (
            <div className="flex items-center gap-1 text-emerald-400" title="Connection is secure (HTTPS)">
              <Lock className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-400" title="Search or enter URL">
              <Search className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            inputRef.current?.select();
          }}
          onBlur={() => {
            // slight delay to allow clicking suggestions
            setTimeout(() => setIsFocused(false), 200);
          }}
          placeholder="Search with Google or type a URL..."
          className="w-full bg-transparent text-xs text-gray-100 placeholder-gray-500 focus:outline-none tracking-normal font-sans"
        />

        {/* Action icons right */}
        <div className="flex items-center gap-1 ml-1.5 flex-shrink-0 text-gray-400">
          {inputVal && isFocused && (
            <button
              type="button"
              onClick={() => {
                setInputVal('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded hover:bg-white/10 hover:text-white"
              title="Clear input"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {!isFocused && activeTab?.url && activeTab.url !== 'boss://newtab' && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded hover:bg-white/10 hover:text-white transition-colors"
              title="Copy URL"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete / Suggestions Dropdown */}
      {isFocused && (
        <div className="absolute top-10 left-0 right-0 z-50 bg-[#101420]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1.5 animate-in fade-in duration-150">
          {/* Direct Search Option */}
          {inputVal.trim() && (
            <div
              onMouseDown={() => handleSubmit()}
              className="flex items-center gap-3 px-3.5 py-2 hover:bg-white/[0.08] cursor-pointer text-xs text-gray-200 border-b border-white/[0.06]"
            >
              <Search className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              <span className="truncate flex-1">
                Search <span className="font-semibold text-white">"{inputVal}"</span> with{' '}
                <span className="capitalize text-accent">{settings.searchEngine}</span>
              </span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </div>
          )}

          {/* Quick Internal Navigation Hubs */}
          <div className="grid grid-cols-4 gap-1 p-2 bg-black/20 border-b border-white/[0.06] text-[11px]">
            <button
              onMouseDown={() => handleSelectSuggestion('boss://newtab')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
            >
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>New Tab</span>
            </button>
            <button
              onMouseDown={() => handleSelectSuggestion('boss://bookmarks')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
            >
              <BookmarkIcon className="w-3 h-3 text-yellow-400" />
              <span>Bookmarks</span>
            </button>
            <button
              onMouseDown={() => handleSelectSuggestion('boss://history')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
            >
              <Clock className="w-3 h-3 text-blue-400" />
              <span>History</span>
            </button>
            <button
              onMouseDown={() => handleSelectSuggestion('boss://settings')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white transition-colors"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Settings</span>
            </button>
          </div>

          {/* Bookmarks Matches */}
          {bookmarkSuggestions.length > 0 && (
            <div className="py-1">
              <div className="px-3.5 py-1 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                Matching Bookmarks
              </div>
              {bookmarkSuggestions.map(bm => (
                <div
                  key={bm.id}
                  onMouseDown={() => handleSelectSuggestion(bm.url)}
                  className="flex items-center gap-3 px-3.5 py-1.5 hover:bg-white/[0.08] cursor-pointer text-xs"
                >
                  <BookmarkIcon className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-200 font-medium truncate flex-1">{bm.title}</span>
                  <span className="text-[11px] text-gray-500 truncate max-w-[180px]">{bm.url}</span>
                </div>
              ))}
            </div>
          )}

          {/* History Matches */}
          {historySuggestions.length > 0 && (
            <div className="py-1">
              <div className="px-3.5 py-1 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                Recent History
              </div>
              {historySuggestions.map(h => (
                <div
                  key={h.id}
                  onMouseDown={() => handleSelectSuggestion(h.url)}
                  className="flex items-center gap-3 px-3.5 py-1.5 hover:bg-white/[0.08] cursor-pointer text-xs"
                >
                  <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-200 font-medium truncate flex-1">{h.title}</span>
                  <span className="text-[11px] text-gray-500 truncate max-w-[180px]">{h.url}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
