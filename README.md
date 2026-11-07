# BOSS BROWSER — Browse Beyond Limits

> **Next-Generation Desktop Web Platform**  
> Inspired by the usability of Google Chrome, the visual polish of Arc Browser, and the high-tech customization of Opera GX.

---

## 🌟 Key Features

### 1. Cyber Glassmorphism & Visual Identity
- **Futuristic Palette**: Deep Obsidian (`#08090C`), Dark Graphite, Cyber Violet, Electric Cyan, Neon Blue, Emerald Grid, Solar Gold, and Crimson Void.
- **Dynamic Accent Color Switcher**: Switch themes on-the-fly and observe the glowing borders, underlines, and particle fields update instantaneously.
- **Glass Panels & Micro-Interactions**: Real-time backdrop blur, glowing borders, smooth hover animations, and subtle neon indicators.

### 2. Tab Management & Navigation
- **Advanced Tab Bar**: Create, close, switch, duplicate, pin/unpin, and mute/unmute tabs.
- **Quick Restoration**: Restore accidentally closed tabs with `Ctrl+Shift+T`.
- **Context Menu**: Right-click tabs to perform bulk actions (Duplicate, Pin, Mute, Close Other Tabs).
- **Omnibox Address Bar**: Fast search suggestions, bookmark matches, history integration, HTTPS security badges, and one-click URL copying. Default search engine is Google, with DuckDuckGo, Bing, Brave, and Ecosia built in.

### 3. Futuristic 3D New Tab Experience
- **Three.js Particle Galaxy**: Over 1,400 glowing additive-blending particles with a responsive cyber wave grid reacting smoothly to cursor parallax.
- **Cyber Digital Clock & Calendar**: Real-time military/24h digital clock with glowing drop-shadows.
- **Live Weather Widget**: Live weather telemetry fetched from Open-Meteo (temperature, weather icons, wind speed, humidity).
- **Quick Shortcuts & History Jump**: One-click launchpad for GitHub, Google, YouTube, ChatGPT, Reddit, and custom user-defined shortcuts.

### 4. Bookmark & History Managers
- **Bookmarks**: Full folder hierarchy, search, instant bookmarking with `Ctrl+D`, and JSON export/import for easy migration.
- **History**: Grouped by date (Today, Yesterday, Past 7 Days), search filter, selective deletion, and one-click "Clear Browsing Data".

### 5. Download Center & Extension Store
- **Download Manager**: Real-time progress bar, byte formatting, native "Open File" and "Show in Folder" actions.
- **Extension Center**: Manage installed extensions (AdBlocker Ultra, Obsidian Dark Engine, WebGPU Radar, AI Co-Pilot) and explore the curated Extension Store.

### 6. BOSS AI Assistant Sidebar
- **Deep Assistant Integration**: Sliders in with `Ctrl+Space` or the spark button.
- **Capabilities**: Summarize current webpage, dissect and explain code snippets, answer technical questions, and translate to multiple languages (including Uzbek and English).
- **Flexible AI Engines**: Supports Google Gemini API (gemini-2.5-flash / gemini-1.5-pro), OpenAI (gpt-4o), or Offline Demo Mode. Stored encrypted on client device.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v20+ recommended)
- Windows 10/11 (or macOS / Linux)

### Installation
```bash
# Clone or navigate to the repository
cd boss-browser

# Install dependencies
npm install
```

### Run Desktop Electron App
```bash
# Build Vite and launch the Desktop Application
npm run build
npm start
```

### Package Desktop Windows Installer (.exe)
```bash
npm run package
```
*The compiled `.exe` and portable packages will be outputted to the `release/` folder.*

---

## ☁️ Cloud Deployment (Render.com & Google Cloud)

BOSS BROWSER includes an integrated web server (`server.js`) that allows running the browser interface in cloud environments (Render, Google Cloud Run, Railway).

### Deploying to Render.com:
1. Push this project to your GitHub repository.
2. Sign in to [Render.com](https://render.com) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build:vite`
   - **Start Command**: `node server.js`
5. Click **Create Web Service**. Your BOSS BROWSER web platform will go live within minutes!

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + T` | Open a new tab |
| `Ctrl + W` | Close current tab |
| `Ctrl + Shift + T` | Restore last closed tab |
| `Ctrl + Tab` | Switch to next tab |
| `Ctrl + R` / `F5` | Reload current page |
| `Ctrl + D` | Bookmark current page |
| `Ctrl + H` | Open Browsing History |
| `Ctrl + J` | Open Download Manager |
| `Ctrl + Space` | Toggle BOSS AI Sidebar |
| `Alt + Left / Right` | Navigate Back / Forward |
| `Alt + Home` | Return to Boss New Tab Page |
