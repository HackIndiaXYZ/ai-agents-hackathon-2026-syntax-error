import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Zap, MapPin, Clock, ExternalLink, BookmarkPlus,
  Filter, Star, TrendingUp, Wifi, Building2, CheckCircle,
  AlertCircle, DollarSign, Target, Info, Search, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

const typeColors = {
  'full-time': 'text-green-400 bg-green-500/10 border-green-500/30',
  'internship': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'freelance': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'remote': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  'part-time': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'contract': 'text-pink-400 bg-pink-500/10 border-pink-500/30'
};

const confidenceColors = {
  'High': 'text-green-400 bg-green-500/10 border-green-500/30',
  'Medium': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'Low': 'text-red-400 bg-red-500/10 border-red-500/30'
};

const QUICK_SKILLS = ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'SQL', 'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Digital Marketing'];

function JobCard({ job, onSave, isSaved }) {
  const [showDetails, setShowDetails] = useState(false);

  // Validate and create apply URL
  const getApplyUrl = () => {
    if (!job.applyUrl || job.applyUrl === '#') return null;
    try {
      const url = new URL(job.applyUrl);
      return url.href;
    } catch {
      // If invalid URL, build search URL based on source
      const query = encodeURIComponent(`${job.title} ${job.company}`);
      if (job.source?.toLowerCase().includes('linkedin')) return `https://www.linkedin.com/jobs/search/?keywords=${query}`;
      if (job.source?.toLowerCase().includes('naukri')) return `https://www.naukri.com/jobs-in-india?k=${query}`;
      if (job.source?.toLowerCase().includes('indeed')) return `https://in.indeed.com/jobs?q=${query}`;
      return `https://www.linkedin.com/jobs/search/?keywords=${query}`;
    }
  };

  const applyUrl = getApplyUrl();
  const matchColor = job.matchScore >= 80 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                     job.matchScore >= 60 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                     'bg-red-500/20 text-red-400 border-red-500/30';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 hover:border-primary-500/30 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold truncate">{job.title}</h3>
          <p className="text-slate-400 text-sm">{job.company}</p>
        </div>
        <div className={`px-2 py-1 rounded-xl flex items-center gap-1 border text-sm font-black flex-shrink-0 ${matchColor}`}>
          <Target className="w-3 h-3" /> {job.matchScore}%
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${typeColors[job.type] || typeColors['full-time']}`}>
          {job.type}
        </span>
        {job.workType && (
          <span className="text-xs px-2 py-0.5 rounded-full border border-accent-cyan/30 text-accent-cyan bg-accent-cyan/10">
            {job.workType}
          </span>
        )}
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <MapPin className="w-3 h-3" /> {job.location}
        </span>
        {job.salaryRange && (
          <span className="flex items-center gap-1 text-xs text-accent-green font-medium">
            <DollarSign className="w-3 h-3" /> {job.salaryRange}
          </span>
        )}
        {job.source && <span className="text-xs text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">{job.source}</span>}
        {job.postedDate && <span className="text-xs text-slate-500">{job.postedDate}</span>}
      </div>

      <p className="text-slate-400 text-xs mb-3 line-clamp-2">{job.description}</p>

      {/* Match confidence */}
      {job.matchConfidence && (
        <div className={`text-xs px-2 py-1 rounded-lg border mb-3 flex items-center gap-1 ${confidenceColors[job.matchConfidence] || confidenceColors['Medium']}`}>
          <CheckCircle className="w-3 h-3" /> {job.matchConfidence} match confidence
        </div>
      )}

      {/* Why this matches */}
      {job.whyMatch && (
        <div className="mb-3 p-2.5 rounded-xl bg-primary-500/5 border border-primary-500/20">
          <p className="text-xs text-primary-300"><Info className="w-3 h-3 inline mr-1" />{job.whyMatch}</p>
        </div>
      )}

      {/* Skills match */}
      {job.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {job.requiredSkills.map(s => (
            <span key={s} className={`text-xs px-2 py-0.5 rounded ${
              job.missingSkills?.includes(s)
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}>
              {job.missingSkills?.includes(s) ? '✗' : '✓'} {s}
            </span>
          ))}
        </div>
      )}

      {/* Missing skills warning */}
      {job.missingSkills?.length > 0 && (
        <div className="mb-3 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
          <p className="text-xs text-yellow-400">
            <AlertCircle className="w-3 h-3 inline mr-1" />
            Skill gap: {job.missingSkills.join(', ')}
            {job.skillGapAnalysis && <span className="text-slate-500 ml-1">— {job.skillGapAnalysis}</span>}
          </p>
        </div>
      )}

      {/* Salary prediction */}
      {job.salaryPrediction && (
        <p className="text-xs text-accent-green mb-3">
          <DollarSign className="w-3 h-3 inline mr-1" />Predicted for you: {job.salaryPrediction}
        </p>
      )}

      <div className="flex gap-2">
        {applyUrl ? (
          <a href={applyUrl} target="_blank" rel="noopener noreferrer"
            className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2">
            Apply Now <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <button
            onClick={() => {
              const query = encodeURIComponent(`${job.title} ${job.company} jobs`);
              window.open(`https://www.linkedin.com/jobs/search/?keywords=${query}`, '_blank');
            }}
            className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2">
            Find & Apply <ExternalLink className="w-3 h-3" />
          </button>
        )}
        <button onClick={() => onSave(job, 'saved')}
          className={`btn-ghost py-2 px-3 flex items-center gap-1 text-sm ${isSaved ? 'text-yellow-400 border-yellow-400/40' : ''}`}>
          <BookmarkPlus className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function InternshipCard({ item, onSave }) {
  const getApplyUrl = () => {
    if (item.applyUrl && item.applyUrl !== '#') return item.applyUrl;
    const query = encodeURIComponent(`${item.title} internship`);
    return `https://internshala.com/internships/keywords-${encodeURIComponent(item.title?.toLowerCase() || 'web+development')}/`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 border-l-4 border-accent-blue/60">
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <h3 className="text-white font-bold">{item.title}</h3>
        <span className="text-accent-blue font-bold text-sm">{item.matchScore}% match</span>
      </div>
      <p className="text-slate-400 text-sm mb-1">{item.company}</p>
      <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-3">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.duration}</span>
        <span><MapPin className="w-3 h-3 inline mr-1" />{item.location}</span>
        {item.stipend && <span className="text-accent-green font-medium">💰 {item.stipend}</span>}
      </div>
      {item.description && <p className="text-slate-500 text-xs mb-3">{item.description}</p>}
      {item.perks?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.perks.map(perk => (
            <span key={perk} className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">
              {perk}
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-1 mb-3">
        {item.skills?.map(s => (
          <span key={s} className="text-xs bg-accent-blue/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">{s}</span>
        ))}
      </div>
      <a href={getApplyUrl()} target="_blank" rel="noopener noreferrer"
        className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
        Apply for Internship <ExternalLink className="w-3 h-3" />
      </a>
    </motion.div>
  );
}

export default function JobsPage() {
  const [skills, setSkills] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('fresher');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [hybridOnly, setHybridOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [filter, setFilter] = useState('all');
  const [skillSearch, setSkillSearch] = useState('');

  useEffect(() => {
    api.get('/career/jobs').then(r => {
      setSavedJobs(r.data.jobs?.map(j => j.jobTitle + j.company) || []);
    }).catch(() => {});

    api.get('/career/skills/profile').then(r => {
      if (r.data.profile) {
        setTargetRole(r.data.profile.targetRole || '');
        setSkills(r.data.profile.currentSkills?.map(s => s.name).join(', ') || '');
        setExperienceLevel(r.data.profile.experienceLevel || 'fresher');
      }
    }).catch(() => {});
  }, []);

  const handleMatch = async () => {
    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
    if (!skillList.length) return toast.error('Enter at least one skill');
    setLoading(true);
    setResult(null);
    try {
      const locationQuery = [
        location,
        remoteOnly ? 'Remote' : '',
        hybridOnly ? 'Hybrid' : ''
      ].filter(Boolean).join(', ') || 'India';

      const { data } = await api.post('/career/jobs/match', {
        skills: skillList, targetRole, location: locationQuery, experienceLevel
      });
      setResult(data.result);
      toast.success(`Found ${data.result.jobMatches?.length || 0} job matches! 🎯`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Matching failed');
    } finally { setLoading(false); }
  };

  const handleSave = async (job, status) => {
    try {
      await api.post('/career/jobs/save', {
        jobTitle: job.title, company: job.company, location: job.location,
        jobType: job.type, status, salaryRange: job.salaryRange,
        matchScore: job.matchScore, jobUrl: job.applyUrl, source: job.source
      });
      setSavedJobs(prev => [...prev, job.title + job.company]);
      toast.success('Job saved!');
    } catch { toast.error('Save failed'); }
  };

  const filteredJobs = () => {
    let jobs = result?.jobMatches || [];
    if (filter !== 'all') jobs = jobs.filter(j => j.type === filter);
    if (remoteOnly) jobs = jobs.filter(j => j.isRemote || j.location?.toLowerCase().includes('remote') || j.workType?.toLowerCase().includes('remote'));
    if (hybridOnly) jobs = jobs.filter(j => j.isHybrid || j.location?.toLowerCase().includes('hybrid') || j.workType?.toLowerCase().includes('hybrid'));
    return jobs;
  };

  const addQuickSkill = (skill) => {
    const existing = skills.split(',').map(s => s.trim()).filter(Boolean);
    if (!existing.includes(skill)) {
      setSkills(prev => prev ? `${prev}, ${skill}` : skill);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Job Matching Agent</h1>
            <p className="text-slate-400 text-sm">AI-powered job matching with confidence scores and direct apply links</p>
          </div>
        </motion.div>

        {/* Search Form */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-300 font-medium mb-1.5 block">
                Your Skills <span className="text-slate-500">(comma separated)</span>
              </label>
              <input value={skills} onChange={e => setSkills(e.target.value)}
                placeholder="e.g. JavaScript, React, Node.js, Python, SQL" className="input-field" />
              {/* Quick skill buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK_SKILLS.filter(s => !skills.includes(s)).map(s => (
                  <button key={s} onClick={() => addQuickSkill(s)}
                    className="text-xs px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-primary-500/40 transition-all">
                    + {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium mb-1.5 block">Target Role</label>
              <input value={targetRole} onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Frontend Developer, Data Analyst" className="input-field" />
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium mb-1.5 block">
                <MapPin className="w-3.5 h-3.5 inline mr-1" /> Preferred Location
              </label>
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Bangalore, Mumbai, or leave blank for all" className="input-field" />
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium mb-1.5 block">Experience Level</label>
              <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} className="input-field">
                <option value="fresher">Fresher (0 years)</option>
                <option value="junior">Junior (1-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior (5+ years)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium mb-1.5 block">Work Mode</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={remoteOnly} onChange={e => setRemoteOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 cursor-pointer" />
                  <span className="text-slate-300 text-sm flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5 text-purple-400" /> Remote
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={hybridOnly} onChange={e => setHybridOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 cursor-pointer" />
                  <span className="text-slate-300 text-sm flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Hybrid
                  </span>
                </label>
              </div>
            </div>
          </div>
          <motion.button onClick={handleMatch} disabled={loading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="btn-primary w-full flex items-center justify-center gap-2 h-12">
            {loading
              ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Finding best matches...</>
              : <><Zap className="w-5 h-5" /> Find My Jobs</>
            }
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Summary */}
              <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <p className="text-slate-300 text-sm">💡 {result.summary}</p>
              </div>

              {/* Market Insights */}
              {result.marketInsights && (
                <div className="glass-card p-4">
                  <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-accent-green" /> Market Insights for {targetRole || 'Your Role'}
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-3 text-xs">
                    {result.marketInsights.demandTrend && (
                      <div className="p-2 rounded-lg bg-white/5 border border-white/8">
                        <p className="text-slate-500">Demand Trend</p>
                        <p className="text-accent-green font-semibold mt-0.5">{result.marketInsights.demandTrend}</p>
                      </div>
                    )}
                    {result.marketInsights.avgSalary && (
                      <div className="p-2 rounded-lg bg-white/5 border border-white/8">
                        <p className="text-slate-500">Avg Salary</p>
                        <p className="text-white font-semibold mt-0.5">{result.marketInsights.avgSalary}</p>
                      </div>
                    )}
                    {result.marketInsights.competitionLevel && (
                      <div className="p-2 rounded-lg bg-white/5 border border-white/8">
                        <p className="text-slate-500">Competition</p>
                        <p className="text-yellow-400 font-semibold mt-0.5">{result.marketInsights.competitionLevel}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'jobs', label: `Jobs (${result.jobMatches?.length || 0})`, icon: Briefcase },
                  { id: 'internships', label: `Internships (${result.internships?.length || 0})`, icon: Star },
                  { id: 'freelance', label: `Freelance (${result.freelanceOpportunities?.length || 0})`, icon: TrendingUp }
                ].map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                      ${activeTab === t.id ? 'bg-primary-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                    <t.icon className="w-4 h-4" /> {t.label}
                  </button>
                ))}
              </div>

              {/* Job filters */}
              {activeTab === 'jobs' && (
                <div className="flex gap-2 flex-wrap items-center">
                  <Filter className="w-4 h-4 text-slate-500" />
                  {['all', 'full-time', 'remote', 'part-time', 'contract'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-all
                        ${filter === f ? 'bg-primary-500/30 text-primary-300 border border-primary-500/50' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'}`}>
                      {f}
                    </button>
                  ))}
                  <div className="flex items-center gap-2 ml-auto">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-400 hover:text-white">
                      <input type="checkbox" checked={remoteOnly} onChange={e => setRemoteOnly(e.target.checked)} className="w-3 h-3" />
                      Remote only
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-400 hover:text-white">
                      <input type="checkbox" checked={hybridOnly} onChange={e => setHybridOnly(e.target.checked)} className="w-3 h-3" />
                      Hybrid only
                    </label>
                  </div>
                </div>
              )}

              {/* Jobs Grid */}
              {activeTab === 'jobs' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredJobs().map((job, i) => (
                    <JobCard key={i} job={job} onSave={handleSave} isSaved={savedJobs.includes(job.title + job.company)} />
                  ))}
                  {filteredJobs().length === 0 && (
                    <div className="sm:col-span-2 glass-card p-8 text-center">
                      <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No jobs match your current filters. Try adjusting the filters above.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Internships */}
              {activeTab === 'internships' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {result.internships?.map((item, i) => (
                    <InternshipCard key={i} item={item} onSave={handleSave} />
                  ))}
                  {!result.internships?.length && (
                    <div className="sm:col-span-2 glass-card p-8 text-center">
                      <p className="text-slate-400">No internships found. Check Internshala and LinkedIn for latest openings.</p>
                      <a href="https://internshala.com/internships/" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-400 text-sm mt-2 hover:text-primary-300">
                        Browse Internshala <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Freelance */}
              {activeTab === 'freelance' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {result.freelanceOpportunities?.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-5 border-l-4 border-yellow-500/60">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-bold">{item.platform}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${item.demandLevel === 'High' ? 'text-green-400 bg-green-500/10 border-green-500/30' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'}`}>
                          {item.demandLevel} Demand
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-1">{item.skill}</p>
                      <p className="text-accent-green font-semibold text-sm mb-3">Avg: {item.avgEarning}</p>
                      {item.projectTypes?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.projectTypes.map(pt => (
                            <span key={pt} className="text-xs bg-white/5 text-slate-400 border border-white/8 px-2 py-0.5 rounded">{pt}</span>
                          ))}
                        </div>
                      )}
                      {item.winRate && <p className="text-xs text-slate-500 mb-3">{item.winRate}</p>}
                      <a href={item.link || `https://www.${item.platform?.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer"
                        className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
                        Find Work on {item.platform} <ExternalLink className="w-3 h-3" />
                      </a>
                    </motion.div>
                  ))}
                  {!result.freelanceOpportunities?.length && (
                    <div className="sm:col-span-2 glass-card p-8 text-center">
                      <p className="text-slate-400">
                        Check <a href="https://www.upwork.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Upwork</a>,{' '}
                        <a href="https://www.fiverr.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Fiverr</a>, and{' '}
                        <a href="https://www.freelancer.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">Freelancer</a> for gigs.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
