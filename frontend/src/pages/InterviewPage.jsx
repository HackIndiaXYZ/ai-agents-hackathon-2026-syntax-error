import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Zap, ChevronRight, CheckCircle, Clock, Star, AlertCircle, RotateCcw, Send, Download, BookOpen, MessageSquare, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';

const INTERVIEW_TYPES = [
  { id: 'hr', label: 'HR Round', desc: 'Behavioral & personal questions', color: 'from-blue-500 to-cyan-500' },
  { id: 'technical', label: 'Technical Round', desc: 'Coding & technical concepts', color: 'from-purple-500 to-primary-500' },
  { id: 'behavioral', label: 'Behavioral', desc: 'Situational & STAR method', color: 'from-green-500 to-teal-500' },
  { id: 'mixed', label: 'Full Mock Interview', desc: 'Comprehensive practice session', color: 'from-orange-500 to-red-500' }
];

const difficultyColor = { easy: 'text-green-400', medium: 'text-yellow-400', hard: 'text-red-400' };

export default function InterviewPage() {
  const [step, setStep] = useState('setup'); // setup | interview | result
  const [targetRole, setTargetRole] = useState('');
  const [interviewType, setInterviewType] = useState('mixed');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    api.get('/career/skills/profile').then(r => {
      if (r.data.profile) {
        setTargetRole(r.data.profile.targetRole || '');
        setSkills(r.data.profile.currentSkills?.map(s => s.name).join(', ') || '');
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const startInterview = async () => {
    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
    if (!targetRole) return toast.error('Enter target role');
    setLoading(true);
    try {
      const { data } = await api.post('/career/interview/generate', {
        role: targetRole, type: interviewType, skills: skillList
      });
      setSession(data.session);
      setQuestions(data.session.questionDetails || []);
      setStep('interview');
      setTimerActive(true);
      toast.success('Mock interview started! Good luck 🎯');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
    } finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return toast.error('Please type an answer first');
    setEvaluating(true);
    setEvaluation(null);
    try {
      const { data } = await api.post('/career/interview/answer', {
        sessionId: session._id,
        questionIndex: currentQ,
        answer,
        question: questions[currentQ]?.question,
        role: targetRole
      });
      setEvaluation(data.evaluation);
    } catch (err) {
      toast.error('Evaluation failed');
    } finally { setEvaluating(false); }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setAnswer('');
      setEvaluation(null);
      textareaRef.current?.focus();
    } else {
      finishInterview();
    }
  };

  const finishInterview = async () => {
    setTimerActive(false);
    try {
      const { data } = await api.post('/career/interview/complete', { sessionId: session._id });
      setFinalResult(data);
      setStep('result');
      toast.success('Interview completed! 🎉');
    } catch { toast.error('Failed to complete session'); }
  };

  const scoreColor = (s) => s >= 8 ? 'text-green-400' : s >= 6 ? 'text-yellow-400' : 'text-red-400';
  const scoreBg = (s) => s >= 8 ? 'bg-green-500' : s >= 6 ? 'bg-yellow-500' : 'bg-red-500';

  const downloadGuide = () => {
    const type = INTERVIEW_TYPES.find(t => t.id === interviewType);
    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
      <title>Interview Guide - ${targetRole}</title>
      <style>
        body{font-family:'Segoe UI',sans-serif;padding:32px;max-width:750px;margin:0 auto;background:#fff;color:#1a1a2e}
        h1{color:#6366f1;font-size:26px;margin-bottom:4px}
        h2{color:#4f46e5;font-size:16px;margin:24px 0 8px;border-bottom:2px solid #e0e7ff;padding-bottom:6px}
        h3{color:#374151;font-size:14px;margin:12px 0 4px}
        p,li{color:#4b5563;font-size:13px;line-height:1.7}
        .tip{background:#f0fdf4;border-left:4px solid #10b981;padding:10px 14px;border-radius:4px;margin:8px 0}
        .warn{background:#fffbeb;border-left:4px solid #f59e0b;padding:10px 14px;border-radius:4px;margin:8px 0}
        .star{background:#eff6ff;border-left:4px solid #6366f1;padding:10px 14px;border-radius:4px;margin:8px 0}
        ul{padding-left:20px}
        .meta{color:#6b7280;font-size:12px;margin-bottom:24px}
        @media print{body{padding:16px}}
      </style></head><body>
      <h1>🎯 Interview Preparation Guide</h1>
      <div class="meta">
        <strong>Role:</strong> ${targetRole} &nbsp;|&nbsp;
        <strong>Type:</strong> ${type?.label || interviewType} &nbsp;|&nbsp;
        <strong>Skills:</strong> ${skillList.join(', ')}<br/>
        <strong>Generated:</strong> ${new Date().toLocaleDateString()}
      </div>

      <h2>📋 Before the Interview</h2>
      <ul>
        <li>Research the company thoroughly — products, culture, recent news</li>
        <li>Review the job description and match your skills to requirements</li>
        <li>Prepare 3-5 specific examples from your experience using STAR method</li>
        <li>Test your tech setup (camera, mic, internet) 30 minutes before</li>
        <li>Dress professionally even for remote interviews</li>
        <li>Prepare 3 thoughtful questions to ask the interviewer</li>
      </ul>

      <h2>🗣️ How to Behave & Communicate</h2>
      <div class="tip">Speak clearly and at a moderate pace. Pause briefly before answering to collect your thoughts — this shows confidence, not hesitation.</div>
      <ul>
        <li>Maintain eye contact (look at the camera for video calls)</li>
        <li>Use positive body language — sit upright, smile naturally</li>
        <li>Listen carefully to the full question before answering</li>
        <li>If you don't know something, say "I haven't worked with that directly, but here's how I'd approach it..."</li>
        <li>Avoid filler words (um, uh, like) — practice pausing instead</li>
        <li>Show enthusiasm for the role and company</li>
      </ul>

      <h2>⭐ STAR Method for Behavioral Questions</h2>
      <div class="star">
        <strong>S</strong>ituation — Set the context briefly<br/>
        <strong>T</strong>ask — What was your responsibility?<br/>
        <strong>A</strong>ction — What specific steps did YOU take?<br/>
        <strong>R</strong>esult — What was the measurable outcome?
      </div>
      <p>Example: "Tell me about a challenging project" → Describe the project (S), your role (T), the specific decisions you made (A), and the impact/result with numbers if possible (R).</p>

      ${interviewType === 'technical' || interviewType === 'mixed' ? `
      <h2>💻 Technical Round Tips for ${targetRole}</h2>
      <ul>
        <li>Think out loud — explain your reasoning as you solve problems</li>
        <li>Clarify requirements before jumping into solutions</li>
        <li>Start with a brute-force solution, then optimize</li>
        <li>Discuss time and space complexity of your solutions</li>
        <li>For ${skillList.slice(0,3).join(', ')} — review core concepts, common patterns, and recent updates</li>
        <li>Practice coding on a whiteboard or shared editor beforehand</li>
      </ul>` : ''}

      ${interviewType === 'hr' || interviewType === 'mixed' ? `
      <h2>👔 HR Round — Common Questions & Tips</h2>
      <ul>
        <li>"Tell me about yourself" — 2-minute structured pitch: background → skills → why this role</li>
        <li>"Why do you want this job?" — Connect your goals to the company's mission</li>
        <li>"What's your weakness?" — Choose a real weakness you're actively improving</li>
        <li>"Where do you see yourself in 5 years?" — Show ambition aligned with the company</li>
        <li>Salary negotiation: Research market rates, give a range, not a single number</li>
      </ul>` : ''}

      <h2>🚫 Common Mistakes to Avoid</h2>
      <div class="warn">
        <ul style="margin:0;padding-left:16px">
          <li>Badmouthing previous employers</li>
          <li>Giving vague answers without specific examples</li>
          <li>Not asking any questions at the end</li>
          <li>Lying or exaggerating your experience</li>
          <li>Checking your phone or being distracted</li>
          <li>Forgetting to follow up with a thank-you email</li>
        </ul>
      </div>

      <h2>📝 Key Topics to Study for ${targetRole}</h2>
      <ul>
        ${skillList.map(s => `<li><strong>${s}</strong> — core concepts, best practices, common interview questions</li>`).join('')}
        <li>System design basics (for senior roles)</li>
        <li>Data structures & algorithms fundamentals</li>
        <li>Version control (Git) workflows</li>
      </ul>

      <h2>✅ After the Interview</h2>
      <ul>
        <li>Send a thank-you email within 24 hours</li>
        <li>Note down questions you struggled with for future practice</li>
        <li>Follow up if you haven't heard back within the stated timeline</li>
      </ul>

      <p style="margin-top:32px;color:#9ca3af;font-size:11px;text-align:center">Generated by CareerIQ AI Platform — Good luck! 🍀</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
            <Mic className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Interview Prep Agent</h1>
            <p className="text-slate-400 text-sm">AI-powered mock interview with real-time feedback</p>
          </div>
          {step === 'interview' && (
            <div className="ml-auto flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <Clock className="w-4 h-4 text-accent-cyan" />
              <span className="text-white font-mono font-bold">{formatTime(timer)}</span>
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* SETUP */}
          {step === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="glass-card p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-300 font-medium mb-1.5 block">Target Role</label>
                    <input value={targetRole} onChange={e => setTargetRole(e.target.value)}
                      placeholder="e.g. React Developer, Data Analyst" className="input-field" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 font-medium mb-1.5 block">Your Skills</label>
                    <input value={skills} onChange={e => setSkills(e.target.value)}
                      placeholder="JavaScript, React, SQL..." className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-300 font-medium mb-3 block">Interview Type</label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {INTERVIEW_TYPES.map(type => (
                      <button key={type.id} onClick={() => setInterviewType(type.id)}
                        className={`p-4 rounded-xl border text-left transition-all
                          ${interviewType === type.id ? 'border-primary-500/60 bg-primary-500/15' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-2`}>
                          <Mic className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-white font-semibold text-sm">{type.label}</p>
                        <p className="text-slate-400 text-xs">{type.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button onClick={startInterview} disabled={loading}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="btn-primary flex-1 flex items-center justify-center gap-2">
                    {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Preparing...</> : <><Zap className="w-5 h-5" /> Start Mock Interview</>}
                  </motion.button>
                  <button onClick={downloadGuide}
                    className="btn-ghost flex items-center gap-2 px-4">
                    <Download className="w-4 h-4" /> Guide PDF
                  </button>
                </div>
              </div>

              {/* Notes to study */}
              <div className="glass-card p-5 border border-accent-cyan/20">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent-cyan" /> Quick Study Notes
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                    <p className="text-accent-cyan font-semibold mb-1">STAR Method</p>
                    <p className="text-slate-400 text-xs">Situation → Task → Action → Result. Use for all behavioral questions.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                    <p className="text-accent-green font-semibold mb-1">Body Language</p>
                    <p className="text-slate-400 text-xs">Eye contact, upright posture, smile. Pause before answering.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                    <p className="text-accent-yellow font-semibold mb-1">Technical Tips</p>
                    <p className="text-slate-400 text-xs">Think out loud. Clarify before solving. Start simple, then optimize.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                    <p className="text-accent-purple font-semibold mb-1">HR Tips</p>
                    <p className="text-slate-400 text-xs">Research the company. Prepare 3 questions to ask. Follow up after.</p>
                  </div>
                </div>
              </div>

              {/* History */}
              <InterviewHistory />
            </motion.div>
          )}

          {/* INTERVIEW */}
          {step === 'interview' && questions.length > 0 && (
            <motion.div key="interview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Progress */}
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Question {currentQ + 1} of {questions.length}</span>
                  <span className={`text-xs capitalize font-medium ${difficultyColor[questions[currentQ]?.difficulty]}`}>
                    {questions[currentQ]?.difficulty}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-accent-purple rounded-full transition-all duration-500"
                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                </div>
              </div>

              {/* Question */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs capitalize px-2 py-0.5 rounded-full border
                    ${questions[currentQ]?.category === 'hr' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' :
                      questions[currentQ]?.category === 'technical' ? 'text-purple-400 bg-purple-500/10 border-purple-500/30' :
                      'text-green-400 bg-green-500/10 border-green-500/30'}`}>
                    {questions[currentQ]?.category}
                  </span>
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {questions[currentQ]?.timeLimit}s suggested
                  </span>
                </div>

                <h2 className="text-white text-lg font-bold mb-3 leading-relaxed">
                  {questions[currentQ]?.question}
                </h2>

                {questions[currentQ]?.hint && (
                  <p className="text-slate-500 text-xs italic mb-4">💡 Hint: {questions[currentQ].hint}</p>
                )}

                <textarea
                  ref={textareaRef}
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Type your answer here... Be clear, specific, and use examples where possible."
                  rows={5}
                  className="input-field resize-none w-full mb-4"
                />

                <div className="flex gap-3">
                  <motion.button onClick={submitAnswer} disabled={evaluating || !answer.trim()}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="btn-primary flex items-center gap-2">
                    {evaluating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    {evaluating ? 'Evaluating...' : 'Submit Answer'}
                  </motion.button>
                  <button onClick={nextQuestion} className="btn-ghost flex items-center gap-2">
                    {currentQ < questions.length - 1 ? 'Skip' : 'Finish'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Evaluation Feedback */}
              <AnimatePresence>
                {evaluation && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 border-l-4 border-primary-500">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-white font-bold">AI Feedback</h3>
                      <div className={`ml-auto text-2xl font-black ${scoreColor(evaluation.score)}`}>
                        {evaluation.score}/10
                      </div>
                    </div>

                    <div className="w-full h-2 bg-white/10 rounded-full mb-4">
                      <div className={`h-full rounded-full ${scoreBg(evaluation.score)} transition-all duration-1000`}
                        style={{ width: `${evaluation.score * 10}%` }} />
                    </div>

                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">{evaluation.feedback}</p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {evaluation.strengths?.length > 0 && (
                        <div>
                          <p className="text-green-400 font-semibold text-sm mb-2">✅ Strengths</p>
                          {evaluation.strengths.map((s, i) => (
                            <p key={i} className="text-slate-400 text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-400" /> {s}</p>
                          ))}
                        </div>
                      )}
                      {evaluation.improvements?.length > 0 && (
                        <div>
                          <p className="text-yellow-400 font-semibold text-sm mb-2">💡 Improve</p>
                          {evaluation.improvements.map((s, i) => (
                            <p key={i} className="text-slate-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3 text-yellow-400" /> {s}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    {evaluation.betterAnswer && (
                      <div className="mt-4 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                        <p className="text-primary-400 font-semibold text-xs mb-1">Model Answer:</p>
                        <p className="text-slate-300 text-xs leading-relaxed">{evaluation.betterAnswer}</p>
                      </div>
                    )}

                    <button onClick={nextQuestion}
                      className="mt-4 btn-primary flex items-center gap-2 w-full justify-center">
                      {currentQ < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* RESULTS */}
          {step === 'result' && finalResult && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
              {/* Score Card */}
              <div className="glass-card p-8 text-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-purple/20 border-2 border-primary-500/40 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-black text-white">{finalResult.overallScore}%</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">
                  {finalResult.overallScore >= 80 ? '🎉 Excellent Performance!' :
                   finalResult.overallScore >= 65 ? '👍 Good Effort!' :
                   finalResult.overallScore >= 50 ? '💪 Decent Attempt!' : '📚 Keep Practicing!'}
                </h2>
                <p className="text-slate-400 mb-2">Interview completed in {formatTime(timer)}</p>
                {finalResult.performanceLevel && (
                  <span className={`text-sm px-3 py-1 rounded-full border font-semibold ${
                    finalResult.performanceLevel === 'Excellent' ? 'text-green-400 border-green-500/40 bg-green-500/10' :
                    finalResult.performanceLevel === 'Good' ? 'text-blue-400 border-blue-500/40 bg-blue-500/10' :
                    finalResult.performanceLevel === 'Average' ? 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10' :
                    'text-red-400 border-red-500/40 bg-red-500/10'
                  }`}>
                    {finalResult.performanceLevel}
                  </span>
                )}
              </div>

              {/* Performance Report */}
              {finalResult.report && (
                <div className="glass-card p-6 border-l-4 border-primary-500">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" /> Performance Report
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">{finalResult.report.summary}</p>

                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/8 text-center">
                      <div className="text-2xl font-black text-primary-400">{finalResult.answeredCount || 0}/{finalResult.totalQuestions || 0}</div>
                      <div className="text-xs text-slate-500">Questions Answered</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/8 text-center">
                      <div className={`text-2xl font-black ${finalResult.readinessScore >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>{finalResult.readinessScore || 0}%</div>
                      <div className="text-xs text-slate-500">Interview Readiness</div>
                    </div>
                  </div>

                  {finalResult.report.nextSteps?.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-400 font-semibold mb-2">Next Steps:</p>
                      {finalResult.report.nextSteps.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-300 mb-1">
                          <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-xs flex items-center justify-center font-bold flex-shrink-0">{i+1}</span>
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Strengths & Improvements */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Strengths
                  </h3>
                  {finalResult.session?.strengths?.length > 0 ? finalResult.session.strengths.map((s, i) => (
                    <p key={i} className="text-slate-300 text-sm mb-1.5 flex items-start gap-2">
                      <span className="text-green-400 flex-shrink-0">•</span> {s}
                    </p>
                  )) : <p className="text-slate-500 text-sm">Keep practicing to identify strengths.</p>}
                </div>
                <div className="glass-card p-5">
                  <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Areas to Improve
                  </h3>
                  {finalResult.session?.improvements?.length > 0 ? finalResult.session.improvements.map((s, i) => (
                    <p key={i} className="text-slate-300 text-sm mb-1.5 flex items-start gap-2">
                      <span className="text-yellow-400 flex-shrink-0">•</span> {s}
                    </p>
                  )) : <p className="text-slate-500 text-sm">Great job! Focus on depth in answers.</p>}
                </div>
              </div>

              {/* Learning Resources */}
              <div className="glass-card p-5 border border-accent-cyan/20">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent-cyan" /> Recommended Resources
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    { name: 'LeetCode Practice', url: 'https://leetcode.com/problemset/', desc: 'Technical interview prep' },
                    { name: 'STAR Method Guide', url: 'https://www.themuse.com/advice/star-interview-method', desc: 'Behavioral questions' },
                    { name: 'Pramp Mock Interviews', url: 'https://www.pramp.com/', desc: 'Free mock interviews' },
                    { name: 'Interview Cake', url: 'https://www.interviewcake.com/', desc: 'Structured interview prep' },
                  ].map(r => (
                    <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/8 hover:border-primary-500/30 transition-all group">
                      <div className="w-7 h-7 rounded-lg bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-3 h-3 text-accent-cyan" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium group-hover:text-primary-300">{r.name}</p>
                        <p className="text-slate-500 text-xs">{r.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={downloadGuide} className="btn-ghost flex-1 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download Guide PDF
                </button>
                <button onClick={() => { setStep('setup'); setCurrentQ(0); setAnswer(''); setEvaluation(null); setTimer(0); setFinalResult(null); }}
                  className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Practice Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

function InterviewHistory() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    api.get('/career/interview/history').then(r => setHistory(r.data.sessions || [])).catch(() => {});
  }, []);

  if (!history.length) return null;

  return (
    <div className="glass-card p-5">
      <h3 className="text-white font-bold mb-4">Recent Interviews</h3>
      <div className="space-y-3">
        {history.slice(0, 3).map(s => (
          <div key={s._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div>
              <p className="text-white text-sm font-medium">{s.targetRole}</p>
              <p className="text-slate-500 text-xs capitalize">{s.type} • {new Date(s.createdAt).toLocaleDateString()}</p>
            </div>
            <div className={`text-lg font-black ${s.overallScore >= 70 ? 'text-green-400' : s.overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {s.overallScore}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
