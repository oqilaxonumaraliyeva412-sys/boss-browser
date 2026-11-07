import React, { useState, useEffect } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { CyberParticlesCanvas } from '../three/CyberParticlesCanvas';
import {
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Clock,
  Compass,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Settings
} from 'lucide-react';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  city: string;
}

export const NewTabPage: React.FC = () => {
  const {
    navigateActiveTab,
    shortcuts,
    addShortcut,
    removeShortcut,
    history,
    settings,
    setAccentColor,
    setActiveModal
  } = useBrowser();

  const [searchQuery, setSearchQuery] = useState('');
  const [time, setTime] = useState(new Date());
  const [isAddingShortcut, setIsAddingShortcut] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Weather state
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 21,
    weatherCode: 0,
    windSpeed: 4.2,
    city: 'Tashkent'
  });
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Digital clock update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real weather from Open-Meteo
  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      try {
        setWeatherLoading(true);
        // Default coordinates: Tashkent (41.3111, 69.2797)
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=41.3111&longitude=69.2797&current_weather=true'
        );
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        if (isMounted && data.current_weather) {
          setWeather({
            temperature: Math.round(data.current_weather.temperature),
            weatherCode: data.current_weather.weathercode,
            windSpeed: data.current_weather.windspeed,
            city: 'Tashkent'
          });
        }
      } catch (err) {
        console.warn('Weather service offline, using calibrated default metrics');
      } finally {
        if (isMounted) setWeatherLoading(false);
      }
    };

    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigateActiveTab(searchQuery);
  };

  const handleCreateShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newUrl.trim()) {
      addShortcut(newTitle, newUrl);
      setNewTitle('');
      setNewUrl('');
      setIsAddingShortcut(false);
    }
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />;
    if (code >= 1 && code <= 3) return <Cloud className="w-5 h-5 text-cyan-300" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (code >= 71) return <CloudSnow className="w-5 h-5 text-sky-200" />;
    return <Cloud className="w-5 h-5 text-cyan-300" />;
  };

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const formattedDate = time.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Recent visited sites
  const recentHistory = history.slice(0, 4);

  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center justify-between p-6 select-none">
      {/* 3D Particle Canvas */}
      <CyberParticlesCanvas
        accentColor={settings.accentColor}
        animationLevel={settings.threeAnimations}
      />

      {/* Top Header Row with Weather Widget & Dynamic Accent Switcher */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10 animate-in fade-in duration-300">
        {/* Weather Widget */}
        <div className="glass-card px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-white/10 hover:border-white/20 transition-all">
          <div className="p-2 rounded-xl bg-white/[0.05]">
            {getWeatherIcon(weather.weatherCode)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-orbitron font-bold text-lg text-white">
                {weather.temperature}°C
              </span>
              <span className="text-xs text-gray-400 font-medium">({weather.city})</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <span className="flex items-center gap-0.5">
                <Wind className="w-3 h-3 text-cyan-400" /> {weather.windSpeed} km/h
              </span>
              <span className="flex items-center gap-0.5">
                <Droplets className="w-3 h-3 text-blue-400" /> 45%
              </span>
            </div>
          </div>
        </div>

        {/* Quick Accent Switcher Pills */}
        <div className="glass-card px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-white/10">
          <span className="text-[11px] text-gray-400 mr-1 hidden sm:inline">Theme:</span>
          {(['purple', 'cyan', 'blue', 'emerald', 'gold', 'rose'] as const).map(color => (
            <button
              key={color}
              onClick={() => setAccentColor(color)}
              className={`w-4 h-4 rounded-full transition-transform hover:scale-125 ${
                settings.accentColor === color ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor:
                  color === 'purple'
                    ? '#8B5CF6'
                    : color === 'cyan'
                    ? '#06B6D4'
                    : color === 'blue'
                    ? '#3B82F6'
                    : color === 'emerald'
                    ? '#10B981'
                    : color === 'gold'
                    ? '#F59E0B'
                    : '#F43F5E'
              }}
              title={`Switch to ${color} accent`}
            />
          ))}
        </div>
      </div>

      {/* Main Center Stage: Clock, Animated Logo, Omnibox */}
      <div className="w-full max-w-3xl flex flex-col items-center my-auto py-8 z-10">
        {/* Digital Cyber Clock */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="font-orbitron font-extrabold text-6xl md:text-7xl text-white tracking-widest drop-shadow-[0_0_35px_var(--accent-glow)]">
            {formattedTime}
          </h1>
          <p className="text-sm font-medium text-gray-400 tracking-wider mt-1 uppercase">
            {formattedDate}
          </p>
        </div>

        {/* Boss Animated Brand & Tagline */}
        <div className="flex items-center gap-3 mb-8 group cursor-default">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 p-[2px] shadow-[0_0_25px_var(--accent-glow)]">
            <div className="w-full h-full bg-[#0A0D14] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron font-black text-2xl tracking-widest text-gradient">
              BOSS BROWSER
            </span>
            <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400">
              Browse Beyond Limits
            </span>
          </div>
        </div>

        {/* Big Search Bar */}
        <form onSubmit={handleSearch} className="w-full mb-8 relative">
          <div className="relative flex items-center w-full h-14 px-5 rounded-2xl bg-[#0D101A]/80 backdrop-blur-2xl border border-white/10 hover:border-purple-500/50 focus-within:border-accent focus-within:shadow-[0_0_30px_-5px_var(--accent-glow)] transition-all duration-300 shadow-2xl">
            <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search the web with ${settings.searchEngine.toUpperCase()} or enter URL...`}
              className="w-full bg-transparent text-sm md:text-base text-white placeholder-gray-500 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 rounded-xl bg-accent hover:brightness-110 text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-[0_0_15px_var(--accent-glow)] transition-all flex-shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Quick Shortcuts Grid */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-accent" />
              Quick Shortcuts
            </span>
            <button
              onClick={() => setIsAddingShortcut(true)}
              className="text-xs text-accent hover:text-white flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Shortcut
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {shortcuts.map(sc => (
              <div
                key={sc.id}
                onClick={() => navigateActiveTab(sc.url)}
                className="group relative flex flex-col items-center p-3 rounded-2xl glass-card cursor-pointer"
              >
                {/* Delete button on hover */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    removeShortcut(sc.id);
                  }}
                  className="absolute top-1 right-1 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                  title="Remove shortcut"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${sc.color || '#8B5CF6'}20`, border: `1px solid ${sc.color || '#8B5CF6'}40` }}
                >
                  <ExternalLink className="w-5 h-5" style={{ color: sc.color || '#8B5CF6' }} />
                </div>
                <span className="text-xs font-medium text-gray-300 group-hover:text-white truncate max-w-full">
                  {sc.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Add Shortcut Dialog Modal */}
        {isAddingShortcut && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#121624] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-accent" />
                Add New Shortcut
              </h3>
              <form onSubmit={handleCreateShortcut} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Shortcut Name</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Dribbble"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">URL</label>
                  <input
                    type="text"
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    placeholder="e.g. dribbble.com"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-accent"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingShortcut(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:brightness-110 shadow-lg shadow-purple-500/20"
                  >
                    Save Shortcut
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Recently Visited Chips */}
        {recentHistory.length > 0 && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-cyan-400" />
                Jump Back In
              </span>
              <button
                onClick={() => setActiveModal('history')}
                className="text-[11px] text-gray-400 hover:text-white transition-colors"
              >
                View History →
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentHistory.map(h => (
                <button
                  key={h.id}
                  onClick={() => navigateActiveTab(h.url)}
                  className="glass-card px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-all max-w-[220px]"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  <span className="truncate">{h.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-5xl flex items-center justify-between text-xs text-gray-500 z-10 pt-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="font-orbitron font-bold text-gray-400">BOSS ENGINE 2.0</span>
          <span>•</span>
          <span>Ultra-Secure Chromium Kernel</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveModal('settings')}
            className="hover:text-gray-300 transition-colors flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5" /> Settings
          </button>
          <span>•</span>
          <span className="text-accent font-semibold">Ready for Orbit</span>
        </div>
      </div>
    </div>
  );
};

