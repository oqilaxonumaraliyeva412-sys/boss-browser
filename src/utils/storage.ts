import { Bookmark, BookmarkFolder, BrowserSettings, DownloadItem, Extension, HistoryItem, QuickShortcut } from '../types';

export const DEFAULT_SETTINGS: BrowserSettings = {
  theme: 'cyber-dark',
  accentColor: 'purple',
  wallpaper: 'cyber-grid',
  searchEngine: 'google',
  customSearchUrl: '',
  startupBehavior: 'newtab',
  startupUrls: [],
  downloadsPath: 'C:\\Users\\MADI\\Downloads',
  askDownloadPath: false,
  privacyMode: false,
  doNotTrack: true,
  clearOnExit: false,
  hardwareAcceleration: true,
  threeAnimations: 'high',
  aiProvider: 'demo',
  aiApiKey: '',
  aiModel: 'gemini-2.5-flash',
  aiTemperature: 0.7,
  aiSystemPrompt: 'You are BOSS AI, the ultra-smart futuristic assistant embedded directly in BOSS BROWSER. You are concise, brilliant, highly technical, and witty. Help the user analyze web pages, write code, explain complex concepts, and navigate the web seamlessly.'
};

export const DEFAULT_SHORTCUTS: QuickShortcut[] = [
  { id: '1', title: 'Google', url: 'https://www.google.com', icon: 'Search', color: '#4285F4' },
  { id: '2', title: 'GitHub', url: 'https://github.com', icon: 'Github', color: '#8B5CF6' },
  { id: '3', title: 'YouTube', url: 'https://www.youtube.com', icon: 'Youtube', color: '#FF0000' },
  { id: '4', title: 'ChatGPT', url: 'https://chatgpt.com', icon: 'Bot', color: '#10A37F' },
  { id: '5', title: 'Reddit', url: 'https://www.reddit.com', icon: 'Globe', color: '#FF4500' },
  { id: '6', title: 'Twitter / X', url: 'https://x.com', icon: 'Twitter', color: '#1DA1F2' },
  { id: '7', title: 'Hacker News', url: 'https://news.ycombinator.com', icon: 'Terminal', color: '#FF6600' },
  { id: '8', title: 'Three.js Docs', url: 'https://threejs.org', icon: 'Box', color: '#00F5FF' }
];

export const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: 'b1', title: 'BOSS BROWSER Official Hub', url: 'boss://newtab', folder: 'Favorites', createdAt: Date.now() - 100000 },
  { id: 'b2', title: 'GitHub: Developer Portal', url: 'https://github.com', folder: 'Development', createdAt: Date.now() - 80000 },
  { id: 'b3', title: 'Google Search', url: 'https://www.google.com', folder: 'Favorites', createdAt: Date.now() - 60000 },
  { id: 'b4', title: 'Hacker News Tech Trends', url: 'https://news.ycombinator.com', folder: 'Tech', createdAt: Date.now() - 50000 },
  { id: 'b5', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', folder: 'Development', createdAt: Date.now() - 40000 },
  { id: 'b6', title: 'Three.js 3D Library', url: 'https://threejs.org', folder: 'Design', createdAt: Date.now() - 30000 },
  { id: 'b7', title: 'Tailwind CSS Docs', url: 'https://tailwindcss.com', folder: 'Development', createdAt: Date.now() - 20000 }
];

export const DEFAULT_FOLDERS: BookmarkFolder[] = [
  { id: 'f1', name: 'Favorites' },
  { id: 'f2', name: 'Development' },
  { id: 'f3', name: 'Tech' },
  { id: 'f4', name: 'Design' }
];

