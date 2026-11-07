import { app, BrowserWindow, ipcMain, shell, session } from 'electron';
import * as path from 'path';

app.name = 'boss-browser';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#08090C',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
      sandbox: false
    }
  });

  // Maximize / Restore events
  mainWindow.on('maximize', () => {
    mainWindow?.webContents.send('window-maximize-changed', true);
  });
  mainWindow.on('unmaximize', () => {
    mainWindow?.webContents.send('window-maximize-changed', false);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Intercept downloads natively
  session.defaultSession.on('will-download', (event, item, webContents) => {
    const filename = item.getFilename();
    const totalBytes = item.getTotalBytes();
    const savePath = item.getSavePath();

    webContents.send('download-started', {
      id: 'dl-' + Date.now(),
      filename,
      totalBytes,
      path: savePath
    });

    item.on('updated', (ev, state) => {
      if (state === 'interrupted') {
        webContents.send('download-interrupted', { filename });
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          webContents.send('download-paused', { filename });
        } else {
          webContents.send('download-progress', {
            filename,
            receivedBytes: item.getReceivedBytes(),
            totalBytes: item.getTotalBytes()
          });
        }
      }
    });

    item.once('done', (ev, state) => {
      webContents.send('download-done', {
        filename,
        state,
        path: item.getSavePath()
      });
    });
  });
}

// Window control IPC handlers
ipcMain.on('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('window-close', () => {
  mainWindow?.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow?.isMaximized() || false;
});

// Native shell handlers
ipcMain.handle('native-open-path', async (_, filePath: string) => {
  return await shell.openPath(filePath);
});

ipcMain.handle('native-show-item', async (_, filePath: string) => {
  shell.showItemInFolder(filePath);
});

ipcMain.handle('native-open-external', async (_, url: string) => {
  await shell.openExternal(url);
});

// Initialize window on app ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
