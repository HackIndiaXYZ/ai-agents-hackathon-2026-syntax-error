const { SkillProfile, Resume, JobApplication, InterviewSession, Progress } = require('../models/Career');
const ApiSettings = require('../models/ApiSettings');
const {
  runSkillAgent, runResumeAgent, runJobMatchAgent,
  runInterviewAgent, evaluateAnswer, generateCareerRoadmap, findLocalOpportunities
} = require('../services/gemini.service');

// Helper: get user's complete LLM configuration (provider, model, key)
const getUserLLMConfig = async (userId) => {
  try {
    const settings = await ApiSettings.findOne({ user: userId });
    if (settings) {
      const keys = settings.getDecryptedKeys();
      const activeProvider = keys.activeProvider || 'default';
      const activeModel = keys.activeModel || 'gemini-2.0-flash';
      
      let key = null;
      let provider = activeProvider;
      
      if (activeProvider === 'default') {
        key = process.env.GEMINI_API_KEY;
        provider = 'gemini';
      } else if (activeProvider === 'gemini') {
        key = keys.geminiKey || process.env.GEMINI_API_KEY;
      } else if (activeProvider === 'openai') {
        key = keys.openaiKey;
      } else if (activeProvider === 'openrouter') {
        key = keys.openrouterKey;
      } else if (activeProvider === 'claude') {
        key = keys.claudeKey;
      } else if (activeProvider === 'groq') {
        key = keys.groqKey;
      } else if (activeProvider === 'deepseek') {
        key = keys.deepseekKey;
      }
      
      return { provider, model: activeModel, apiKey: key };
    }
  } catch {}
  
  return {
    provider: 'gemini',
    model: 'gemini-2.0-flash',
    apiKey: process.env.GEMINI_API_KEY
  };
};

// Helper: update progress stats
const updateProgress = async (userId, field) => {
  try {
    await Progress.findOneAndUpdate(
      { user: userId },
      {
        $inc: { [`totalStats.${field}`]: 1 },
        $set: { lastActiveDate: new Date() }
      },
      { upsert: true }
    );
  } catch {}
};

// ─── SKILL AGENT ──────────────────────────────────────────────────────────
exports.analyzeSkills = async (req, res, next) => {
  try {
    const { skills, targetRole, experienceLevel, education } = req.body;
    if (!skills || !skills.length) return res.status(400).json({ success: false, message: 'Please provide at least one skill.' });

    const llmConfig = await getUserLLMConfig(req.user._id);
    const result = await runSkillAgent(skills, targetRole, experienceLevel, llmConfig);

    // Save/update skill profile
    const profile = await SkillProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        currentSkills: skills.map(s => ({ name: s, level: 'beginner' })),
        targetRole, experienceLevel, education,
        careerPaths: result.careerPaths,
        learningRoadmap: result.learningRoadmap?.map(r => ({
          skill: r.skill, priority: r.priority || 'medium',
          resources: r.resources, estimatedWeeks: r.weeks, completed: false
        })),
        skillScore: result.overallReadiness || 0,
        lastAnalyzed: new Date()
      },
      { upsert: true, new: true }
    );

    await updateProgress(req.user._id, 'skillsLearned');
    res.json({ success: true, result, profile });
  } catch (error) {
    next(error);
  }
};

exports.getSkillProfile = async (req, res, next) => {
  try {
    const profile = await SkillProfile.findOne({ user: req.user._id });
    res.json({ success: true, profile: profile || null });
  } catch (error) { next(error); }
};

exports.markRoadmapComplete = async (req, res, next) => {
  try {
    const { skillIndex } = req.body;
    await SkillProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: { [`learningRoadmap.${skillIndex}.completed`]: true } }
    );
    res.json({ success: true, message: 'Marked as complete!' });
  } catch (error) { next(error); }
};

// ─── RESUME AGENT ─────────────────────────────────────────────────────────
exports.analyzeResume = async (req, res, next) => {
  try {
    const { resumeData, targetRole } = req.body;
    if (!resumeData) return res.status(400).json({ success: false, message: 'Resume data required.' });

    const llmConfig = await getUserLLMConfig(req.user._id);
    const result = await runResumeAgent(resumeData, targetRole, llmConfig);

    // Save resume
    const resume = await Resume.findOneAndUpdate(
      { user: req.user._id, isActive: true },
      {
        ...resumeData,
        atsScore: result.atsScore || 0,
        aiSuggestions: result.suggestions || [],
        keywords: result.keywordSuggestions || [],
      },
      { upsert: true, new: true }
    );

    await updateProgress(req.user._id, 'resumeScore');
    res.json({ success: true, result, resumeId: resume._id });
  } catch (error) { next(error); }
};

exports.saveResume = async (req, res, next) => {
  try {
    const { resumeData } = req.body;
    const resume = await Resume.findOneAndUpdate(
      { user: req.user._id, isActive: true },
      { ...resumeData, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'Resume saved!', resume });
  } catch (error) { next(error); }
};

exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id, isActive: true }).sort({ updatedAt: -1 });
    res.json({ success: true, resume: resume || null });
  } catch (error) { next(error); }
};

// ─── JOB MATCHING AGENT ───────────────────────────────────────────────────
exports.matchJobs = async (req, res, next) => {
  try {
    const { skills, targetRole, location, experienceLevel } = req.body;
    if (!skills?.length) return res.status(400).json({ success: false, message: 'Skills required for job matching.' });

    const llmConfig = await getUserLLMConfig(req.user._id);
    const result = await runJobMatchAgent(skills, targetRole, location, experienceLevel, llmConfig);
    res.json({ success: true, result });
  } catch (error) { next(error); }
};

exports.saveJobApplication = async (req, res, next) => {
  try {
    const job = await JobApplication.create({ user: req.user._id, ...req.body });
    await updateProgress(req.user._id, 'jobsApplied');
    res.json({ success: true, message: 'Job saved!', job });
  } catch (error) { next(error); }
};

exports.getJobApplications = async (req, res, next) => {
  try {
    const jobs = await JobApplication.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) { next(error); }
};

exports.updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const job = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status, ...(status === 'applied' ? { appliedAt: new Date() } : {}) },
      { new: true }
    );
    res.json({ success: true, job });
  } catch (error) { next(error); }
};

// ─── INTERVIEW AGENT ──────────────────────────────────────────────────────
exports.generateInterview = async (req, res, next) => {
  try {
    const { role, type, skills } = req.body;
    const llmConfig = await getUserLLMConfig(req.user._id);
    const result = await runInterviewAgent(role, type, skills || [], llmConfig);

    const session = await InterviewSession.create({
      user: req.user._id, type: type || 'mixed', targetRole: role,
      questions: result.questions?.map(q => ({ question: q.question, userAnswer: '', aiFeedback: '', score: 0 })) || [],
      status: 'in-progress'
    });

    res.json({ success: true, session: { ...session.toObject(), questionDetails: result.questions }, tips: result.tips, preparationPlan: result.preparationPlan });
  } catch (error) { next(error); }
};

exports.submitAnswer = async (req, res, next) => {
  try {
    const { sessionId, questionIndex, answer, question, role } = req.body;
    const llmConfig = await getUserLLMConfig(req.user._id);

    const evaluation = await evaluateAnswer(question, answer, role, llmConfig);

    await InterviewSession.findByIdAndUpdate(sessionId, {
      $set: {
        [`questions.${questionIndex}.userAnswer`]: answer,
        [`questions.${questionIndex}.aiFeedback`]: evaluation.feedback,
        [`questions.${questionIndex}.score`]: evaluation.score
      }
    });

    res.json({ success: true, evaluation });
  } catch (error) { next(error); }
};

exports.completeInterview = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });

    const answeredQuestions = session.questions.filter(q => q.score > 0);
    const scores = answeredQuestions.map(q => q.score);
    const overallScore = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) : 0;

    // Build real strengths/improvements from question evaluations
    const allFeedbacks = session.questions.filter(q => q.aiFeedback).map(q => q.aiFeedback);
    const highScoreQuestions = session.questions.filter(q => q.score >= 7);
    const lowScoreQuestions = session.questions.filter(q => q.score > 0 && q.score < 6);

    const strengths = highScoreQuestions.length > 0
      ? highScoreQuestions.map(q => `Strong answer on: "${q.question?.slice(0, 50)}..."`)
      : ['Completed the full interview session', 'Attempted all questions presented'];

    const improvements = lowScoreQuestions.length > 0
      ? lowScoreQuestions.map(q => `Needs work on: "${q.question?.slice(0, 50)}..."`)
      : ['Practice adding more specific examples to answers', 'Use the STAR method for behavioral questions'];

    const performanceLevel = overallScore >= 80 ? 'Excellent' : overallScore >= 65 ? 'Good' : overallScore >= 50 ? 'Average' : 'Needs Improvement';
    const readinessScore = Math.min(100, overallScore + (answeredQuestions.length * 2));

    const updated = await InterviewSession.findByIdAndUpdate(sessionId, {
      overallScore,
      status: 'completed',
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 3)
    }, { new: true });

    await updateProgress(req.user._id, 'interviewsPracticed');
    res.json({
      success: true,
      session: updated,
      overallScore,
      performanceLevel,
      readinessScore,
      answeredCount: answeredQuestions.length,
      totalQuestions: session.questions.length,
      report: {
        summary: `You scored ${overallScore}% across ${answeredQuestions.length} questions. Performance level: ${performanceLevel}.`,
        strengths: strengths.slice(0, 3),
        improvements: improvements.slice(0, 3),
        nextSteps: [
          'Review model answers for questions you scored below 6',
          'Practice STAR method for behavioral questions',
          'Schedule another mock interview in 2-3 days'
        ]
      }
    });
  } catch (error) { next(error); }
};

exports.getInterviewHistory = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id })
      .select('-questions').sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, sessions });
  } catch (error) { next(error); }
};

