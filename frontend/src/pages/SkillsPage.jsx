import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Plus, X, Zap, Target, TrendingUp, CheckCircle, BookOpen, ExternalLink, GraduationCap, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

const PRESET_SKILLS = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'Git', 'TypeScript', 'Express.js', 'PHP', 'Django', 'Flutter', 'Android', 'Machine Learning', 'Data Analysis', 'Figma', 'Adobe XD'];
const EXPERIENCE_LEVELS = [{ value: 'fresher', label: 'Fresher (0 years)' }, { value: 'junior', label: 'Junior (1-2 years)' }, { value: 'mid', label: 'Mid Level (3-5 years)' }, { value: 'senior', label: 'Senior (5+ years)' }];
const TARGET_ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer', 'Data Analyst', 'Machine Learning Engineer', 'DevOps Engineer', 'UI/UX Designer', 'QA Engineer', 'Product Manager'];

const priorityColors = { high: 'text-red-400 bg-red-500/10 border-red-500/30', medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', low: 'text-green-400 bg-green-500/10 border-green-500/30' };

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [inputSkill, setInputSkill] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('fresher');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [existingProfile, setExistingProfile] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    api.get('/career/skills/profile').then(r => {
      if (r.data.profile) {
        setExistingProfile(r.data.profile);
        setSkills(r.data.profile.currentSkills?.map(s => s.name) || []);
        setTargetRole(r.data.profile.targetRole || '');
        setExperienceLevel(r.data.profile.experienceLevel || 'fresher');
        const completed = r.data.profile.learningRoadmap?.filter(r => r.completed).map((_, i) => i) || [];
        setCompletedSteps(completed);
      }
    }).catch(() => {});
  }, []);

  const addSkill = (s) => {
    const skill = (typeof s === 'string' ? s : inputSkill).trim();
    if (!skill) return;
    if (skills.includes(skill)) return toast.error('Skill already added');
    setSkills(prev => [...prev, skill]);
    setInputSkill('');
  };

  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s));

  const handleAnalyze = async () => {
    if (!skills.length) return toast.error('Add at least one skill');
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/career/skills/analyze', { skills, targetRole, experienceLevel });
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

  const downloadPDF = () => {
    if (!result) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
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
        .path-title{font-weight:700;font-size:13px;color:#1d4ed8}
        .path-score{float:right;font-weight:800;color:#059669}
        .step{display:flex;gap:10px;padding:8px;background:#f9fafb;border-radius:6px;margin:5px 0;align-items:flex-start}
        .step-num{background:#6366f1;color:#fff;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
        .course{background:#faf5ff;border:1px solid #e9d5ff;padding:8px 12px;border-radius:6px;margin:4px 0;font-size:12px}
        .course-name{font-weight:600;color:#7c3aed}
        .course-meta{color:#9ca3af;font-size:11px}
        .next-step{padding:6px 12px;background:#f0fdf4;border-left:3px solid #10b981;border-radius:4px;margin:4px 0;font-size:13px;color:#065f46}
        ul{padding-left:20px}
        @media print{body{padding:16px}}
      </style></head><body>
      <h1>🧠 Skill Analysis Report</h1>
      <div class="meta">
        <strong>Skills:</strong> ${skills.join(', ')} &nbsp;|&nbsp;
        <strong>Target Role:</strong> ${targetRole || 'Not specified'} &nbsp;|&nbsp;
        <strong>Experience:</strong> ${experienceLevel}<br/>
        <strong>Generated:</strong> ${new Date().toLocaleDateString()}
      </div>

      <div style="display:flex;align-items:center;gap:16px;margin-bottom:8px">
        <div class="score">${result.overallReadiness}%</div>
        <div>
          <div style="font-weight:700;font-size:16px;color:#111">Overall Career Readiness</div>
          <div style="color:#6b7280;font-size:13px">for ${targetRole || 'your target role'}</div>
        </div>
      </div>

      <div class="summary">${result.summary}</div>

      ${result.strengths?.length ? `
        <h2>✅ Your Strengths</h2>
        ${result.strengths.map(s => `<div class="strength">✓ ${s}</div>`).join('')}
      ` : ''}

      ${result.careerPaths?.length ? `
        <h2>🚀 Recommended Career Paths</h2>
        ${result.careerPaths.map(p => `
          <div class="path">
            <span class="path-title">${p.role}</span>
            <span class="path-score">${p.matchScore}% match</span>
            <div style="clear:both;margin-top:4px;font-size:12px;color:#4b5563">${p.description}</div>
            <div style="font-size:12px;color:#6366f1;margin-top:2px">💰 ${p.avgSalary}</div>
          </div>
        `).join('')}
      ` : ''}

      ${result.skillGaps?.length ? `
        <h2>🎯 Skill Gaps to Fill</h2>
        ${result.skillGaps.map(g => `
          <div class="gap ${g.priority}">
            <div class="gap-title">${g.skill}<span class="badge ${g.priority}">${g.priority}</span></div>
            <div class="gap-reason">${g.reason}</div>
            <div style="font-size:11px;color:#9ca3af;margin-top:2px">⏱ ~${g.estimatedWeeks} weeks to learn</div>
            ${g.courses?.length ? `<div style="margin-top:6px;font-size:11px;color:#6b7280">Courses: ${g.courses.map(c => c.name || c).join(', ')}</div>` : ''}
          </div>
        `).join('')}
      ` : ''}

      ${result.learningRoadmap?.length ? `
        <h2>📚 Learning Roadmap</h2>
        ${result.learningRoadmap.map((step, i) => `
          <div class="step">
            <div class="step-num">${step.step || i+1}</div>
            <div>
              <div style="font-weight:600;font-size:13px;color:#111">${step.skill}</div>
              <div style="font-size:11px;color:#9ca3af">⏱ ${step.weeks} weeks &nbsp;|&nbsp; Resources: ${step.resources?.join(', ')}</div>
            </div>
          </div>
        `).join('')}
      ` : ''}

      ${result.suggestedCourses?.length ? `
        <h2>🎓 Suggested Courses</h2>
        ${result.suggestedCourses.map(c => `
          <div class="course">
            <div class="course-name">${c.name}</div>
            <div class="course-meta">${c.platform} &nbsp;·&nbsp; ${c.duration} &nbsp;·&nbsp; ${c.free ? 'Free' : 'Paid'} &nbsp;·&nbsp; ${c.url}</div>
          </div>
        `).join('')}
      ` : ''}

      ${result.nextSteps?.length ? `
        <h2>⚡ Your Next Steps</h2>
        ${result.nextSteps.map((s, i) => `<div class="next-step">${i+1}. ${s}</div>`).join('')}
      ` : ''}

      <p style="margin-top:32px;color:#9ca3af;font-size:11px;text-align:center">Generated by CareerIQ AI Platform</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

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
            <p className="text-slate-400 text-sm">AI-powered career gap analysis and learning roadmap</p>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-5">
          {/* Skills Input */}
          <div>
            <label className="text-sm text-slate-300 font-medium mb-2 block">Your Current Skills</label>
            <div className="flex gap-2 mb-3">
              <input
                value={inputSkill}
                onChange={e => setInputSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="Type a skill and press Enter..."
                className="input-field flex-1"
              />
              <motion.button onClick={() => addSkill()} whileTap={{ scale: 0.95 }} className="btn-primary px-4 py-2">
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Preset skills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_SKILLS.filter(s => !skills.includes(s)).map(s => (
                <button key={s} onClick={() => addSkill(s)}
                  className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 transition-all">
                  + {s}
                </button>
              ))}
            </div>

            {/* Selected skills */}
            {skills.length > 0 && (
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
            )}
          </div>

          {/* Target Role & Experience */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 font-medium mb-2 block">Target Role</label>
              <select value={targetRole} onChange={e => setTargetRole(e.target.value)} className="input-field">
                <option value="">Select target role...</option>
                {TARGET_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
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
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing your profile...</>
            ) : (
              <><Zap className="w-5 h-5" /> Analyze Skills with AI</>
            )}
          </motion.button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

              {/* Download Button */}
              <div className="flex justify-end">
                <button onClick={downloadPDF}
                  className="btn-ghost flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" /> Download PDF Report
                </button>
              </div>

              {/* Summary Card */}
              <div className="glass-card p-6 border-l-4 border-primary-500">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-6 h-6 text-primary-400" />
                  <h2 className="text-white font-bold text-lg">AI Analysis Summary</h2>
                  <span className="ml-auto text-2xl font-black text-primary-400">{result.overallReadiness}%</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{result.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.strengths?.map(s => (
                    <span key={s} className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg">
                      <CheckCircle className="w-3 h-3" /> {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Career Paths */}
              <div className="glass-card p-6">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent-green" /> Recommended Career Paths
                </h2>
                <div className="space-y-3">
                  {result.careerPaths?.map(path => (
                    <div key={path.role} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/8">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-semibold">{path.role}</span>
                          <span className="text-accent-green text-sm font-bold">{path.matchScore}% match</span>
                        </div>
                        <p className="text-slate-400 text-xs mb-2">{path.description}</p>
                        <p className="text-primary-400 text-xs">💰 {path.avgSalary}</p>
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

              {/* Skill Gaps */}
              <div className="glass-card p-6">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent-yellow" /> Skill Gaps to Fill
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {result.skillGaps?.map(gap => (
                    <div key={gap.skill} className={`p-4 rounded-xl border ${priorityColors[gap.priority] || priorityColors.medium}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white">{gap.skill}</span>
                        <span className={`text-xs capitalize px-2 py-0.5 rounded-full border ${priorityColors[gap.priority]}`}>{gap.priority}</span>
                      </div>
                      <p className="text-slate-400 text-xs mb-1">{gap.reason}</p>
                      <p className="text-slate-500 text-xs">⏱ ~{gap.estimatedWeeks} weeks to learn</p>
                      {gap.courses?.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Suggested Courses:</p>
                          <div className="space-y-1">
                            {gap.courses.map((c, ci) => (
                              <a key={ci} href={c.url || '#'} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors">
                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{c.name || c}</span>
                                {c.platform && <span className="text-slate-600 ml-auto flex-shrink-0">({c.platform})</span>}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Courses Section */}
              {result.suggestedCourses?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-accent-purple" /> Recommended Courses to Improve
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
                          {course.duration && <p className="text-slate-600 text-xs mt-0.5">⏱ {course.duration}</p>}
                          {course.free !== undefined && (
                            <span className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${course.free ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                              {course.free ? 'Free' : 'Paid'}
                            </span>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-primary-400 flex-shrink-0 mt-0.5 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Roadmap */}
              <div className="glass-card p-6">
                <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent-cyan" /> Learning Roadmap
                </h2>
                <div className="space-y-3">
                  {result.learningRoadmap?.map((step, i) => (
                    <div key={i} className={`flex gap-4 p-4 rounded-xl border transition-all ${completedSteps.includes(i) ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/8'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm
                        ${completedSteps.includes(i) ? 'bg-green-500 text-white' : 'bg-primary-500/30 text-primary-400'}`}>
                        {completedSteps.includes(i) ? <CheckCircle className="w-4 h-4" /> : step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${completedSteps.includes(i) ? 'text-green-400 line-through' : 'text-white'}`}>{step.skill}</span>
                          <span className="text-slate-500 text-xs">{step.weeks}w</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {step.resources?.map(r => (
                            <span key={r} className="text-xs bg-white/5 text-slate-400 px-2 py-0.5 rounded">{r}</span>
                          ))}
                        </div>
                      </div>
                      {!completedSteps.includes(i) && (
                        <button onClick={() => markComplete(i)}
                          className="text-xs text-slate-500 hover:text-green-400 transition-colors flex-shrink-0">
                          Mark done
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="glass-card p-6 border border-accent-green/20">
                <h2 className="text-white font-bold mb-3">🚀 Your Next Steps</h2>
                <div className="space-y-2">
                  {result.nextSteps?.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
                      <span className="w-6 h-6 rounded-full bg-accent-green/20 text-accent-green text-xs flex items-center justify-center font-bold">{i + 1}</span>
                      <span className="text-slate-300 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Download */}
              <button onClick={downloadPDF}
                className="btn-primary w-full flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download Full Analysis PDF
              </button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
