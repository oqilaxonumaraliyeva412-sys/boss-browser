import React, { useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { HistoryItem } from '../../types';
import {
  Clock,
  Search,
  Trash2,
  ExternalLink,
  Globe,
  Sparkles,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { history, clearHistory, removeHistoryItem, navigateActiveTab, createTab } = useBrowser();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday' | 'week'>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // Filter history
  const filteredHistory = history.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const diff = now - item.visitedAt;
    if (dateFilter === 'today') return diff < oneDay;
    if (dateFilter === 'yesterday') return diff >= oneDay && diff < 2 * oneDay;
    if (dateFilter === 'week') return diff < 7 * oneDay;
    return true;
  });

  // Group by date
  const groupHistoryByDate = () => {
    const groups: { [key: string]: HistoryItem[] } = {};
    filteredHistory.forEach(item => {
      const dateStr = new Date(item.visitedAt).toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(item);
    });
    return groups;
  };

  const grouped = groupHistoryByDate();

  return (
    <div className="flex flex-col w-full h-full bg-[#08090C] text-gray-200 p-8 select-none overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-lg text-white tracking-wider">
              BROWSING HISTORY
            </h2>
            <p className="text-xs text-gray-400">
              {history.length} records securely cached locally
            </p>
          </div>
        </div>

        {/* Clear History Button */}
        <div>
          {confirmClear ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Clear all?
              </span>
              <button
                onClick={() => {
                  clearHistory();
                  setConfirmClear(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 text-xs text-gray-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium border border-red-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Browsing Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search browsing history..."
            className="w-full bg-[#121622] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#121622] p-1 rounded-xl border border-white/10">
          {(['all', 'today', 'yesterday', 'week'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setDateFilter(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${
                dateFilter === tab
                  ? 'bg-accent text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Time' : tab === 'week' ? 'Past 7 Days' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* History Items Grouped */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Clock className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No browsing history found</p>
          </div>
        ) : (
          Object.keys(grouped).map(dateStr => (
            <div key={dateStr} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 sticky top-0 bg-[#08090C]/90 py-1 z-10 backdrop-blur-sm">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                <span>{dateStr}</span>
              </div>

              {grouped[dateStr].map(item => (
                <div
                  key={item.id}
                  className="glass-card flex items-center justify-between p-3 rounded-xl group hover:border-accent/40 transition-all"
                >
                  <div
                    onClick={() => navigateActiveTab(item.url)}
                    className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                      {item.url.startsWith('boss://') ? (
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-semibold text-gray-200 group-hover:text-white truncate">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-gray-500 truncate">{item.url}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-400">
                    <span className="text-[10px] text-gray-500">
                      {new Date(item.visitedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <button
                      onClick={() => createTab(item.url, item.title)}
                      className="p-1 rounded-md hover:bg-white/10 hover:text-white"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeHistoryItem(item.id)}
                      className="p-1 rounded-md hover:bg-red-500/20 hover:text-red-400"
                      title="Remove from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
