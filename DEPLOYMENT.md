# Production Deployment Guide
## Smart College Admission Counselor Agent (TNEA Intelligence)

This guide documents the step-by-step procedure for deploying the **Smart College Admission Counselor Agent** to public production using modern, production-grade cloud services:
* **Frontend**: [Vercel](https://vercel.com/) (Global Edge CDN, React + Vite SPA)
* **Backend**: [Render](https://render.com/) or [Railway](https://railway.app/) (Managed Node.js runtime)
* **Database**: Managed MySQL ([Aiven](https://aiven.io/), [Railway MySQL](https://railway.app/), [PlanetScale](https://planetscale.com/), [DigitalOcean](https://www.digitalocean.com/products/managed-databases), or [AWS RDS](https://aws.amazon.com/rds/))

---

### Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │            Browser Client            │
                      └──────────────────┬───────────────────┘
                                         │
                        HTTPS Requests   │
                                         ▼
   ┌─────────────────────────────────────┴─────────────────────────────────────┐
   │                                                                           │
   ▼                                                                           ▼
┌─────────────────────────┐                                 ┌─────────────────────────┐
│     Vercel Frontend     │                                 │     Render / Railway    │
│    (React + Vite SPA)   │  ── API Requests (VITE_API_URL) ──▶   (Node.js Express)   │
│   *.vercel.app          │                                 │  https://.../api        │
└─────────────────────────┘                                 └────────────┬────────────┘
                                                                         │
                                                             Sequelize   │ SSL / TCP
                                                               Pool      │ Port 3306
                                                                         ▼
                                                            ┌─────────────────────────┐
                                                            │   Managed Cloud MySQL   │
                                                            │ (176 Colleges, Cutoffs) │
                                                            └─────────────────────────┘
```

---

## 1. Database Setup & Migration

The application uses MySQL with 14 relational tables (176 institutions, 16 engineering branches, 1,188 course mappings, 6,384 TNEA cutoffs, and 2,128 historical records).

### Option A: Automatic Seeding on First Boot (Easiest)
The backend includes an automatic data loader ([`backend/src/database/dataLoader.js`](file:///c:/Users/VISHNU%20SR/OneDrive/Desktop/Mini%20project/backend/src/database/dataLoader.js)). When deployed to a fresh, empty cloud MySQL database, the server will automatically:
1. Detect uninitialized tables.
2. Synchronize the schema via Sequelize.
3. Seed all 38 Tamil Nadu districts, 16 courses, 176 institutions, 1,188 offerings, and baseline cutoffs from the packaged repository datasets.

### Option B: Export & Import Existing Database Dump
To replicate the exact current local MySQL database state into a cloud database:

1. **Export the local database**:
   Run the included export utility from your terminal or double-click:
   ```cmd
   scripts\export_database.bat
   ```
   *(Or run `powershell -ExecutionPolicy Bypass -File scripts\export_database.ps1`)*
   This produces a single, optimized dump file: `smart_counsel_dump.sql` (~1.5 MB).

2. **Import into your managed cloud MySQL database**:
   ```bash
   mysql -h <CLOUD_DB_HOST> -P <CLOUD_DB_PORT> -u <CLOUD_DB_USER> -p <CLOUD_DB_NAME> < smart_counsel_dump.sql
   ```

### Required Database Environment Variables
| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `DB_HOST` | Cloud database hostname | `gateway.aws.aivencloud.com` or `roundhouse.proxy.rlwy.net` |
| `DB_PORT` | Port number | `3306` (or provider allocated port, e.g. `24512`) |
| `DB_USER` | MySQL database user | `avnadmin` or `root` |
| `DB_PASS` | MySQL database password | `[REDACTED_SECURE_PASSWORD]` |
| `DB_NAME` | Database schema name | `smart_counsel` (or `defaultdb`) |
| `DB_DIALECT`| Sequelize dialect | `mysql` |
| `DB_SSL` | Enable SSL for cloud transit | `true` |
| *`DATABASE_URL`* | *(Alternative)* Full connection URI | `mysql://user:pass@host:port/dbname` |

---

## 2. Backend Deployment (Render or Railway)

### Recommended: Render Web Service

1. **Create Web Service**:
   * Connect your GitHub repository on [Render Dashboard](https://dashboard.render.com/).
   * Select **Web Service**.
2. **Configure Service Settings**:
   * **Name**: `smart-counsel-api` (or your preferred name)
   * **Region**: `Singapore` or `Frankfurt` (closest to your users)
   * **Root Directory**: `backend`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node src/server.js`
   * **Instance Type**: Free or Starter
3. **Environment Variables on Render**:
   In the **Environment** tab, add:
   ```ini
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-counselor-app.vercel.app
   ALLOWED_ORIGINS=https://your-counselor-app.vercel.app,http://localhost:3000
   DB_HOST=<YOUR_CLOUD_DB_HOST>
   DB_PORT=<YOUR_CLOUD_DB_PORT>
   DB_USER=<YOUR_CLOUD_DB_USER>
   DB_PASS=<YOUR_CLOUD_DB_PASSWORD>
   DB_NAME=<YOUR_CLOUD_DB_NAME>
   DB_DIALECT=mysql
   DB_SSL=true
   GEMINI_API_KEY=<YOUR_GOOGLE_GEMINI_API_KEY>
   ```
   *(If using Railway/Aiven MySQL URL, you can alternatively set `DATABASE_URL=mysql://...`)*
4. **Health Check Path**:
   Set Health Check path to `/api/health`.
5. **Deploy**:
   Click **Create Web Service**. Wait for the build and deployment logs to display:
   ```text
   🚀 SmartCounsel API Server running on port 5000
   🌍 Mode: production
   🔗 Health check: /api/health
   ```
   Note your public API URL (e.g. `https://smart-counsel-api.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

### Deploying the React + Vite Client

1. **Import Project to Vercel**:
   * Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New... -> Project**.
   * Select your GitHub repository.
2. **Project Settings**:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click *Edit* and select `frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
   * **Install Command**: `npm install`
3. **Environment Variables on Vercel**:
   Add the following environment variable:
   ```ini
   VITE_API_URL=https://smart-counsel-api.onrender.com/api
   ```
   *(Replace with your actual Render/Railway backend URL; include `/api`)*
4. **Single Page Application (SPA) Routing**:
   The repository already includes [`frontend/vercel.json`](file:///c:/Users/VISHNU%20SR/OneDrive/Desktop/Mini%20project/frontend/vercel.json) configured with:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
   This ensures deep linking, browser back/forward buttons, and page reloads work seamlessly without 404 errors.
5. **Deploy**:
   Click **Deploy**. Vercel will build the production assets and assign your production domain:
   `https://your-counselor-app.vercel.app`

---

## 4. Post-Deployment Verification Checklist

Once both services are active, perform these tests:

### 1. API Health Check
Open in your browser or curl:
```bash
curl https://your-backend-api.onrender.com/api/health
```
**Expected Response (HTTP 200)**:
```json
{
  "status": "ok",
  "database": "connected",
  "system": "Smart College Admission Counselor Agent API",
  "timestamp": "2026-09-28T16:20:00.000Z"
}
```

### 2. Tamil Nadu Colleges Directory
```bash
curl https://your-backend-api.onrender.com/api/tamilnadu/institutions?limit=5
```
Verify that the 176 Tamil Nadu colleges load with proper names, TNEA codes, and districts.

### 3. Recommendation Scoring Test
```bash
curl -X POST https://your-backend-api.onrender.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"name":"Student","cutoff":187.5,"category":"BC","courses":["ECE","CSE"],"location":"Coimbatore","budget":150000}'
```
Verify that `recommendations` array returns classified results (`SAFE`, `MODERATE`, `AMBITIOUS`).

### 4. Frontend End-to-End Walkthrough
Open your public Vercel URL in a browser:
1. Verify homepage loads with 176 institutions and 38 districts in statistics.
2. Click **Start Counseling** $\to$ Click **Load Demo Data** (or enter 187.5 cutoff) $\to$ Click **Generate Recommendations**.
3. Confirm Results Dashboard displays Safe, Moderate, and Ambitious institutions.
4. Click **TNEA Choice Sheet (3:3:2)** $\to$ Confirm ordered choice sequence (8 choices) and test CSV export.
5. Click **AI Counselor** $\to$ Submit a query and verify CounselChat responds with admissions intelligence.

---

## 5. Security & Maintenance

* **Zero Leaked Secrets**: No passwords, API keys, or private database credentials exist in frontend code or Git history.
* **CORS Protection**: The backend accepts requests exclusively from your specified `FRONTEND_URL` and `ALLOWED_ORIGINS`.
* **Database Backups**: Schedule automated daily backups on your cloud MySQL provider (Render/Aiven/AWS provide automatic snapshot retention).
