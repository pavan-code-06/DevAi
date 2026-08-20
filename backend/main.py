"""
DevGuard AI — FastAPI Application Entry Point
"""

import logging
import os
from pathlib import Path

from dotenv import load_dotenv

# Load .env from the repo root (one level up from backend/)
env_path = Path(__file__).parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
    print(f"Loaded environment from {env_path}")
else:
    load_dotenv()  # fallback: load from CWD or system environment

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from api.routes import router

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  —  %(message)s",
)
logger = logging.getLogger(__name__)

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="DevGuard AI",
    description="AI-powered root-cause debugging assistant for developers",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ───────────────────────────────────────────────────────────────────────
cors_origins_env = os.getenv("CORS_ORIGINS", "").strip()
if cors_origins_env and cors_origins_env != "*":
    allowed_origins = [orig.strip() for orig in cors_origins_env.split(",") if orig.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Allow all origins by default for public API access
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# ── Routes ─────────────────────────────────────────────────────────────────────
app.include_router(router, prefix="/api")

# ── Static Frontend (Optional Full-Stack Serving) ──────────────────────────────
# If frontend/dist exists, serve it so the full application runs from a single service
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
if not frontend_dist.exists():
    frontend_dist = Path(__file__).parent / "dist"

if frontend_dist.exists() and (frontend_dist / "index.html").exists():
    logger.info(f"Serving built frontend from {frontend_dist}")
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="static_frontend")

# ── Startup ────────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    logger.info("DevGuard AI backend starting up")
    has_gemini = bool(os.getenv("GEMINI_API_KEY"))
    has_openai = bool(os.getenv("OPENAI_API_KEY"))
    if has_gemini:
        logger.info("LLM provider: Google Gemini")
    elif has_openai:
        logger.info("LLM provider: OpenAI")
    else:
        logger.warning(
            "No LLM API key detected! Set GEMINI_API_KEY or OPENAI_API_KEY in .env"
        )


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("BACKEND_HOST", "0.0.0.0")
    port = int(os.getenv("PORT", os.getenv("BACKEND_PORT", 8000)))
    uvicorn.run("main:app", host=host, port=port, reload=False)
