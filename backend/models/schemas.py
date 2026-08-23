"""
Pydantic schemas for DevGuard AI API.
"""
from typing import List, Optional
import re
import urllib.parse
from pydantic import BaseModel, HttpUrl, field_validator


def sanitize_repo_url(url: str) -> str:
    """
    Sanitize and normalize Git repository URLs:
    - Strips query parameters (e.g. ?tab=readme-ov-file)
    - Strips fragment identifiers (e.g. #readme)
    - Normalizes GitHub/GitLab tree/blob subpaths to base repository URL
    - Strips trailing slashes
    """
    url = url.strip()
    if not url:
        return ""

    if url.startswith("git@"):
        return url.split("?")[0].split("#")[0].rstrip("/")

    parsed = urllib.parse.urlparse(url)
    if not parsed.scheme:
        url = "https://" + url
        parsed = urllib.parse.urlparse(url)

    if parsed.scheme in ("http", "https"):
        path = parsed.path.rstrip("/")
        subpath_match = re.search(r"^(.*?)(?:/(?:tree|blob)/.*)$", path)
        if subpath_match:
            path = subpath_match.group(1)
        clean_url = urllib.parse.urlunparse((parsed.scheme, parsed.netloc, path, "", "", ""))
        return clean_url.rstrip("/")

    return url.split("?")[0].split("#")[0].rstrip("/")


class AnalyzeRequest(BaseModel):
    repository_url: str
    error_log: Optional[str] = None

    @field_validator("repository_url")
    @classmethod
    def validate_repo_url(cls, v: str) -> str:
        v = sanitize_repo_url(v)
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
