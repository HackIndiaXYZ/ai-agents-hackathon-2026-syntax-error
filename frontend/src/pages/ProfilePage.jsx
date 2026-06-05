import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Activity, Monitor, Trash2, Save, Camera, CheckCircle, AlertCircle, Upload, Shield, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'devices', label: 'Devices', icon: Monitor },
];

// Neutral professional avatars — no gender assumptions
const NEUTRAL_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=alex&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=morgan&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=jordan&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=casey&backgroundColor=d1f4d1',
  'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=riley&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=sam&backgroundColor=b6e3f4',
];
const PROFESSIONAL_AVATARS = [
  'https://api.dicebear.com/7.x/personas/svg?seed=dev1',
  'https://api.dicebear.com/7.x/personas/svg?seed=dev2',
  'https://api.dicebear.com/7.x/personas/svg?seed=dev3',
  'https://api.dicebear.com/7.x/personas/svg?seed=dev4',
  'https://api.dicebear.com/7.x/personas/svg?seed=dev5',
  'https://api.dicebear.com/7.x/personas/svg?seed=dev6',
];
const PIXEL_AVATARS = [
  'https://api.dicebear.com/7.x/pixel-art-neutral/svg?seed=pix1',
  'https://api.dicebear.com/7.x/pixel-art-neutral/svg?seed=pix2',
  'https://api.dicebear.com/7.x/pixel-art-neutral/svg?seed=pix3',
  'https://api.dicebear.com/7.x/pixel-art-neutral/svg?seed=pix4',
  'https://api.dicebear.com/7.x/pixel-art-neutral/svg?seed=pix5',
  'https://api.dicebear.com/7.x/pixel-art-neutral/svg?seed=pix6',
];

