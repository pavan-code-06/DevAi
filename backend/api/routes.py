"""
API routes — DevGuard AI

POST /api/analyze
  - Validates request
  - Runs repository analyzer
  - Runs AI analyzer
  - Returns structured AnalysisResult
"""

import time
import logging

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from models.schemas import (
    AnalyzeRequest,
    AnalysisResult,
    FixPromptRequest,
    FixPromptResponse,
    ErrorResponse,
)
from services.repository_analyzer.analyzer import RepositoryAnalyzer
from services.ai_analyzer.analyzer import AIAnalyzer

router = APIRouter()
logger = logging.getLogger(__name__)

repo_analyzer = RepositoryAnalyzer()
ai_analyzer = AIAnalyzer()


@router.post(
    "/analyze",
    response_model=AnalysisResult,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid input"},
        422: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Analysis failed"},
    },
    summary="Analyze a repository and error log for root-cause diagnosis",
)
def analyze(request: AnalyzeRequest):
    start_time = time.time()
    logger.info(f"Received analyze request for: {request.repository_url}")

    # ── Step 1: Repository Analysis ────────────────────────────
    try:
        repo_context = repo_analyzer.analyze(request.repository_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception("Unexpected error during repository analysis")
        raise HTTPException(
            status_code=500,
            detail=f"Repository analysis failed unexpectedly: {str(e)}"
        )

    # ── Step 2: AI Root-Cause Analysis ────────────────────────
    try:
        result_data = ai_analyzer.analyze(request.error_log, repo_context)
    except EnvironmentError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI returned an invalid response: {str(e)}"
        )
    except Exception as e:
        logger.exception("Unexpected error during AI analysis")
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    # ── Step 3: Build Response ─────────────────────────────────
    duration = round(time.time() - start_time, 2)
    result_data["repo_url"] = request.repository_url
    result_data["analysis_duration_seconds"] = duration

    logger.info(f"Analysis complete in {duration}s — severity: {result_data.get('severity')}")

    return AnalysisResult(**result_data)


@router.post(
    "/generate-fix-prompt",
    response_model=FixPromptResponse,
    summary="Generate or regenerate an AI fix prompt from diagnosis context",
)
def generate_fix_prompt(request: FixPromptRequest):
    """Generate a clean, structured coding prompt for external coding agents."""
    prompt = ai_analyzer.generate_fix_prompt(
        root_cause=request.root_cause,
        severity=request.severity or "Medium",
        confidence=request.confidence or "High",
        evidence=request.evidence,
        affected_files=request.affected_files,
        suggested_fix=request.suggested_fix,
        explanation=request.explanation or "",
        repository_url=request.repository_url or "",
        error_log=request.error_log or "",
    )
    return FixPromptResponse(ai_fix_prompt=prompt)


@router.get("/health", summary="Health check")
async def health():
    return {"status": "ok", "service": "DevGuard AI"}
