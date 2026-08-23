"""
Repository Analyzer — DevGuard AI

Clones a public GitHub repository to a temp directory, walks the
file tree, extracts relevant source / dependency / config files,
and returns a clean RepositoryContext ready to be sent to the LLM.
"""

import os
import re
import shutil
import tempfile
import logging
from pathlib import Path
from typing import Dict, Tuple

import git

logger = logging.getLogger(__name__)

# ── Constants ──────────────────────────────────────────────────────────────────

IGNORED_DIRS = {
    "node_modules", ".git", "build", "dist", "target",
    "__pycache__", ".gradle", ".idea", ".vscode", "venv",
    ".venv", "env", ".env", "coverage", ".nyc_output",
    "generated", "gen", "out", ".next", ".nuxt", "vendor",
    "Pods", ".dart_tool", ".flutter-plugins",
}

IGNORED_EXTENSIONS = {
    ".pyc", ".pyo", ".class", ".jar", ".war", ".ear",
    ".zip", ".tar", ".gz", ".rar", ".7z",
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
    ".woff", ".woff2", ".ttf", ".eot",
    ".mp3", ".mp4", ".mov", ".avi",
    ".pdf", ".docx", ".xlsx",
    ".lock",  # package-lock.json, yarn.lock, etc. — too noisy
}

DEPENDENCY_FILES = {
    "package.json", "requirements.txt", "pyproject.toml",
    "pom.xml", "build.gradle", "build.gradle.kts",
    "pubspec.yaml", "Gemfile", "Gemfile.lock",
    "go.mod", "go.sum", "Cargo.toml", "composer.json",
    "setup.py", "setup.cfg",
}

CONFIG_FILES = {
    "*.env", ".env.example", "*.env.example",
    "config.py", "config.js", "config.ts",
    "settings.py", "settings.js",
    "webpack.config.js", "vite.config.js", "vite.config.ts",
    "tsconfig.json", "jsconfig.json",
    "jest.config.js", "jest.config.ts",
    "babel.config.js", ".babelrc",
    "docker-compose.yml", "docker-compose.yaml",
    "Dockerfile",
    "nginx.conf", "apache.conf",
    "application.yml", "application.yaml",
    "application.properties",
    ".eslintrc.js", ".eslintrc.json",
    "pytest.ini", "mypy.ini", "tox.ini",
}

SOURCE_EXTENSIONS = {
    ".py", ".js", ".ts", ".jsx", ".tsx",
    ".java", ".kt", ".scala",
    ".go", ".rs", ".rb", ".php",
    ".c", ".cpp", ".h", ".hpp",
    ".cs", ".swift", ".dart",
    ".html", ".css", ".scss",
    ".sh", ".bash", ".zsh",
    ".sql", ".graphql",
    ".yml", ".yaml", ".json", ".toml", ".ini", ".cfg", ".xml",
    ".md", ".txt",
}

MAX_CONTEXT_BYTES = int(os.getenv("MAX_CONTEXT_BYTES", 60000))
MAX_FILE_BYTES = int(os.getenv("MAX_FILE_BYTES", 15000))


# ── Helpers ────────────────────────────────────────────────────────────────────

def _is_ignored_dir(name: str) -> bool:
    return name in IGNORED_DIRS or name.startswith(".")

def _is_config_file(name: str) -> bool:
    """Check if a filename matches any config file pattern."""
    if name in CONFIG_FILES:
        return True
    for pattern in CONFIG_FILES:
        if "*" in pattern:
            import fnmatch
            if fnmatch.fnmatch(name, pattern):
                return True
    return False

def _is_dependency_file(name: str) -> bool:
    return name in DEPENDENCY_FILES

def _build_tree(root: Path, prefix: str = "", max_depth: int = 5, depth: int = 0) -> str:
    """Build a text tree representation of the repo, skipping ignored dirs."""
    if depth > max_depth:
        return ""
    lines = []
    try:
        entries = sorted(root.iterdir(), key=lambda p: (p.is_file(), p.name))
    except PermissionError:
        return ""
    for i, entry in enumerate(entries):
        if entry.is_dir() and _is_ignored_dir(entry.name):
            continue
        connector = "└── " if i == len(entries) - 1 else "├── "
        lines.append(f"{prefix}{connector}{entry.name}")
        if entry.is_dir():
            extension = "    " if i == len(entries) - 1 else "│   "
            lines.append(_build_tree(entry, prefix + extension, max_depth, depth + 1))
    return "\n".join(filter(None, lines))

