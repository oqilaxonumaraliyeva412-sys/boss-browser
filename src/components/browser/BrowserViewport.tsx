import React, { useEffect, useRef, useState } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { Tab } from '../../types';
import { NewTabPage } from '../pages/NewTabPage';
import { BookmarksView } from '../pages/BookmarksView';
import { HistoryView } from '../pages/HistoryView';
import { DownloadsView } from '../pages/DownloadsView';
import { ExtensionsView } from '../pages/ExtensionsView';
import { SettingsView } from '../pages/SettingsView';
import {
  RotateCw,
  Home,
  WifiOff,
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';

interface TabViewProps {
  tab: Tab;
  isActive: boolean;
}

const TabView: React.FC<TabViewProps> = ({ tab, isActive }) => {
  const { updateTab, createTab, navigateActiveTab } = useBrowser();
  const webviewRef = useRef<any>(null);
  const [loadError, setLoadError] = useState<{ code: number; desc: string } | null>(null);

  // Check if running in native Electron
  const isElectron = typeof window !== 'undefined' && Boolean(window.bossAPI);
  const isInternal = tab.url.startsWith('boss://');

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview || isInternal || !isElectron) return;

    const handleStartLoading = () => {
      setLoadError(null);
      updateTab(tab.id, { isLoading: true });
    };

    const handleStopLoading = () => {
      updateTab(tab.id, {
        isLoading: false,
        canGoBack: typeof webview.canGoBack === 'function' ? webview.canGoBack() : false,
        canGoForward: typeof webview.canGoForward === 'function' ? webview.canGoForward() : false
      });
    };

    const handleTitleUpdate = (e: any) => {
      if (e.title) {
        updateTab(tab.id, { title: e.title });
      }
    };

    const handleFaviconUpdate = (e: any) => {
      if (e.favicons && e.favicons.length > 0) {
        updateTab(tab.id, { favicon: e.favicons[0] });
      }
    };

    const handleDidNavigate = (e: any) => {
      if (e.url && e.url !== tab.url) {
        updateTab(tab.id, {
          url: e.url,
          canGoBack: typeof webview.canGoBack === 'function' ? webview.canGoBack() : false,
          canGoForward: typeof webview.canGoForward === 'function' ? webview.canGoForward() : false
        });
      }
    };

    const handleFailLoad = (e: any) => {
      if (e.errorCode !== -3) {
        setLoadError({ code: e.errorCode, desc: e.errorDescription });
        updateTab(tab.id, { isLoading: false });
      }
    };

    const handleNewWindow = (e: any) => {
      e.preventDefault();
      if (e.url) {
        createTab(e.url);
      }
    };

    webview.addEventListener('did-start-loading', handleStartLoading);
    webview.addEventListener('did-stop-loading', handleStopLoading);
    webview.addEventListener('page-title-updated', handleTitleUpdate);
    webview.addEventListener('page-favicon-updated', handleFaviconUpdate);
    webview.addEventListener('did-navigate', handleDidNavigate);
    webview.addEventListener('did-navigate-in-page', handleDidNavigate);
    webview.addEventListener('did-fail-load', handleFailLoad);
    webview.addEventListener('new-window', handleNewWindow);

    return () => {
      webview.removeEventListener('did-start-loading', handleStartLoading);
      webview.removeEventListener('did-stop-loading', handleStopLoading);
      webview.removeEventListener('page-title-updated', handleTitleUpdate);
      webview.removeEventListener('page-favicon-updated', handleFaviconUpdate);
      webview.removeEventListener('did-navigate', handleDidNavigate);
      webview.removeEventListener('did-navigate-in-page', handleDidNavigate);
      webview.removeEventListener('did-fail-load', handleFailLoad);
      webview.removeEventListener('new-window', handleNewWindow);
    };
  }, [tab.id, tab.url, isInternal, isElectron, updateTab, createTab]);

  if (!isActive) return null;

  // Render Internal Pages
  if (isInternal) {
    if (tab.url === 'boss://newtab') return <NewTabPage />;
    if (tab.url === 'boss://bookmarks') return <BookmarksView />;
    if (tab.url === 'boss://history') return <HistoryView />;
    if (tab.url === 'boss://downloads') return <DownloadsView />;
    if (tab.url === 'boss://extensions') return <ExtensionsView />;
    if (tab.url === 'boss://settings') return <SettingsView />;
    return <NewTabPage />;
  }

  // Render External Web Content
  return (
    <div className="relative w-full h-full bg-[#08090C] overflow-hidden">
      {/* Network / Navigation Error Screen */}
      {loadError && (
        <div className="absolute inset-0 z-20 bg-[#08090C] flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
            <WifiOff className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="font-orbitron font-bold text-xl text-white mb-2">
            Unable to Reach Site
          </h2>
          <p className="text-xs text-gray-400 max-w-md mb-2 font-mono">
            {tab.url}
          </p>
          <p className="text-xs text-red-400 max-w-md mb-6">
            Error {loadError.code}: {loadError.desc || 'Check internet connection and domain resolution.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setLoadError(null);
                webviewRef.current?.reload();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:brightness-110 shadow-lg shadow-purple-500/20"
            >
              <RotateCw className="w-3.5 h-3.5" /> Retry
            </button>
            <button
              onClick={() => navigateActiveTab('boss://newtab')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/15 text-gray-300 text-xs font-semibold"
            >
              <Home className="w-3.5 h-3.5" /> Return Home
            </button>
          </div>
        </div>
      )}

      {/* Real Electron Webview or Cloud Web Fallback */}
      {isElectron ? (
        <webview
          ref={webviewRef}
          data-tab-id={tab.id}
          src={tab.url}
          className="w-full h-full border-none"
          allowpopups="true"
          webpreferences="contextIsolation=yes, nodeIntegration=no, nativeWindowOpen=yes"
        />
      ) : (
        <div className="relative w-full h-full flex flex-col">
          {/* Cloud Web Mode Notice Bar */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-[#101420] border-b border-white/10 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Web Sandbox Mode (Render / Cloud Deployment)</span>
            </div>
            <a
              href={tab.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-accent hover:underline text-[11px]"
            >
              Open in Native Window <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <iframe
            src={tab.url}
            title={tab.title}
            className="w-full flex-1 border-none bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onLoad={() => updateTab(tab.id, { isLoading: false })}
          />
        </div>
      )}
    </div>
  );
};

export const BrowserViewport: React.FC = () => {
  const { tabs, activeTabId } = useBrowser();

  return (
    <main className="relative flex-1 w-full h-full overflow-hidden bg-[#08090C]">
      {tabs.map(tab => (
        <TabView key={tab.id} tab={tab} isActive={tab.id === activeTabId} />
      ))}
    </main>
  );
};
