import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, ExternalLink, Building2, GraduationCap, Laptop, Calendar, RefreshCw, Briefcase, User, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Remote', 'Freelance', 'Walk-in'];
const EXPERIENCE_LEVELS = ['Fresher', 'Junior (1-2 yrs)', 'Mid (3-5 yrs)', 'Senior (5+ yrs)'];
const POPULAR_CITIES = ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Kolkata', 'Ahmedabad'];

export default function OpportunitiesPage() {
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [jobType, setJobType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('online');

  useEffect(() => {
    api.get('/career/skills/profile').then(r => {
      if (r.data.profile) {
        setSkills(r.data.profile.currentSkills?.map(s => s.name).join(', ') || '');
      }
    }).catch(() => {});
  }, []);

  const find = async () => {
    if (!location.trim()) return toast.error('Please enter your location');
    setLoading(true);
    try {
      const { data } = await api.post('/career/opportunities', { location, skills, jobType, experienceLevel });
      setResult(data.result);
      toast.success('Opportunities found! 📍');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed');
    } finally { setLoading(false); }
  };

  const tabs = [
    { id: 'online', label: 'Online Portals', icon: Laptop },
    { id: 'walkin', label: 'Walk-in Drives', icon: Building2 },
    { id: 'govt', label: 'Govt Jobs', icon: Calendar },
    { id: 'skill', label: 'Skill Centers', icon: GraduationCap },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-yellow to-orange-500 flex items-center justify-center">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Local Opportunity Agent</h1>
            <p className="text-slate-400 text-sm">Find jobs, walk-in drives, govt openings & skill centers near you</p>
          </div>
        </motion.div>

        {/* Search */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-white font-semibold">Search Preferences</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 font-medium mb-1.5 block">Your Location *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input value={location} onChange={e => setLocation(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && find()}
                  placeholder="e.g. Hyderabad, Bangalore, Delhi" className="input-field pl-10" />
              </div>
              {/* Quick city buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {POPULAR_CITIES.map(city => (
                  <button key={city} onClick={() => setLocation(city)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all
                      ${location === city ? 'bg-primary-500/20 border-primary-500/50 text-primary-300' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}>
                    {city}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium mb-1.5 block">Your Skills</label>
              <input value={skills} onChange={e => setSkills(e.target.value)}
                placeholder="e.g. React, Python, Java..." className="input-field" />
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium mb-1.5 block">Job Type</label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map(type => (
                  <button key={type} onClick={() => setJobType(jobType === type ? '' : type)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all
                      ${jobType === type ? 'bg-primary-500/20 border-primary-500/50 text-primary-300' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium mb-1.5 block">Experience Level</label>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_LEVELS.map(level => (
                  <button key={level} onClick={() => setExperienceLevel(level)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all
                      ${experienceLevel === level ? 'bg-accent-green/20 border-accent-green/50 text-accent-green' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <motion.button onClick={find} disabled={loading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="btn-primary w-full flex items-center justify-center gap-2 h-12">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap className="w-5 h-5" />}
            {loading ? 'Finding opportunities...' : `Find Opportunities in ${location || 'Your City'}`}
          </motion.button>
        </div>

        {result && (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {/* Tip */}
              <div className="p-4 rounded-xl bg-accent-yellow/10 border border-accent-yellow/30">
                <p className="text-accent-yellow text-sm">💡 {result.tip}</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                      ${activeTab === t.id ? 'bg-primary-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                    <t.icon className="w-4 h-4" /> {t.label}
                  </button>
                ))}
              </div>

              {/* Online Portals */}
              {activeTab === 'online' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {result.onlineOpportunities?.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="glass-card p-5 hover:border-primary-500/30 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                            <Laptop className="w-5 h-5 text-primary-400" />
                          </div>
                          <div>
                            <p className="text-white font-bold">{item.platform}</p>
                            <p className="text-slate-500 text-xs">{item.type}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.roles?.map(r => (
                          <span key={r} className="text-xs bg-white/5 text-slate-400 border border-white/8 px-2 py-0.5 rounded">{r}</span>
                        ))}
                      </div>
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary-400 text-sm hover:text-primary-300 transition-colors font-medium">
                        Visit {item.platform} <ExternalLink className="w-3 h-3" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Walk-in Drives */}
              {activeTab === 'walkin' && (
                <div className="space-y-3">
                  {result.walkInDrives?.length > 0 ? result.walkInDrives.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="glass-card p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent-blue/20 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-accent-blue" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold">{item.company}</p>
                        <p className="text-slate-400 text-sm">{item.role}</p>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
                          {item.contact && <span>📧 {item.contact}</span>}
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="glass-card p-8 text-center">
                      <p className="text-slate-400">No walk-in drives found. Check online portals for the latest drives in your area.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Govt Jobs */}
              {activeTab === 'govt' && (
                <div className="space-y-3">
                  {result.governmentJobs?.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="glass-card p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-white font-bold">{item.type}</p>
                          <p className="text-primary-400 text-sm font-medium">{item.portal}</p>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                            <span>📋 Eligibility: {item.eligibility}</span>
                            <span className="text-accent-red">⏰ Last Date: {item.lastDate}</span>
                          </div>
                        </div>
                        <a href={item.link} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary-400 text-sm hover:text-primary-300 whitespace-nowrap">
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Skill Centers */}
              {activeTab === 'skill' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {result.skillCenters?.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="glass-card p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-accent-green" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{item.name}</p>
                          <p className="text-slate-500 text-xs"><MapPin className="w-3 h-3 inline mr-1" />{item.location}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.courses?.map(c => (
                          <span key={c} className="text-xs bg-accent-green/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">{c}</span>
                        ))}
                      </div>
                      <p className="text-accent-yellow text-xs font-medium">Fee: {item.fee}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              <button onClick={find} disabled={loading}
                className="btn-ghost w-full flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" /> Refresh Results
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </DashboardLayout>
  );
}
