import React, { useState, useEffect, useRef } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { AIMessage } from '../../types';
import { getStorage, setStorage, STORAGE_KEYS } from '../../utils/storage';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  ExternalLink,
  Code2,
  FileText,
  Languages,
  Zap,
  KeyRound,
  AlertCircle,
  HelpCircle,
  Loader2
} from 'lucide-react';

const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'ai-init-1',
    role: 'assistant',
    content: "Greetings, Commander! I am **BOSS AI**, your copilot built directly into BOSS BROWSER.\n\nI can **summarize web pages**, **explain code**, **translate languages**, or **answer technical questions**. What are we exploring today?",
    timestamp: Date.now() - 60000,
    model: 'BOSS Core AI'
  }
];

export const BossAISidebar: React.FC = () => {
  const {
    isAISidebarOpen,
    setIsAISidebarOpen,
    activeTab,
    settings,
    updateSettings,
    setActiveModal
  } = useBrowser();

  const [messages, setMessages] = useState<AIMessage[]>(() =>
    getStorage<AIMessage[]>(STORAGE_KEYS.AI_CHAT, INITIAL_AI_MESSAGES)
  );
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStorage(STORAGE_KEYS.AI_CHAT, messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isAISidebarOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isLoading) return;

    const userMessage: AIMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputVal('');
    setIsLoading(true);

    try {
      let aiResponseText = '';

      // Check if real Gemini or OpenAI API key is set
      if (settings.aiProvider === 'gemini' && settings.aiApiKey) {
        // Direct call to Gemini 2.5 Flash / 1.5 Pro
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.aiModel}:generateContent?key=${settings.aiApiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `System Context: ${settings.aiSystemPrompt}\nCurrent Tab Title: ${activeTab?.title}\nCurrent Tab URL: ${activeTab?.url}\n\nUser Question: ${query}`
                  }
                ]
              }
            ]
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || 'Gemini API call failed');
        }

        const data = await response.json();
        aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      } else if (settings.aiProvider === 'openai' && settings.aiApiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.aiApiKey}`
          },
          body: JSON.stringify({
            model: settings.aiModel || 'gpt-4o',
            messages: [
              { role: 'system', content: settings.aiSystemPrompt },
              { role: 'user', content: `Current Tab: ${activeTab?.title} (${activeTab?.url})\n\n${query}` }
            ]
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || 'OpenAI API call failed');
        }

        const data = await response.json();
        aiResponseText = data.choices?.[0]?.message?.content || 'No response generated.';
      } else {
        // High quality offline demo responses
        await new Promise(res => setTimeout(res, 800));

        if (query.toLowerCase().includes('summar') || query.toLowerCase().includes('page')) {
          aiResponseText = `### Webpage Analysis: ${activeTab?.title || 'Active Tab'}\n\n- **Target URL**: \`${activeTab?.url}\`\n- **Security**: Verified HTTPS / Isolated Sandbox\n- **Core Summary**: This page is currently open in BOSS BROWSER. The DOM viewport and assets are loaded with hardware acceleration.\n\n*Pro-tip: Connect your Google Gemini API key in Settings to get real-time full DOM semantic parsing!*`;
        } else if (query.toLowerCase().includes('code') || query.toLowerCase().includes('js') || query.toLowerCase().includes('react')) {
          aiResponseText = `Here is a high-performance pattern for BOSS BROWSER extensions:\n\n\`\`\`typescript\n// Secure IPC Listener\nwindow.bossAPI.tabs.onNavigated((tab) => {\n  console.log('⚡ Loaded with WebContentsView:', tab.url);\n});\n\`\`\`\n\nRuns isolated without exposing raw Node.js internals to the browser canvas.`;
        } else if (query.toLowerCase().includes('uzbek') || query.toLowerCase().includes('tarjima')) {
          aiResponseText = `Salom! **BOSS BROWSER** - bu zamonaviy, tezkor va xavfsiz desktop brauzer. Siz istalgan savol berishingiz, matnlarni tarjima qilishingiz yoki sahifalar tahlilini olishingiz mumkin!`;
        } else {
          aiResponseText = `I have analyzed your request regarding: **"${query}"**.\n\nCurrent environment status:\n- Active tab: **${activeTab?.title || 'BOSS Hub'}**\n- Browser Engine: Chromium 114 / Electron Kernel\n- Response Latency: 12ms (Local Acceleration)\n\nIs there anything specific you would like me to dissect, translate, or code for you?`;
        }
      }

      const assistantMessage: AIMessage = {
        id: 'msg-' + Date.now(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: Date.now(),
        model: settings.aiModel
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMsg: AIMessage = {
        id: 'msg-' + Date.now(),
        role: 'assistant',
        content: `⚠️ **AI Engine Error:** ${err.message || 'Failed to communicate with provider'}.\n\nPlease check your API key in **Settings > BOSS AI** or switch to Demo Mode.`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const clearChat = () => {
    setMessages(INITIAL_AI_MESSAGES);
  };

  const isKeyConfigured = settings.aiProvider === 'demo' || Boolean(settings.aiApiKey);

  return (
    <aside className="w-80 md:w-96 h-full flex flex-col bg-[#0A0D15]/95 backdrop-blur-2xl border-l border-white/10 z-40 select-none shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#0E111B]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 p-[1.5px] shadow-[0_0_12px_var(--accent-glow)]">
            <div className="w-full h-full bg-[#08090C] rounded-[6.5px] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-orbitron font-bold text-xs tracking-wider text-white">
                BOSS AI
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-accent/20 text-accent font-semibold border border-accent/40">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-gray-400 capitalize">
              {settings.aiProvider} ({settings.aiModel})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsAISidebarOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* No API key alert banner (if user chose gemini/openai without key) */}
      {!isKeyConfigured && (
        <div className="p-3 m-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <KeyRound className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>API Key Required:</strong> You selected {settings.aiProvider.toUpperCase()}, but no key is configured yet.
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveModal('settings')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 font-semibold text-[11px] transition-colors"
            >
              Enter API Key
            </button>
            <button
              onClick={() => updateSettings({ aiProvider: 'demo' })}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 text-[11px]"
            >
              Use Demo Mode
            </button>
          </div>
        </div>
      )}

      {/* Quick Action Prompt Pills */}
      <div className="p-2 border-b border-white/[0.06] bg-black/20 flex gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
        <button
          onClick={() => handleSendMessage(`Summarize the key points of this webpage: "${activeTab?.title}" (${activeTab?.url})`)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-accent/20 hover:text-white text-gray-300 transition-colors flex-shrink-0 border border-white/[0.06]"
        >
          <FileText className="w-3 h-3 text-cyan-400" />
          <span>Summarize Page</span>
        </button>
        <button
          onClick={() => handleSendMessage("Explain this code in detail and suggest modern optimizations:")}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-accent/20 hover:text-white text-gray-300 transition-colors flex-shrink-0 border border-white/[0.06]"
        >
          <Code2 className="w-3 h-3 text-purple-400" />
          <span>Explain Code</span>
        </button>
        <button
          onClick={() => handleSendMessage("Ushbu sahifani o'zbek tiliga qisqacha tarjima qilib ber:")}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-accent/20 hover:text-white text-gray-300 transition-colors flex-shrink-0 border border-white/[0.06]"
        >
          <Languages className="w-3 h-3 text-emerald-400" />
          <span>O'zbekchaga</span>
        </button>
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-gray-500">
                {isUser ? (
                  <>
                    <span>You</span>
                    <User className="w-3 h-3 text-gray-400" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3 h-3 text-accent" />
                    <span className="font-semibold text-accent">BOSS AI</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </>
                )}
              </div>

              <div
                className={`relative max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed transition-all ${
                  isUser
                    ? 'bg-accent text-white rounded-tr-none shadow-lg shadow-purple-500/20'
                    : 'bg-[#141824] border border-white/10 text-gray-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap break-words font-sans">
                  {msg.content}
                </div>

                {!isUser && (
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-white/10 text-gray-400 hover:text-white transition-opacity"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-accent bg-white/[0.04] p-3 rounded-xl border border-white/[0.06] w-fit animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>BOSS AI is analyzing and synthesizing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-3 border-t border-white/[0.08] bg-[#0C0F18]">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-[#121622] border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-accent focus-within:shadow-[0_0_12px_var(--accent-glow)] transition-all"
        >
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Ask BOSS AI anything..."
            className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="p-1.5 rounded-lg bg-accent text-white disabled:opacity-40 hover:brightness-110 transition-all flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </aside>
  );
};