// ─── ROADMAP & LOCAL OPPORTUNITIES ───────────────────────────────────────
exports.generateRoadmap = async (req, res, next) => {
  try {
    const profile = await SkillProfile.findOne({ user: req.user._id });
    const duration = req.body.duration || 90;
    const userProfile = {
      skills: profile?.currentSkills?.map(s => s.name) || req.body.skills || [],
      targetRole: profile?.targetRole || req.body.targetRole || 'Software Developer',
      experienceLevel: profile?.experienceLevel || 'fresher',
      education: profile?.education || {},
      duration
    };
    const llmConfig = await getUserLLMConfig(req.user._id);
    const result = await generateCareerRoadmap(userProfile, llmConfig);
    res.json({ success: true, result });
  } catch (error) { next(error); }
};

exports.findOpportunities = async (req, res, next) => {
  try {
    const { location } = req.body;
    const profile = await SkillProfile.findOne({ user: req.user._id });
    const skills = profile?.currentSkills?.map(s => s.name) || ['JavaScript', 'HTML', 'CSS'];
    const llmConfig = await getUserLLMConfig(req.user._id);
    const result = await findLocalOpportunities(location || req.user.location || 'India', skills, llmConfig);
    res.json({ success: true, result });
  } catch (error) { next(error); }
};

// ─── PROGRESS ─────────────────────────────────────────────────────────────
exports.getProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ user: req.user._id });
    if (!progress) {
      progress = await Progress.create({ user: req.user._id });
    }

    // Streak logic
    const today = new Date().toDateString();
    const lastActive = progress.lastActiveDate ? new Date(progress.lastActiveDate).toDateString() : null;
    if (lastActive && lastActive !== today) {
      const diff = (new Date() - new Date(progress.lastActiveDate)) / (1000 * 60 * 60 * 24);
      if (diff > 1) {
        progress.streak = 0;
        await progress.save();
      }
    }

    // Compute career readiness from other models
    const skillProfile = await SkillProfile.findOne({ user: req.user._id });
    const resume = await Resume.findOne({ user: req.user._id, isActive: true });
    const interviews = await InterviewSession.countDocuments({ user: req.user._id, status: 'completed' });
    const jobs = await JobApplication.countDocuments({ user: req.user._id });

    const readiness = Math.min(100, Math.round(
      (skillProfile?.skillScore || 0) * 0.3 +
      (resume?.atsScore || 0) * 0.3 +
      Math.min(interviews * 10, 20) +
      Math.min(jobs * 2, 20)
    ));

    progress.careerReadinessScore = readiness;
    progress.totalStats.resumeScore = resume?.atsScore || 0;
    await progress.save();

    res.json({
      success: true,
      progress,
      snapshot: {
        skillScore: skillProfile?.skillScore || 0,
        resumeScore: resume?.atsScore || 0,
        interviewsDone: interviews,
        jobsApplied: jobs,
        careerReadiness: readiness,
        streak: progress.streak,
        targetRole: skillProfile?.targetRole || 'Not set'
      }
    });
  } catch (error) { next(error); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [skillProfile, resume, interviews, jobs] = await Promise.all([
      SkillProfile.findOne({ user: req.user._id }),
      Resume.findOne({ user: req.user._id, isActive: true }),
      InterviewSession.find({ user: req.user._id, status: 'completed' }).select('overallScore createdAt targetRole'),
      JobApplication.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(5)
    ]);

    const avgInterviewScore = interviews.length
      ? Math.round(interviews.reduce((a, b) => a + b.overallScore, 0) / interviews.length)
      : 0;

    // Activity last 7 days (mock for now)
    const weekActivity = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        minutes: Math.floor(Math.random() * 60 + 10)
      };
    });

    res.json({
      success: true,
      stats: {
        skillScore: skillProfile?.skillScore || 0,
        resumeScore: resume?.atsScore || 0,
        totalSkills: skillProfile?.currentSkills?.length || 0,
        targetRole: skillProfile?.targetRole || 'Not set',
        jobsApplied: await JobApplication.countDocuments({ user: req.user._id }),
        jobsSaved: await JobApplication.countDocuments({ user: req.user._id, status: 'saved' }),
        interviewsDone: interviews.length,
        avgInterviewScore,
        recentJobs: jobs,
        recentInterviews: interviews.slice(0, 3),
        weekActivity,
        careerReadiness: Math.min(100, Math.round(
          (skillProfile?.skillScore || 0) * 0.3 +
          (resume?.atsScore || 0) * 0.3 +
          Math.min(interviews.length * 10, 20) +
          Math.min((await JobApplication.countDocuments({ user: req.user._id })) * 2, 20)
        )),
        roadmapProgress: skillProfile?.learningRoadmap
          ? Math.round((skillProfile.learningRoadmap.filter(r => r.completed).length / (skillProfile.learningRoadmap.length || 1)) * 100)
          : 0
      }
    });
  } catch (error) { next(error); }
};
