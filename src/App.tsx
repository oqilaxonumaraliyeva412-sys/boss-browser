import React, { useEffect } from 'react';
import { TitleBar } from './components/chrome/TitleBar';
import { NavigationBar } from './components/chrome/NavigationBar';
import { BookmarkBar } from './components/chrome/BookmarkBar';
import { BrowserViewport } from './components/browser/BrowserViewport';
import { BossAISidebar } from './components/ai/BossAISidebar';
import { ModalHost } from './components/modals/ModalHost';
import { useBrowser } from './context/BrowserContext';

export const AppContent: React.FC = () => {
  const {
    createTab,
    closeTab,
    activeTabId,
    reload,
    restoreClosedTab,
    toggleBookmarkCurrentPage,
    setIsAISidebarOpen,
    setActiveModal,
    activeModal
  } = useBrowser();

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+T: New Tab
      if (e.ctrlKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        createTab();
      }
      // Ctrl+W: Close Tab
      else if (e.ctrlKey && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        closeTab(activeTabId);
      }
      // Ctrl+Shift+T: Restore closed tab
      else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        restoreClosedTab();
      }
      // Ctrl+R or F5: Reload
      else if ((e.ctrlKey && e.key.toLowerCase() === 'r') || e.key === 'F5') {
        e.preventDefault();
        reload();
      }
      // Ctrl+D: Bookmark page
      else if (e.ctrlKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleBookmarkCurrentPage();
      }
      // Ctrl+H: History
      else if (e.ctrlKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setActiveModal(activeModal === 'history' ? null : 'history');
      }
      // Ctrl+J: Downloads
      else if (e.ctrlKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setActiveModal(activeModal === 'downloads' ? null : 'downloads');
      }
      // Ctrl+Space: Boss AI Sidebar
      else if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setIsAISidebarOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    createTab,
    closeTab,
    activeTabId,
    reload,
    restoreClosedTab,
    toggleBookmarkCurrentPage,
    setIsAISidebarOpen,
    setActiveModal,
    activeModal
  ]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[#08090C] text-[#F3F4F6]">
      {/* 1. Custom Frameless Titlebar & Tab Strip */}
      <TitleBar />

      {/* 2. Omnibox Navigation & Browser Controls */}
      <NavigationBar />

      {/* 3. Quick Favorites / Bookmark Bar */}
      <BookmarkBar />

      {/* 4. Main Body: Webview & Boss AI Sidebar */}
      <div className="flex flex-1 w-full h-[calc(100vh-89px)] overflow-hidden relative">
        <BrowserViewport />
        <BossAISidebar />
      </div>

      {/* 5. Modal Overlay Host */}
      <ModalHost />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};
export default App;
