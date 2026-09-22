# 🎓 Smart College Admission Counselor Agent

An AI-powered web application that helps Tamil Nadu engineering students identify the most suitable colleges and courses based on their TNEA cutoff marks, community category, budget, preferred location, and interests.

---

## ✨ Features

- **Personalized Recommendations** — Weighted scoring across 6 factors (cutoff compatibility, course preference, location, budget, NIRF quality, student interest)
- **SAFE / MODERATE / AMBITIOUS** classification per college
- **Suitability Breakdown Modal** — Shows exact contribution of each factor to the final score (mathematically transparent)
- **AI Counselor Chat** — Powered by Google Gemini, grounded in live MySQL data. Falls back to a deterministic engine when offline.
- **Results Dashboard** — Sort by suitability score, cutoff delta, NIRF rank, placement rate, or annual fee
- **College Detail Page** — Cutoff trend charts, courses offered, hostel info, accreditation
- **College Comparison** — Side-by-side matrix for up to 3 colleges
- **Cutoff Trends Explorer** — Historical TNEA cutoff data (2023–2025) across categories
- **Course Explorer** — Browse engineering disciplines with offering colleges
- **Student Profile** — View and manage your counselling session
- **Profile Persistence** — Session survives browser refresh via localStorage

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 + TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | Lucide React |
| Backend | Node.js + Express |
| ORM | Sequelize |
| Database | MySQL 8.0 |
| AI | Google Gemini 1.5 Flash |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0
- (Optional) Google Gemini API key

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/smart-college-counselor.git
cd smart-college-counselor
```

### 2. Set up the backend
```bash
cd backend
npm install

# Copy and fill in env variables
cp .env.example .env
# Edit .env with your MySQL credentials and (optionally) Gemini API key
```

### 3. Set up the database
Create the MySQL database:
```sql
CREATE DATABASE smart_counsel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
The backend auto-creates tables and seeds data on first run.

### 4. Start the backend
```bash
node src/server.js
# API runs on http://localhost:5000
```

### 5. Set up and start the frontend
```bash
cd ../frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 📂 Project Structure

```
Mini project/
├── backend/
│   ├── src/
│   │   ├── database/       # Sequelize setup, dbRun/dbGet/dbAll layer
│   │   ├── models/         # Sequelize models (College, Course, Student, etc.)
│   │   ├── routes/         # Express routes (colleges, courses, counseling, AI)
│   │   ├── services/       # recommendationEngine.js, aiCounselorService.js
│   │   ├── seedData.js     # 12 Tamil Nadu colleges, 9 courses, TNEA cutoffs
│   │   └── server.js       # Entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # CollegeCard, SuitabilityBreakdown, Navbar, etc.
│   │   ├── pages/          # 10 views (Landing, Form, Results, Chat, etc.)
│   │   └── App.jsx         # State management + localStorage persistence
│   └── vite.config.js
└── .gitignore
```

---

## 🔒 Environment Variables

Copy `backend/.env.example` to `backend/.env` and set:

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL host (default: `127.0.0.1`) |
| `DB_PORT` | MySQL port (default: `3306`) |
| `DB_NAME` | Database name (`smart_counsel`) |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `GEMINI_API_KEY` | Google Gemini API key (optional) |
| `PORT` | Backend port (default: `5000`) |

> **Note:** The app works fully without a Gemini API key — the AI counselor falls back to a deterministic rule-based engine.

---

## 🎯 Recommendation Algorithm

| Factor | Weight |
|--------|--------|
| Cutoff Compatibility | 55% |
| Course Preference | 15% |
| Location Match | 10% |
| Budget Compatibility | 10% |
| College Quality (NIRF) | 5% |
| Student Interest | 5% |

**Admission Chance Classification:**
- 🟢 **SAFE** — Student cutoff ≥ historical cutoff (Δ ≥ 0)
- 🟡 **MODERATE** — −3.50 ≤ Δ < 0
- 🔴 **AMBITIOUS** — Δ < −3.50

---

## 📸 Key Pages

- **Landing Page** → student entry point
- **Counseling Form Wizard** → multi-step input (marks, category, preferences)
- **Analysis Loading** → animated processing screen
- **Results Dashboard** → ranked recommendations with sortable cards
- **College Detail** → full profile with cutoff trend charts
- **AI Counselor Chat** → ask anything about colleges / cutoffs