export const DEFAULT_HISTORY: HistoryItem[] = [
  { id: 'h1', title: 'BOSS BROWSER — Browse Beyond Limits', url: 'boss://newtab', visitedAt: Date.now() - 10000, visitCount: 12 },
  { id: 'h2', title: 'GitHub: Let’s build from here', url: 'https://github.com', visitedAt: Date.now() - 120000, visitCount: 5 },
  { id: 'h3', title: 'Google Search Engine', url: 'https://www.google.com', visitedAt: Date.now() - 360000, visitCount: 8 },
  { id: 'h4', title: 'Three.js - JavaScript 3D Library', url: 'https://threejs.org', visitedAt: Date.now() - 86400000, visitCount: 3 }
];

export const DEFAULT_EXTENSIONS: Extension[] = [
  {
    id: 'ext-adblock',
    name: 'BOSS Shield AdBlocker Ultra',
    version: '3.4.0',
    description: 'High-speed cosmetic and network level tracker & advertisement blocker designed specifically for BOSS BROWSER.',
    icon: 'Shield',
    enabled: true,
    author: 'BOSS Security Labs',
    permissions: ['webRequest', 'declarativeNetRequest', 'cookies'],
    isInstalled: true,
    category: 'security'
  },
  {
    id: 'ext-dark',
    name: 'Cyber Obsidian Dark Engine',
    version: '2.1.2',
    description: 'Smart inverted luminescence engine injecting ultra-high contrast dark themes into every legacy web page.',
    icon: 'Moon',
    enabled: true,
    author: 'Obsidian Team',
    permissions: ['activeTab', 'storage'],
    isInstalled: true,
    category: 'productivity'
  },
  {
    id: 'ext-ai',
    name: 'BOSS AI Co-Pilot Integrator',
    version: '1.0.8',
    description: 'Direct deep DOM extraction pipeline hooking the browser viewport directly to the BOSS AI Sidebar.',
    icon: 'Sparkles',
    enabled: true,
    author: 'DeepMind Architecture',
    permissions: ['all_urls', 'contextMenus', 'clipboardRead'],
    isInstalled: true,
    category: 'developer'
  },
  {
    id: 'ext-webgpu',
    name: 'WebGPU & Shader Performance Radar',
    version: '1.2.0',
    description: 'Real-time telemetry measuring FPS, frame jitter, and memory allocation of Three.js and WebGL scenes.',
    icon: 'Cpu',
    enabled: false,
    author: 'Khronos Community',
    permissions: ['webgpu', 'metrics'],
    isInstalled: true,
    category: 'developer'
  },
  {
    id: 'ext-password',
    name: 'VaultX Zero-Knowledge KeyPass',
    version: '4.0.1',
    description: 'Military grade AES-256 local encrypted password manager with biometrics and instant fill.',
    icon: 'Key',
    enabled: false,
    author: 'VaultX Cryptography',
    permissions: ['autofill', 'storage', 'passwords'],
    isInstalled: false,
    category: 'security'
  },
  {
    id: 'ext-translate',
    name: 'PolyGlot Neural Translator',
    version: '2.0.4',
    description: 'Instant multi-language page translations with Uzbek, English, Russian, German, and 50+ languages.',
    icon: 'Languages',
    enabled: false,
    author: 'Neural Bridge',
    permissions: ['translate', 'tabs'],
    isInstalled: false,
    category: 'productivity'
  }
];

export const STORAGE_KEYS = {
  SETTINGS: 'boss_browser_settings',
  TABS: 'boss_browser_tabs',
  BOOKMARKS: 'boss_browser_bookmarks',
  FOLDERS: 'boss_browser_folders',
  HISTORY: 'boss_browser_history',
  DOWNLOADS: 'boss_browser_downloads',
  EXTENSIONS: 'boss_browser_extensions',
  SHORTCUTS: 'boss_browser_shortcuts',
  CLOSED_TABS: 'boss_browser_closed_tabs',
  AI_CHAT: 'boss_browser_ai_chat'
};

// Safe storage with fallback
export function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage for key ${key}:`, err);
    return fallback;
  }
}

export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage for key ${key}:`, err);
  }
}
