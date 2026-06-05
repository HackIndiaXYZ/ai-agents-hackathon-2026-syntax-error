const ApiSettings = require('../models/ApiSettings');
const axios = require('axios');

// @desc    Get API settings (masked)
const getSettings = async (req, res, next) => {
  try {
    let settings = await ApiSettings.findOne({ user: req.user._id });
    if (!settings) {
      settings = await ApiSettings.create({ user: req.user._id });
    }
    res.json({ success: true, settings: settings.getMaskedKeys() });
  } catch (error) {
    next(error);
  }
};

// @desc    Save API key
const saveApiKey = async (req, res, next) => {
  try {
    if (req.user.isDemo) {
      return res.status(403).json({ success: false, message: 'Demo accounts cannot save API keys.' });
    }
    
    const { provider, apiKey } = req.body;
    const validProviders = ['gemini', 'openrouter', 'openai', 'claude', 'groq', 'deepseek'];
    
    if (!validProviders.includes(provider)) {
      return res.status(400).json({ success: false, message: 'Invalid provider.' });
    }
    
    const fieldMap = { 
      gemini: 'geminiKey', openrouter: 'openrouterKey', openai: 'openaiKey', 
      claude: 'claudeKey', groq: 'groqKey', deepseek: 'deepseekKey' 
    };
    const field = fieldMap[provider];
    
    let settings = await ApiSettings.findOne({ user: req.user._id });
    if (!settings) settings = new ApiSettings({ user: req.user._id });
    
    settings[field] = apiKey;
    settings.markModified(field);
    await settings.save();
    
    res.json({ success: true, message: `${provider} API key saved!`, settings: settings.getMaskedKeys() });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove API key
const removeApiKey = async (req, res, next) => {
  try {
    const { provider } = req.body;
    const fieldMap = { 
      gemini: 'geminiKey', openrouter: 'openrouterKey', openai: 'openaiKey', 
      claude: 'claudeKey', groq: 'groqKey', deepseek: 'deepseekKey' 
    };
    const field = fieldMap[provider];
    if (!field) return res.status(400).json({ success: false, message: 'Invalid provider.' });
    
    await ApiSettings.findOneAndUpdate(
      { user: req.user._id },
      { [field]: null, [`providerStatus.${provider}`]: 'inactive' }
    );
    
    res.json({ success: true, message: `${provider} API key removed.` });
  } catch (error) {
    next(error);
  }
};

// @desc    Test API connection
const testApiKey = async (req, res, next) => {
  try {
    const { provider } = req.body;
    const settings = await ApiSettings.findOne({ user: req.user._id });
    if (!settings) return res.status(404).json({ success: false, message: 'No settings found.' });
    
    const keys = settings.getDecryptedKeys();
    const fieldMap = { 
      gemini: 'geminiKey', openrouter: 'openrouterKey', openai: 'openaiKey', 
      claude: 'claudeKey', groq: 'groqKey', deepseek: 'deepseekKey' 
    };
    const key = keys[fieldMap[provider]];
    
    if (!key) return res.status(400).json({ success: false, message: 'No API key for this provider.' });
    
    let isValid = false;
    let error = null;
    
    try {
      if (provider === 'gemini') {
        const resp = await axios.get(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
          { timeout: 8000 }
        );
        isValid = resp.status === 200;
      } else if (provider === 'openai') {
        const resp = await axios.get('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${key}` },
          timeout: 8000
        });
        isValid = resp.status === 200;
      } else if (provider === 'openrouter') {
        const resp = await axios.get('https://openrouter.ai/api/v1/models', {
          headers: { Authorization: `Bearer ${key}` },
          timeout: 8000
        });
        isValid = resp.status === 200;
      } else if (provider === 'claude') {
        const resp = await axios.get('https://api.anthropic.com/v1/models', {
          headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
          timeout: 8000
        });
        isValid = resp.status === 200;
      } else if (provider === 'groq') {
        const resp = await axios.get('https://api.groq.com/openai/v1/models', {
          headers: { Authorization: `Bearer ${key}` },
          timeout: 8000
        });
        isValid = resp.status === 200;
      } else if (provider === 'deepseek') {
        // DeepSeek: test with a minimal completion
        const resp = await axios.post('https://api.deepseek.com/v1/chat/completions', {
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'Say OK' }],
          max_tokens: 5
        }, {
          headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
          timeout: 8000
        });
        isValid = resp.status === 200;
      }
    } catch (e) {
      error = e.response?.data?.error?.message || e.response?.data?.message || 'Connection failed';
    }
    
    // Update status
    await ApiSettings.findOneAndUpdate(
      { user: req.user._id },
      { [`providerStatus.${provider}`]: isValid ? 'active' : 'error' }
    );
    
    res.json({ success: true, valid: isValid, message: isValid ? 'Connection successful!' : error || 'Invalid API key.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update model preference
const updateModel = async (req, res, next) => {
  try {
    const { activeProvider, activeModel } = req.body;
    
    await ApiSettings.findOneAndUpdate(
      { user: req.user._id },
      { activeProvider, activeModel },
      { upsert: true }
    );
    
    res.json({ success: true, message: 'Model preference updated!' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, saveApiKey, removeApiKey, testApiKey, updateModel };
