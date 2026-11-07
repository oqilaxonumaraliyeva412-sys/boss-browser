import React from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { DownloadItem } from '../../types';
import {
  Download,
  FolderOpen,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  ExternalLink,
  HardDrive
} from 'lucide-react';

export const DownloadsView: React.FC = () => {
  const { downloads, removeDownload } = useBrowser();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleOpenFile = (path: string) => {
    if (window.bossAPI?.native) {
      window.bossAPI.native.openPath(path);
    }
  };

  const handleRevealInFolder = (path: string) => {
    if (window.bossAPI?.native) {
      window.bossAPI.native.showItemInFolder(path);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#08090C] text-gray-200 p-8 select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Download className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="font-orbitron font-bold text-lg text-white tracking-wider">
              DOWNLOAD MANAGER
            </h2>
            <p className="text-xs text-gray-400">
              {downloads.length} items logged
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (window.bossAPI?.native) {
              window.bossAPI.native.openPath('C:\\Users\\MADI\\Downloads');
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs text-gray-300 transition-colors border border-white/[0.08]"
        >
          <FolderOpen className="w-3.5 h-3.5 text-accent" />
          <span>Open Downloads Folder</span>
        </button>
      </div>

      {/* Downloads List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {downloads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Download className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No downloads recorded</p>
          </div>
        ) : (
          downloads.map(dl => {
            const progress = Math.min(
              100,
              Math.round((dl.receivedBytes / (dl.totalBytes || 1)) * 100)
            );

            return (
              <div
                key={dl.id}
                className="glass-card flex flex-col p-4 rounded-xl border border-white/10 hover:border-accent/40 transition-all gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white truncate max-w-md">
                        {dl.filename}
                      </span>
                      <span className="text-[11px] text-gray-500 truncate max-w-sm">
                        {dl.path || dl.url}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {dl.state === 'completed' && (
                      <>
                        <button
                          onClick={() => handleOpenFile(dl.path)}
                          className="px-2.5 py-1 rounded-lg bg-accent/20 hover:bg-accent/40 text-accent text-xs font-medium transition-colors"
                          title="Open file"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => handleRevealInFolder(dl.path)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
                          title="Show in folder"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => removeDownload(dl.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                      title="Remove from list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar (if in progress) */}
                {dl.state === 'progressing' && (
                  <div className="w-full mt-1">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>{formatBytes(dl.receivedBytes)} of {formatBytes(dl.totalBytes)}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Status footer */}
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  {dl.state === 'completed' ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle className="w-3 h-3" /> Completed ({formatBytes(dl.totalBytes)})
                    </span>
                  ) : dl.state === 'progressing' ? (
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Clock className="w-3 h-3 animate-spin" /> Downloading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400">
                      <XCircle className="w-3 h-3" /> Cancelled
                    </span>
                  )}
                  <span>•</span>
                  <span>{new Date(dl.startTime).toLocaleString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

