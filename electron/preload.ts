import { contextBridge, ipcRenderer } from 'electron';

// Secure Preload API
contextBridge.exposeInMainWorld('bossAPI', {
  window: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
    onMaximizeChange: (callback: (isMaximized: boolean) => void) => {
      const handler = (_: any, val: boolean) => callback(val);
      ipcRenderer.on('window-maximize-changed', handler);
      return () => ipcRenderer.removeListener('window-maximize-changed', handler);
    }
  },
  native: {
    openPath: (path: string) => ipcRenderer.invoke('native-open-path', path),
    showItemInFolder: (path: string) => ipcRenderer.invoke('native-show-item', path),
    openExternal: (url: string) => ipcRenderer.invoke('native-open-external', url)
  },
  system: {
    platform: process.platform,
    versions: process.versions
  }
});
