import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Plus, X, Zap, Target, TrendingUp, CheckCircle, BookOpen,
  ExternalLink, GraduationCap, Download, Search, ChevronDown,
  BarChart3, Star, Clock, Award, Lightbulb, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

// Comprehensive skill database across all domains
const ALL_SKILLS = {
  'Frontend': ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Next.js', 'Tailwind CSS', 'Bootstrap', 'Sass/SCSS', 'Redux', 'Zustand', 'Webpack', 'Vite'],
  'Backend': ['Node.js', 'Express.js', 'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring Boot', 'PHP', 'Laravel', 'Ruby on Rails', 'Go', 'Rust', 'C#', '.NET'],
  'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS', 'Expo', 'Ionic'],
  'Database': ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'Supabase', 'Elasticsearch', 'DynamoDB'],
  'Data Science': ['Python', 'R', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Scikit-learn', 'Statistics', 'Data Visualization', 'Power BI', 'Tableau', 'Excel', 'SQL'],
  'AI/ML': ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras', 'NLP', 'Computer Vision', 'LLMs', 'Prompt Engineering', 'OpenAI API', 'Hugging Face', 'MLOps'],
  'DevOps/Cloud': ['Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure', 'CI/CD', 'GitHub Actions', 'Jenkins', 'Terraform', 'Linux', 'Nginx'],
  'Design': ['Figma', 'Adobe XD', 'Sketch', 'UI Design', 'UX Research', 'Prototyping', 'Wireframing', 'Adobe Illustrator', 'Canva'],
  'Business': ['Project Management', 'Agile', 'Scrum', 'Business Analysis', 'Excel', 'PowerPoint', 'Communication', 'Leadership', 'Marketing', 'Sales'],
  'Other': ['Git', 'GitHub', 'REST APIs', 'GraphQL', 'WebSockets', 'Testing', 'Jest', 'Cypress', 'Blockchain', 'Web3'],
};

const FLAT_SKILLS = Object.values(ALL_SKILLS).flat();

const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher (0 years)' },
  { value: 'junior', label: 'Junior (1-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior (5+ years)' }
];

const POPULAR_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer',
  'Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer',
  'DevOps Engineer', 'Cloud Architect', 'UI/UX Designer', 'QA Engineer',
  'Product Manager', 'Business Analyst', 'Cybersecurity Engineer', 'Blockchain Developer',
  'Game Developer', 'Embedded Systems Engineer', 'Technical Writer', 'Software Architect'
];

const priorityColors = {
  high: 'text-red-400 bg-red-500/10 border-red-500/30',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  low: 'text-green-400 bg-green-500/10 border-green-500/30'
};

