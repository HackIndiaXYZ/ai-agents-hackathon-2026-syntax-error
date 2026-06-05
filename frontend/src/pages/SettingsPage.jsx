import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Key, Eye, EyeOff, CheckCircle, XCircle, Zap,
  Trash2, Save, RefreshCw, Info, Cpu, Activity, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

const PROVIDERS = [
  {
    id: 'gemini', label: 'Google Gemini', desc: 'Free tier available · Recommended for most users',
    color: 'from-blue-500 to-cyan-500', recommended: true,
    docsUrl: 'https://aistudio.google.com/app/apikey',
    docsText: 'Get free API key'
  },
  {
    id: 'groq', label: 'Groq', desc: 'Ultra-fast inference · Free tier · LLaMA & Mixtral',
    color: 'from-orange-500 to-red-500',
    docsUrl: 'https://console.groq.com/keys',
    docsText: 'Get Groq API key (free)'
  },
  {
    id: 'openai', label: 'OpenAI GPT', desc: 'GPT-4o Mini, GPT-4o — Paid credits required',
    color: 'from-green-500 to-teal-500',
    docsUrl: 'https://platform.openai.com/api-keys',
    docsText: 'Get OpenAI key'
  },
  {
    id: 'claude', label: 'Anthropic Claude', desc: 'Claude 3.5 Sonnet, Claude 3 Haiku — Paid',
    color: 'from-orange-400 to-amber-500',
    docsUrl: 'https://console.anthropic.com/',
    docsText: 'Get Claude key'
  },
  {
    id: 'deepseek', label: 'DeepSeek AI', desc: 'DeepSeek Chat & Coder · Very affordable pricing',
    color: 'from-indigo-500 to-blue-600',
    docsUrl: 'https://platform.deepseek.com/',
    docsText: 'Get DeepSeek key'
  },
  {
    id: 'openrouter', label: 'OpenRouter', desc: 'Access 100+ models (Llama, Mistral, etc.)',
    color: 'from-purple-500 to-primary-500',
    docsUrl: 'https://openrouter.ai/keys',
    docsText: 'Get OpenRouter key'
  },
];

