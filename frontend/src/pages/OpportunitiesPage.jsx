import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Zap, ExternalLink, Building2, GraduationCap, Laptop,
  Calendar, RefreshCw, Briefcase, Globe, Wifi, CheckCircle, X, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Remote', 'Freelance', 'Walk-in'];
const EXPERIENCE_LEVELS = ['Fresher', 'Junior (1-2 yrs)', 'Mid (3-5 yrs)', 'Senior (5+ yrs)'];

const POPULAR_CITIES = [
  'Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Pune',
  'Kolkata', 'Ahmedabad', 'Noida', 'Gurgaon', 'Jaipur', 'Coimbatore'
];
const POPULAR_STATES = ['Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi NCR', 'Gujarat', 'Rajasthan'];
const POPULAR_COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Singapore'];

export default function OpportunitiesPage() {
  const [locations, setLocations] = useState([]);  // Multiple cities
  const [locationInput, setLocationInput] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [remoteFilter, setRemoteFilter] = useState(false);
  const [hybridFilter, setHybridFilter] = useState(false);
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

  const addLocation = (city) => {
    if (!locations.includes(city)) {
      setLocations(prev => [...prev, city]);
    }
    setLocationInput('');
  };

  const removeLocation = (city) => {
    setLocations(prev => prev.filter(l => l !== city));
  };

  const addCustomLocation = () => {
    if (locationInput.trim()) {
      addLocation(locationInput.trim());
    }
  };

  const getSearchLocation = () => {
    const parts = [];
    if (locations.length > 0) parts.push(...locations);
    if (selectedState) parts.push(selectedState);
    if (remoteFilter) parts.push('Remote');
    if (hybridFilter) parts.push('Hybrid');
    if (parts.length === 0 && selectedCountry) parts.push(selectedCountry);
    return parts.join(', ') || selectedCountry || 'India';
  };

  const find = async () => {
    const locationQuery = getSearchLocation();
    if (!locationQuery) return toast.error('Please select at least one location or enable Remote');
    setLoading(true);
    try {
      const { data } = await api.post('/career/opportunities', {
        location: locationQuery,
        skills,
        jobType,
        experienceLevel
      });
      setResult(data.result);
      toast.success('Opportunities found! 📍');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed');
    } finally { setLoading(false); }
  };

  const tabs = [
    { id: 'online', label: 'Online Portals', icon: Laptop },
    { id: 'remote', label: 'Remote Jobs', icon: Wifi },
    { id: 'walkin', label: 'Walk-in Drives', icon: Building2 },
    { id: 'govt', label: 'Govt Jobs', icon: Calendar },
    { id: 'skill', label: 'Skill Centers', icon: GraduationCap },
  ];

  const locationDisplay = getSearchLocation();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-yellow to-orange-500 flex items-center justify-center">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Local Opportunity Agent</h1>
            <p className="text-slate-400 text-sm">Find jobs by city, state, country — remote & hybrid options too</p>
          </div>
        </motion.div>

        {/* Search Form */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="text-white font-semibold">Search Preferences</h2>

          {/* Country selector */}
          <div>
            <label className="text-sm text-slate-300 font-medium mb-2 block">
              <Globe className="w-3.5 h-3.5 inline mr-1" /> Country
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_COUNTRIES.map(c => (
                <button key={c} onClick={() => setSelectedCountry(c)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    selectedCountry === c
                      ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* State selector */}
          {selectedCountry === 'India' && (
            <div>
              <label className="text-sm text-slate-300 font-medium mb-2 block">State (optional)</label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_STATES.map(s => (
                  <button key={s} onClick={() => setSelectedState(selectedState === s ? '' : s)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      selectedState === s
                        ? 'bg-accent-cyan/20 border-accent-cyan/50 text-accent-cyan'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* City multi-select */}
          <div>
            <label className="text-sm text-slate-300 font-medium mb-2 block">
              Cities <span className="text-slate-500">(select multiple or type any city)</span>
            </label>
            {/* Quick city buttons */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {POPULAR_CITIES.map(city => (
                <button key={city} onClick={() => locations.includes(city) ? removeLocation(city) : addLocation(city)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                    locations.includes(city)
                      ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}>
                  {locations.includes(city) && <CheckCircle className="w-3 h-3" />}
                  {city}
                </button>
              ))}
            </div>
            {/* Custom city input */}
            <div className="flex gap-2">
              <input
                value={locationInput}
                onChange={e => setLocationInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomLocation()}
                placeholder="Type any city (e.g. Vizag, Nagpur, Kochi...)"
                className="input-field flex-1 text-sm"
              />
              <button onClick={addCustomLocation} className="btn-ghost px-3 py-2">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {/* Selected cities */}
            {locations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {locations.map(loc => (
                  <span key={loc} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-primary-500/20 border border-primary-500/40 text-primary-300">
                    {loc}
                    <button onClick={() => removeLocation(loc)} className="hover:text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Remote / Hybrid toggles */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setRemoteFilter(!remoteFilter)}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                remoteFilter
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}>
              <Wifi className="w-4 h-4" />
              <span className="text-sm font-medium">Remote Jobs</span>
              {remoteFilter && <CheckCircle className="w-4 h-4 ml-auto" />}
            </button>
            <button onClick={() => setHybridFilter(!hybridFilter)}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                hybridFilter
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}>
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">Hybrid Jobs</span>
              {hybridFilter && <CheckCircle className="w-4 h-4 ml-auto" />}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
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
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      jobType === type
                        ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-300 font-medium mb-1.5 block">Experience Level</label>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_LEVELS.map(level => (
                  <button key={level} onClick={() => setExperienceLevel(level)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      experienceLevel === level
                        ? 'bg-accent-green/20 border-accent-green/50 text-accent-green'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.button onClick={find} disabled={loading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="btn-primary w-full flex items-center justify-center gap-2 h-12">
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Zap className="w-5 h-5" />
            }
            {loading ? 'Finding opportunities...' : `Find Opportunities${locationDisplay ? ` in ${locationDisplay}` : ''}`}
          </motion.button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
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
                      {item.tips && <p className="text-xs text-slate-500 mb-3 italic">💡 {item.tips}</p>}
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
                        Browse {item.platform} <ExternalLink className="w-3 h-3" />
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Remote Opportunities */}
              {activeTab === 'remote' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {result.remoteOpportunities?.length > 0 ? result.remoteOpportunities.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="glass-card p-5 border-l-4 border-purple-500/60">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                          <Wifi className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-bold">{item.platform}</p>
                          <p className="text-slate-500 text-xs">{item.type}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.roles?.map(r => (
                          <span key={r} className="text-xs bg-white/5 text-slate-400 border border-white/8 px-2 py-0.5 rounded">{r}</span>
                        ))}
                      </div>
                      {item.tips && <p className="text-xs text-slate-500 mb-3 italic">💡 {item.tips}</p>}
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
                        Find Remote Work <ExternalLink className="w-3 h-3" />
                      </a>
                    </motion.div>
                  )) : (
                    <div className="sm:col-span-2 space-y-3">
                      {[
                        { platform: 'LinkedIn Remote Jobs', link: 'https://www.linkedin.com/jobs/remote-jobs/', desc: 'Thousands of remote openings updated daily' },
                        { platform: 'Wellfound (AngelList)', link: 'https://wellfound.com/remote', desc: 'Remote startup jobs — often equity + salary' },
                        { platform: 'Remote.co', link: 'https://remote.co/remote-jobs/', desc: 'Curated remote jobs across all industries' },
                        { platform: 'We Work Remotely', link: 'https://weworkremotely.com/', desc: 'Top remote tech and design jobs globally' },
                      ].map(item => (
                        <div key={item.platform} className="glass-card p-5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                              <Wifi className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">{item.platform}</p>
                              <p className="text-slate-500 text-xs">{item.desc}</p>
                            </div>
                          </div>
                          <a href={item.link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary-400 text-sm whitespace-nowrap hover:text-primary-300">
                            Visit <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
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
                        {item.salary && <p className="text-accent-green text-xs font-medium">💰 {item.salary}</p>}
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
                          {item.contact && <span>📧 {item.contact}</span>}
                          {item.eligibility && <span>📋 {item.eligibility}</span>}
                        </div>
                      </div>
                      {item.applyUrl && (
                        <a href={item.applyUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary-400 text-xs whitespace-nowrap hover:text-primary-300">
                          Apply <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </motion.div>
                  )) : (
                    <div className="glass-card p-8 text-center">
                      <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 mb-3">Check these platforms for latest walk-in drives:</p>
                      <div className="flex flex-wrap justify-center gap-3">
                        {[
                          { name: 'Naukri Walk-in', url: 'https://www.naukri.com/walk-in-jobs' },
                          { name: 'Indeed Walk-in', url: 'https://in.indeed.com/walk-in-jobs' },
                          { name: 'TimesJobs', url: 'https://www.timesjobs.com/' },
                        ].map(p => (
                          <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                            className="text-primary-400 text-sm hover:underline flex items-center gap-1">
                            {p.name} <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
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
                          {item.category && <span className="text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2 py-0.5 rounded mt-1 inline-block">{item.category}</span>}
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                            <span>📋 {item.eligibility}</span>
                            {item.salary && <span className="text-accent-green">💰 {item.salary}</span>}
                            <span className="text-accent-yellow">⏰ {item.lastDate}</span>
                          </div>
                        </div>
                        <a href={item.link} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary-400 text-sm hover:text-primary-300 whitespace-nowrap btn-ghost py-1.5 px-3 text-xs">
                          View Portal <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                  {/* Static fallback portals */}
                  <div className="glass-card p-5">
                    <p className="text-white font-semibold text-sm mb-3">Key Government Job Portals</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {[
                        { name: 'National Career Service', url: 'https://www.ncs.gov.in', desc: 'Central government portal' },
                        { name: 'SSC - Staff Selection Commission', url: 'https://ssc.nic.in', desc: 'Central govt positions' },
                        { name: 'IBPS - Banking Jobs', url: 'https://www.ibps.in', desc: 'Bank clerical & officer posts' },
                        { name: 'Skill India Portal', url: 'https://skillindiadigital.gov.in', desc: 'Training + job placement' },
                      ].map(p => (
                        <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/8 hover:border-primary-500/30 transition-all group">
                          <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                            <Globe className="w-4 h-4 text-primary-400" />
                          </div>
                          <div>
                            <p className="text-white text-xs font-medium group-hover:text-primary-300">{p.name}</p>
                            <p className="text-slate-500 text-xs">{p.desc}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
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
                      {item.duration && <p className="text-xs text-slate-500 mb-1">⏱ Duration: {item.duration}</p>}
                      {item.certification && <p className="text-xs text-primary-400 mb-1">🏆 {item.certification}</p>}
                      <p className="text-accent-yellow text-xs font-medium">Fee: {item.fee}</p>
                      {item.contact && (
                        <a href={item.contact.startsWith('http') ? item.contact : `https://${item.contact}`}
                          target="_blank" rel="noopener noreferrer"
                          className="mt-2 text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                          Learn more <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </motion.div>
                  ))}
                  {/* Fallback skill programs */}
                  <div className="sm:col-span-2 glass-card p-5">
                    <p className="text-white font-semibold text-sm mb-3">National Skill Development Programs</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {[
                        { name: 'NSDC - National Skill Dev Corp', url: 'https://nsdcindia.org', desc: 'Free government skill training' },
                        { name: 'Skill India Digital', url: 'https://skillindiadigital.gov.in', desc: 'Online + offline courses, free' },
                        { name: 'PMKVY - Pradhan Mantri Kaushal', url: 'https://pmkvyofficial.org', desc: 'Free industry training + certification' },
                        { name: 'eSkill India', url: 'https://eskillindia.org', desc: 'Digital skill courses, government' },
                      ].map(p => (
                        <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/8 hover:border-accent-green/30 transition-all group">
                          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white text-xs font-medium group-hover:text-green-300">{p.name}</p>
                            <p className="text-slate-500 text-xs">{p.desc}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button onClick={find} disabled={loading}
                className="btn-ghost w-full flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" /> Refresh Results
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