const AVATAR_CATEGORIES = [
  { label: 'Illustrated', avatars: NEUTRAL_AVATARS },
  { label: 'Professional', avatars: PROFESSIONAL_AVATARS },
  { label: 'Pixel Art', avatars: PIXEL_AVATARS },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [activeAvatarCategory, setActiveAvatarCategory] = useState(0);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    company: user?.company || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [activity, setActivity] = useState([]);
  const [devices, setDevices] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [blockingDevice, setBlockingDevice] = useState(null);
  const [blockPassword, setBlockPassword] = useState('');

  useEffect(() => {
    if (tab === 'activity') api.get('/users/activity').then(r => setActivity(r.data.activity || [])).catch(() => {});
    if (tab === 'devices') api.get('/users/devices').then(r => setDevices(r.data.devices || [])).catch(() => {});
  }, [tab]);

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', profile);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) return toast.error('Fill all fields');
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    setSaving(true);
    try {
      await api.put('/users/change-password', passwords);
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Change failed'); }
    finally { setSaving(false); }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/users/account', { data: { password: deletePassword } });
      toast.success('Account deleted');
      window.location.href = '/';
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error('Image must be under 2MB');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfile(p => ({ ...p, avatar: ev.target.result }));
      toast.success('Image selected! Save to apply.');
    };
    reader.readAsDataURL(file);
  };

  const handleRevokeDevice = async (deviceIndex, password) => {
    if (!password) return toast.error('Enter your password to revoke access');
    try {
      await api.post('/users/revoke-device', { deviceIndex, password });
      setDevices(prev => prev.filter((_, i) => i !== deviceIndex));
      setBlockingDevice(null);
      setBlockPassword('');
      toast.success('Device access revoked');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to revoke device'); }
  };

  const completionScore = user?.profileCompletionScore || 0;
  const avatarList = AVATAR_CATEGORIES[activeAvatarCategory]?.avatars || NEUTRAL_AVATARS;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="relative">
            <img src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
              alt="avatar" className="w-16 h-16 rounded-2xl border-2 border-primary-500/40 object-cover bg-white/10" />
            <button onClick={() => setShowAvatarPicker(p => !p)}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center hover:bg-primary-400 transition-colors">
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{user?.fullName}</h1>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 h-1.5 bg-white/10 rounded-full">
                <div className="h-full bg-gradient-to-r from-primary-500 to-accent-purple rounded-full" style={{ width: `${completionScore}%` }} />
              </div>
              <span className="text-xs text-slate-500">Profile {completionScore}% complete</span>
            </div>
          </div>
        </motion.div>

        {/* Avatar Picker */}
        {showAvatarPicker && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Choose Avatar</h3>
              <button onClick={() => setShowAvatarPicker(false)} className="text-slate-500 hover:text-white text-sm">Close</button>
            </div>
            {/* Upload option */}
            <div className="mb-4">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-white/20 hover:border-primary-500/50 cursor-pointer transition-all group">
                <Upload className="w-5 h-5 text-slate-500 group-hover:text-primary-400" />
                <span className="text-slate-400 text-sm group-hover:text-white">Upload your own photo (max 2MB)</span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {/* Avatar category selector — no gender labels */}
            <div className="flex gap-2 mb-3">
              {AVATAR_CATEGORIES.map((cat, idx) => (
                <button key={cat.label} onClick={() => setActiveAvatarCategory(idx)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeAvatarCategory === idx ? 'bg-primary-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-2">
              {avatarList.map((url, i) => (
                <button key={i} onClick={() => { setProfile(p => ({ ...p, avatar: url })); setShowAvatarPicker(false); }}
                  className={`rounded-xl overflow-hidden border-2 transition-all hover:scale-105
                    ${profile.avatar === url ? 'border-primary-500' : 'border-transparent hover:border-white/30'}`}>
                  <img src={url} alt={`avatar ${i+1}`} className="w-full h-full bg-white/10" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                ${tab === t.id ? 'bg-primary-500 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-4">
            <h2 className="text-white font-bold">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: 'fullName', label: 'Full Name', type: 'text' },
                { key: 'company', label: 'Company / College', type: 'text' },
                { key: 'location', label: 'Location', type: 'text' },
                { key: 'phone', label: 'Phone Number', type: 'tel' },
                { key: 'website', label: 'Portfolio / LinkedIn', type: 'url' },
                { key: 'avatar', label: 'Avatar URL', type: 'url' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-sm text-slate-400 mb-1.5 block">{field.label}</label>
                  <input type={field.type} value={profile[field.key]}
                    onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                    className="input-field" disabled={user?.isDemo} />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-sm text-slate-400 mb-1.5 block">Bio</label>
                <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell us about yourself, your goals, and experience..." rows={3}
                  className="input-field resize-none w-full" disabled={user?.isDemo} />
              </div>
            </div>
            {user?.isDemo ? (
              <p className="text-accent-yellow text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Demo accounts cannot edit profile
              </p>
            ) : (
              <motion.button onClick={handleProfileSave} disabled={saving}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Password Tab */}
        {tab === 'password' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-4">
            <h2 className="text-white font-bold">Change Password</h2>
            {user?.isDemo ? (
              <p className="text-accent-yellow flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Demo accounts cannot change password
              </p>
            ) : (
              <>
                {[
                  { key: 'currentPassword', label: 'Current Password' },
                  { key: 'newPassword', label: 'New Password' },
                  { key: 'confirmPassword', label: 'Confirm New Password' }
                ].map(field => (
                  <div key={field.key}>
                    <label className="text-sm text-slate-400 mb-1.5 block">{field.label}</label>
                    <input type="password" value={passwords[field.key]}
                      onChange={e => setPasswords(p => ({ ...p, [field.key]: e.target.value }))}
                      className="input-field" />
                  </div>
                ))}
                <motion.button onClick={handlePasswordChange} disabled={saving}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="btn-primary flex items-center gap-2">
                  <Lock className="w-4 h-4" /> {saving ? 'Updating...' : 'Update Password'}
                </motion.button>
              </>
            )}

            {/* Danger Zone */}
            {!user?.isDemo && (
              <div className="mt-8 pt-6 border-t border-red-500/20">
                <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
                <p className="text-slate-400 text-sm mb-4">Permanently delete your account and all data. This cannot be undone.</p>
                {!showDelete ? (
                  <button onClick={() => setShowDelete(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all text-sm">
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </button>
                ) : (
                  <div className="space-y-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <p className="text-red-400 text-sm font-semibold">Enter your password to confirm:</p>
                    <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)}
                      placeholder="Your password" className="input-field border-red-500/40" />
                    <div className="flex gap-3">
                      <button onClick={handleDeleteAccount}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition-all">
                        <Trash2 className="w-4 h-4" /> Delete Forever
                      </button>
                      <button onClick={() => setShowDelete(false)} className="btn-ghost text-sm py-2">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Activity Tab */}
        {tab === 'activity' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
            <h2 className="text-white font-bold mb-4">Login Activity</h2>
            {activity.length === 0 ? (
              <p className="text-slate-400 text-sm">No activity recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {activity.slice(0, 15).map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm capitalize">{a.action?.replace('_', ' ')}</p>
                      <p className="text-slate-500 text-xs">{new Date(a.timestamp).toLocaleString()}</p>
                    </div>
                    {a.ip && <span className="text-slate-600 text-xs font-mono">{a.ip}</span>}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Devices Tab */}
        {tab === 'devices' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Login Devices</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="w-3 h-3" /> {devices.length} device{devices.length !== 1 ? 's' : ''} logged in
              </div>
            </div>
            {devices.length === 0 ? (
              <p className="text-slate-400 text-sm">No devices recorded.</p>
            ) : (
              <div className="space-y-3">
                {devices.map((d, i) => (
                  <div key={i} className="rounded-xl bg-white/5 border border-white/8 overflow-hidden">
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Monitor className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{d.device || 'Unknown Device'}</p>
                        <p className="text-slate-500 text-xs">{d.ip} · Last seen {new Date(d.lastSeen).toLocaleDateString()}</p>
                        {d.userAgent && <p className="text-slate-600 text-xs truncate max-w-xs">{d.userAgent.slice(0, 60)}...</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {i === 0 && (
                          <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded-full">Current</span>
                        )}
                        {i !== 0 && (
                          <button onClick={() => setBlockingDevice(blockingDevice === i ? null : i)}
                            className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 px-3 py-1 rounded-lg transition-all flex items-center gap-1">
                            <LogOut className="w-3 h-3" /> Revoke
                          </button>
                        )}
                      </div>
                    </div>
                    {blockingDevice === i && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="px-4 pb-4 border-t border-red-500/20 bg-red-500/5">
                        <p className="text-red-400 text-xs font-semibold mt-3 mb-2">Enter your password to revoke this device's access:</p>
                        <div className="flex gap-2">
                          <input type="password" value={blockPassword} onChange={e => setBlockPassword(e.target.value)}
                            placeholder="Your password" className="input-field text-sm flex-1 py-2 border-red-500/30" />
                          <button onClick={() => handleRevokeDevice(i, blockPassword)}
                            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition-all">
                            Confirm
                          </button>
                          <button onClick={() => { setBlockingDevice(null); setBlockPassword(''); }}
                            className="btn-ghost text-sm py-2 px-3">Cancel</button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
