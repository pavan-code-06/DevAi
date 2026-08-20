"""
Pydantic schemas for DevGuard AI API.
"""
from typing import List, Optional
from pydantic import BaseModel, HttpUrl, field_validator


class AnalyzeRequest(BaseModel):
    repository_url: str
    error_log: str

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

    @field_validator("error_log")
    @classmethod
    def validate_error_log(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("error_log cannot be empty — paste the error or log output")
        if len(v) < 10:
            raise ValueError("error_log is too short — please provide more detail")
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
    # metadata added by the backend
    repo_url: Optional[str] = None
    analysis_duration_seconds: Optional[float] = None


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
