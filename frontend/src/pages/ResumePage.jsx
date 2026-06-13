import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Zap, CheckCircle, AlertCircle, Plus, Trash2, Save,
  Download, Upload, Layout, User, Columns, Target, Award,
  BarChart3, Lightbulb, Camera, FileText, Sparkles, Brain
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import AIResumeUpload from '../components/dashboard/AIResumeUpload';
import api from '../services/api';
import { parseResumeFile } from '../services/resume.service';
import useAuthStore from '../store/authStore';

const TABS = ['Personal Info', 'Summary', 'Experience', 'Education', 'Skills', 'Projects'];

const RESUME_MODES = [
  { id: 'general', label: 'General', desc: 'Standard all-purpose resume' },
  { id: 'ats', label: 'ATS Optimized', desc: 'Keyword-heavy for applicant tracking' },
  { id: 'company', label: 'Company Specific', desc: 'Tailored for a specific company' },
  { id: 'fresher', label: 'Fresher', desc: 'For 0-1 year experience' },
  { id: 'experienced', label: 'Experienced', desc: 'Senior professional format' },
];

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
  projects: [{ name: '', description: '', tech: [''], link: '' }],
  certifications: [{ name: '', issuer: '', year: '' }],
};

// ─── Resume Preview ──────────────────────────────────────────────────────────
function ResumePreview({ resume, template, profilePic }) {
  const p = resume.personalInfo || {};

  if (template === 'professional') {
    return (
      <div className="bg-white text-gray-900 text-xs font-sans min-h-[600px] flex">
        <div className="w-1/3 bg-purple-700 text-white p-4 space-y-4">
          <div className="text-center">
            {profilePic ? (
              <img src={profilePic} alt="profile" className="w-16 h-16 rounded-full mx-auto mb-2 object-cover border-2 border-purple-400" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-2 text-2xl font-bold">
                {p.fullName?.charAt(0) || 'A'}
              </div>
            )}
            <h1 className="font-bold text-sm leading-tight">{p.fullName || 'Your Name'}</h1>
          </div>
          <div className="space-y-1">
            <p className="text-purple-200 font-semibold text-xs uppercase tracking-wide">Contact</p>
            {p.email && <p className="text-xs break-all">{p.email}</p>}
            {p.phone && <p className="text-xs">{p.phone}</p>}
            {p.location && <p className="text-xs">{p.location}</p>}
            {p.linkedin && <p className="text-xs break-all">{p.linkedin}</p>}
            {p.github && <p className="text-xs break-all">{p.github}</p>}
          </div>
          {resume.skills?.filter(Boolean).length > 0 && (
            <div>
              <p className="text-purple-200 font-semibold text-xs uppercase tracking-wide mb-1">Skills</p>
              <div className="flex flex-wrap gap-1">
                {resume.skills.filter(Boolean).map((s, i) => (
                  <span key={i} className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded">{s}</span>
                ))}
              </div>
            </div>
          )}
          {resume.certifications?.filter(c => c.name).length > 0 && (
            <div>
              <p className="text-purple-200 font-semibold text-xs uppercase tracking-wide mb-1">Certifications</p>
              {resume.certifications.filter(c => c.name).map((c, i) => (
                <div key={i} className="mb-1">
                  <p className="text-xs font-medium">{c.name}</p>
                  {c.issuer && <p className="text-purple-300 text-xs">{c.issuer} {c.year ? `(${c.year})` : ''}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 p-4 space-y-3">
          {resume.summary && (
            <div>
              <h2 className="text-purple-700 font-bold text-xs uppercase tracking-wide border-b border-purple-200 pb-1 mb-1">Profile</h2>
              <p className="text-white/40 text-xs leading-relaxed">{resume.summary}</p>
            </div>
          )}
          {resume.experience?.filter(e => e.company || e.role).length > 0 && (
            <div>
              <h2 className="text-purple-700 font-bold text-xs uppercase tracking-wide border-b border-purple-200 pb-1 mb-2">Experience</h2>
              {resume.experience.filter(e => e.company || e.role).map((exp, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between"><span className="font-semibold text-xs">{exp.role}</span><span className="text-white/50 text-xs">{exp.duration}</span></div>
                  <p className="text-purple-600 text-xs">{exp.company}</p>
                  {exp.description && <p className="text-white/50 text-xs mt-0.5">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
          {resume.education?.filter(e => e.degree || e.institution).length > 0 && (
            <div>
              <h2 className="text-purple-700 font-bold text-xs uppercase tracking-wide border-b border-purple-200 pb-1 mb-2">Education</h2>
              {resume.education.filter(e => e.degree || e.institution).map((edu, i) => (
                <div key={i} className="mb-1">
                  <div className="flex justify-between"><span className="font-semibold text-xs">{edu.degree}</span><span className="text-white/50 text-xs">{edu.year}</span></div>
                  <p className="text-white/50 text-xs">{edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}</p>
                </div>
              ))}
            </div>
          )}
          {resume.projects?.filter(p => p.name).length > 0 && (
            <div>
              <h2 className="text-purple-700 font-bold text-xs uppercase tracking-wide border-b border-purple-200 pb-1 mb-2">Projects</h2>
              {resume.projects.filter(p => p.name).map((proj, i) => (
                <div key={i} className="mb-1">
                  <span className="font-semibold text-xs">{proj.name}</span>
                  {proj.description && <p className="text-white/50 text-xs">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (template === 'minimal') {
    return (
      <div className="bg-white text-gray-900 text-xs font-sans p-5 min-h-[600px]">
        <div className="border-b-2 border-space-border pb-3 mb-3 flex items-start gap-3">
          {profilePic && <img src={profilePic} alt="profile" className="w-12 h-12 rounded-full object-cover border border-white/10" />}
          <div>
            <h1 className="text-lg font-bold text-gray-900">{p.fullName || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-2 text-white/50 text-xs mt-1">
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>| {p.phone}</span>}
              {p.location && <span>| {p.location}</span>}
              {p.linkedin && <span>| {p.linkedin}</span>}
              {p.github && <span>| {p.github}</span>}
            </div>
          </div>
        </div>
        {resume.summary && <div className="mb-3"><p className="text-white/40 text-xs leading-relaxed">{resume.summary}</p></div>}
        {resume.experience?.filter(e => e.company || e.role).length > 0 && (
          <div className="mb-3">
            <h2 className="font-bold text-xs uppercase tracking-widest text-white/40 mb-1">EXPERIENCE</h2>
            {resume.experience.filter(e => e.company || e.role).map((exp, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between"><span className="font-semibold">{exp.role} — {exp.company}</span><span className="text-white/50">{exp.duration}</span></div>
                {exp.description && <p className="text-white/50 mt-0.5">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        {resume.education?.filter(e => e.degree).length > 0 && (
          <div className="mb-3">
            <h2 className="font-bold text-xs uppercase tracking-widest text-white/40 mb-1">EDUCATION</h2>
            {resume.education.filter(e => e.degree).map((edu, i) => (
              <div key={i} className="flex justify-between mb-1">
                <span className="font-semibold">{edu.degree}, {edu.institution}</span>
                <span className="text-white/50">{edu.year}</span>
              </div>
            ))}
          </div>
        )}
        {resume.skills?.filter(Boolean).length > 0 && (
          <div className="mb-3">
            <h2 className="font-bold text-xs uppercase tracking-widest text-white/40 mb-1">SKILLS</h2>
            <p className="text-white/40">{resume.skills.filter(Boolean).join(' · ')}</p>
          </div>
        )}
        {resume.projects?.filter(p => p.name).length > 0 && (
          <div className="mb-3">
            <h2 className="font-bold text-xs uppercase tracking-widest text-white/40 mb-1">PROJECTS</h2>
            {resume.projects.filter(p => p.name).map((proj, i) => (
              <div key={i} className="mb-1">
                <span className="font-semibold">{proj.name}</span>
                {proj.description && <span className="text-white/50"> — {proj.description}</span>}
              </div>
            ))}
          </div>
        )}
        {resume.certifications?.filter(c => c.name).length > 0 && (
          <div>
            <h2 className="font-bold text-xs uppercase tracking-widest text-white/40 mb-1">CERTIFICATIONS</h2>
            {resume.certifications.filter(c => c.name).map((c, i) => (
              <p key={i} className="text-white/40 text-xs">{c.name}{c.issuer ? ` — ${c.issuer}` : ''}{c.year ? ` (${c.year})` : ''}</p>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Modern (default)
  return (
    <div className="bg-white text-gray-900 text-xs font-sans min-h-[600px]">
      <div className="bg-gradient-to-r from-purple-600 to-purple-600 text-white p-5">
        <div className="flex items-center gap-4">
          {profilePic && <img src={profilePic} alt="profile" className="w-16 h-16 rounded-full object-cover border-2 border-white/40 flex-shrink-0" />}
          <div>
            <h1 className="text-xl font-bold">{p.fullName || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-3 mt-1 text-purple-100 text-xs">
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {p.location && <span>{p.location}</span>}
            </div>
            <div className="flex flex-wrap gap-3 mt-1 text-purple-200 text-xs">
              {p.linkedin && <span>{p.linkedin}</span>}
              {p.github && <span>{p.github}</span>}
              {p.website && <span>{p.website}</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {resume.summary && (
          <div>
            <h2 className="text-purple-600 font-bold text-xs uppercase tracking-wide mb-1">Professional Summary</h2>
            <p className="text-white/40 leading-relaxed">{resume.summary}</p>
          </div>
        )}
        {resume.experience?.filter(e => e.company || e.role).length > 0 && (
          <div>
            <h2 className="text-purple-600 font-bold text-xs uppercase tracking-wide mb-2">Experience</h2>
            {resume.experience.filter(e => e.company || e.role).map((exp, i) => (
              <div key={i} className="mb-3 pl-3 border-l-2 border-purple-200">
                <div className="flex justify-between items-start">
                  <div><p className="font-bold text-white/40">{exp.role}</p><p className="text-purple-500">{exp.company}</p></div>
                  <span className="text-white/50 text-xs whitespace-nowrap ml-2">{exp.duration}</span>
                </div>
                {exp.description && <p className="text-white/50 mt-1 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        {resume.education?.filter(e => e.degree || e.institution).length > 0 && (
          <div>
            <h2 className="text-purple-600 font-bold text-xs uppercase tracking-wide mb-2">Education</h2>
            {resume.education.filter(e => e.degree || e.institution).map((edu, i) => (
              <div key={i} className="flex justify-between mb-1">
                <div><p className="font-semibold">{edu.degree}</p><p className="text-white/50">{edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}</p></div>
                <span className="text-white/50 text-xs">{edu.year}</span>
              </div>
            ))}
          </div>
        )}
        {resume.skills?.filter(Boolean).length > 0 && (
          <div>
            <h2 className="text-purple-600 font-bold text-xs uppercase tracking-wide mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {resume.skills.filter(Boolean).map((s, i) => (
                <span key={i} className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-xs">{s}</span>
              ))}
            </div>
          </div>
        )}
        {resume.projects?.filter(p => p.name).length > 0 && (
          <div>
            <h2 className="text-purple-600 font-bold text-xs uppercase tracking-wide mb-2">Projects</h2>
            {resume.projects.filter(p => p.name).map((proj, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold text-white/40">{proj.name}{proj.link ? <a href={proj.link} className="text-purple-400 ml-2 text-xs" target="_blank" rel="noopener noreferrer">↗</a> : ''}</p>
                {proj.description && <p className="text-white/50 leading-relaxed">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
        {resume.certifications?.filter(c => c.name).length > 0 && (
          <div>
            <h2 className="text-purple-600 font-bold text-xs uppercase tracking-wide mb-2">Certifications</h2>
            {resume.certifications.filter(c => c.name).map((c, i) => (
              <div key={i} className="flex justify-between mb-1">
                <span className="font-semibold text-white/40">{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</span>
                <span className="text-white/50 text-xs">{c.year}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ResumePage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState(0);
  const [template, setTemplate] = useState('modern');
  const [resumeMode, setResumeMode] = useState('general');
  const [resume, setResume] = useState(defaultResume);
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const profilePicRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get('/career/resume').then(r => {
      if (r.data.resume) {
        const { _id, user: u, __v, createdAt, updatedAt, ...rest } = r.data.resume;
        setResume({ ...defaultResume, ...rest });
        setAtsScore(r.data.resume.atsScore || null);
      }
    }).catch(() => {});
    // Pre-fill from user profile
    setResume(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        fullName: user?.fullName || '',
        email: user?.email || ''
      }
    }));
    // Load profile pic from user avatar
    if (user?.avatar) setProfilePic(user.avatar);
  }, []);

  const updateField = (path, value) => {
    setResume(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = next;
      keys.slice(0, -1).forEach(k => { obj = isNaN(k) ? obj[k] : obj[parseInt(k)]; });
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
      const { data } = await api.post('/career/resume/analyze', {
        resumeData: resume,
        targetRole: targetRole || 'Software Developer'
      });
      setAiResult(data.result);
      setAtsScore(data.result.atsScore);
      toast.success(`ATS Score: ${data.result.atsScore}%! Analysis complete.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally { setAnalyzing(false); }
  };

  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const handleUploadResume = async (file) => {
    if (!file) return;

    setIsParsing(true);
    setParsedData(null);
    const toastId = toast.loading('Parsing resume... This may take a few seconds.');
    try {
      const data = await parseResumeFile(file);
      const parsed = data.data;

      // Extract details correctly mapping the backend structure
      const parsedExperience = parsed.experience?.map(exp => ({
        company: exp.company || '',
        role: exp.role || '',
        duration: (exp.startDate || '') + (exp.endDate ? ' - ' + exp.endDate : ''),
        description: exp.description || ''
      })) || [];

      const parsedEducation = parsed.education?.map(edu => ({
        institution: edu.institution || '',
        degree: edu.degree || '',
        year: edu.endDate || '',
        grade: edu.score || ''
      })) || [];
      
      const parsedProjects = parsed.projects?.map(proj => ({
        name: proj.name || '',
        description: proj.description || '',
        link: proj.link || '',
        tech: proj.technologies || []
      })) || [];

      setResume(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: parsed.personalInfo?.fullName || prev.personalInfo.fullName,
          email: parsed.personalInfo?.email || prev.personalInfo.email,
          phone: parsed.personalInfo?.phone || prev.personalInfo.phone,
          linkedin: parsed.personalInfo?.linkedin || prev.personalInfo.linkedin,
          github: parsed.personalInfo?.github || prev.personalInfo.github,
          location: parsed.personalInfo?.location || prev.personalInfo.location
        },
        skills: parsed.skills?.length > 0 ? parsed.skills : prev.skills,
        summary: parsed.summary || prev.summary,
        experience: parsedExperience.length > 0 ? parsedExperience : prev.experience,
        education: parsedEducation.length > 0 ? parsedEducation : prev.education,
        projects: parsedProjects.length > 0 ? parsedProjects : prev.projects
      }));

      setParsedData({
        name: file.name,
        skillsExtracted: parsed.skills?.length || 0,
        experienceParsed: parsedExperience.length,
        educationParsed: parsedEducation.length
      });

      toast.success('Resume parsed successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to parse resume automatically. Please fill manually.', { id: toastId });
    } finally {
      setIsParsing(false);
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return toast.error('Image must be under 3MB');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilePic(ev.target.result);
      toast.success('Profile picture added to resume!');
    };
    reader.readAsDataURL(file);
  };

  const downloadPDF = () => {
    const p = resume.personalInfo || {};
    const printWindow = window.open('', '_blank');
    if (!printWindow) { toast.error('Popup blocked. Please allow popups.'); return; }

    const getStyles = () => {
      if (template === 'professional') return `body{font-family:'Segoe UI',sans-serif;margin:0;padding:0;background:#fff;color:#1a1a2e;display:flex;min-height:100vh}.sidebar{width:220px;background:#4338ca;color:#fff;padding:24px 16px;flex-shrink:0}.avatar-img{width:60px;height:60px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block;border:2px solid rgba(255,255,255,0.3)}.avatar-txt{width:60px;height:60px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;margin:0 auto 12px}.sidebar h1{font-size:16px;font-weight:700;margin:0 0 4px;text-align:center}.sec-title{color:#a5b4fc;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:16px 0 6px}.sidebar p{font-size:11px;margin:2px 0;word-break:break-all}.skill-tag{background:#4f46e5;color:#fff;font-size:10px;padding:2px 8px;border-radius:10px;display:inline-block;margin:2px}.main{flex:1;padding:24px}.section{margin-bottom:16px}.section-title{color:#4338ca;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #e0e7ff;padding-bottom:4px;margin-bottom:8px}.exp-item{margin-bottom:10px}.exp-header{display:flex;justify-content:space-between}.exp-role{font-weight:700;font-size:12px}.exp-company{color:#6366f1;font-size:11px}.exp-date{color:#9ca3af;font-size:10px}.exp-desc{color:#6b7280;font-size:11px;margin-top:3px;line-height:1.5}`;
      if (template === 'minimal') return `body{font-family:'Segoe UI',sans-serif;padding:32px;max-width:700px;margin:0 auto;background:#fff;color:#111}.name-row{display:flex;align-items:center;gap:12px;border-bottom:2px solid #111;padding-bottom:12px;margin-bottom:12px}.profile-img{width:50px;height:50px;border-radius:50%;object-fit:cover;border:1px solid #ddd}.name{font-size:22px;font-weight:700;margin-bottom:4px}.contact{color:#6b7280;font-size:12px}.section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#374151;border-bottom:1px solid #e5e7eb;padding-bottom:3px;margin:14px 0 6px}.exp-item{margin-bottom:8px}.exp-header{display:flex;justify-content:space-between}.exp-role{font-weight:600;font-size:12px}.exp-date{color:#9ca3af;font-size:11px}.exp-desc{color:#6b7280;font-size:11px;margin-top:2px}.skill-list{color:#374151;font-size:12px}`;
      return `body{font-family:'Segoe UI',sans-serif;margin:0;padding:0;background:#fff;color:#1a1a2e}.header{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:24px 28px}.header-inner{display:flex;align-items:center;gap:16px}.profile-img{width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.4);flex-shrink:0}.header h1{font-size:22px;font-weight:700;margin:0 0 6px}.header .contact{font-size:11px;color:#c7d2fe;display:flex;flex-wrap:wrap;gap:12px}.content{padding:20px 28px}.section{margin-bottom:16px}.section-title{color:#4f46e5;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}.exp-item{border-left:2px solid #e0e7ff;padding-left:10px;margin-bottom:10px}.exp-header{display:flex;justify-content:space-between}.exp-role{font-weight:700;font-size:12px}.exp-company{color:#6366f1;font-size:11px}.exp-date{color:#9ca3af;font-size:10px}.exp-desc{color:#6b7280;font-size:11px;margin-top:3px;line-height:1.5}.skill-tag{background:#ede9fe;color:#5b21b6;border:1px solid #ddd6fe;font-size:10px;padding:2px 8px;border-radius:10px;display:inline-block;margin:2px}`;
    };

    const picHtml = profilePic ? `<img src="${profilePic}" class="profile-img" alt="profile" />` : '';
    const expHtml = resume.experience?.filter(e => e.company || e.role).map(exp =>
      `<div class="exp-item"><div class="exp-header"><div><div class="exp-role">${exp.role || ''}</div><div class="exp-company">${exp.company || ''}</div></div><span class="exp-date">${exp.duration || ''}</span></div>${exp.description ? `<div class="exp-desc">${exp.description}</div>` : ''}</div>`
    ).join('') || '';
    const eduHtml = resume.education?.filter(e => e.degree).map(edu =>
      `<div class="exp-item"><div class="exp-header"><div><div class="exp-role">${edu.degree || ''}</div><div class="exp-company">${edu.institution || ''}${edu.grade ? ` · ${edu.grade}` : ''}</div></div><span class="exp-date">${edu.year || ''}</span></div></div>`
    ).join('') || '';
    const skillsHtml = resume.skills?.filter(Boolean).map(s => `<span class="skill-tag">${s}</span>`).join('') || '';
    const projHtml = resume.projects?.filter(p => p.name).map(proj =>
      `<div class="exp-item"><div class="exp-role">${proj.name}${proj.link ? ` <span style="color:#6366f1;font-size:10px">${proj.link}</span>` : ''}</div>${proj.description ? `<div class="exp-desc">${proj.description}</div>` : ''}</div>`
    ).join('') || '';
    const certHtml = resume.certifications?.filter(c => c.name).map(c =>
      `<p style="font-size:11px;color:#374151;margin:2px 0">${c.name}${c.issuer ? ` — ${c.issuer}` : ''}${c.year ? ` (${c.year})` : ''}</p>`
    ).join('') || '';

    let bodyHtml = '';
    if (template === 'professional') {
      const avatarHtml = profilePic ? `<img src="${profilePic}" class="avatar-img" alt="profile" />` : `<div class="avatar-txt">${p.fullName?.charAt(0) || 'A'}</div>`;
      bodyHtml = `<div class="sidebar">${avatarHtml}<h1>${p.fullName || 'Your Name'}</h1><div class="sec-title">Contact</div>${p.email ? `<p>${p.email}</p>` : ''}${p.phone ? `<p>${p.phone}</p>` : ''}${p.location ? `<p>${p.location}</p>` : ''}${p.linkedin ? `<p>${p.linkedin}</p>` : ''}${p.github ? `<p>${p.github}</p>` : ''}${skillsHtml ? `<div class="sec-title">Skills</div>${skillsHtml}` : ''}${certHtml ? `<div class="sec-title">Certifications</div>${certHtml}` : ''}</div><div class="main">${resume.summary ? `<div class="section"><div class="section-title">Profile</div><p style="font-size:11px;color:#4b5563;line-height:1.6">${resume.summary}</p></div>` : ''}${expHtml ? `<div class="section"><div class="section-title">Experience</div>${expHtml}</div>` : ''}${eduHtml ? `<div class="section"><div class="section-title">Education</div>${eduHtml}</div>` : ''}${projHtml ? `<div class="section"><div class="section-title">Projects</div>${projHtml}</div>` : ''}</div>`;
    } else if (template === 'minimal') {
      bodyHtml = `<div class="name-row">${profilePic ? `<img src="${profilePic}" class="profile-img" alt="profile" />` : ''}<div><div class="name">${p.fullName || 'Your Name'}</div><div class="contact">${[p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).join(' | ')}</div></div></div>${resume.summary ? `<p style="font-size:12px;color:#4b5563;line-height:1.6;margin-bottom:8px">${resume.summary}</p>` : ''}${expHtml ? `<div class="section-title">Experience</div>${expHtml}` : ''}${eduHtml ? `<div class="section-title">Education</div>${eduHtml}` : ''}${skillsHtml ? `<div class="section-title">Skills</div><div class="skill-list">${resume.skills.filter(Boolean).join(' · ')}</div>` : ''}${projHtml ? `<div class="section-title">Projects</div>${projHtml}` : ''}${certHtml ? `<div class="section-title">Certifications</div>${certHtml}` : ''}`;
    } else {
      bodyHtml = `<div class="header"><div class="header-inner">${picHtml}<div><h1>${p.fullName || 'Your Name'}</h1><div class="contact">${[p.email, p.phone, p.location].filter(Boolean).map(v => `<span>${v}</span>`).join('')}</div><div class="contact" style="margin-top:2px">${[p.linkedin, p.github, p.website].filter(Boolean).map(v => `<span>${v}</span>`).join('')}</div></div></div></div><div class="content">${resume.summary ? `<div class="section"><div class="section-title">Professional Summary</div><p style="font-size:11px;color:#4b5563;line-height:1.6">${resume.summary}</p></div>` : ''}${expHtml ? `<div class="section"><div class="section-title">Experience</div>${expHtml}</div>` : ''}${eduHtml ? `<div class="section"><div class="section-title">Education</div>${eduHtml}</div>` : ''}${skillsHtml ? `<div class="section"><div class="section-title">Skills</div><div>${skillsHtml}</div></div>` : ''}${projHtml ? `<div class="section"><div class="section-title">Projects</div>${projHtml}</div>` : ''}${certHtml ? `<div class="section"><div class="section-title">Certifications</div>${certHtml}</div>` : ''}</div>`;
    }

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Resume - ${p.fullName || 'My Resume'}</title><style>${getStyles()}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>${bodyHtml}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 600);
  };

  const scoreColor = atsScore >= 75 ? 'text-green-400' : atsScore >= 50 ? 'text-pink-neon' : 'text-red-400';
  const scoreBg = atsScore >= 75 ? 'bg-green-500' : atsScore >= 50 ? 'bg-pink-neon' : 'bg-red-500';

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-purple to-primary-500 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Resume Builder Agent</h1>
              <p className="text-white/50 text-sm">AI-powered ATS-optimized resume with live preview</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {atsScore !== null && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <div className={`w-2 h-2 rounded-full ${scoreBg}`} />
                <span className={`font-black text-lg ${scoreColor}`}>{atsScore}%</span>
                <span className="text-white/50 text-sm">ATS Score</span>
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

        {/* Resume Mode Selector */}
        <div className="glass-card p-4">
          <p className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-400" /> Resume Mode
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {RESUME_MODES.map(mode => (
              <button key={mode.id} onClick={() => setResumeMode(mode.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  resumeMode === mode.id
                    ? 'border-primary-500/60 bg-primary-500/15'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}>
                <p className={`font-semibold text-xs ${resumeMode === mode.id ? 'text-white' : 'text-white/50'}`}>{mode.label}</p>
                <p className="text-white/50 text-xs mt-0.5">{mode.desc}</p>
              </button>
            ))}
          </div>
          {resumeMode === 'company' && (
            <input value={targetCompany} onChange={e => setTargetCompany(e.target.value)}
              placeholder="Enter target company name (e.g. Google, Infosys, Startup Name)"
              className="input-field mt-3 text-sm" />
          )}
        </div>

        {/* Template + Upload Row */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <p className="text-white font-semibold text-sm">Template</p>
            <div className="flex items-center gap-3">
              {/* Profile picture upload */}
              <label className="flex items-center gap-2 text-sm text-accent-cyan cursor-pointer hover:text-accent-blue transition-colors">
                <Camera className="w-4 h-4" />
                {profilePic ? 'Change Photo' : 'Add Profile Photo'}
                <input ref={profilePicRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
              </label>
              {profilePic && (
                <div className="flex items-center gap-2">
                  <img src={profilePic} alt="profile" className="w-7 h-7 rounded-full object-cover border border-primary-500/40" />
                  <button onClick={() => setProfilePic('')} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setTemplate(t.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  template === t.id ? 'border-primary-500/60 bg-primary-500/15' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}>
                <div className="flex items-center gap-2 mb-1">
                  <t.icon className={`w-4 h-4 ${template === t.id ? 'text-primary-400' : 'text-white/50'}`} />
                  <span className={`font-semibold text-sm ${template === t.id ? 'text-white' : 'text-white/50'}`}>{t.label}</span>
                </div>
                <p className="text-xs text-white/50">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-3 space-y-4">
            <AIResumeUpload 
              onFileSelect={handleUploadResume}
              isParsing={isParsing}
              parsedData={parsedData}
              resetData={() => setParsedData(null)}
            />
            
            <div className="glass-card p-1 flex gap-1 overflow-x-auto">
              {TABS.map((t, i) => (
                <button key={t} onClick={() => setTab(i)}
                  className={`flex-1 min-w-max px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === i ? 'bg-primary-500 text-white shadow-lg' : 'text-white/50 hover:text-white'
                  }`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="glass-card p-6">
              {/* Tab 0: Personal Info */}
              {tab === 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.keys(resume.personalInfo).map(key => (
                    <div key={key}>
                      <label className="text-xs text-white/50 capitalize mb-1 block">
                        {key.replace(/([A-Z])/g, ' $1').replace('_', ' ')}
                      </label>
                      <input
                        type={key === 'email' ? 'email' : 'text'}
                        value={resume.personalInfo[key]}
                        onChange={e => updateField(`personalInfo.${key}`, e.target.value)}
                        placeholder={`Your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        className="input-field text-sm py-2"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 1: Summary */}
              {tab === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-white/50 font-medium mb-2 block">Target Role</label>
                    <input value={targetRole} onChange={e => setTargetRole(e.target.value)}
                      placeholder="e.g. Frontend Developer, Data Analyst" className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="text-sm text-white/50 font-medium mb-2 block">Professional Summary</label>
                    <textarea value={resume.summary} onChange={e => updateField('summary', e.target.value)}
                      placeholder="Write a compelling 2-3 sentence summary highlighting your key skills and goals..."
                      rows={5} className="input-field resize-none w-full" />
                  </div>
                  {aiResult?.improvedSummary && (
                    <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/30">
                      <p className="text-xs text-primary-400 font-semibold mb-1">✨ AI Improved Summary:</p>
                      <p className="text-white/50 text-sm">{aiResult.improvedSummary}</p>
                      <button onClick={() => updateField('summary', aiResult.improvedSummary)}
                        className="mt-2 text-xs text-primary-400 hover:text-primary-300 font-medium border border-primary-500/30 px-3 py-1 rounded-lg">
                        Use this summary →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Experience */}
              {tab === 2 && (
                <div className="space-y-4">
                  {resume.experience.map((exp, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/8 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/50 font-medium">Experience {i + 1}</span>
                        {resume.experience.length > 1 && (
                          <button onClick={() => setResume(prev => ({ ...prev, experience: prev.experience.filter((_, j) => j !== i) }))}
                            className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[['company', 'Company Name'], ['role', 'Job Title / Role'], ['duration', 'Duration (e.g. Jan 2022 - Dec 2023)']].map(([k, label]) => (
                          <div key={k} className={k === 'duration' ? 'sm:col-span-2' : ''}>
                            <input value={exp[k] || ''} onChange={e => updateField(`experience.${i}.${k}`, e.target.value)}
                              placeholder={label} className="input-field text-sm py-2 w-full" />
                          </div>
                        ))}
                      </div>
                      <textarea value={exp.description || ''} onChange={e => updateField(`experience.${i}.description`, e.target.value)}
                        placeholder="Describe responsibilities and achievements with impact metrics (e.g. 'Built X feature that reduced Y by 30%')..."
                        rows={3} className="input-field resize-none w-full text-sm" />
                    </div>
                  ))}
                  <button onClick={() => setResume(prev => ({ ...prev, experience: [...prev.experience, { company: '', role: '', duration: '', description: '' }] }))}
                    className="btn-ghost w-full flex items-center justify-center gap-2 py-2 text-sm">
                    <Plus className="w-4 h-4" /> Add Experience
                  </button>
                </div>
              )}

              {/* Tab 3: Education */}
              {tab === 3 && (
                <div className="space-y-4">
                  {resume.education.map((edu, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/8 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/50 font-medium">Education {i + 1}</span>
                        {resume.education.length > 1 && (
                          <button onClick={() => setResume(prev => ({ ...prev, education: prev.education.filter((_, j) => j !== i) }))}
                            className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[['degree', 'Degree / Course'], ['institution', 'College / University'], ['year', 'Year'], ['grade', 'Grade / CGPA / Percentage']].map(([k, label]) => (
                          <input key={k} value={edu[k] || ''} onChange={e => updateField(`education.${i}.${k}`, e.target.value)}
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

              {/* Tab 4: Skills */}
              {tab === 4 && (
                <div className="space-y-4">
                  <label className="text-sm text-white/50 font-medium block">Technical & Professional Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((s, i) => (
                      <div key={i} className="flex items-center gap-1 bg-primary-500/20 border border-primary-500/30 rounded-xl px-3 py-1.5">
                        <input value={s} onChange={e => {
                          const next = [...resume.skills]; next[i] = e.target.value;
                          setResume(prev => ({ ...prev, skills: next }));
                        }} className="bg-transparent text-primary-300 text-sm outline-none w-24" placeholder="Skill" />
                        <button onClick={() => setResume(prev => ({ ...prev, skills: prev.skills.filter((_, j) => j !== i) }))}
                          className="text-red-400 hover:text-red-300 ml-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    <button onClick={() => setResume(prev => ({ ...prev, skills: [...prev.skills, ''] }))}
                      className="flex items-center gap-1 text-sm text-white/50 hover:text-white border border-dashed border-white/20 px-3 py-1.5 rounded-xl hover:border-primary-500/50 transition-all">
                      <Plus className="w-3 h-3" /> Add Skill
                    </button>
                  </div>
                  {aiResult?.keywordSuggestions?.length > 0 && (
                    <div className="p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20">
                      <p className="text-xs text-accent-cyan font-semibold mb-2">🔑 AI Suggested Keywords for ATS:</p>
                      <div className="flex flex-wrap gap-1">
                        {aiResult.keywordSuggestions.map(kw => (
                          <button key={kw} onClick={() => { if (!resume.skills.includes(kw)) setResume(prev => ({ ...prev, skills: [...prev.skills, kw] })); }}
                            className="text-xs bg-white/5 text-white/50 px-2 py-0.5 rounded hover:bg-primary-500/20 hover:text-primary-300 transition-all border border-white/10">
                            + {kw}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Certifications in skills tab */}
                  <div className="pt-3 border-t border-white/10">
                    <label className="text-sm text-white/50 font-medium block mb-3">Certifications</label>
                    {resume.certifications?.map((cert, i) => (
                      <div key={i} className="grid sm:grid-cols-3 gap-2 mb-2 items-center">
                        <input value={cert.name || ''} onChange={e => updateField(`certifications.${i}.name`, e.target.value)}
                          placeholder="Certification Name" className="input-field text-sm py-2" />
                        <input value={cert.issuer || ''} onChange={e => updateField(`certifications.${i}.issuer`, e.target.value)}
                          placeholder="Issuer (e.g. Google, AWS)" className="input-field text-sm py-2" />
                        <div className="flex gap-2">
                          <input value={cert.year || ''} onChange={e => updateField(`certifications.${i}.year`, e.target.value)}
                            placeholder="Year" className="input-field text-sm py-2 flex-1" />
                          {(resume.certifications?.length || 0) > 1 && (
                            <button onClick={() => setResume(prev => ({ ...prev, certifications: prev.certifications.filter((_, j) => j !== i) }))}
                              className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setResume(prev => ({ ...prev, certifications: [...(prev.certifications || []), { name: '', issuer: '', year: '' }] }))}
                      className="btn-ghost w-full flex items-center justify-center gap-2 py-2 text-sm mt-2">
                      <Plus className="w-4 h-4" /> Add Certification
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 5: Projects */}
              {tab === 5 && (
                <div className="space-y-4">
                  {resume.projects.map((proj, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/8 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/50 font-medium">Project {i + 1}</span>
                        {resume.projects.length > 1 && (
                          <button onClick={() => setResume(prev => ({ ...prev, projects: prev.projects.filter((_, j) => j !== i) }))}
                            className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                        )}
                      </div>
                      <input value={proj.name || ''} onChange={e => updateField(`projects.${i}.name`, e.target.value)}
                        placeholder="Project Name" className="input-field text-sm py-2 w-full" />
                      <textarea value={proj.description || ''} onChange={e => updateField(`projects.${i}.description`, e.target.value)}
                        placeholder="Describe the project — what it does, tech used, and impact/results..." rows={3}
                        className="input-field resize-none w-full text-sm" />
                      <input value={proj.link || ''} onChange={e => updateField(`projects.${i}.link`, e.target.value)}
                        placeholder="GitHub / Live Demo URL" className="input-field text-sm py-2 w-full" />
                    </div>
                  ))}
                  <button onClick={() => setResume(prev => ({ ...prev, projects: [...prev.projects, { name: '', description: '', tech: [], link: '' }] }))}
                    className="btn-ghost w-full flex items-center justify-center gap-2 py-2 text-sm">
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: AI Analysis + Live Preview */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Holographic AI Analysis Panel */}
            <AnimatePresence mode="wait">
              {analyzing ? (
                <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-6 border-cyan-neon relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[160px]">
                  <div className="absolute inset-0 bg-matrix-sm opacity-30" />
                  <div className="absolute inset-0 bg-cyan-neon/10 animate-pulse" />
                  <div className="w-10 h-10 border-2 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin mb-3 relative z-10 shadow-[0_0_15px_#22D3EE]" />
                  <p className="text-cyan-neon font-bold text-sm tracking-widest uppercase relative z-10 text-glow-cyan">Holographic Scan in Progress...</p>
                </motion.div>
              ) : (
                <motion.div key="controls" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5 border-purple-500/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-purple-500/20 transition-colors" />
                  
                  {/* Floating ATS Banner if analyzed */}
                  {aiResult ? (
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <div className={`px-3 py-1.5 rounded-full text-xs font-black tracking-widest flex items-center gap-2 ${aiResult.atsScore >= 70 ? 'bg-green-500 shadow-[0_0_15px_#10B981]' : aiResult.atsScore >= 50 ? 'bg-pink-neon shadow-[0_0_15px_#EC4899]' : 'bg-red-500'}`}>
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                          <span className="text-white">ATS OPTIMIZATION: {aiResult.atsScore}%</span>
                        </div>
                        <motion.button onClick={handleAnalyze} whileHover={{ scale: 1.05 }} className="text-cyan-neon text-xs font-bold flex items-center gap-1 text-glow-cyan">
                          <Zap className="w-3 h-3" /> Rescan
                        </motion.button>
                      </div>

                      {/* Score Breakdown */}
                      {aiResult.atsBreakdown && (
                        <div className="space-y-2">
                          <p className="text-xs text-white/50 font-semibold">Breakdown:</p>
                          {Object.entries(aiResult.atsBreakdown).map(([k, v]) => (
                            <div key={k}>
                              <div className="flex justify-between text-[10px] mb-0.5">
                                <span className="text-white/50 uppercase tracking-wide">{k.replace(/([A-Z])/g, ' $1')}</span>
                                <span className={`font-bold ${v >= 70 ? 'text-green-400' : v >= 50 ? 'text-pink-neon' : 'text-red-400'}`}>{v}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-700 ${v >= 70 ? 'bg-green-500' : v >= 50 ? 'bg-pink-neon' : 'bg-red-500'}`} style={{ width: `${v}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Inline Cyber-Cyan Keyword Suggestions */}
                      {aiResult.suggestions?.length > 0 && (
                        <div className="mt-4 p-4 border border-cyan-neon/30 bg-cyan-neon/5 rounded-xl relative overflow-hidden">
                          <div className="absolute inset-0 bg-cyan-neon/5 animate-pulse" />
                          <h4 className="text-cyan-neon font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
                            <Zap className="w-3 h-3" /> Keyword Alignment Suggestions
                          </h4>
                          <div className="space-y-1.5 relative z-10">
                            {aiResult.suggestions.map((s, i) => (
                              <div key={i} className="flex items-start gap-2 text-[10px] text-white/60 p-2 rounded bg-space-black border border-cyan-neon/20 hover:border-cyan-neon/60 transition-colors">
                                <Lightbulb className="w-3 h-3 text-cyan-neon flex-shrink-0 mt-0.5" />
                                <span>{s}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {aiResult.hiringProbability !== undefined && (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-space-black border border-white/8 mt-2">
                          <div>
                            <p className="text-white text-xs font-bold uppercase tracking-wider">Hiring Probability</p>
                            {aiResult.salaryPrediction && <p className="text-cyan-neon text-[10px] font-semibold mt-0.5">{aiResult.salaryPrediction}</p>}
                          </div>
                          <div className={`text-2xl font-black drop-shadow-lg ${aiResult.hiringProbability >= 70 ? 'text-green-400' : aiResult.hiringProbability >= 50 ? 'text-pink-neon' : 'text-red-400'}`}>
                            {aiResult.hiringProbability}%
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-black text-sm flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-400" /> AI Optimization Engine
                        </h3>
                      </div>
                      <motion.button onClick={handleAnalyze} disabled={analyzing} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary w-full flex items-center justify-center gap-2 text-sm ai-glow">
                        <Zap className="w-4 h-4" /> Get ATS Score & AI Suggestions
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live Document Layer (Crisp, Illuminated) */}
            <div className="glass-card p-0 overflow-hidden relative border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5),_inset_0_0_20px_rgba(139,92,246,0.1)]">
              {/* Glowing Edge Header */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-neon via-pink-neon to-cyan-neon z-20" />
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-space-black/80 backdrop-blur-md relative z-20">
                <p className="text-white font-semibold text-xs tracking-widest uppercase flex items-center gap-2">
                  <Layout className="w-3.5 h-3.5 text-purple-400" /> Live Resume Preview
                </p>
                <button onClick={downloadPDF} className="text-[10px] uppercase font-bold text-cyan-neon hover:text-white transition-colors flex items-center gap-1">
                  <Download className="w-3 h-3" /> Export PDF
                </button>
              </div>
              
              {/* Document Wrapper rendering existing ResumePreview component */}
              <div className="overflow-y-auto max-h-[600px] bg-[#E2E8F0] relative z-10 p-2 shadow-[inset_0_0_50px_rgba(0,0,0,0.2)]">
                <div className="shadow-2xl mx-auto bg-white" style={{ maxWidth: '800px', transform: 'scale(0.95)', transformOrigin: 'top center' }}>
                  <ResumePreview resume={resume} template={template} profilePic={profilePic} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