const demandColors = {
  'Very High': 'text-green-400',
  'High': 'text-emerald-400',
  'Medium': 'text-yellow-400',
  'Low': 'text-red-400'
};

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [inputSkill, setInputSkill] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('fresher');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const suggestRef = useRef(null);

  useEffect(() => {
    api.get('/career/skills/profile').then(r => {
      if (r.data.profile) {
        setSkills(r.data.profile.currentSkills?.map(s => s.name) || []);
        const role = r.data.profile.targetRole || '';
        if (POPULAR_ROLES.includes(role)) {
          setTargetRole(role);
        } else if (role) {
          setTargetRole('custom');
          setCustomRole(role);
        }
        setExperienceLevel(r.data.profile.experienceLevel || 'fresher');
        const completed = r.data.profile.learningRoadmap?.filter(r => r.completed).map((_, i) => i) || [];
        setCompletedSteps(completed);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSkillInput = (value) => {
    setInputSkill(value);
    if (value.length >= 1) {
      const filtered = FLAT_SKILLS
        .filter(s => s.toLowerCase().includes(value.toLowerCase()) && !skills.includes(s))
        .slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const addSkill = (s) => {
    const skill = (typeof s === 'string' ? s : inputSkill).trim();
    if (!skill) return;
    if (skills.map(sk => sk.toLowerCase()).includes(skill.toLowerCase())) {
      return toast.error('Skill already added');
    }
    setSkills(prev => [...prev, skill]);
    setInputSkill('');
    setShowSuggestions(false);
  };

  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

  const getEffectiveRole = () => targetRole === 'custom' ? customRole : targetRole;

  const handleAnalyze = async () => {
    if (!skills.length) return toast.error('Add at least one skill');
    const role = getEffectiveRole();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/career/skills/analyze', {
        skills,
        targetRole: role,
        experienceLevel
      });
      setResult(data.result);
      toast.success('Skill analysis complete! 🎯');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (index) => {
    try {
      await api.put('/career/skills/roadmap/complete', { skillIndex: index });
      setCompletedSteps(prev => [...prev, index]);
      toast.success('Marked as complete! 🎉');
    } catch {}
  };

  const filteredSkillsForBrowse = () => {
    const categorySkills = activeCategory === 'All'
      ? FLAT_SKILLS
      : (ALL_SKILLS[activeCategory] || []);
    return categorySkills.filter(s =>
      s.toLowerCase().includes(searchQuery.toLowerCase()) && !skills.includes(s)
    );
  };

  const downloadPDF = () => {
    if (!result) return;
    const role = getEffectiveRole();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<!DOCTYPE html><html><head>
      <title>Skill Analysis Report</title>
      <style>
        body{font-family:'Segoe UI',sans-serif;padding:32px;max-width:800px;margin:0 auto;background:#fff;color:#1a1a2e}
        h1{color:#6366f1;font-size:26px;margin-bottom:4px}
        h2{color:#4f46e5;font-size:16px;margin:24px 0 8px;border-bottom:2px solid #e0e7ff;padding-bottom:6px}
        p,li{color:#4b5563;font-size:13px;line-height:1.7}
        .meta{color:#6b7280;font-size:12px;margin-bottom:20px}
        .score{font-size:36px;font-weight:800;color:#6366f1}
        .summary{background:#f5f3ff;border-left:4px solid #6366f1;padding:12px 16px;border-radius:4px;margin:8px 0}
        .strength{background:#f0fdf4;border-left:4px solid #10b981;padding:8px 14px;border-radius:4px;margin:4px 0;font-size:13px;color:#065f46}
        .gap{padding:10px 14px;border-radius:6px;margin:6px 0;border:1px solid #e5e7eb}
        .gap.high{background:#fef2f2;border-color:#fca5a5}
        .gap.medium{background:#fffbeb;border-color:#fcd34d}
        .gap.low{background:#f0fdf4;border-color:#86efac}
        .gap-title{font-weight:700;font-size:13px;color:#111}
        .gap-reason{font-size:12px;color:#6b7280;margin-top:2px}
        .badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;margin-left:8px}
        .badge.high{background:#fee2e2;color:#dc2626}
        .badge.medium{background:#fef3c7;color:#d97706}
        .badge.low{background:#dcfce7;color:#16a34a}
        .path{background:#eff6ff;border:1px solid #bfdbfe;padding:10px 14px;border-radius:6px;margin:6px 0}
        .step{display:flex;gap:10px;padding:8px;background:#f9fafb;border-radius:6px;margin:5px 0;align-items:flex-start}
        .step-num{background:#6366f1;color:#fff;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
        .course{background:#faf5ff;border:1px solid #e9d5ff;padding:8px 12px;border-radius:6px;margin:4px 0;font-size:12px}
        .next-step{padding:6px 12px;background:#f0fdf4;border-left:3px solid #10b981;border-radius:4px;margin:4px 0;font-size:13px;color:#065f46}
        ul{padding-left:20px}
        @media print{body{padding:16px}}
      </style></head><body>
      <h1>🧠 Skill Analysis Report</h1>
      <div class="meta">
        <strong>Skills:</strong> ${skills.join(', ')} | <strong>Target Role:</strong> ${role || 'Not specified'} |
        <strong>Experience:</strong> ${experienceLevel} | <strong>Generated:</strong> ${new Date().toLocaleDateString()}
      </div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:8px">
        <div class="score">${result.overallReadiness}%</div>
        <div>
          <div style="font-weight:700;font-size:16px;color:#111">Overall Career Readiness</div>
          <div style="color:#6b7280;font-size:13px">for ${role || 'your target role'}</div>
          ${result.estimatedTimeToJob ? `<div style="color:#6366f1;font-size:12px;margin-top:4px">⏱ ${result.estimatedTimeToJob}</div>` : ''}
        </div>
      </div>
      <div class="summary">${result.summary}</div>
      ${result.marketOutlook ? `<div style="background:#f0fdf4;border-left:4px solid #10b981;padding:10px 14px;border-radius:4px;margin:8px 0;font-size:13px;color:#065f46">📈 ${result.marketOutlook}</div>` : ''}
      ${result.strengths?.length ? `<h2>✅ Your Strengths</h2>${result.strengths.map(s => `<div class="strength">✓ ${s}</div>`).join('')}` : ''}
      ${result.careerPaths?.length ? `<h2>🚀 Recommended Career Paths</h2>${result.careerPaths.map(p => `<div class="path"><strong>${p.role}</strong> — <span style="color:#059669;font-weight:700">${p.matchScore}% match</span><br><span style="font-size:12px;color:#4b5563">${p.description}</span><br><span style="font-size:12px;color:#6366f1">💰 ${p.avgSalary}</span></div>`).join('')}` : ''}
      ${result.skillGaps?.length ? `<h2>🎯 Skill Gaps to Fill</h2>${result.skillGaps.map(g => `<div class="gap ${g.priority}"><div class="gap-title">${g.skill}<span class="badge ${g.priority}">${g.priority}</span></div><div class="gap-reason">${g.reason}</div><div style="font-size:11px;color:#9ca3af;margin-top:2px">⏱ ~${g.estimatedWeeks} weeks${g.currentDemand ? ` | Demand: ${g.currentDemand}` : ''}</div></div>`).join('')}` : ''}
      ${result.learningRoadmap?.length ? `<h2>📚 Learning Roadmap</h2>${result.learningRoadmap.map((step, i) => `<div class="step"><div class="step-num">${step.step || i+1}</div><div><div style="font-weight:600;font-size:13px;color:#111">${step.skill}</div><div style="font-size:11px;color:#9ca3af">⏱ ${step.weeks} weeks | Resources: ${step.resources?.join(', ')}</div></div></div>`).join('')}` : ''}
      ${result.suggestedCourses?.length ? `<h2>🎓 Suggested Courses</h2>${result.suggestedCourses.map(c => `<div class="course"><strong>${c.name}</strong><br><span style="color:#9ca3af">${c.platform} · ${c.duration} · ${c.free ? 'Free' : 'Paid'}</span></div>`).join('')}` : ''}
      ${result.nextSteps?.length ? `<h2>⚡ Your Next Steps</h2>${result.nextSteps.map((s, i) => `<div class="next-step">${i+1}. ${s}</div>`).join('')}` : ''}
      <p style="margin-top:32px;color:#9ca3af;font-size:11px;text-align:center">Generated by CareerIQ AI Platform</p>
    </body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const categories = ['All', ...Object.keys(ALL_SKILLS)];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Skill Analysis Agent</h1>
            <p className="text-slate-400 text-sm">AI-powered career gap analysis and personalized learning roadmap</p>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-5">
          {/* Skills Input with Auto-suggest */}
          <div>
            <label className="text-sm text-slate-300 font-medium mb-2 block">
              Your Current Skills <span className="text-slate-500">(type any skill — not limited to suggestions)</span>
            </label>
            <div ref={suggestRef} className="relative">
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    value={inputSkill}
                    onChange={e => handleSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                    placeholder="Type any skill (React, Python, Excel, Marketing...) and press Enter"
                    className="input-field pl-10"
                  />
                  {/* Suggestions dropdown */}
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 right-0 z-50 mt-1 bg-dark-700 border border-white/15 rounded-xl shadow-2xl overflow-hidden"
                      >
                        {suggestions.map(s => (
                          <button key={s} onClick={() => addSkill(s)}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-primary-500/20 hover:text-white transition-colors flex items-center gap-2">
                            <Plus className="w-3 h-3 text-primary-400" /> {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button onClick={() => addSkill()} whileTap={{ scale: 0.95 }}
                  className="btn-primary px-4 py-2 flex items-center gap-1">
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Category filter */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      activeCategory === cat
                        ? 'bg-primary-500/20 border-primary-500/50 text-primary-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search within category */}
              {activeCategory !== 'All' && (
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeCategory} skills...`}
                    className="input-field pl-9 text-sm py-2"
                  />
                </div>
              )}

              {/* Skill tags from category */}
              <div className="flex flex-wrap gap-1.5 mb-3 max-h-24 overflow-y-auto">
                {filteredSkillsForBrowse().slice(0, 30).map(s => (
                  <button key={s} onClick={() => addSkill(s)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 transition-all">
                    + {s}
                  </button>
                ))}
              </div>

              {/* Selected skills */}
              {skills.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Selected skills ({skills.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(s => (
                      <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500/20 border border-primary-500/40 text-primary-300 text-sm">
                        {s}
                        <button onClick={() => removeSkill(s)} className="hover:text-red-400 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Target Role & Experience */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 font-medium mb-2 block">Target Role</label>
              <select value={targetRole} onChange={e => setTargetRole(e.target.value)} className="input-field mb-2">
                <option value="">Select target role...</option>
                {POPULAR_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                <option value="custom">Custom role (type below)</option>
              </select>
              {targetRole === 'custom' && (
                <input
                  value={customRole}
                  onChange={e => setCustomRole(e.target.value)}
                  placeholder="Enter your specific target role..."
                  className="input-field text-sm"
                />
              )}
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium mb-2 block">Experience Level</label>
              <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} className="input-field">
                {EXPERIENCE_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>

          <motion.button
            onClick={handleAnalyze} disabled={loading || !skills.length}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing your profile with AI...</>
            ) : (
              <><Zap className="w-5 h-5" /> Analyze Skills with AI — {skills.length} skill{skills.length !== 1 ? 's' : ''} selected</>
            )}
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

              {/* Download Button */}
              <div className="flex justify-end">
                <button onClick={downloadPDF} className="btn-ghost flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" /> Download PDF Report
                </button>
              </div>

              {/* Summary Card with metrics */}
              <div className="glass-card p-6 border-l-4 border-primary-500">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-primary-400" />
                    <h2 className="text-white font-bold text-lg">AI Analysis Summary</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-3xl font-black text-primary-400">{result.overallReadiness}%</div>
                      <div className="text-xs text-slate-500">Career Readiness</div>
                    </div>
                    {result.confidenceScore && (
                      <div className="text-center">
                        <div className="text-3xl font-black text-accent-green">{result.confidenceScore}%</div>
                        <div className="text-xs text-slate-500">Confidence</div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed mb-4">{result.summary}</p>

                {/* Key metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {result.estimatedTimeToJob && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/8 text-center">
                      <Clock className="w-4 h-4 text-accent-cyan mx-auto mb-1" />
                      <p className="text-white text-xs font-semibold">{result.estimatedTimeToJob}</p>
                      <p className="text-slate-500 text-xs">Time to Job</p>
                    </div>
                  )}
                  {result.marketOutlook && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/8 text-center sm:col-span-2">
                      <TrendingUp className="w-4 h-4 text-accent-green mx-auto mb-1" />
                      <p className="text-accent-green text-xs font-semibold">{result.marketOutlook}</p>
                      <p className="text-slate-500 text-xs">Market Outlook</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {result.strengths?.map(s => (
                    <span key={s} className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg">
                      <CheckCircle className="w-3 h-3" /> {s}
                    </span>
                  ))}
                </div>
                {result.weaknesses?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.weaknesses.map(w => (
                      <span key={w} className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg">
                        <AlertTriangle className="w-3 h-3" /> {w}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Career Paths */}
              {result.careerPaths?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent-green" /> Recommended Career Paths
                  </h2>
                  <div className="space-y-3">
                    {result.careerPaths.map(path => (
                      <div key={path.role} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                            <span className="text-white font-semibold">{path.role}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-accent-green text-sm font-bold">{path.matchScore}% match</span>
                              {path.demandLevel && (
                                <span className={`text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${demandColors[path.demandLevel] || 'text-slate-400'}`}>
                                  {path.demandLevel} demand
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-slate-400 text-xs mb-2">{path.description}</p>
                          <div className="flex flex-wrap gap-3 text-xs">
                            <span className="text-primary-400 font-medium">💰 {path.avgSalary}</span>
                            {path.timeToReady && <span className="text-slate-500">⏱ {path.timeToReady}</span>}
                          </div>
                          {path.missingSkills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {path.missingSkills.map(ms => (
                                <span key={ms} className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                  Missing: {ms}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="w-16 h-16 flex-shrink-0">
                          <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                            <circle cx="20" cy="20" r="16" fill="none" stroke="#10b981" strokeWidth="4"
                              strokeDasharray={`${path.matchScore} 100`} strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Gaps with enhanced info */}
              {result.skillGaps?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent-yellow" /> Skill Gaps to Fill
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.skillGaps.map(gap => (
                      <div key={gap.skill} className={`p-4 rounded-xl border ${priorityColors[gap.priority] || priorityColors.medium}`}>
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                          <span className="font-semibold text-white">{gap.skill}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs capitalize px-2 py-0.5 rounded-full border ${priorityColors[gap.priority]}`}>
                              {gap.priority}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-400 text-xs mb-2">{gap.reason}</p>
                        <div className="flex flex-wrap gap-2 text-xs mb-2">
                          <span className="text-slate-500">⏱ ~{gap.estimatedWeeks} weeks</span>
                          {gap.currentDemand && (
                            <span className={`font-medium ${demandColors[gap.currentDemand] || 'text-slate-400'}`}>
                              📊 {gap.currentDemand} demand
                            </span>
                          )}
                          {gap.salaryImpact && (
                            <span className="text-accent-green font-medium">💰 {gap.salaryImpact}</span>
                          )}
                        </div>
                        {gap.courses?.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/10">
                            <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" /> Suggested Courses:
                            </p>
                            <div className="space-y-1">
                              {gap.courses.slice(0, 2).map((c, ci) => (
                                <a key={ci} href={c.url || '#'} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors">
                                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{c.name || c}</span>
                                  {c.free !== undefined && (
                                    <span className={`ml-auto flex-shrink-0 px-1 rounded text-xs ${c.free ? 'text-green-400' : 'text-yellow-400'}`}>
                                      {c.free ? 'Free' : 'Paid'}
                                    </span>
                                  )}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Mastery Levels */}
              {result.skillMasteryLevels?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-accent-blue" /> Current Skill Mastery
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.skillMasteryLevels.map((item) => (
                      <div key={item.skill} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-medium">{item.skill}</span>
                            <span className="text-xs text-primary-400">{item.targetLevel}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>Current: <span className="text-yellow-400">{item.currentLevel}</span></span>
                            <span>→ Target: <span className="text-accent-green">{item.targetLevel}</span></span>
                          </div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-lg font-medium ${
                          item.gapSize === 'Small' ? 'bg-green-500/10 text-green-400' :
                          item.gapSize === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {item.gapSize || 'Gap'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Courses */}
              {result.suggestedCourses?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-accent-purple" /> Recommended Courses
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.suggestedCourses.map((course, i) => (
                      <a key={i} href={course.url || '#'} target="_blank" rel="noopener noreferrer"
                        className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/8 hover:border-primary-500/30 transition-all group">
                        <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-5 h-5 text-accent-purple" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm group-hover:text-primary-300 transition-colors">{course.name}</p>
                          <p className="text-slate-500 text-xs">{course.platform}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {course.duration && <span className="text-slate-600 text-xs">⏱ {course.duration}</span>}
                            {course.rating && <span className="text-yellow-400 text-xs">⭐ {course.rating}</span>}
                            {course.free !== undefined && (
                              <span className={`text-xs px-1.5 py-0.5 rounded ${course.free ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                {course.free ? 'Free' : 'Paid'}
                              </span>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-primary-400 flex-shrink-0 mt-0.5 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Roadmap */}
              {result.learningRoadmap?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent-cyan" /> Learning Roadmap
                  </h2>
                  <div className="space-y-3">
                    {result.learningRoadmap.map((step, i) => (
                      <div key={i} className={`flex gap-4 p-4 rounded-xl border transition-all ${completedSteps.includes(i) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm
                          ${completedSteps.includes(i) ? 'bg-green-500 text-white' : 'bg-primary-500/30 text-primary-400'}`}>
                          {completedSteps.includes(i) ? <CheckCircle className="w-4 h-4" /> : (step.step || i + 1)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className={`font-semibold ${completedSteps.includes(i) ? 'text-green-400 line-through' : 'text-white'}`}>{step.skill}</span>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-500">{step.weeks}w</span>
                              {step.marketDemand && (
                                <span className={`px-1.5 py-0.5 rounded bg-white/5 ${demandColors[step.marketDemand] || 'text-slate-400'}`}>
                                  {step.marketDemand}
                                </span>
                              )}
                              {step.priority && (
                                <span className={`px-1.5 py-0.5 rounded border capitalize text-xs ${priorityColors[step.priority]}`}>
                                  {step.priority}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {step.resources?.map(r => (
                              <span key={r} className="text-xs bg-white/5 text-slate-400 px-2 py-0.5 rounded">{r}</span>
                            ))}
                          </div>
                        </div>
                        {!completedSteps.includes(i) && (
                          <button onClick={() => markComplete(i)}
                            className="text-xs text-slate-500 hover:text-green-400 transition-colors flex-shrink-0 border border-white/10 hover:border-green-500/40 px-2 py-1 rounded-lg">
                            Done
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              {result.nextSteps?.length > 0 && (
                <div className="glass-card p-6 border border-accent-green/20">
                  <h2 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-accent-yellow" /> Your Next Steps
                  </h2>
                  <div className="space-y-2">
                    {result.nextSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <span className="w-6 h-6 rounded-full bg-accent-green/20 text-accent-green text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                        <span className="text-slate-300 text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Download PDF */}
              <button onClick={downloadPDF} className="btn-primary w-full flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download Full Analysis PDF
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
