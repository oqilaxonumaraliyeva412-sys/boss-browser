export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isPinned: boolean;
  isMuted: boolean;
  lastAccessed: number;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  folder: string;
  createdAt: number;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  parentId?: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  visitedAt: number;
  visitCount: number;
  favicon?: string;
}

export interface DownloadItem {
  id: string;
  filename: string;
  url: string;
  path: string;
  totalBytes: number;
  receivedBytes: number;
  state: 'progressing' | 'completed' | 'cancelled' | 'interrupted' | 'paused';
  speed?: number;
  startTime: number;
  endTime?: number;
}

export interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  icon: string;
  enabled: boolean;
  author: string;
  permissions: string[];
  isInstalled: boolean;
  category: 'security' | 'productivity' | 'developer' | 'entertainment';
}

export type AccentColor = 'purple' | 'cyan' | 'blue' | 'emerald' | 'gold' | 'rose';

export interface BrowserSettings {
  theme: 'cyber-dark' | 'deep-space' | 'matrix-green' | 'solar-gold' | 'neon-rose' | 'oled';
  accentColor: AccentColor;
  wallpaper: string;
  searchEngine: 'google' | 'duckduckgo' | 'bing' | 'brave' | 'ecosia';
  customSearchUrl: string;
  startupBehavior: 'newtab' | 'restore' | 'urls';
  startupUrls: string[];
  downloadsPath: string;
  askDownloadPath: boolean;
  privacyMode: boolean;
  doNotTrack: boolean;
  clearOnExit: boolean;
  hardwareAcceleration: boolean;
  threeAnimations: 'high' | 'medium' | 'low' | 'off';
  aiProvider: 'gemini' | 'openai' | 'ollama' | 'demo';
  aiApiKey: string;
  aiModel: string;
  aiTemperature: number;
  aiSystemPrompt: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
}

export interface QuickShortcut {
  id: string;
  title: string;
  url: string;
  icon: string;
  color?: string;
}
