import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, CheckCircle, Calendar, Clock, Lightbulb, Star, RefreshCw, Download, ArrowRight, BookOpen, Briefcase, Mic, Brain, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

const DURATION_OPTIONS = [
  { value: 30, label: '30 Days', desc: 'Quick sprint' },
  { value: 60, label: '60 Days', desc: 'Focused plan' },
  { value: 90, label: '90 Days', desc: 'Full roadmap' },
  { value: 120, label: '4 Months', desc: 'Deep dive' },
  { value: 180, label: '6 Months', desc: 'Career shift' },
];

const NEXT_STEPS = [
  { icon: Brain, label: 'Analyze Skills', desc: 'Find your skill gaps', path: '/skills', color: 'bg-primary-500' },
  { icon: BookOpen, label: 'Build Resume', desc: 'Create ATS-optimized resume', path: '/resume', color: 'bg-accent-purple' },
  { icon: Briefcase, label: 'Find Jobs', desc: 'Match with top roles', path: '/jobs', color: 'bg-accent-blue' },
  { icon: Mic, label: 'Practice Interview', desc: 'Mock interview prep', path: '/interview', color: 'bg-accent-cyan' },
  { icon: MapPin, label: 'Local Opportunities', desc: 'Jobs near you', path: '/opportunities', color: 'bg-accent-yellow' },
];

const weekColors = ['from-primary-500 to-accent-purple', 'from-accent-cyan to-accent-blue', 'from-accent-green to-teal-500', 'from-accent-yellow to-orange-500'];

