# DevGuard AI — Autonomous Codebase Debugger & AI Fix Prompt Generator

> Autonomous AI-powered tool that analyzes a GitHub repository, diagnoses root-cause bugs, and generates ready-to-use fix prompts for coding agents.

---

## Features

- **Repository-Only Analysis**: Simply paste a public GitHub repository URL — no error log or stack trace required.
- **Deep Codebase Inspection**: Automatically clones and audits dependency manifests (`requirements.txt`, `pyproject.toml`, `package.json`), configuration files, and source code.
- **Autonomous Root-Cause Diagnosis**: Detects version incompatibilities, broken imports, symbol errors, and runtime bugs.
- **🛠️ AI Fix Prompt Generator**: Generates an actionable 10-section implementation prompt (~450–500 words) ready to copy directly into Antigravity, Gemini, Cursor, Copilot, or ChatGPT.

---

## Quick Start

### 1. Clone and set up

```bash
git clone https://github.com/pavan-code-06/DevAi.git
cd DevAi/devguard-ai
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

Get a free Gemini API key at: https://aistudio.google.com/apikey

### 3. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## Running the App Locally

### Start backend (from the `backend/` directory)

```bash
cd backend
python main.py
# or
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Backend API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

### Start frontend (from the `frontend/` directory)

```bash
cd frontend
npm run dev
```

- Frontend UI: http://localhost:5173

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes (or OpenAI) | Google AI Studio API key |
| `GEMINI_MODEL` | Optional | Gemini model name (default: `gemini-3.6-flash`) |
| `OPENAI_API_KEY` | Optional | OpenAI API key (alternative provider) |
| `CORS_ORIGINS` | Optional | Allowed origins (default: `*`) |
| `MAX_CONTEXT_BYTES` | Optional | Max context budget sent to LLM (default: 60000) |
| `MAX_FILE_BYTES` | Optional | Max bytes per individual file (default: 15000) |

---

## Project Structure

```
devguard-ai/
├── frontend/               # React 18 + Vite 5 + Tailwind CSS 3
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyzeForm.jsx     # GitHub URL input & validation
│   │   │   ├── LoadingState.jsx    # Step progress animation
│   │   │   └── ResultReport.jsx    # Report view + AI Fix Prompt (copy/regen)
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vercel.json         # Vercel SPA routing
│
├── backend/                # Python FastAPI
│   ├── main.py             # Server entry point & static mount
│   ├── api/routes.py       # POST /api/analyze & POST /api/generate-fix-prompt
│   ├── services/
│   │   ├── repository_analyzer/analyzer.py  # Git shallow clone & context extraction
│   │   └── ai_analyzer/analyzer.py          # AI reasoning & prompt generator
│   ├── models/schemas.py   # Pydantic request/response models
│   ├── requirements.txt
│   └── Procfile            # Render/Heroku process configuration
│
├── demo-project/           # Intentionally broken test project
├── render.yaml             # Render Blueprint configuration
├── .env.example            # Safe environment template
└── README.md
```

---

## API Reference

### 1. POST `/api/analyze`

**Request:**
```json
{
  "repository_url": "https://github.com/pallets/flask"
}
```

**Response:**
```json
{
  "root_cause": "src/flask/app.py imports ImmutableDict removed in Werkzeug 3.0+.",
  "severity": "Critical",
  "confidence": "High (90%)",
  "evidence": [
    "pyproject.toml pins werkzeug>=3.1.0",
    "src/flask/app.py imports ImmutableDict"
  ],
  "affected_files": ["src/flask/app.py", "pyproject.toml"],
  "suggested_fix": "In src/flask/app.py, replace ImmutableDict with types.MappingProxyType.",
  "explanation": "Werkzeug 3.0 removed ImmutableDict causing startup crash.",
  "ai_fix_prompt": "# AI Debugging & Remediation Prompt\n\n## 1. ROLE...",
  "repo_url": "https://github.com/pallets/flask",
  "analysis_duration_seconds": 32.4
}
```

### 2. POST `/api/generate-fix-prompt`

**Request:**
```json
{
  "root_cause": "...",
  "severity": "Critical",
  "confidence": "High (90%)",
  "evidence": ["..."],
  "affected_files": ["..."],
  "suggested_fix": "...",
  "explanation": "...",
  "repository_url": "https://github.com/owner/repo"
}
```

**Response:**
```json
{
  "ai_fix_prompt": "# AI Debugging & Remediation Prompt..."
}
```

---

## Production Deployment

### Backend (Render)
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `GEMINI_API_KEY`: Your Google AI Studio key
  - `GEMINI_MODEL`: `gemini-3.6-flash`
  - `CORS_ORIGINS`: `*`
  - `PYTHON_VERSION`: `3.11.9`

### Frontend (Vercel)
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Your live Render backend URL (e.g. `https://devguard-ai-backend.onrender.com`)

---

## Limitations & Architecture Notes

- Only public Git repositories are supported in the prototype.
- Repositories are analyzed up to a configurable context budget (~60 KB) focusing on manifests, configuration, and entry-point source files.
- The AI analyzer adheres to an accuracy rule: If static evidence is inconclusive, it explicitly reports *"Insufficient evidence from repository inspection"* rather than speculating.
