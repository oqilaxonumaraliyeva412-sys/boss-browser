import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Tab,
  Bookmark,
  BookmarkFolder,
  HistoryItem,
  DownloadItem,
  Extension,
  BrowserSettings,
  QuickShortcut,
  AccentColor
} from '../types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_SHORTCUTS,
  DEFAULT_BOOKMARKS,
  DEFAULT_FOLDERS,
  DEFAULT_HISTORY,
  DEFAULT_EXTENSIONS,
  STORAGE_KEYS,
  getStorage,
  setStorage
} from '../utils/storage';

interface BrowserContextType {
  // Tabs
  tabs: Tab[];
  activeTabId: string;
  activeTab: Tab | undefined;
  createTab: (url?: string, title?: string, pinned?: boolean) => string;
  closeTab: (id: string) => void;
  switchTab: (id: string) => void;
  duplicateTab: (id: string) => void;
  pinTab: (id: string) => void;
  muteTab: (id: string) => void;
  restoreClosedTab: () => void;
  updateActiveTab: (partial: Partial<Tab>) => void;
  updateTab: (id: string, partial: Partial<Tab>) => void;
  navigateActiveTab: (input: string) => void;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  stopLoading: () => void;

  // Bookmarks
  bookmarks: Bookmark[];
  bookmarkFolders: BookmarkFolder[];
  addBookmark: (title: string, url: string, folder?: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (url: string) => boolean;
  toggleBookmarkCurrentPage: () => void;
  addBookmarkFolder: (name: string) => void;

  // History
  history: HistoryItem[];
  addToHistory: (title: string, url: string) => void;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;

  // Downloads
  downloads: DownloadItem[];
  addDownload: (item: Partial<DownloadItem>) => void;
  removeDownload: (id: string) => void;

  // Settings
  settings: BrowserSettings;
  updateSettings: (partial: Partial<BrowserSettings>) => void;
  setAccentColor: (accent: AccentColor) => void;

  // Extensions
  extensions: Extension[];
  toggleExtension: (id: string) => void;
  installExtension: (id: string) => void;
  removeExtension: (id: string) => void;

  // Shortcuts
  shortcuts: QuickShortcut[];
  addShortcut: (title: string, url: string) => void;
  removeShortcut: (id: string) => void;

  // UI Modals & Sidebars
  isAISidebarOpen: boolean;
  setIsAISidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  activeModal: 'settings' | 'history' | 'bookmarks' | 'downloads' | 'extensions' | null;
  setActiveModal: (modal: 'settings' | 'history' | 'bookmarks' | 'downloads' | 'extensions' | null) => void;

  // Search Engine Helper
  buildSearchUrl: (query: string) => string;
}

const BrowserContext = createContext<BrowserContextType | null>(null);

const DEFAULT_NEW_TAB: Tab = {
  id: 'tab-init-1',
  title: 'BOSS BROWSER — New Tab',
  url: 'boss://newtab',
  isLoading: false,
  canGoBack: false,
  canGoForward: false,
  isPinned: false,
  isMuted: false,
  lastAccessed: Date.now()
};

export const BrowserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Settings
  const [settings, setSettings] = useState<BrowserSettings>(() =>
    getStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );

