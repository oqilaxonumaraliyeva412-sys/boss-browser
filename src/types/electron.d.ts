export interface BossAPI {
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    isMaximized: () => Promise<boolean>;
    onMaximizeChange: (callback: (isMaximized: boolean) => void) => () => void;
  };
  native: {
    openPath: (path: string) => Promise<string>;
    showItemInFolder: (path: string) => Promise<void>;
    openExternal: (url: string) => Promise<void>;
  };
  system: {
    platform: string;
    versions: Record<string, string>;
  };
}

declare global {
  interface Window {
    bossAPI?: BossAPI;
  }
}

