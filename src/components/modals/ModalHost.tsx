import React, { useEffect } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { SettingsView } from '../pages/SettingsView';
import { HistoryView } from '../pages/HistoryView';
import { BookmarksView } from '../pages/BookmarksView';
import { DownloadsView } from '../pages/DownloadsView';
import { ExtensionsView } from '../pages/ExtensionsView';
import { X } from 'lucide-react';

export const ModalHost: React.FC = () => {
  const { activeModal, setActiveModal } = useBrowser();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, setActiveModal]);

  if (!activeModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200"
      onClick={() => setActiveModal(null)}
    >
      <div
        className="relative w-full max-w-5xl h-[85vh] bg-[#0A0D15]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 z-50 p-2 rounded-xl bg-white/[0.05] hover:bg-white/15 text-gray-400 hover:text-white border border-white/10 transition-colors"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal View Content */}
        <div className="flex-1 w-full h-full overflow-hidden">
          {activeModal === 'settings' && <SettingsView />}
          {activeModal === 'history' && <HistoryView />}
          {activeModal === 'bookmarks' && <BookmarksView />}
          {activeModal === 'downloads' && <DownloadsView />}
          {activeModal === 'extensions' && <ExtensionsView />}
        </div>
      </div>
    </div>
  );
};

