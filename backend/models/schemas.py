"""
Pydantic schemas for DevGuard AI API.
"""
from typing import List, Optional
from pydantic import BaseModel, HttpUrl, field_validator


class AnalyzeRequest(BaseModel):
    repository_url: str
    error_log: Optional[str] = None

    @field_validator("repository_url")
    @classmethod
    def validate_repo_url(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("repository_url cannot be empty")
        # Accept github.com or any git-clonable URL for flexibility
        if not (v.startswith("https://") or v.startswith("http://") or v.startswith("git@")):
            raise ValueError("repository_url must be a valid HTTP/HTTPS/SSH URL")
        return v


class RepositoryContext(BaseModel):
    """Internal model representing the analyzed repository context."""
    repo_url: str
    structure: str                     # Tree-like string of the repo layout
    dependency_files: dict             # filename -> content
    config_files: dict                 # filename -> content
    source_files: dict                 # filepath -> content
    total_files_found: int
    total_bytes_sent: int


class AnalysisResult(BaseModel):
    """Structured result returned by the AI analyzer."""
    root_cause: str
    severity: str                      # Low | Medium | High | Critical
    confidence: str                    # e.g. "High (85%)"
    evidence: List[str]
    affected_files: List[str]
    suggested_fix: str
    explanation: str
    ai_fix_prompt: Optional[str] = None # High-quality prompt for coding agents
    # metadata added by the backend
    repo_url: Optional[str] = None
    analysis_duration_seconds: Optional[float] = None


class FixPromptRequest(BaseModel):
    """Request to generate or regenerate an AI fix prompt from an existing diagnosis."""
    root_cause: str
    severity: Optional[str] = "Medium"
    confidence: Optional[str] = "High"
    evidence: List[str] = []
    affected_files: List[str] = []
    suggested_fix: str
    explanation: Optional[str] = ""
    repository_url: Optional[str] = ""
    error_log: Optional[str] = ""


class FixPromptResponse(BaseModel):
    ai_fix_prompt: str


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