export default function RoadmapPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [skills, setSkills] = useState('');
  const [duration, setDuration] = useState(90);
  const [completedMilestones, setCompletedMilestones] = useState([]);
  const printRef = useRef(null);

  useEffect(() => {
    api.get('/career/skills/profile').then(r => {
      if (r.data.profile) {
        setTargetRole(r.data.profile.targetRole || '');
        setSkills(r.data.profile.currentSkills?.map(s => s.name).join(', ') || '');
      }
    }).catch(() => {});
  }, []);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/career/roadmap', {
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        targetRole,
        duration
      });
      setResult(data.result);
      setCompletedMilestones([]);
      toast.success(`${duration}-day roadmap generated! 🗺️`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally { setLoading(false); }
  };

  const toggleMilestone = (day) => {
    setCompletedMilestones(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const downloadPDF = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
      <title>Career Roadmap - ${targetRole || 'My Plan'}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #fff; color: #1a1a2e; padding: 32px; max-width: 800px; margin: 0 auto; }
        h1 { color: #6366f1; font-size: 28px; margin-bottom: 4px; }
        h2 { color: #4f46e5; font-size: 18px; margin: 24px 0 8px; border-bottom: 2px solid #e0e7ff; padding-bottom: 6px; }
        h3 { color: #374151; font-size: 15px; margin: 12px 0 4px; }
        p, li { color: #4b5563; font-size: 14px; line-height: 1.6; }
        .phase { background: #f5f3ff; border-left: 4px solid #6366f1; padding: 12px 16px; margin: 12px 0; border-radius: 4px; }
        .milestone { display: flex; align-items: center; gap: 8px; padding: 8px; background: #f9fafb; border-radius: 6px; margin: 6px 0; }
        .day-badge { background: #6366f1; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .routine-item { background: #ecfdf5; border-left: 3px solid #10b981; padding: 8px 12px; margin: 6px 0; border-radius: 4px; }
        .next-step { background: #eff6ff; border: 1px solid #bfdbfe; padding: 10px; border-radius: 8px; margin: 6px 0; }
        .header-meta { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
        ul { padding-left: 20px; }
        @media print { body { padding: 16px; } }
      </style></head><body>
      <h1>🗺️ Career Roadmap</h1>
      <div class="header-meta">
        <strong>Target Role:</strong> ${targetRole || 'Not specified'} &nbsp;|&nbsp;
        <strong>Duration:</strong> ${duration} Days &nbsp;|&nbsp;
        <strong>Skills:</strong> ${skills || 'Not specified'}<br/>
        <strong>Generated:</strong> ${new Date().toLocaleDateString()}
      </div>
      ${result?.motivationalTip ? `<div class="phase"><em>"${result.motivationalTip}"</em></div>` : ''}
      <h2>📅 ${duration}-Day Timeline</h2>
      ${Object.entries(result?.roadmap || {}).map(([key, phase], idx) => `
        <div class="phase">
          <h3>${['Week 1-2','Week 3-4','Month 2','Month 3'][idx] || key} — ${phase.focus}</h3>
          <p><strong>Goal:</strong> ${phase.goal}</p>
          <ul>${phase.tasks?.map(t => `<li>${t}</li>`).join('') || ''}</ul>
        </div>
      `).join('')}
      ${result?.dailyRoutine?.length ? `
        <h2>⏰ Daily Routine</h2>
        ${result.dailyRoutine.map((item, i) => `<div class="routine-item">${i+1}. ${item}</div>`).join('')}
      ` : ''}
      ${result?.milestones?.length ? `
        <h2>🏆 Key Milestones</h2>
        ${result.milestones.map(m => `
          <div class="milestone">
            <span class="day-badge">Day ${m.day}</span>
            <span>${m.milestone}</span>
          </div>
        `).join('')}
      ` : ''}
      <h2>🚀 Next Steps to Take</h2>
      ${NEXT_STEPS.map(s => `<div class="next-step"><strong>${s.label}</strong> — ${s.desc}</div>`).join('')}
      <p style="margin-top:32px;color:#9ca3af;font-size:12px;text-align:center;">Generated by CareerIQ AI Platform</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const weekKeys = Object.keys(result?.roadmap || {});
  const weekLabels = { week1_2: 'Week 1-2', week3_4: 'Week 3-4', month2: 'Month 2', month3: 'Month 3' };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-green to-teal-500 flex items-center justify-center">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Career Roadmap Agent</h1>
            <p className="text-slate-400 text-sm">Your personalized action plan to get hired — start here, then follow the steps</p>
          </div>
        </motion.div>

        {/* Generate Form */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 font-medium mb-1.5 block">Target Role</label>
              <input value={targetRole} onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Developer" className="input-field" />
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium mb-1.5 block">Current Skills</label>
              <input value={skills} onChange={e => setSkills(e.target.value)}
                placeholder="HTML, CSS, JavaScript..." className="input-field" />
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="text-sm text-slate-300 font-medium mb-3 block">Roadmap Duration</label>
            <div className="grid grid-cols-5 gap-2">
              {DURATION_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setDuration(opt.value)}
                  className={`p-3 rounded-xl border text-center transition-all
                    ${duration === opt.value
                      ? 'border-primary-500/60 bg-primary-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}>
                  <p className="font-bold text-sm">{opt.label}</p>
                  <p className="text-xs opacity-70 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <motion.button onClick={generate} disabled={loading}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="btn-primary w-full flex items-center justify-center gap-2">
            {loading
              ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating your roadmap...</>
              : <><Zap className="w-5 h-5" /> Generate My {duration}-Day Plan</>}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div ref={printRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

              {/* Download Button */}
              <div className="flex justify-end">
                <button onClick={downloadPDF}
                  className="btn-ghost flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>

              {/* Motivational Tip */}
              <div className="glass-card p-5 border border-accent-yellow/30 bg-accent-yellow/5">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-accent-yellow flex-shrink-0 mt-0.5" />
                  <p className="text-slate-200 text-sm leading-relaxed italic">"{result.motivationalTip}"</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-400" /> {duration}-Day Timeline
                </h2>
                {weekKeys.map((key, idx) => {
                  const phase = result.roadmap?.[key];
                  if (!phase) return null;
                  return (
                    <motion.div key={key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${weekColors[idx % weekColors.length]} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <span className="text-white text-xs font-bold">{idx + 1}</span>
                        </div>
                        {idx < weekKeys.length - 1 && (
                          <div className="w-0.5 h-full mt-2 bg-white/10 min-h-8" />
                        )}
                      </div>
                      <div className="flex-1 glass-card p-5 mb-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-bold bg-gradient-to-r ${weekColors[idx % weekColors.length]} bg-clip-text text-transparent`}>
                            {weekLabels[key] || key}
                          </span>
                          <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-lg">{phase.focus}</span>
                        </div>
                        <p className="text-slate-300 text-sm font-medium mb-3">🎯 Goal: {phase.goal}</p>
                        <div className="space-y-2">
                          {phase.tasks?.map((task, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                              <CheckCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                              <span className="text-slate-300 text-sm">{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Daily Routine */}
              {result.dailyRoutine?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent-cyan" /> Recommended Daily Routine
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {result.dailyRoutine.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                        <span className="w-7 h-7 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                        <span className="text-slate-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weekly Goals */}
              {result.weeklyGoals?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent-purple" /> Weekly Goals
                  </h2>
                  <div className="space-y-2">
                    {result.weeklyGoals.map((goal, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                        <span className="w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple text-xs font-bold flex items-center justify-center flex-shrink-0">W{i+1}</span>
                        <span className="text-slate-300 text-sm">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Goals */}
              {result.monthlyGoals?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent-green" /> Monthly Goals
                  </h2>
                  <div className="space-y-2">
                    {result.monthlyGoals.map((goal, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-accent-green/5 border border-accent-green/20">
                        <span className="w-7 h-7 rounded-full bg-accent-green/20 text-accent-green text-xs font-bold flex items-center justify-center flex-shrink-0">M{i+1}</span>
                        <span className="text-slate-300 text-sm">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Milestones */}
              {result.milestones?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent-yellow" /> Key Milestones
                  </h2>
                  <div className="space-y-3">
                    {result.milestones.map((m, i) => (
                      <motion.div key={i} whileHover={{ scale: 1.01 }}
                        onClick={() => toggleMilestone(m.day)}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all
                          ${completedMilestones.includes(m.day)
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-white/5 border-white/8 hover:border-white/20'}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                          ${completedMilestones.includes(m.day) ? 'bg-green-500/20' : 'bg-white/5'}`}>
                          {completedMilestones.includes(m.day)
                            ? <CheckCircle className="w-6 h-6 text-green-400" />
                            : <span className="text-white font-black text-sm">D{m.day}</span>}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${completedMilestones.includes(m.day) ? 'text-green-400 line-through' : 'text-white'}`}>
                            {m.milestone}
                          </p>
                          <p className="text-slate-500 text-xs">Day {m.day} target</p>
                        </div>
                        <span className="text-slate-600 text-xs">{completedMilestones.includes(m.day) ? '✓ Done' : 'Tap to complete'}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Steps Guide */}
              <div className="glass-card p-6 border border-primary-500/20">
                <h2 className="text-white font-bold mb-2 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-primary-400" /> Follow These Steps Next
                </h2>
                <p className="text-slate-400 text-sm mb-4">Your roadmap is ready. Now complete each step below to maximize your chances of getting hired.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {NEXT_STEPS.map((step, i) => (
                    <Link key={step.path} to={step.path}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:border-primary-500/30 transition-all cursor-pointer group">
                        <div className={`w-9 h-9 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0`}>
                          <step.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold">{step.label}</p>
                          <p className="text-slate-500 text-xs truncate">{step.desc}</p>
                        </div>
                        <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/20 transition-all">
                          <span className="text-slate-500 text-xs group-hover:text-primary-400">→</span>
                        </span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={generate} disabled={loading}
                  className="btn-ghost flex-1 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
                <button onClick={downloadPDF}
                  className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