  // Tabs
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const saved = getStorage<Tab[]>(STORAGE_KEYS.TABS, []);
    return saved.length > 0 ? saved : [DEFAULT_NEW_TAB];
  });
  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[0]?.id || DEFAULT_NEW_TAB.id);
  const [closedTabs, setClosedTabs] = useState<Tab[]>(() =>
    getStorage(STORAGE_KEYS.CLOSED_TABS, [])
  );

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() =>
    getStorage(STORAGE_KEYS.BOOKMARKS, DEFAULT_BOOKMARKS)
  );
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>(() =>
    getStorage(STORAGE_KEYS.FOLDERS, DEFAULT_FOLDERS)
  );

  // History
  const [history, setHistory] = useState<HistoryItem[]>(() =>
    getStorage(STORAGE_KEYS.HISTORY, DEFAULT_HISTORY)
  );

  // Downloads
  const [downloads, setDownloads] = useState<DownloadItem[]>(() =>
    getStorage(STORAGE_KEYS.DOWNLOADS, [
      {
        id: 'd1',
        filename: 'boss-browser-setup-x64.exe',
        url: 'https://bossbrowser.io/releases/boss-browser-setup-x64.exe',
        path: 'C:\\Users\\MADI\\Downloads\\boss-browser-setup-x64.exe',
        totalBytes: 98500000,
        receivedBytes: 98500000,
        state: 'completed',
        startTime: Date.now() - 3600000,
        endTime: Date.now() - 3550000
      },
      {
        id: 'd2',
        filename: 'cyber-nebula-wallpaper-4k.png',
        url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86',
        path: 'C:\\Users\\MADI\\Downloads\\cyber-nebula-wallpaper-4k.png',
        totalBytes: 14200000,
        receivedBytes: 14200000,
        state: 'completed',
        startTime: Date.now() - 7200000,
        endTime: Date.now() - 7180000
      }
    ])
  );

  // Extensions
  const [extensions, setExtensions] = useState<Extension[]>(() =>
    getStorage(STORAGE_KEYS.EXTENSIONS, DEFAULT_EXTENSIONS)
  );

  // Shortcuts
  const [shortcuts, setShortcuts] = useState<QuickShortcut[]>(() =>
    getStorage(STORAGE_KEYS.SHORTCUTS, DEFAULT_SHORTCUTS)
  );

  // Modals & Sidebar
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'settings' | 'history' | 'bookmarks' | 'downloads' | 'extensions' | null>(null);

  // Sync to localStorage
  useEffect(() => { setStorage(STORAGE_KEYS.SETTINGS, settings); }, [settings]);
  useEffect(() => { setStorage(STORAGE_KEYS.TABS, tabs); }, [tabs]);
  useEffect(() => { setStorage(STORAGE_KEYS.CLOSED_TABS, closedTabs); }, [closedTabs]);
  useEffect(() => { setStorage(STORAGE_KEYS.BOOKMARKS, bookmarks); }, [bookmarks]);
  useEffect(() => { setStorage(STORAGE_KEYS.FOLDERS, bookmarkFolders); }, [bookmarkFolders]);
  useEffect(() => { setStorage(STORAGE_KEYS.HISTORY, history); }, [history]);
  useEffect(() => { setStorage(STORAGE_KEYS.DOWNLOADS, downloads); }, [downloads]);
  useEffect(() => { setStorage(STORAGE_KEYS.EXTENSIONS, extensions); }, [extensions]);
  useEffect(() => { setStorage(STORAGE_KEYS.SHORTCUTS, shortcuts); }, [shortcuts]);

  // Sync accent attribute on document.documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', settings.accentColor);
  }, [settings.accentColor]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const buildSearchUrl = useCallback((query: string) => {
    const trimmed = query.trim();
    if (settings.searchEngine === 'duckduckgo') {
      return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
    } else if (settings.searchEngine === 'bing') {
      return `https://www.bing.com/search?q=${encodeURIComponent(trimmed)}`;
    } else if (settings.searchEngine === 'brave') {
      return `https://search.brave.com/search?q=${encodeURIComponent(trimmed)}`;
    } else if (settings.searchEngine === 'ecosia') {
      return `https://www.ecosia.org/search?q=${encodeURIComponent(trimmed)}`;
    } else if (settings.customSearchUrl && settings.customSearchUrl.includes('%s')) {
      return settings.customSearchUrl.replace('%s', encodeURIComponent(trimmed));
    }
    // Default Google
    return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
  }, [settings.searchEngine, settings.customSearchUrl]);

  const addToHistory = useCallback((title: string, url: string) => {
    if (!url || url === 'boss://newtab' || settings.privacyMode) return;
    setHistory(prev => {
      const existingIndex = prev.findIndex(item => item.url === url);
      if (existingIndex >= 0) {
        const item = prev[existingIndex];
        const updated = {
          ...item,
          title: title || item.title,
          visitedAt: Date.now(),
          visitCount: (item.visitCount || 1) + 1
        };
        const rest = prev.filter((_, idx) => idx !== existingIndex);
        return [updated, ...rest];
      }
      const newItem: HistoryItem = {
        id: 'hist-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        title: title || url,
        url,
        visitedAt: Date.now(),
        visitCount: 1
      };
      return [newItem, ...prev.slice(0, 499)]; // retain 500 items
    });
  }, [settings.privacyMode]);

  const createTab = useCallback((url = 'boss://newtab', title = 'BOSS BROWSER — New Tab', pinned = false): string => {
    const newId = 'tab-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newTab: Tab = {
      id: newId,
      title,
      url,
      isLoading: url !== 'boss://newtab',
      canGoBack: false,
      canGoForward: false,
      isPinned: pinned,
      isMuted: false,
      lastAccessed: Date.now()
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
    return newId;
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      if (prev.length <= 1) {
        // If closing the only tab, replace with fresh new tab
        const resetTab: Tab = {
          id: 'tab-' + Date.now(),
          title: 'BOSS BROWSER — New Tab',
          url: 'boss://newtab',
          isLoading: false,
          canGoBack: false,
          canGoForward: false,
          isPinned: false,
          isMuted: false,
          lastAccessed: Date.now()
        };
        setActiveTabId(resetTab.id);
        return [resetTab];
      }

      const closingIndex = prev.findIndex(t => t.id === id);
      const closingTab = prev[closingIndex];
      if (closingTab) {
        setClosedTabs(c => [closingTab, ...c.slice(0, 19)]);
      }

      const nextTabs = prev.filter(t => t.id !== id);
      if (activeTabId === id) {
        const nextActive = nextTabs[Math.max(0, closingIndex - 1)] || nextTabs[0];
        setActiveTabId(nextActive.id);
      }
      return nextTabs;
    });
  }, [activeTabId]);

  const switchTab = useCallback((id: string) => {
    setActiveTabId(id);
    setTabs(prev =>
      prev.map(t => (t.id === id ? { ...t, lastAccessed: Date.now() } : t))
    );
  }, []);

  const duplicateTab = useCallback((id: string) => {
    const target = tabs.find(t => t.id === id);
    if (!target) return;
    createTab(target.url, target.title);
  }, [tabs, createTab]);

  const pinTab = useCallback((id: string) => {
    setTabs(prev =>
      prev.map(t => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    );
  }, []);

  const muteTab = useCallback((id: string) => {
    setTabs(prev =>
      prev.map(t => (t.id === id ? { ...t, isMuted: !t.isMuted } : t))
    );
  }, []);

  const restoreClosedTab = useCallback(() => {
    if (closedTabs.length === 0) return;
    const [latest, ...remaining] = closedTabs;
    setClosedTabs(remaining);
    setTabs(prev => [...prev, { ...latest, id: 'tab-' + Date.now() }]);
    setActiveTabId(latest.id);
  }, [closedTabs]);

  const updateActiveTab = useCallback((partial: Partial<Tab>) => {
    setTabs(prev =>
      prev.map(t => (t.id === activeTabId ? { ...t, ...partial } : t))
    );
  }, [activeTabId]);

  const updateTab = useCallback((id: string, partial: Partial<Tab>) => {
    setTabs(prev =>
      prev.map(t => (t.id === id ? { ...t, ...partial } : t))
    );
  }, []);

  const navigateActiveTab = useCallback((input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;

    let targetUrl = trimmed;

    // Check internal boss:// pages
    if (trimmed.startsWith('boss://')) {
      targetUrl = trimmed;
    } else if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('file://')
    ) {
      targetUrl = trimmed;
    } else if (
      // Domain-like patterns (e.g. google.com, github.com/deepmind, localhost:3000)
      trimmed.includes('.') &&
      !trimmed.includes(' ') &&
      !trimmed.startsWith('?')
    ) {
      targetUrl = `https://${trimmed}`;
    } else {
      // Search query
      targetUrl = buildSearchUrl(trimmed);
    }

    updateActiveTab({
      url: targetUrl,
      isLoading: true,
      title: targetUrl.startsWith('boss://')
        ? `BOSS — ${targetUrl.replace('boss://', '').toUpperCase()}`
        : targetUrl
    });

    addToHistory(targetUrl, targetUrl);
  }, [buildSearchUrl, updateActiveTab, addToHistory]);

  const goBack = useCallback(() => {
    const webview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`) as any;
    if (webview && typeof webview.canGoBack === 'function' && webview.canGoBack()) {
      webview.goBack();
    }
  }, [activeTabId]);

  const goForward = useCallback(() => {
    const webview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`) as any;
    if (webview && typeof webview.canGoForward === 'function' && webview.canGoForward()) {
      webview.goForward();
    }
  }, [activeTabId]);

  const reload = useCallback(() => {
    const webview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`) as any;
    if (webview && typeof webview.reload === 'function') {
      webview.reload();
      updateActiveTab({ isLoading: true });
    }
  }, [activeTabId, updateActiveTab]);

  const stopLoading = useCallback(() => {
    const webview = document.querySelector(`webview[data-tab-id="${activeTabId}"]`) as any;
    if (webview && typeof webview.stop === 'function') {
      webview.stop();
      updateActiveTab({ isLoading: false });
    }
  }, [activeTabId, updateActiveTab]);

  // Bookmarks
  const isBookmarked = useCallback((url: string) => {
    return bookmarks.some(b => b.url === url);
  }, [bookmarks]);

  const addBookmark = useCallback((title: string, url: string, folder = 'Favorites') => {
    if (!url || isBookmarked(url)) return;
    const newBm: Bookmark = {
      id: 'bm-' + Date.now(),
      title: title || url,
      url,
      folder,
      createdAt: Date.now()
    };
    setBookmarks(prev => [newBm, ...prev]);
  }, [isBookmarked]);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  const toggleBookmarkCurrentPage = useCallback(() => {
    if (!activeTab || !activeTab.url) return;
    const current = bookmarks.find(b => b.url === activeTab.url);
    if (current) {
      removeBookmark(current.id);
    } else {
      addBookmark(activeTab.title, activeTab.url);
    }
  }, [activeTab, bookmarks, removeBookmark, addBookmark]);

  const addBookmarkFolder = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed || bookmarkFolders.some(f => f.name.toLowerCase() === trimmed.toLowerCase())) return;
    setBookmarkFolders(prev => [...prev, { id: 'f-' + Date.now(), name: trimmed }]);
  }, [bookmarkFolders]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  }, []);

  // Downloads
  const addDownload = useCallback((item: Partial<DownloadItem>) => {
    const newDownload: DownloadItem = {
      id: item.id || 'dl-' + Date.now(),
      filename: item.filename || 'download',
      url: item.url || '',
      path: item.path || '',
      totalBytes: item.totalBytes || 1,
      receivedBytes: item.receivedBytes || 0,
      state: item.state || 'progressing',
      speed: item.speed || 0,
      startTime: item.startTime || Date.now(),
      endTime: item.endTime
    };
    setDownloads(prev => [newDownload, ...prev.filter(d => d.id !== newDownload.id)]);
  }, []);

  const removeDownload = useCallback((id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  }, []);

  // Settings
  const updateSettings = useCallback((partial: Partial<BrowserSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const setAccentColor = useCallback((accent: AccentColor) => {
    setSettings(prev => ({ ...prev, accentColor: accent }));
  }, []);

  // Extensions
  const toggleExtension = useCallback((id: string) => {
    setExtensions(prev =>
      prev.map(e => (e.id === id ? { ...e, enabled: !e.enabled } : e))
    );
  }, []);

  const installExtension = useCallback((id: string) => {
    setExtensions(prev =>
      prev.map(e => (e.id === id ? { ...e, isInstalled: true, enabled: true } : e))
    );
  }, []);

  const removeExtension = useCallback((id: string) => {
    setExtensions(prev =>
      prev.map(e => (e.id === id ? { ...e, isInstalled: false, enabled: false } : e))
    );
  }, []);

  // Shortcuts
  const addShortcut = useCallback((title: string, url: string) => {
    const trimmedUrl = url.startsWith('http') ? url : `https://${url}`;
    const newShortcut: QuickShortcut = {
      id: 'sc-' + Date.now(),
      title: title.trim() || trimmedUrl,
      url: trimmedUrl,
      icon: 'Globe',
      color: '#8B5CF6'
    };
    setShortcuts(prev => [...prev, newShortcut]);
  }, []);

  const removeShortcut = useCallback((id: string) => {
    setShortcuts(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <BrowserContext.Provider
      value={{
        tabs,
        activeTabId,
        activeTab,
        createTab,
        closeTab,
        switchTab,
        duplicateTab,
        pinTab,
        muteTab,
        restoreClosedTab,
        updateActiveTab,
        updateTab,
        navigateActiveTab,
        goBack,
        goForward,
        reload,
        stopLoading,
        bookmarks,
        bookmarkFolders,
        addBookmark,
        removeBookmark,
        isBookmarked,
        toggleBookmarkCurrentPage,
        addBookmarkFolder,
        history,
        addToHistory,
        clearHistory,
        removeHistoryItem,
        downloads,
        addDownload,
        removeDownload,
        settings,
        updateSettings,
        setAccentColor,
        extensions,
        toggleExtension,
        installExtension,
        removeExtension,
        shortcuts,
        addShortcut,
        removeShortcut,
        isAISidebarOpen,
        setIsAISidebarOpen,
        activeModal,
        setActiveModal,
        buildSearchUrl
      }}
    >
      {children}
    </BrowserContext.Provider>
  );
};

export const useBrowser = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error('useBrowser must be used within a BrowserProvider');
  }
  return context;
};

