const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { callLLM } = require('../services/gemini.service');
const ApiSettings = require('../models/ApiSettings');

// Helper: get user's complete LLM configuration (provider, model, key)
const getUserLLMConfig = async (userId) => {
  try {
    const settings = await ApiSettings.findOne({ user: userId });
    if (settings) {
      const keys = settings.getDecryptedKeys();
      const activeProvider = keys.activeProvider || 'default';
      let provider = activeProvider;
      let key = null;
      if (activeProvider === 'default' || activeProvider === 'gemini') {
        key = keys.geminiKey || process.env.GEMINI_API_KEY;
        provider = 'gemini';
      }
      return { provider: provider, model: keys.activeModel || 'gemini-2.0-flash', apiKey: key };
    }
  } catch {}
  return { provider: 'gemini', model: 'gemini-2.0-flash', apiKey: process.env.GEMINI_API_KEY };
};

const parseJSON = (raw) => {
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  throw new Error('Failed to parse AI response');
};

// @desc    Parse resume from PDF/DOCX to extract structured data
// @route   POST /api/resume/parse
const parseResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    let textToParse = '';

    try {
      if (req.file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(req.file.buffer);
        textToParse = pdfData.text;
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        textToParse = result.value;
      }
    } catch (parseError) {
      console.warn('Primary parser failed, falling back to basic extraction', parseError);
      textToParse = req.file.buffer.toString('utf8').replace(/[^\x20-\x7E\n]/g, ' '); // Very raw fallback
    }

    if (!textToParse || textToParse.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Could not extract text from file.' });
    }

    // Call LLM to extract structured data
    const prompt = `You are an expert AI Resume Builder and Career Coach. Your task is to extract the EXACT facts from the provided resume text, but ACTIVELY IMPROVE and rewrite the descriptions and summary to make them highly ATS-friendly, impactful, and results-oriented.

CRITICAL RULES:
1. Do NOT change factual details like company names, job titles, dates, degrees, or university names. Use the exact facts from the text.
2. DO NOT use fake or mock details. If a field is missing, omit it or leave it empty.
3. Rewrite the "summary" and "experience.description" fields to be professional, using strong action verbs (e.g., "Architected", "Spearheaded") and quantifiable metrics if they can be reasonably inferred or structured better.
4. Ensure the final output is significantly better than the original raw text, tailored for ATS systems.

Return ONLY valid JSON with this exact structure:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "portfolio": ""
  },
  "summary": "",
  "experience": [
    {
      "company": "",
      "role": "",
      "startDate": "",
      "endDate": "",
      "location": "",
      "description": "REWRITTEN AND IMPROVED ATS-FRIENDLY DESCRIPTION HERE"
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "score": ""
    }
  ],
  "skills": [],
  "projects": [
    {
      "name": "",
      "description": "REWRITTEN ATS-FRIENDLY DESCRIPTION",
      "technologies": [],
      "link": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": ""
    }
  ]
}

RESUME TEXT:
${textToParse}
`;

    // Fetch user's LLM config
    const llmConfig = await getUserLLMConfig(req.user._id);
    const rawResult = await callLLM(prompt, llmConfig);
    const parsedData = parseJSON(rawResult);

    res.json({
      success: true,
      message: 'Resume parsed and optimized successfully',
      data: parsedData
    });

  } catch (error) {
    console.error('Resume Parse Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process resume with AI. Please check your AI API key settings or try again later.',
      error: error.message
    });
  }
};

module.exports = { parseResume };
