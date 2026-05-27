import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Zap, CheckCircle, AlertCircle, Plus, Trash2, Save, Download, Upload, Layout, User, Columns } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const TABS = ['Personal Info', 'Summary', 'Experience', 'Education', 'Skills', 'Projects'];

const TEMPLATES = [
  { id: 'modern', label: 'Modern', desc: 'Clean single-column with color accents', icon: Layout },
  { id: 'professional', label: 'Professional', desc: 'Classic two-column layout', icon: Columns },
  { id: 'minimal', label: 'Minimal', desc: 'Simple, ATS-friendly format', icon: User },
];

const defaultResume = {
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
  summary: '',
  experience: [{ company: '', role: '', duration: '', description: '', achievements: [''] }],
  education: [{ degree: '', institution: '', year: '', grade: '' }],
  skills: [''],
  projects: [{ name: '', description: '', tech: [''], link: '' }]
};

// Resume preview templates
function ResumePreview({ resume, template }) {
  const p = resume.personalInfo || {};
  const isModern = template === 'modern';
  const isProfessional = template === 'professional';
  const isMinimal = template === 'minimal';

  if (isProfessional) {
    return (
      <div className="bg-white text-gray-900 text-xs font-sans min-h-[600px] flex">
        {/* Left sidebar */}
        <div className="w-1/3 bg-indigo-700 text-white p-4 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center mx-auto mb-2 text-2xl font-bold">
              {p.fullName?.charAt(0) || 'A'}
            </div>
            <h1 className="font-bold text-sm leading-tight">{p.fullName || 'Your Name'}</h1>
          </div>
          <div className="space-y-1">
            <p className="text-indigo-200 font-semibold text-xs uppercase tracking-wide">Contact</p>
            {p.email && <p className="text-xs break-all">{p.email}</p>}
            {p.phone && <p className="text-xs">{p.phone}</p>}
            {p.location && <p className="text-xs">{p.location}</p>}
            {p.linkedin && <p className="text-xs break-all">{p.linkedin}</p>}
            {p.github && <p className="text-xs break-all">{p.github}</p>}
          </div>
          {resume.skills?.filter(Boolean).length > 0 && (
            <div>
              <p className="text-indigo-200 font-semibold text-xs uppercase tracking-wide mb-1">Skills</p>
              <div className="flex flex-wrap gap-1">
                {resume.skills.filter(Boolean).map((s, i) => (
                  <span key={i} className="bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Right content */}
        <div className="flex-1 p-4 space-y-3">
          {resume.summary && (
            <div>
              <h2 className="text-indigo-700 font-bold text-xs uppercase tracking-wide border-b border-indigo-200 pb-1 mb-1">Profile</h2>
              <p className="text-gray-600 text-xs leading-relaxed">{resume.summary}</p>
            </div>
          )}
          {resume.experience?.filter(e => e.company || e.role).length > 0 && (
            <div>
              <h2 className="text-indigo-700 font-bold text-xs uppercase tracking-wide border-b border-indigo-200 pb-1 mb-2">Experience</h2>
              {resume.experience.filter(e => e.company || e.role).map((exp, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between"><span className="font-semibold text-xs">{exp.role}</span><span className="text-gray-400 text-xs">{exp.duration}</span></div>
                  <p className="text-indigo-600 text-xs">{exp.company}</p>
                  {exp.description && <p className="text-gray-500 text-xs mt-0.5">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
          {resume.education?.filter(e => e.degree || e.institution).length > 0 && (
            <div>
              <h2 className="text-indigo-700 font-bold text-xs uppercase tracking-wide border-b border-indigo-200 pb-1 mb-2">Education</h2>
              {resume.education.filter(e => e.degree || e.institution).map((edu, i) => (
                <div key={i} className="mb-1">
                  <div className="flex justify-between"><span className="font-semibold text-xs">{edu.degree}</span><span className="text-gray-400 text-xs">{edu.year}</span></div>
                  <p className="text-gray-500 text-xs">{edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}</p>
                </div>
              ))}
            </div>
          )}
          {resume.projects?.filter(p => p.name).length > 0 && (
            <div>
              <h2 className="text-indigo-700 font-bold text-xs uppercase tracking-wide border-b border-indigo-200 pb-1 mb-2">Projects</h2>
              {resume.projects.filter(p => p.name).map((proj, i) => (
                <div key={i} className="mb-1">
                  <span className="font-semibold text-xs">{proj.name}</span>
                  {proj.description && <p className="text-gray-500 text-xs">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isMinimal) {
    return (
      <div className="bg-white text-gray-900 text-xs font-sans p-5 min-h-[600px]">
        <div className="border-b-2 border-gray-800 pb-3 mb-3">
          <h1 className="text-lg font-bold text-gray-900">{p.fullName || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-2 text-gray-500 text-xs mt-1">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>| {p.phone}</span>}
            {p.location && <span>| {p.location}</span>}
            {p.linkedin && <span>| {p.linkedin}</span>}
          </div>
        </div>
        {resume.summary && <div className="mb-3"><p className="text-gray-600 text-xs leading-relaxed">{resume.summary}</p></div>}
        {resume.experience?.filter(e => e.company || e.role).length > 0 && (
          <div className="mb-3">
            <h2 className="font-bold text-xs uppercase tracking-widest text-gray-700 mb-1">EXPERIENCE</h2>
            {resume.experience.filter(e => e.company || e.role).map((exp, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between"><span className="font-semibold">{exp.role} — {exp.company}</span><span className="text-gray-400">{exp.duration}</span></div>
                {exp.description && <p className="text-gray-500 mt-0.5">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        {resume.education?.filter(e => e.degree).length > 0 && (
          <div className="mb-3">
            <h2 className="font-bold text-xs uppercase tracking-widest text-gray-700 mb-1">EDUCATION</h2>
            {resume.education.filter(e => e.degree).map((edu, i) => (
              <div key={i} className="flex justify-between mb-1">
                <span className="font-semibold">{edu.degree}, {edu.institution}</span>
                <span className="text-gray-400">{edu.year}</span>
              </div>
            ))}
          </div>
        )}
        {resume.skills?.filter(Boolean).length > 0 && (
          <div className="mb-3">
            <h2 className="font-bold text-xs uppercase tracking-widest text-gray-700 mb-1">SKILLS</h2>
            <p className="text-gray-600">{resume.skills.filter(Boolean).join(' · ')}</p>
          </div>
        )}
        {resume.projects?.filter(p => p.name).length > 0 && (
          <div>
            <h2 className="font-bold text-xs uppercase tracking-widest text-gray-700 mb-1">PROJECTS</h2>
            {resume.projects.filter(p => p.name).map((proj, i) => (
              <div key={i} className="mb-1">
                <span className="font-semibold">{proj.name}</span>
                {proj.description && <span className="text-gray-500"> — {proj.description}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Modern (default)
  return (
    <div className="bg-white text-gray-900 text-xs font-sans min-h-[600px]">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5">
        <h1 className="text-xl font-bold">{p.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-3 mt-1 text-indigo-100 text-xs">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
        </div>
        <div className="flex flex-wrap gap-3 mt-1 text-indigo-200 text-xs">
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.github && <span>{p.github}</span>}
        </div>
      </div>
      <div className="p-5 space-y-4">
        {resume.summary && (
          <div>
            <h2 className="text-indigo-600 font-bold text-xs uppercase tracking-wide mb-1">Professional Summary</h2>
            <p className="text-gray-600 leading-relaxed">{resume.summary}</p>
          </div>
        )}
        {resume.experience?.filter(e => e.company || e.role).length > 0 && (
          <div>
            <h2 className="text-indigo-600 font-bold text-xs uppercase tracking-wide mb-2">Experience</h2>
            {resume.experience.filter(e => e.company || e.role).map((exp, i) => (
              <div key={i} className="mb-3 pl-3 border-l-2 border-indigo-200">
                <div className="flex justify-between items-start">
                  <div><p className="font-bold text-gray-800">{exp.role}</p><p className="text-indigo-500">{exp.company}</p></div>
                  <span className="text-gray-400 text-xs whitespace-nowrap ml-2">{exp.duration}</span>
                </div>
                {exp.description && <p className="text-gray-500 mt-1 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        {resume.education?.filter(e => e.degree || e.institution).length > 0 && (
          <div>
            <h2 className="text-indigo-600 font-bold text-xs uppercase tracking-wide mb-2">Education</h2>
            {resume.education.filter(e => e.degree || e.institution).map((edu, i) => (
              <div key={i} className="flex justify-between mb-1">
                <div><p className="font-semibold">{edu.degree}</p><p className="text-gray-500">{edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}</p></div>
                <span className="text-gray-400 text-xs">{edu.year}</span>
              </div>
            ))}
          </div>
        )}
        {resume.skills?.filter(Boolean).length > 0 && (
          <div>
            <h2 className="text-indigo-600 font-bold text-xs uppercase tracking-wide mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {resume.skills.filter(Boolean).map((s, i) => (
                <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded text-xs">{s}</span>
              ))}
            </div>
          </div>
        )}
        {resume.projects?.filter(p => p.name).length > 0 && (
          <div>
            <h2 className="text-indigo-600 font-bold text-xs uppercase tracking-wide mb-2">Projects</h2>
            {resume.projects.filter(p => p.name).map((proj, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold text-gray-800">{proj.name}{proj.link ? <a href={proj.link} className="text-indigo-400 ml-2 text-xs" target="_blank" rel="noopener noreferrer">↗</a> : ''}</p>
                {proj.description && <p className="text-gray-500 leading-relaxed">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResumePage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState(0);
  const [template, setTemplate] = useState('modern');
  const [resume, setResume] = useState(defaultResume);
  const [targetRole, setTargetRole] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get('/career/resume').then(r => {
      if (r.data.resume) {
        const { _id, user, __v, createdAt, updatedAt, ...rest } = r.data.resume;
        setResume({ ...defaultResume, ...rest });
        setAtsScore(r.data.resume.atsScore);
      }
    }).catch(() => {});
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, fullName: user?.fullName || '', email: user?.email || '' }
    }));
  }, []);

  const updateField = (path, value) => {
    setResume(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = next;
      keys.slice(0, -1).forEach(k => obj = isNaN(k) ? obj[k] : obj[parseInt(k)]);
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/career/resume/save', { resumeData: resume });
      toast.success('Resume saved!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAiResult(null);
    try {
      const { data } = await api.post('/career/resume/analyze', { resumeData: resume, targetRole });
      setAiResult(data.result);
      setAtsScore(data.result.atsScore);
      toast.success(`ATS Score: ${data.result.atsScore}%! ??`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally { setAnalyzing(false); }
  };

  const handleUploadResume = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      // Parse basic info from text
      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
      const phoneMatch = text.match(/[\+]?[\d\s\-\(\)]{10,}/);
      const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
      const githubMatch = text.match(/github\.com\/[\w-]+/i);
      setResume(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          email: emailMatch?.[0] || prev.personalInfo.email,
          phone: phoneMatch?.[0]?.trim() || prev.personalInfo.phone,
          linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : prev.personalInfo.linkedin,
          github: githubMatch ? `https://${githubMatch[0]}` : prev.personalInfo.github,
        }
      }));
      toast.success('Resume parsed! Review and update the fields.');
    };
    reader.readAsText(file);
  };

  const downloadPDF = () => {
    const p = resume.personalInfo || {};
    const printWindow = window.open('', '_blank');
    const templateStyles = template === 'professional'
      ? `body{font-family:'Segoe UI',sans-serif;margin:0;padding:0;background:#fff;color:#1a1a2e;display:flex;min-height:100vh}.sidebar{width:220px;background:#4338ca;color:#fff;padding:24px 16px;flex-shrink:0}.sidebar h1{font-size:16px;font-weight:700;margin:0 0 4px}.sidebar .avatar{width:60px;height:60px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;margin:0 auto 12px}.sidebar .section-title{color:#a5b4fc;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:16px 0 6px}.sidebar p{font-size:11px;margin:2px 0;word-break:break-all}.skill-tag{background:#4f46e5;color:#fff;font-size:10px;padding:2px 8px;border-radius:10px;display:inline-block;margin:2px}.main{flex:1;padding:24px}.section{margin-bottom:16px}.section-title{color:#4338ca;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #e0e7ff;padding-bottom:4px;margin-bottom:8px}.exp-item{margin-bottom:10px}.exp-header{display:flex;justify-content:space-between}.exp-role{font-weight:700;font-size:12px}.exp-company{color:#6366f1;font-size:11px}.exp-date{color:#9ca3af;font-size:10px}.exp-desc{color:#6b7280;font-size:11px;margin-top:3px;line-height:1.5}`
      : template === 'minimal'
      ? `body{font-family:'Segoe UI',sans-serif;padding:32px;max-width:700px;margin:0 auto;background:#fff;color:#111}.name{font-size:22px;font-weight:700;margin-bottom:4px}.contact{color:#6b7280;font-size:12px;margin-bottom:16px}.section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#374151;border-bottom:1px solid #e5e7eb;padding-bottom:3px;margin:14px 0 6px}.exp-item{margin-bottom:8px}.exp-header{display:flex;justify-content:space-between}.exp-role{font-weight:600;font-size:12px}.exp-date{color:#9ca3af;font-size:11px}.exp-desc{color:#6b7280;font-size:11px;margin-top:2px}.skill-list{color:#374151;font-size:12px}`
      : `body{font-family:'Segoe UI',sans-serif;margin:0;padding:0;background:#fff;color:#1a1a2e}.header{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:24px 28px}.header h1{font-size:22px;font-weight:700;margin:0 0 6px}.header .contact{font-size:11px;color:#c7d2fe;display:flex;flex-wrap:wrap;gap:12px}.content{padding:20px 28px}.section{margin-bottom:16px}.section-title{color:#4f46e5;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}.exp-item{border-left:2px solid #e0e7ff;padding-left:10px;margin-bottom:10px}.exp-header{display:flex;justify-content:space-between}.exp-role{font-weight:700;font-size:12px}.exp-company{color:#6366f1;font-size:11px}.exp-date{color:#9ca3af;font-size:10px}.exp-desc{color:#6b7280;font-size:11px;margin-top:3px;line-height:1.5}.skill-tag{background:#ede9fe;color:#5b21b6;border:1px solid #ddd6fe;font-size:10px;padding:2px 8px;border-radius:10px;display:inline-block;margin:2px}`;

    const body = template === 'professional' ? `
      <div class="sidebar">
        <div class="avatar">${p.fullName?.charAt(0) || 'A'}</div>
        <h1>${p.fullName || 'Your Name'}</h1>
        <div class="section-title">Contact</div>
        ${p.email ? `<p>${p.email}</p>` : ''}${p.phone ? `<p>${p.phone}</p>` : ''}${p.location ? `<p>${p.location}</p>` : ''}${p.linkedin ? `<p>${p.linkedin}</p>` : ''}${p.github ? `<p>${p.github}</p>` : ''}
        ${resume.skills?.filter(Boolean).length ? `<div class="section-title">Skills</div>${resume.skills.filter(Boolean).map(s => `<span class="skill-tag">${s}</span>`).join('')}` : ''}
      </div>
      <div class="main">
        ${resume.summary ? `<div class="section"><div class="section-title">Profile</div><p style="font-size:11px;color:#4b5563;line-height:1.6">${resume.summary}</p></div>` : ''}
        ${resume.experience?.filter(e => e.company || e.role).length ? `<div class="section"><div class="section-title">Experience</div>${resume.experience.filter(e => e.company || e.role).map(exp => `<div class="exp-item"><div class="exp-header"><span class="exp-role">${exp.role}</span><span class="exp-date">${exp.duration}</span></div><div class="exp-company">${exp.company}</div>${exp.description ? `<div class="exp-desc">${exp.description}</div>` : ''}</div>`).join('')}</div>` : ''}
        ${resume.education?.filter(e => e.degree).length ? `<div class="section"><div class="section-title">Education</div>${resume.education.filter(e => e.degree).map(edu => `<div class="exp-item"><div class="exp-header"><span class="exp-role">${edu.degree}</span><span class="exp-date">${edu.year}</span></div><div class="exp-company">${edu.institution}${edu.grade ? ` � ${edu.grade}` : ''}</div></div>`).join('')}</div>` : ''}
        ${resume.projects?.filter(p => p.name).length ? `<div class="section"><div class="section-title">Projects</div>${resume.projects.filter(p => p.name).map(proj => `<div class="exp-item"><div class="exp-role">${proj.name}</div>${proj.description ? `<div class="exp-desc">${proj.description}</div>` : ''}</div>`).join('')}</div>` : ''}
      </div>` : template === 'minimal' ? `
      <div class="name">${p.fullName || 'Your Name'}</div>
      <div class="contact">${[p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).join(' | ')}</div>
      ${resume.summary ? `<p style="font-size:12px;color:#4b5563;line-height:1.6;margin-bottom:8px">${resume.summary}</p>` : ''}
      ${resume.experience?.filter(e => e.company || e.role).length ? `<div class="section-title">Experience</div>${resume.experience.filter(e => e.company || e.role).map(exp => `<div class="exp-item"><div class="exp-header"><span class="exp-role">${exp.role} � ${exp.company}</span><span class="exp-date">${exp.duration}</span></div>${exp.description ? `<div class="exp-desc">${exp.description}</div>` : ''}</div>`).join('')}` : ''}
      ${resume.education?.filter(e => e.degree).length ? `<div class="section-title">Education</div>${resume.education.filter(e => e.degree).map(edu => `<div class="exp-item"><div class="exp-header"><span class="exp-role">${edu.degree}, ${edu.institution}</span><span class="exp-date">${edu.year}</span></div></div>`).join('')}` : ''}
      ${resume.skills?.filter(Boolean).length ? `<div class="section-title">Skills</div><div class="skill-list">${resume.skills.filter(Boolean).join(' � ')}</div>` : ''}
      ${resume.projects?.filter(p => p.name).length ? `<div class="section-title">Projects</div>${resume.projects.filter(p => p.name).map(proj => `<div class="exp-item"><span class="exp-role">${proj.name}</span>${proj.description ? ` � <span class="exp-desc">${proj.description}</span>` : ''}</div>`).join('')}` : ''}
      ` : `
      <div class="header"><h1>${p.fullName || 'Your Name'}</h1><div class="contact">${[p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).map(v => `<span>${v}</span>`).join('')}</div></div>
      <div class="content">
        ${resume.summary ? `<div class="section"><div class="section-title">Professional Summary</div><p style="font-size:11px;color:#4b5563;line-height:1.6">${resume.summary}</p></div>` : ''}
        ${resume.experience?.filter(e => e.company || e.role).length ? `<div class="section"><div class="section-title">Experience</div>${resume.experience.filter(e => e.company || e.role).map(exp => `<div class="exp-item"><div class="exp-header"><div><div class="exp-role">${exp.role}</div><div class="exp-company">${exp.company}</div></div><span class="exp-date">${exp.duration}</span></div>${exp.description ? `<div class="exp-desc">${exp.description}</div>` : ''}</div>`).join('')}</div>` : ''}
        ${resume.education?.filter(e => e.degree).length ? `<div class="section"><div class="section-title">Education</div>${resume.education.filter(e => e.degree).map(edu => `<div class="exp-item"><div class="exp-header"><div><div class="exp-role">${edu.degree}</div><div class="exp-company">${edu.institution}${edu.grade ? ` � ${edu.grade}` : ''}</div></div><span class="exp-date">${edu.year}</span></div></div>`).join('')}</div>` : ''}
        ${resume.skills?.filter(Boolean).length ? `<div class="section"><div class="section-title">Skills</div><div>${resume.skills.filter(Boolean).map(s => `<span class="skill-tag">${s}</span>`).join('')}</div></div>` : ''}
        ${resume.projects?.filter(p => p.name).length ? `<div class="section"><div class="section-title">Projects</div>${resume.projects.filter(p => p.name).map(proj => `<div class="exp-item"><div class="exp-role">${proj.name}</div>${proj.description ? `<div class="exp-desc">${proj.description}</div>` : ''}</div>`).join('')}</div>` : ''}
      </div>`;

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Resume - ${p.fullName || 'My Resume'}</title><style>${templateStyles}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${body}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const scoreColor = atsScore >= 75 ? 'text-green-400' : atsScore >= 50 ? 'text-yellow-400' : 'text-red-400';
  const scoreBg = atsScore >= 75 ? 'bg-green-500' : atsScore >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-purple to-primary-500 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Resume Builder Agent</h1>
              <p className="text-slate-400 text-sm">AI-powered ATS-optimized resume creator</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {atsScore !== null && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <div className={`w-2 h-2 rounded-full ${scoreBg}`} />
                <span className={`font-black text-lg ${scoreColor}`}>{atsScore}%</span>
                <span className="text-slate-400 text-sm">ATS Score</span>
              </div>
            )}
            <button onClick={handleSave} disabled={saving} className="btn-ghost flex items-center gap-2 py-2">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={downloadPDF} className="btn-primary flex items-center gap-2 py-2">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </motion.div>

        {/* Template Selector */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-semibold text-sm">Resume Template</p>
            <label className="flex items-center gap-2 text-sm text-primary-400 cursor-pointer hover:text-primary-300 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Existing Resume
              <input ref={fileInputRef} type="file" accept=".txt,.pdf" className="hidden" onChange={handleUploadResume} />
            </label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setTemplate(t.id)}
                className={`p-3 rounded-xl border text-left transition-all
                  ${template === t.id ? 'border-primary-500/60 bg-primary-500/15' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <t.icon className={`w-4 h-4 ${template === t.id ? 'text-primary-400' : 'text-slate-500'}`} />
                  <span className={`font-semibold text-sm ${template === t.id ? 'text-white' : 'text-slate-400'}`}>{t.label}</span>
                </div>
                <p className="text-xs text-slate-500">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass-card p-1 flex gap-1 overflow-x-auto">
              {TABS.map((t, i) => (
                <button key={t} onClick={() => setTab(i)}
                  className={`flex-1 min-w-max px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${tab === i ? 'bg-primary-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="glass-card p-6">
              {tab === 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.keys(resume.personalInfo).map(key => (
                    <div key={key}>
                      <label className="text-xs text-slate-400 capitalize mb-1 block">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <input type={key === 'email' ? 'email' : 'text'} value={resume.personalInfo[key]}
                        onChange={e => updateField(`personalInfo.${key}`, e.target.value)}
                        placeholder={`Your ${key}`} className="input-field text-sm py-2" />
                    </div>
                  ))}
                </div>
              )}

              {tab === 1 && (
                <div>
                  <label className="text-sm text-slate-300 font-medium mb-2 block">Professional Summary</label>
                  <textarea value={resume.summary} onChange={e => updateField('summary', e.target.value)}
                    placeholder="Write a compelling 2-3 sentence summary..." rows={5} className="input-field resize-none w-full" />
                  {aiResult?.improvedSummary && (
                    <div className="mt-3 p-3 rounded-xl bg-primary-500/10 border border-primary-500/30">
                      <p className="text-xs text-primary-400 font-semibold mb-1">✨ AI Improved Summary:</p>
                      <p className="text-slate-300 text-sm">{aiResult.improvedSummary}</p>
                      <button onClick={() => updateField('summary', aiResult.improvedSummary)}
                        className="mt-2 text-xs text-primary-400 hover:text-primary-300 font-medium">Use this →</button>
                    </div>
                  )}
                </div>
              )}

              {tab === 2 && (
                <div className="space-y-4">
                  {resume.experience.map((exp, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/8 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400 font-medium">Experience {i + 1}</span>
                        {resume.experience.length > 1 && (
                          <button onClick={() => setResume(prev => ({ ...prev, experience: prev.experience.filter((_, j) => j !== i) }))}
                            className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[['company', 'Company Name'], ['role', 'Job Title'], ['duration', 'Duration']].map(([k, label]) => (
                          <div key={k} className={k === 'duration' ? 'sm:col-span-2' : ''}>
                            <input value={exp[k]} onChange={e => updateField(`experience.${i}.${k}`, e.target.value)}
                              placeholder={label} className="input-field text-sm py-2 w-full" />
                          </div>
                        ))}
                      </div>
                      <textarea value={exp.description} onChange={e => updateField(`experience.${i}.description`, e.target.value)}
                        placeholder="Describe your responsibilities and achievements..." rows={2} className="input-field resize-none w-full text-sm" />
                    </div>
                  ))}
                  <button onClick={() => setResume(prev => ({ ...prev, experience: [...prev.experience, { company: '', role: '', duration: '', description: '', achievements: [''] }] }))}
                    className="btn-ghost w-full flex items-center justify-center gap-2 py-2 text-sm">
                    <Plus className="w-4 h-4" /> Add Experience
                  </button>
                </div>
              )}

              {tab === 3 && (
                <div className="space-y-4">
                  {resume.education.map((edu, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/8 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400 font-medium">Education {i + 1}</span>
                        {resume.education.length > 1 && (
                          <button onClick={() => setResume(prev => ({ ...prev, education: prev.education.filter((_, j) => j !== i) }))}
                            className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[['degree', 'Degree'], ['institution', 'College / University'], ['year', 'Year'], ['grade', 'Grade / CGPA']].map(([k, label]) => (
                          <input key={k} value={edu[k]} onChange={e => updateField(`education.${i}.${k}`, e.target.value)}
                            placeholder={label} className="input-field text-sm py-2" />
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setResume(prev => ({ ...prev, education: [...prev.education, { degree: '', institution: '', year: '', grade: '' }] }))}
                    className="btn-ghost w-full flex items-center justify-center gap-2 py-2 text-sm">
                    <Plus className="w-4 h-4" /> Add Education
                  </button>
                </div>
              )}

              {tab === 4 && (
                <div className="space-y-3">
                  <label className="text-sm text-slate-300 font-medium block">Technical Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((s, i) => (
                      <div key={i} className="flex items-center gap-1 bg-primary-500/20 border border-primary-500/30 rounded-lg px-2 py-1">
                        <input value={s} onChange={e => {
                          const next = [...resume.skills]; next[i] = e.target.value;
                          setResume(prev => ({ ...prev, skills: next }));
                        }} className="bg-transparent text-primary-300 text-sm outline-none w-24" placeholder="Skill..." />
                        <button onClick={() => setResume(prev => ({ ...prev, skills: prev.skills.filter((_, j) => j !== i) }))}
                          className="text-red-400 hover:text-red-300 ml-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    <button onClick={() => setResume(prev => ({ ...prev, skills: [...prev.skills, ''] }))}
                      className="flex items-center gap-1 text-sm text-slate-400 hover:text-white border border-dashed border-white/20 px-3 py-1 rounded-lg hover:border-primary-500/50 transition-all">
                      <Plus className="w-3 h-3" /> Add Skill
                    </button>
                  </div>
                  {aiResult?.keywordSuggestions?.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20">
                      <p className="text-xs text-accent-cyan font-semibold mb-2">🔑 AI Keyword Suggestions:</p>
                      <div className="flex flex-wrap gap-1">
                        {aiResult.keywordSuggestions.map(kw => (
                          <button key={kw} onClick={() => setResume(prev => ({ ...prev, skills: [...prev.skills, kw] }))}
                            className="text-xs bg-white/5 text-slate-300 px-2 py-0.5 rounded hover:bg-primary-500/20 hover:text-primary-300 transition-all">
                            + {kw}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === 5 && (
                <div className="space-y-4">
                  {resume.projects.map((proj, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/8 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400 font-medium">Project {i + 1}</span>
                        {resume.projects.length > 1 && (
                          <button onClick={() => setResume(prev => ({ ...prev, projects: prev.projects.filter((_, j) => j !== i) }))}
                            className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                      <input value={proj.name} onChange={e => updateField(`projects.${i}.name`, e.target.value)}
                        placeholder="Project Name" className="input-field text-sm py-2 w-full" />
                      <textarea value={proj.description} onChange={e => updateField(`projects.${i}.description`, e.target.value)}
                        placeholder="Describe the project, tech used, and your role..." rows={2}
                        className="input-field resize-none w-full text-sm" />
                      <input value={proj.link} onChange={e => updateField(`projects.${i}.link`, e.target.value)}
                        placeholder="GitHub / Live Link" className="input-field text-sm py-2 w-full" />
                    </div>
                  ))}
                  <button onClick={() => setResume(prev => ({ ...prev, projects: [...prev.projects, { name: '', description: '', tech: [''], link: '' }] }))}
                    className="btn-ghost w-full flex items-center justify-center gap-2 py-2 text-sm">
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: AI + Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-5">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary-400" /> AI Optimization
              </h3>
              <input value={targetRole} onChange={e => setTargetRole(e.target.value)}
                placeholder="Target role (e.g. React Developer)" className="input-field text-sm mb-3" />
              <motion.button onClick={handleAnalyze} disabled={analyzing}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                {analyzing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</> : <><Zap className="w-4 h-4" /> Analyze & Optimize</>}
              </motion.button>
            </div>

            {aiResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold text-sm">ATS Score</span>
                    <span className={`text-xl font-black ${scoreColor}`}>{aiResult.atsScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${aiResult.atsScore}%` }}
                      transition={{ duration: 1 }} className={`h-full rounded-full ${scoreBg}`} />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{aiResult.atsScore >= 80 ? '🎉 Excellent ATS score!' : aiResult.atsScore >= 60 ? '👍 Good, keep improving' : '⚠️ Needs improvement'}</p>
                </div>
                <div className="glass-card p-4">
                  <h4 className="text-white font-semibold text-sm mb-3">💡 AI Suggestions</h4>
                  <div className="space-y-2">
                    {aiResult.suggestions?.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertCircle className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-400 text-xs">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {aiResult.strengthAreas?.length > 0 && (
                  <div className="glass-card p-4">
                    <h4 className="text-white font-semibold text-sm mb-3">✅ Strengths</h4>
                    {aiResult.strengthAreas.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span className="text-slate-400 text-xs">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
                {aiResult.missingSections?.length > 0 && (
                  <div className="glass-card p-4">
                    <h4 className="text-white font-semibold text-sm mb-3">⚠️ Missing / Needed</h4>
                    {aiResult.missingSections.map((s, i) => (
                      <p key={i} className="text-slate-400 text-xs">• {s}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Live Preview */}
            <div className="glass-card p-3">
              <p className="text-slate-400 text-xs font-medium mb-2">Live Preview — {TEMPLATES.find(t => t.id === template)?.label}</p>
              <div className="rounded-lg overflow-hidden border border-white/10 max-h-96 overflow-y-auto">
                <ResumePreview resume={resume} template={template} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
