# ai-agents-hackathon-2026-syntax-error
Hackathon team repository for Syntax Error - [hackindia-team:ai-agents-hackathon-2026:syntax-error]

# 🚀 CareerIQ AI — Multi-Agent Employment Assistance Platform

## 👥 Team

**Team Name:** Syntax Error  
**HackIndia AI Agents Hackathon 2026**

### Team Members

- **Telugu Bhargav Ram**
- **Naincy Prakash**
- **Soniya Meena**

---
# Live link 
*[(project live link here)](https://hm-azure-ten.vercel.app/)*

# 🎥 Demo Video

*[(demo video link here)](https://www.linkedin.com/posts/soniya-meena-3bb25b395_hackindia-adaption-ai-activity-7471905364863512576-qJ2V?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEzCFwIBmkvuB0_mELpsliUUXe8SGNpUEY8)*

# 📌 About The Project

CareerIQ AI is an AI-powered career intelligence platform that helps students and professionals understand their career direction, identify skill gaps, create personalized learning roadmaps, improve resumes, prepare for interviews, and discover suitable job opportunities.

The platform uses multiple specialized AI agents to provide personalized career assistance instead of generic recommendations.

---

# ❓ Problem Statement

Students and professionals often face difficulties in:
- Choosing the right career path
- Understanding required skills for their target role
- Improving resumes for ATS systems
- Preparing for interviews
- Finding relevant job opportunities
- Tracking career growth

---

# 💡 Our Solution

CareerIQ AI provides an intelligent career assistant that analyzes user profiles and generates:
- **Skill gap analysis**
- **Personalized career roadmap**
- **Resume improvement**
- **Interview preparation**
- **Job recommendations**
- **Career progress tracking**

---

# 🤖 AI Agents

### 1. Skill Analysis Agent
- Skill evaluation
- Missing skill detection
- Market demand analysis
- Learning recommendations

### 2. Resume Builder Agent
- Resume generation
- ATS score analysis
- Resume optimization
- PDF export

### 3. Job Matching Agent
- Job recommendations
- Match confidence score
- Salary prediction
- Remote/hybrid filters

### 4. Interview Preparation Agent
- Role-based interview questions
- Answer evaluation
- AI feedback
- Performance improvement

### 5. Career Roadmap Agent
- 30/60/90/180 day plans
- Learning milestones
- Daily tasks
- Project suggestions

### 6. Local Opportunity Agent
- Location-based opportunities
- Remote jobs
- Career resources

---

# 🔄 AI Workflow

```
User Profile
|
↓
AI Skill Analysis
|
↓
Career Roadmap Generation
|
↓
Resume Optimization
|
↓
Interview Preparation
|
↓
Job Matching
|
↓
Progress Tracking
```

---

# ✨ Features

### 🔐 Authentication
- Register & Login
- OTP Verification via email
- Forgot Password
- Demo Mode

### 👤 Profile Management
- User profile completion tracking
- Skills & Experience management
- Career goals & preferences
- Neutral avatar gallery (no gender assumptions) or photo upload

### 📊 Dashboard
- Career readiness score (with radar chart visualization)
- Progress tracking & weekly activity monitoring
- Agent insights & action cards

### 📄 Resume Intelligence
- Resume upload & AI parsing
- ATS optimization & detailed score breakdown
- Multiple modes (General, ATS, Company-specific, Fresher, Experienced)
- Live preview & PDF export

### 🗺️ Roadmap
- Personalized learning plan
- Weekly & monthly goals
- Daily tasks
- Milestone tracking

### 💬 Interview Coach
- AI questions tailored to roles
- Real-time answer evaluation
- Comprehensive feedback report

### 💼 Job Intelligence
- Tailored job matching
- Skill comparison
- Opportunity discovery

---

# 🏗️ Architecture

```
React Frontend
|
|
Node.js + Express Backend
|
|
MongoDB Database
|
|
AI Services (Gemini / LLM Providers)
```

---

# 🛠️ Tech Stack

### Frontend
- React 18, Vite, Tailwind CSS, Zustand, Framer Motion, Recharts

### Backend
- Node.js, Express.js, MongoDB, Mongoose, JWT Authentication

### AI Services & LLMs
- Google Gemini 2.0 Flash (default)
- Groq (Llama 3.1 70b, Mixtral 8x7b)
- OpenAI (GPT-4o, GPT-4o-mini)
- Claude (Claude 3.5 Sonnet, Claude 3 Haiku)
- DeepSeek (deepseek-chat, deepseek-coder)
- OpenRouter (100+ models support)

### API Providers Matrix

| Provider | Free Tier | Models |
|----------|-----------|--------|
| **Google Gemini** | ✅ 15 RPM free | gemini-2.0-flash, gemini-1.5-pro |
| **Groq** | ✅ Generous free | llama-3.1-70b, mixtral-8x7b |
| **OpenAI** | ❌ Paid | gpt-4o, gpt-4o-mini |
| **Claude** | ❌ Paid | claude-3-5-sonnet, claude-3-haiku |
| **DeepSeek** | ✅ Very cheap | deepseek-chat, deepseek-coder |
| **OpenRouter** | ✅ Free models | 100+ models |

---

# 📂 Project Structure

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

---

# 📈 Key Improvements (Latest Updates)

- Added **Groq** and **DeepSeek** provider support
- Multi-city location selection for opportunities
- Resume profile photo upload
- Fixed hardcoded interview strengths/improvements
- Fixed ATS score toast emoji bug
- Added `vite.config.js` (was missing)
- Improved AI prompts for all 6 agents
- Weekly/monthly goals in roadmap
- Job match confidence scores and salary predictions
- Neutral avatar gallery (no gender assumptions)
- Resume modes: General, ATS, Company-specific, Fresher, Experienced
- Remote/hybrid job filters
- Skill mastery levels in skill analysis

---

# ⚙️ Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure environment variables in .env
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

# 🔐 Environment Variables

Create `.env` in the `backend/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
ENCRYPTION_KEY=your_32_character_encryption_key
```

### Configuration Details:
- `MONGODB_URI` — MongoDB Atlas connection string
- `GEMINI_API_KEY` — Free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- `JWT_SECRET` & `JWT_REFRESH_SECRET` — Random 32+ character strings for secure session tokens
- `EMAIL_USER` & `EMAIL_PASS` — Gmail username and Google App Password for OTP mail services
- `ENCRYPTION_KEY` — Exactly 32 characters for encrypting/decrypting custom API keys

---

# 📊 Dataset

CareerIQ uses a career intelligence dataset containing:
- Profession
- Industry
- Experience level
- Skills
- Career goals
- Career progression data

Dataset Source: [https://huggingface.co/datasets/balh0000/career_iq](https://huggingface.co/datasets/balh0000/career_iq)

---


# 🚀 Future Improvements

- 🤖 **AI Career Chatbot**: A 24/7 interactive chat assistant.
- 🎙️ **Voice Assistant**: Talk directly to the mock interviewer and get voice feedback.
- 💼 **More Job Integrations**: Integration with LinkedIn, Indeed, and glassdoor APIs.
- 🔮 **Advanced Career Prediction**: Multi-year career path projection.
- 📚 **Course Recommendations**: Direct links to learning courses for identified skill gaps.

---

# 📜 License

MIT License

---

# 🏆 Hackathon

Built for:  
**HackIndia AI Agents Hackathon 2026**

Team:  
**Syntax Error**
