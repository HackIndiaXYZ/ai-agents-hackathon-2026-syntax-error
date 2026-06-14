# ai-agents-hackathon-2026-syntax-error
Hackathon team repository for Syntax Error - [hackindia-team:ai-agents-hackathon-2026:syntax-error]
# CareerIQ AI — Multi-Agent Employment Assistance Platform

A production-ready, hackathon-winning AI-powered career platform with 6 specialized AI agents to help users find jobs, build resumes, ace interviews, and plan their careers.

## Features

### 6 AI Career Agents
- **Skill Analysis Agent** — Deep gap analysis, mastery levels, market demand, learning roadmap
- **Resume Builder Agent** — ATS scoring with breakdown, live preview, profile photo, multiple modes & templates, PDF export
- **Job Matching Agent** — Direct apply links, match confidence, salary prediction, remote/hybrid filters
- **Interview Prep Agent** — Role-specific questions, real-time answer evaluation, performance report
- **Career Roadmap Agent** — Weekly/monthly goals, milestone tracker, 30-180 day plans
- **Local Opportunity Agent** — Multi-city search, state/country filters, remote jobs, govt portals

### Platform Features
- Authentication: Register, Login, Demo mode, OTP email verification, Forgot password
- Profile: Avatar gallery (no gender assumptions), photo upload, profile completion
- Settings: 6 AI providers — Gemini, Groq, OpenAI, Claude, DeepSeek, OpenRouter
- Dashboard: Career readiness score, stats, radar chart, weekly activity, agent cards
- All exports: PDF download for resume, skill analysis, interview guide, roadmap

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Zustand, Recharts  
**Backend:** Node.js, Express, MongoDB/Mongoose, JWT auth  
**AI:** Gemini 2.0 Flash (default), Groq, OpenAI GPT, Claude, DeepSeek, OpenRouter  

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Setup

Copy `.env.example` to `.env` in the `backend/` directory and fill in:
- `MONGODB_URI` — MongoDB Atlas connection string
- `GEMINI_API_KEY` — Free from https://aistudio.google.com/app/apikey
- `JWT_SECRET` & `JWT_REFRESH_SECRET` — Random 32+ char strings
- `EMAIL_USER` & `EMAIL_PASS` — Gmail + App Password for OTP emails
- `ENCRYPTION_KEY` — Exactly 32 characters for API key encryption

## API Providers Supported

| Provider | Free Tier | Models |
|----------|-----------|--------|
| Google Gemini | ✅ 15 RPM free | gemini-2.0-flash, gemini-1.5-pro |
| Groq | ✅ Generous free | llama-3.1-70b, mixtral-8x7b |
| OpenAI | ❌ Paid | gpt-4o, gpt-4o-mini |
| Claude | ❌ Paid | claude-3-5-sonnet, claude-3-haiku |
| DeepSeek | ✅ Very cheap | deepseek-chat, deepseek-coder |
| OpenRouter | ✅ Free models | 100+ models |

## Architecture

```
startup-intelligence/
├── backend/
│   ├── controllers/    # Business logic
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── services/       # AI agents (gemini.service.js)
│   ├── middleware/     # Auth middleware
│   └── server.js       # Express entry
└── frontend/
    ├── src/
    │   ├── pages/      # All page components
    │   ├── components/ # Layout, UI components
    │   ├── store/      # Zustand auth store
    │   └── services/   # Axios API client
    └── vite.config.js  # Dev proxy config
```

## Key Improvements (Latest Update)

- Added Groq and DeepSeek provider support
- Multi-city location selection for opportunities
- Resume profile photo upload
- Fixed hardcoded interview strengths/improvements
- Fixed ATS score toast emoji bug
- Added vite.config.js (was missing)
- Improved AI prompts for all 6 agents
- Weekly/monthly goals in roadmap
- Job match confidence scores and salary predictions
- Neutral avatar gallery (no gender assumptions)
- Resume modes: General, ATS, Company-specific, Fresher, Experienced
- Remote/hybrid job filters
- Skill mastery levels in skill analysis

## License

MIT
