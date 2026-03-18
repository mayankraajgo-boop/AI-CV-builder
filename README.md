# CVPilot — AI-Powered Resume Builder

> © 2026 CVPilot. All rights reserved. Created by Mayank Raj.

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key

### Backend Setup
```bash
cd backend
npm install
# Edit .env — set MONGO_URI and OPENAI_API_KEY
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:5000`.

## Project Structure

```
cvpilot/
├── frontend/          # React + Bootstrap 5
│   └── src/
│       ├── pages/     # Home, Auth, Dashboard, Builder, Templates, Pricing, Settings
│       ├── components/ # Navbar, Sidebar, ResumeCard, AIHelperPanel, etc.
│       ├── store/     # Redux Toolkit (auth + resume slices)
│       ├── services/  # Axios API service
│       ├── hooks/     # useAutoSave
│       └── utils/     # PDF export
└── backend/           # Node.js + Express + TypeScript
    └── src/
        ├── controllers/ # auth, resume, ai
        ├── routes/      # REST API routes
        ├── models/      # User, Resume (Mongoose)
        ├── middleware/  # JWT auth, error handler
        └── services/    # OpenAI integration
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✓ | Get current user |
| PUT | /api/auth/profile | ✓ | Update profile |
| GET | /api/resumes | ✓ | List resumes |
| POST | /api/resumes | ✓ | Create resume |
| PUT | /api/resumes/:id | ✓ | Update resume |
| DELETE | /api/resumes/:id | ✓ | Delete resume |
| POST | /api/ai/generate-summary | ✓ Pro | AI summary |
| POST | /api/ai/improve-section | ✓ Pro | Improve section |
| POST | /api/ai/ats-friendly | ✓ Pro | ATS optimize |
| POST | /api/ai/action-words | ✓ Pro | Action words |
| POST | /api/ai/ats-score | ✓ | ATS score |
| POST | /api/ai/generate-resume | ✓ Pro | Full AI resume |