def _read_file_safe(path: Path, max_bytes: int = MAX_FILE_BYTES) -> str:
    """Read a file safely, truncating if too large."""
    try:
        size = path.stat().st_size
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read(max_bytes)
        if size > max_bytes:
            content += f"\n\n... [TRUNCATED — file is {size} bytes, showing first {max_bytes}] ..."
        return content
    except Exception as e:
        return f"[Could not read file: {e}]"


def _sanitize_git_url(url: str) -> str:
    """
    Sanitize and normalize Git repository URLs:
    - Strips query parameters (e.g. ?tab=readme-ov-file)
    - Strips fragment identifiers (e.g. #readme)
    - Normalizes GitHub/GitLab tree/blob subpaths to base repository URL
    - Strips trailing slashes
    """
    import urllib.parse
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


# ── Main Analyzer ──────────────────────────────────────────────────────────────

class RepositoryAnalyzer:

    def analyze(self, repo_url: str) -> dict:
        """
        Clone the repository and return a context dict with:
        - structure: str
        - dependency_files: dict[filename, content]
        - config_files: dict[filename, content]
        - source_files: dict[filepath, content]
        - total_files_found: int
        - total_bytes_sent: int
        """
        clean_url = _sanitize_git_url(repo_url)
        tmp_dir = tempfile.mkdtemp(prefix="devguard_")
        try:
            logger.info(f"Cloning {clean_url} into {tmp_dir}")
            self._clone(clean_url, tmp_dir)
            return self._extract_context(clean_url, Path(tmp_dir))
        finally:
            shutil.rmtree(tmp_dir, ignore_errors=True)
            logger.info("Cleaned up temp directory")

    # ── Private ────────────────────────────────────────────────

    def _clone(self, url: str, dest: str):
        """Clone a public repo. Raises ValueError on bad URL or clone failure."""
        clean_url = _sanitize_git_url(url)
        # Validate it looks like a git URL
        if not re.search(r"github\.com|gitlab\.com|bitbucket\.org|\.git$", clean_url):
            raise ValueError(
                f"URL does not appear to be a supported Git hosting URL: {url}"
            )
        try:
            git.Repo.clone_from(clean_url, dest, depth=1)
        except git.exc.GitCommandError as e:
            raise RuntimeError(
                f"Failed to clone repository. Ensure it is public and the URL is correct.\n{e}"
            )

    def _extract_context(self, repo_url: str, root: Path) -> dict:
        dependency_files: Dict[str, str] = {}
        config_files: Dict[str, str] = {}
        source_files: Dict[str, str] = {}
        total_files_found = 0
        total_bytes = 0

        # Build directory tree
        structure = f"{root.name}/\n" + _build_tree(root)

        # Walk file tree
        for dirpath, dirnames, filenames in os.walk(root):
            # Prune ignored directories in-place
            dirnames[:] = [d for d in dirnames if not _is_ignored_dir(d)]

            for filename in filenames:
                filepath = Path(dirpath) / filename
                ext = filepath.suffix.lower()

                if ext in IGNORED_EXTENSIONS:
                    continue

                total_files_found += 1
                rel_path = str(filepath.relative_to(root))

                # Priority 1: dependency files
                if _is_dependency_file(filename):
                    content = _read_file_safe(filepath)
                    dependency_files[rel_path] = content
                    total_bytes += len(content.encode("utf-8"))

                # Priority 2: config files
                elif _is_config_file(filename):
                    content = _read_file_safe(filepath)
                    config_files[rel_path] = content
                    total_bytes += len(content.encode("utf-8"))

                # Priority 3: source files (if budget allows)
                elif ext in SOURCE_EXTENSIONS:
                    if total_bytes < MAX_CONTEXT_BYTES:
                        content = _read_file_safe(filepath)
                        source_files[rel_path] = content
                        total_bytes += len(content.encode("utf-8"))
                    # else: silently skip to stay within token budget

        logger.info(
            f"Extracted context: {len(dependency_files)} dep files, "
            f"{len(config_files)} config files, {len(source_files)} source files, "
            f"{total_bytes} bytes total"
        )

        return {
            "repo_url": repo_url,
            "structure": structure,
            "dependency_files": dependency_files,
            "config_files": config_files,
            "source_files": source_files,
            "total_files_found": total_files_found,
            "total_bytes_sent": total_bytes,
        }
