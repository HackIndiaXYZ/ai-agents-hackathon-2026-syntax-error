# ai-agents-hackathon-2026-syntax-error
Hackathon team repository for Syntax Error - [hackindia-team:ai-agents-hackathon-2026:syntax-error]
```md
# 🚀 CareerIQ AI — Multi-Agent Employment Assistance Platform

## 👥 Team

**Team Name:** Syntax Error  
**HackIndia AI Agents Hackathon 2026**

### Team Members

- Telugu Bhargav Ram
- Naincy Prakash
- Soniya Meena


# 📌 About The Project

CareerIQ AI is an AI-powered career intelligence platform that helps students and professionals understand their career direction, identify skill gaps, create personalized learning roadmaps, improve resumes, prepare for interviews, and discover suitable job opportunities.

The platform uses multiple specialized AI agents to provide personalized career assistance instead of generic recommendations.


# ❓ Problem Statement

Students and professionals often face difficulties in:

- Choosing the right career path
- Understanding required skills for their target role
- Improving resumes for ATS systems
- Preparing for interviews
- Finding relevant job opportunities
- Tracking career growth


# 💡 Our Solution

CareerIQ AI provides an intelligent career assistant that analyzes user profiles and generates:

- Skill gap analysis
- Personalized career roadmap
- Resume improvement
- Interview preparation
- Job recommendations
- Career progress tracking


# 🤖 AI Agents

## 1. Skill Analysis Agent

- Skill evaluation
- Missing skill detection
- Market demand analysis
- Learning recommendations


## 2. Resume Builder Agent

- Resume generation
- ATS score analysis
- Resume optimization
- PDF export


## 3. Job Matching Agent

- Job recommendations
- Match confidence score
- Salary prediction
- Remote/hybrid filters


## 4. Interview Preparation Agent

- Role-based interview questions
- Answer evaluation
- AI feedback
- Performance improvement


## 5. Career Roadmap Agent

- 30/60/90/180 day plans
- Learning milestones
- Daily tasks
- Project suggestions


## 6. Local Opportunity Agent

- Location-based opportunities
- Remote jobs
- Career resources


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


# ✨ Features

## Authentication

- Register
- Login
- OTP Verification
- Forgot Password
- Demo Mode


## Profile Management

- User profile
- Skills
- Experience
- Career goals
- Preferences


## Dashboard

- Career readiness score
- Progress tracking
- Agent insights
- Activity monitoring


## Resume Intelligence

- Resume upload
- AI parsing
- ATS optimization
- Multiple templates
- PDF export


## Roadmap

- Personalized learning plan
- Weekly goals
- Daily tasks
- Milestone tracking


## Interview Coach

- AI questions
- Answer evaluation
- Feedback report


## Job Intelligence

- Job matching
- Skill comparison
- Opportunity discovery


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
AI Services
(Gemini / LLM Providers)

```


# 🛠️ Tech Stack

## Frontend

- React 18
- Vite
- Tailwind CSS
- Zustand
- Framer Motion
- Recharts


## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication


## AI

- Gemini 2.0 Flash
- Groq
- OpenAI
- Claude
- DeepSeek
- OpenRouter


# 📂 Project Structure

```

CareerIQ/

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
````


# ⚙️ Installation

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
````

## Frontend

```bash
cd frontend
npm install
npm run dev
```

# 🔐 Environment Variables

Create `.env` in backend:

```
MONGODB_URI=

GEMINI_API_KEY=

JWT_SECRET=

EMAIL_USER=

EMAIL_PASS=

ENCRYPTION_KEY=
```

# 📊 Dataset

CareerIQ uses a career intelligence dataset containing:

* Profession
* Industry
* Experience level
* Skills
* Career goals
* Career progression data

Dataset:

[https://huggingface.co/datasets/balh0000/career_iq](https://huggingface.co/datasets/balh0000/career_iq)

# 🎥 Demo Video

(Add HackIndia demo video link)

# 📸 Screenshots

(Add screenshots)

* Landing Page
* Dashboard
* AI Analysis
* Resume Builder
* Roadmap
* Interview

# 🚀 Future Improvements

* AI career chatbot
* Voice assistant
* More job integrations
* Advanced career prediction
* Course recommendations

# 📜 License

MIT License

# 🏆 Hackathon

Built for:

**HackIndia AI Agents Hackathon 2026**

Team:

**Syntax Error**

```

