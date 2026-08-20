# DevGuard AI — Root-Cause Debugging Assistant

> AI-powered tool that analyzes a GitHub repository + error log and produces a structured root-cause diagnosis.

---

## Quick Start

### 1. Clone and set up

```bash
git clone <this-repo>
cd devguard-ai
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

Get a free Gemini API key at: https://aistudio.google.com

### 3. Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Install frontend dependencies

```bash
cd frontend
npm install
```

---

## Running the App

### Start backend (from the `backend/` directory)

```bash
cd backend
python main.py
# or
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Start frontend (from the `frontend/` directory)

```bash
cd frontend
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes (or OpenAI) | Google Gemini API key |
| `OPENAI_API_KEY` | Optional | OpenAI API key (alternative provider) |
| `OPENAI_MODEL` | Optional | OpenAI model (default: `gpt-3.5-turbo`) |
| `MAX_CONTEXT_BYTES` | Optional | Max bytes of code sent to LLM (default: 60000) |
| `MAX_FILE_BYTES` | Optional | Max bytes per file (default: 15000) |

---

## Testing with the Demo Project

The `demo-project/` directory contains an intentionally broken Flask app.

The bug: **Flask 2.3.3 is pinned alongside Werkzeug 0.16.1** — an incompatible version combination that causes an `ImportError` at startup.

### To test:

1. Push `demo-project/` to a public GitHub repository
2. Open DevGuard AI at http://localhost:5173
3. Paste the repository URL
4. Paste this error log:

```
Traceback (most recent call last):
  File "app.py", line 1, in <module>
    from flask import Flask, jsonify
  File "/usr/local/lib/python3.10/site-packages/flask/__init__.py", line 14, in <module>
    from .app import Flask as Flask
  File "/usr/local/lib/python3.10/site-packages/flask/app.py", line 28, in <module>
    from werkzeug.datastructures import Headers, ImmutableDict
ImportError: cannot import name 'ImmutableDict' from 'werkzeug.datastructures'
(/usr/local/lib/python3.10/site-packages/werkzeug/datastructures/__init__.py)
```

5. Click "Analyze"
6. DevGuard AI should identify the `Werkzeug==0.16.1` version mismatch as the root cause

---

## Project Structure

```
devguard-ai/
├── frontend/               # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyzeForm.jsx     # URL + error log input form
│   │   │   ├── LoadingState.jsx    # Animated progress steps
│   │   │   └── ResultReport.jsx    # Structured analysis report
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/                # Python FastAPI
│   ├── main.py             # App entry point
│   ├── api/routes.py       # POST /api/analyze
│   ├── services/
│   │   ├── repository_analyzer/analyzer.py  # Clones & extracts repo context
│   │   └── ai_analyzer/analyzer.py          # Calls LLM, parses result
│   ├── models/schemas.py   # Pydantic request/response models
│   └── requirements.txt
│
├── demo-project/           # Intentionally broken Flask app (for testing)
├── .env.example
└── README.md
```

---

## API Reference

### POST /api/analyze

**Request:**
```json
{
  "repository_url": "https://github.com/owner/repo",
  "error_log": "Traceback (most recent call last):\n..."
}
```

**Response:**
```json
{
  "root_cause": "...",
  "severity": "High",
  "confidence": "High (85%)",
  "evidence": ["...", "..."],
  "affected_files": ["requirements.txt", "app.py"],
  "suggested_fix": "...",
  "explanation": "...",
  "repo_url": "https://github.com/owner/repo",
  "analysis_duration_seconds": 28.4
}
```

---

## Deployment Guide

### Option A: 1-Click Deploy on Render (Recommended)

1. Push this repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New** -> **Blueprint**.
3. Connect your repository. Render will automatically read [`render.yaml`](file:///c:/Users/pavan/OneDrive/Desktop/DevAI/devguard-ai/render.yaml) to provision both:
   - **`devguard-ai-backend`**: FastAPI web service
   - **`devguard-ai-frontend`**: Static Vite site connected to the backend
4. Set the `GEMINI_API_KEY` environment variable in the Render dashboard.
5. Click **Apply**.

---

### Option B: Deploy Backend on Render / Railway + Frontend on Vercel

#### 1. Backend (Render / Railway)
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `GEMINI_API_KEY`: Your Google AI Studio key
  - `CORS_ORIGINS`: `*` (or your frontend domain)

#### 2. Frontend (Vercel / Netlify / Cloudflare Pages)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Your deployed backend URL (e.g., `https://devguard-backend.onrender.com`)

---

## Known Limitations (Prototype v1)

- Only public GitHub repositories are supported
- Very large repositories may be partially analyzed (context is capped at ~60KB)
- Analysis takes 20–60 seconds depending on repo size and LLM response time
- No authentication, rate limiting, or caching
- Redis, queues, Docker, and worker pools are planned for v2