const MODELS = {
  gemini: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'],
  groq: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'llama3-70b-8192', 'gemma2-9b-it'],
  openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo', 'gpt-4-turbo'],
  claude: ['claude-3-5-haiku-20241022', 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229'],
  deepseek: ['deepseek-chat', 'deepseek-coder'],
  openrouter: [
    'deepseek/deepseek-chat',
    'meta-llama/llama-3.1-8b-instruct:free',
    'meta-llama/llama-3.1-70b-instruct',
    'mistralai/mistral-7b-instruct:free',
    'google/gemma-2-9b-it:free',
    'microsoft/phi-3-mini-128k-instruct:free'
  ],
  default: ['gemini-2.0-flash']
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState({ gemini: '', openai: '', openrouter: '', claude: '', groq: '', deepseek: '' });
  const [showKeys, setShowKeys] = useState({ gemini: false, openai: false, openrouter: false, claude: false, groq: false, deepseek: false });
  const [testing, setTesting] = useState({});
  const [saving, setSaving] = useState({});
  const [activeProvider, setActiveProvider] = useState('default');
  const [activeModel, setActiveModel] = useState('gemini-2.0-flash');

  useEffect(() => {
    api.get('/settings').then(r => {
      setSettings(r.data.settings);
      setActiveProvider(r.data.settings.activeProvider || 'default');
      setActiveModel(r.data.settings.activeModel || 'gemini-2.0-flash');
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSaveKey = async (provider) => {
    if (!keys[provider]) return toast.error('Enter an API key first');
    setSaving(s => ({ ...s, [provider]: true }));
    try {
      const { data } = await api.post('/settings/api-key', { provider, apiKey: keys[provider] });
      setSettings(data.settings);
      setKeys(k => ({ ...k, [provider]: '' }));
      toast.success(`${provider.toUpperCase()} API key saved and encrypted! 🔐`);
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(s => ({ ...s, [provider]: false })); }
  };

  const handleRemoveKey = async (provider) => {
    try {
      await api.delete('/settings/api-key', { data: { provider } });
      setSettings(s => ({
        ...s,
        [`has${provider.charAt(0).toUpperCase() + provider.slice(1)}`]: false,
        [`${provider}Key`]: null
      }));
      toast.success('API key removed');
    } catch { toast.error('Remove failed'); }
  };

  const handleTest = async (provider) => {
    setTesting(t => ({ ...t, [provider]: true }));
    try {
      const { data } = await api.post('/settings/test-api', { provider });
      if (data.valid) {
        toast.success(`${provider.toUpperCase()} connection successful! ✅`);
      } else {
        toast.error(`${provider}: ${data.message}`);
      }
      const r = await api.get('/settings');
      setSettings(r.data.settings);
    } catch { toast.error('Test failed'); }
    finally { setTesting(t => ({ ...t, [provider]: false })); }
  };

  const handleModelSave = async () => {
    try {
      await api.put('/settings/model', { activeProvider, activeModel });
      toast.success('Model preference saved!');
    } catch { toast.error('Save failed'); }
  };

  const getStatus = (provider) => settings?.providerStatus?.[provider];
  const hasKey = (provider) => settings?.[`has${provider.charAt(0).toUpperCase() + provider.slice(1)}`];
  const maskedKey = (provider) => settings?.[`${provider}Key`];

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-500 flex items-center justify-center">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Settings</h1>
            <p className="text-slate-400 text-sm">Manage AI providers, API keys, and model preferences</p>
          </div>
        </motion.div>

        {/* Info Banner */}
        <div className="glass-card p-4 border-l-4 border-accent-cyan/60">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold text-sm">Bring Your Own API Keys</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Add your API keys to use your personal quota. Keys are AES-256-CBC encrypted before storage.
                Without a custom key, the platform uses the default Gemini API (free tier with rate limits).
              </p>
            </div>
          </div>
        </div>

        {/* Active Model Indicator */}
        <div className="glass-card p-4 border border-accent-green/20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <Cpu className="w-4 h-4 text-accent-green" />
            <p className="text-white text-sm">
              Currently using: <span className="font-black text-accent-green">{activeModel}</span>
              <span className="text-slate-500 ml-2">via {activeProvider === 'default' ? 'Platform Default (Gemini)' : activeProvider.toUpperCase()}</span>
            </p>
          </div>
        </div>

        {/* AI Provider Cards */}
        <div className="space-y-4">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Key className="w-5 h-5 text-primary-400" /> AI Provider API Keys
          </h2>
          {PROVIDERS.map(provider => {
            const status = getStatus(provider.id);
            const saved = hasKey(provider.id);

            return (
              <motion.div key={provider.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-5 ${activeProvider === provider.id ? 'border-primary-500/50 ring-1 ring-primary-500/20' : ''}`}>
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${provider.color} flex items-center justify-center shadow-lg`}>
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-bold">{provider.label}</p>
                        {provider.recommended && (
                          <span className="text-xs bg-accent-green/20 text-accent-green border border-accent-green/30 px-2 py-0.5 rounded-full">Recommended</span>
                        )}
                        {activeProvider === provider.id && (
                          <span className="text-xs bg-primary-500/20 text-primary-300 border border-primary-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Activity className="w-2.5 h-2.5" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs">{provider.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Badge */}
                    {saved && status === 'active' && (
                      <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-1 rounded-lg">
                        <CheckCircle className="w-3 h-3" /> Connected
                      </span>
                    )}
                    {saved && status === 'error' && (
                      <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-1 rounded-lg">
                        <XCircle className="w-3 h-3" /> Error
                      </span>
                    )}
                    {saved && status === 'inactive' && (
                      <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-slate-400" /> Saved
                      </span>
                    )}
                    {/* Docs link */}
                    <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 border border-primary-500/30 px-2 py-1 rounded-lg transition-colors">
                      <ExternalLink className="w-3 h-3" /> {provider.docsText}
                    </a>
                  </div>
                </div>

                {/* Saved Key Display */}
                {saved && maskedKey(provider.id) && (
                  <div className="mb-3 flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/8">
                    <Key className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400 font-mono text-sm flex-1">{maskedKey(provider.id)}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleTest(provider.id)} disabled={testing[provider.id]}
                        className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 border border-primary-500/30 px-2 py-1 rounded-lg transition-colors">
                        {testing[provider.id]
                          ? <div className="w-3 h-3 border border-primary-400/30 border-t-primary-400 rounded-full animate-spin" />
                          : <Zap className="w-3 h-3" />
                        }
                        Test
                      </button>
                      <button onClick={() => handleRemoveKey(provider.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 border border-red-500/30 px-2 py-1 rounded-lg transition-colors">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Key Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showKeys[provider.id] ? 'text' : 'password'}
                      value={keys[provider.id]}
                      onChange={e => setKeys(k => ({ ...k, [provider.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleSaveKey(provider.id)}
                      placeholder={saved ? 'Update with a new key...' : `Paste your ${provider.label} API key`}
                      className="input-field pl-10 pr-10 text-sm"
                    />
                    <button onClick={() => setShowKeys(s => ({ ...s, [provider.id]: !s[provider.id] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <motion.button
                    onClick={() => handleSaveKey(provider.id)}
                    disabled={saving[provider.id] || !keys[provider.id]}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`${saved ? 'btn-ghost' : 'btn-primary'} px-4 py-2 text-sm flex items-center gap-2`}>
                    {saving[provider.id]
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : saved ? <RefreshCw className="w-4 h-4" /> : <Save className="w-4 h-4" />
                    }
                    {saved ? 'Update' : 'Save'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Model Selector */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary-400" /> Active AI Model
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Provider</label>
              <select
                value={activeProvider}
                onChange={e => {
                  setActiveProvider(e.target.value);
                  setActiveModel(MODELS[e.target.value]?.[0] || 'gemini-2.0-flash');
                }}
                className="input-field">
                <option value="default">Default (Platform Gemini Key)</option>
                {PROVIDERS.map(p => (
                  <option key={p.id} value={p.id} disabled={!hasKey(p.id)}>
                    {p.label} {!hasKey(p.id) ? '(No key saved)' : '✓'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Model</label>
              <select value={activeModel} onChange={e => setActiveModel(e.target.value)} className="input-field">
                {(MODELS[activeProvider] || MODELS.default).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Current model indicator */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <p className="text-slate-300 text-sm">
              Active: <span className="text-white font-semibold">{activeModel}</span>
              <span className="text-slate-500 ml-2">via {activeProvider === 'default' ? 'Platform Key' : activeProvider.toUpperCase()}</span>
            </p>
          </div>

          <motion.button onClick={handleModelSave}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Model Preference
          </motion.button>
        </div>

        {/* Usage Tips */}
        <div className="glass-card p-5 border border-accent-cyan/20">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-accent-cyan" /> Provider Recommendations
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/8">
              <p className="text-accent-green font-semibold mb-1">🆓 Best Free Options</p>
              <p className="text-slate-400">Gemini (15 RPM free) or Groq (very fast, generous free tier)</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/8">
              <p className="text-primary-400 font-semibold mb-1">⚡ Fastest Response</p>
              <p className="text-slate-400">Groq with LLaMA models — near real-time inference</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/8">
              <p className="text-accent-yellow font-semibold mb-1">🧠 Best Quality</p>
              <p className="text-slate-400">GPT-4o or Claude 3.5 Sonnet for complex career analysis</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/8">
              <p className="text-accent-purple font-semibold mb-1">💰 Best Value</p>
              <p className="text-slate-400">DeepSeek Chat — GPT-4 quality at fraction of the cost</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
