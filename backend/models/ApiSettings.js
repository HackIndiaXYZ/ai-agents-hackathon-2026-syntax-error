const mongoose = require('mongoose');
const crypto = require('crypto');

const ALGO = 'aes-256-cbc';
const KEY = Buffer.from((process.env.ENCRYPTION_KEY || 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6').padEnd(32, '0').slice(0, 32));

function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  if (!text) return null;
  try {
    const [ivHex, encHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();
  } catch { return null; }
}

const apiSettingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  geminiKey: { type: String },
  openrouterKey: { type: String },
  openaiKey: { type: String },
  claudeKey: { type: String },
  groqKey: { type: String },
  deepseekKey: { type: String },
  
  activeProvider: {
    type: String,
    enum: ['gemini', 'openrouter', 'openai', 'claude', 'groq', 'deepseek', 'default'],
    default: 'default'
  },
  activeModel: { type: String, default: 'gemini-2.0-flash' },
  
  fallbackProvider: { type: String, default: 'gemini' },
  
  providerStatus: {
    gemini: { type: String, enum: ['active', 'inactive', 'error'], default: 'inactive' },
    openrouter: { type: String, enum: ['active', 'inactive', 'error'], default: 'inactive' },
    openai: { type: String, enum: ['active', 'inactive', 'error'], default: 'inactive' },
    claude: { type: String, enum: ['active', 'inactive', 'error'], default: 'inactive' },
    groq: { type: String, enum: ['active', 'inactive', 'error'], default: 'inactive' },
    deepseek: { type: String, enum: ['active', 'inactive', 'error'], default: 'inactive' }
  }
}, { timestamps: true });

// Encrypt before save
apiSettingsSchema.pre('save', function(next) {
  if (this.isModified('geminiKey') && this.geminiKey) this.geminiKey = encrypt(this.geminiKey);
  if (this.isModified('openrouterKey') && this.openrouterKey) this.openrouterKey = encrypt(this.openrouterKey);
  if (this.isModified('openaiKey') && this.openaiKey) this.openaiKey = encrypt(this.openaiKey);
  if (this.isModified('claudeKey') && this.claudeKey) this.claudeKey = encrypt(this.claudeKey);
  if (this.isModified('groqKey') && this.groqKey) this.groqKey = encrypt(this.groqKey);
  if (this.isModified('deepseekKey') && this.deepseekKey) this.deepseekKey = encrypt(this.deepseekKey);
  next();
});

// Decrypt on read
apiSettingsSchema.methods.getDecryptedKeys = function() {
  return {
    geminiKey: decrypt(this.geminiKey),
    openrouterKey: decrypt(this.openrouterKey),
    openaiKey: decrypt(this.openaiKey),
    claudeKey: decrypt(this.claudeKey),
    groqKey: decrypt(this.groqKey),
    deepseekKey: decrypt(this.deepseekKey),
    activeProvider: this.activeProvider,
    activeModel: this.activeModel,
    fallbackProvider: this.fallbackProvider,
    providerStatus: this.providerStatus
  };
};

// Mask keys for client
apiSettingsSchema.methods.getMaskedKeys = function() {
  const mask = (k) => k ? '•'.repeat(Math.max(0, decrypt(k)?.length - 8)) + (decrypt(k)?.slice(-4) || '') : null;
  return {
    geminiKey: mask(this.geminiKey),
    openrouterKey: mask(this.openrouterKey),
    openaiKey: mask(this.openaiKey),
    claudeKey: mask(this.claudeKey),
    groqKey: mask(this.groqKey),
    deepseekKey: mask(this.deepseekKey),
    activeProvider: this.activeProvider,
    activeModel: this.activeModel,
    fallbackProvider: this.fallbackProvider,
    providerStatus: this.providerStatus,
    hasGemini: !!this.geminiKey,
    hasOpenrouter: !!this.openrouterKey,
    hasOpenai: !!this.openaiKey,
    hasClaude: !!this.claudeKey,
    hasGroq: !!this.groqKey,
    hasDeepseek: !!this.deepseekKey
  };
};

module.exports = mongoose.model('ApiSettings', apiSettingsSchema);
