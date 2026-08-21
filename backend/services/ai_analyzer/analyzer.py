"""
AI Analyzer — DevGuard AI

Sends the repository context + error log to a cloud LLM and
returns a structured AnalysisResult with root-cause diagnosis.

Supports:
  - Google Gemini  (default, set GEMINI_API_KEY)
  - OpenAI         (set OPENAI_API_KEY)

Provider is selected automatically based on which API key is
present in the environment.
"""

import os
import json
import logging
import re
from typing import Dict

logger = logging.getLogger(__name__)

# ── Prompt Construction ────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are DevGuard AI, an expert software debugging and root-cause analysis assistant.

Your job is to inspect and analyze a software repository to identify bugs, root-cause failures, version/dependency conflicts, broken imports, configuration mismatches, syntax/runtime defects, or error-prone implementations.

You will receive:
1. The repository structure
2. Dependency files (package.json, requirements.txt, pyproject.toml, etc.)
3. Configuration files
4. Relevant source code
5. Optional error log or stack trace (if available)

Your task:
- Audit the repository to detect the primary root-cause issue, critical bug, dependency conflict, or runtime defect.
- If an error log is provided, trace its root cause in the codebase.
- If no error log is provided, inspect the repository for:
  * Incompatible dependency/version constraints (e.g. library A requires version X, but pinned to version Y)
  * Broken, deprecated, or missing imports
  * Undefined variables, functions, classes, or incorrect symbol references
  * Configuration errors or environment mismatches
  * Startup or initialization failures
  * Suspicious, bug-prone, or crashing code paths
- Distinguish clearly between: confirmed evidence, probable cause, and suggested fix
- Do NOT make unsupported claims. If the repository does not provide enough evidence to identify a definitive defect, state: "Insufficient evidence from repository inspection."
- Do NOT generate large amounts of code unless the fix is trivial
- Be specific: reference exact file names, line patterns, version numbers, and imported symbols

You MUST return ONLY valid JSON (no markdown, no code fences, no extra text) matching exactly this schema:

{
  "root_cause": "One clear sentence describing the most probable root cause (or 'Insufficient evidence from repository inspection.')",
  "severity": "Low|Medium|High|Critical",
  "confidence": "High (90%)|Medium (65%)|Low (40%)",
  "evidence": [
    "Specific piece of evidence #1 — quote exact file/line/version when possible",
    "Specific piece of evidence #2",
    "..."
  ],
  "affected_files": [
    "path/to/file1.py",
    "path/to/file2.json"
  ],
  "suggested_fix": "Concrete, actionable recommendation to resolve the root cause",
  "explanation": "2-4 sentences explaining WHY the evidence points to this root cause and HOW the fix resolves it"
}

Severity guidelines:
- Critical: App cannot start / startup crash / fatal version incompatibility / data loss
- High: Core feature broken, unhandled exception, missing dependency
- Medium: Feature degraded, deprecation warning, subtle logic bug
- Low: Minor issue, cosmetic, or edge case

Confidence guidelines:
- High: Strong direct evidence in files provided (e.g. pinned incompatible version, invalid import)
- Medium: Indirect evidence, requires runtime verification
- Low: Hypothesis based on limited context or insufficient evidence
"""


def _build_user_prompt(context: dict, error_log: str = None) -> str:
    parts = []

    if error_log and error_log.strip():
        parts.append("## ERROR LOG / STACK TRACE (OPTIONAL CONTEXT)\n")
        parts.append(error_log.strip())
        parts.append("\n")

    parts.append("## REPOSITORY STRUCTURE\n")
    parts.append("```\n" + context.get("structure", "Not available") + "\n```\n")

    if context.get("dependency_files"):
        parts.append("## DEPENDENCY FILES\n")
        for fname, content in context["dependency_files"].items():
            parts.append(f"### {fname}\n```\n{content}\n```\n")

    if context.get("config_files"):
        parts.append("## CONFIGURATION FILES\n")
        for fname, content in context["config_files"].items():
            parts.append(f"### {fname}\n```\n{content}\n```\n")

    if context.get("source_files"):
        parts.append("## SOURCE FILES\n")
        for fname, content in context["source_files"].items():
            parts.append(f"### {fname}\n```\n{content}\n```\n")

    parts.append(
        "\nInspect the above repository and return ONLY the JSON object described in the system prompt."
    )

    return "\n".join(parts)


def _parse_llm_response(raw: str) -> dict:
    """
    Extract and parse the JSON object from the LLM response.
    Handles cases where the model wraps JSON in markdown code fences.
    """
    # Strip markdown code fences if present
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    raw = raw.strip()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        # Try to extract JSON object from surrounding text
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            data = json.loads(match.group())
        else:
            raise ValueError(f"LLM did not return valid JSON: {e}\nRaw response:\n{raw[:500]}")

    # Validate required fields
    required = ["root_cause", "severity", "confidence", "evidence",
                 "affected_files", "suggested_fix", "explanation"]
    missing = [f for f in required if f not in data]
    if missing:
        raise ValueError(f"LLM response missing required fields: {missing}")

    # Normalize lists
    if isinstance(data.get("evidence"), str):
        data["evidence"] = [data["evidence"]]
    if isinstance(data.get("affected_files"), str):
        data["affected_files"] = [data["affected_files"]]

    return data


# ── Provider Implementations ───────────────────────────────────────────────────

def _analyze_with_gemini(user_prompt: str) -> dict:
    import google.generativeai as genai

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError("GEMINI_API_KEY is not set in the environment")

    genai.configure(api_key=api_key)
    model_name = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
    model = genai.GenerativeModel(
        model_name=model_name,
        system_instruction=SYSTEM_PROMPT,
    )

    response = model.generate_content(user_prompt)
    raw = response.text
    logger.debug(f"Gemini raw response (first 500 chars): {raw[:500]}")
    return _parse_llm_response(raw)


def _analyze_with_openai(user_prompt: str) -> dict:
    import openai as _openai

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise EnvironmentError("OPENAI_API_KEY is not set in the environment")

    _openai.api_key = api_key
    model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")

    # Support both openai v0.x / v3.x (legacy) and v1.x+ (new)
    if hasattr(_openai, "ChatCompletion"):
        # Legacy openai <= 0.28 / v3.x
        response = _openai.ChatCompletion.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
        )
        raw = response["choices"][0]["message"]["content"]
    else:
        # New openai >= 1.0
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
        )
        raw = response.choices[0].message.content

    logger.debug(f"OpenAI raw response (first 500 chars): {raw[:500]}")
    return _parse_llm_response(raw)


def generate_ai_fix_prompt(
    root_cause: str,
    severity: str = "Medium",
    confidence: str = "High",
    evidence: list = None,
    affected_files: list = None,
    suggested_fix: str = "",
    explanation: str = "",
    repository_url: str = "",
    error_log: str = "",
) -> str:
    evidence_items = evidence or []
    files = affected_files or []

    evidence_text = "\n".join([f"- {e}" for e in evidence_items]) if evidence_items else "- No specific evidence list available from the current analysis."
    files_text = "\n".join([f"- `{f}`" for f in files]) if files else "- Affected files not specified in the current analysis."
    error_text = error_log.strip() if error_log and error_log.strip() else "Diagnosed via automated static codebase & dependency inspection."
    repo_text = repository_url.strip() if repository_url and repository_url.strip() else "Local workspace / supplied project"
    expl_text = explanation.strip() if explanation and explanation.strip() else "Refer to diagnostic evidence and suggested fix above."
    fix_text = suggested_fix.strip() if suggested_fix and suggested_fix.strip() else "Apply remediation as identified in the root cause summary."

    prompt = f"""# AI Debugging & Remediation Prompt

## 1. ROLE
You are an expert senior software engineer and debugging specialist. Your objective is to investigate, locate, and resolve a verified software defect in this codebase with precision, minimal code churn, and zero regressions.

## 2. TASK
Analyze the project context, verify the diagnosed failure, and implement the necessary code and configuration corrections to resolve the issue reported below in repository `{repo_text}`.

## 3. PROBLEM SUMMARY (DIAGNOSED ROOT CAUSE)
- **Diagnosed Root Cause**: {root_cause}
- **Severity Level**: {severity}
- **Diagnostic Confidence**: {confidence}
- **Target Repository**: {repo_text}

## 4. ERROR CONTEXT / DETECTION SOURCE
```text
{error_text}
```

## 5. AFFECTED FILES
The following files have been identified as directly involved in this failure:
{files_text}

## 6. DIAGNOSTIC EVIDENCE
The diagnosis is substantiated by the following confirmed evidence:
{evidence_text}

## 7. SUGGESTED FIX
{fix_text}

## 8. EXPLANATION & CONTEXT
{expl_text}

## 9. STRICT IMPLEMENTATION INSTRUCTIONS
1. **Inspect Before Modifying**: Thoroughly inspect the existing repository, dependencies, and configuration before making any modifications.
2. **Verify Diagnosis**: Confirm that the diagnosis accurately describes the failure and matches the current codebase state.
3. **Locate Exact Code**: Pinpoint the precise lines, functions, or dependency definitions that require adjustment.
4. **Minimal Required Changes**: Implement only the minimum changes required to resolve the root cause. Avoid unnecessary refactoring or moving unrelated logic.
5. **Preserve Existing Functionality**: Ensure that existing features, public interfaces, and configuration options remain intact.
6. **No Unrelated Dependencies**: Do not introduce new third-party dependencies unless strictly necessary for the fix.
7. **Adhere to Code Style**: Strictly follow the existing project's coding style, conventions, and formatting.

## 10. VERIFICATION & TESTING
1. **Reproduce Failure**: If feasible in the local environment, reproduce the diagnosed issue to verify the symptom.
2. **Apply Remediation**: Apply the code and configuration adjustments.
3. **Execute Tests**: Run relevant test suites and start the application to ensure clean execution without startup or runtime errors.
4. **Confirm Resolution**: Verify that the defect is completely eliminated.
5. **Check for Regressions**: Ensure no adjacent workflows or modules were broken.

## 11. FINAL RESPONSE REQUIREMENTS
Upon completing the repair, please provide a clear summary report containing:
- **Files Changed**: Complete list of modified, added, or deleted files.
- **Changes Made**: Clear summary of code and configuration adjustments.
- **Why the Fix Works**: Technical explanation of how the change resolves the root cause.
- **Tests Performed**: Verification commands and test results.
- **Remaining Risks**: Any edge cases, deprecation notes, or follow-up considerations."""

    return prompt


# ── Main Entry Point ───────────────────────────────────────────────────────────

class AIAnalyzer:

    def analyze(self, repo_context: dict, error_log: str = None) -> dict:
        """
        Run AI root-cause analysis on repository context.
        Returns a dict matching AnalysisResult fields.
        """
        user_prompt = _build_user_prompt(context=repo_context, error_log=error_log)

        # Auto-detect provider from environment
        if os.getenv("GEMINI_API_KEY"):
            logger.info("Using Gemini as LLM provider")
            result = _analyze_with_gemini(user_prompt)
        elif os.getenv("OPENAI_API_KEY"):
            logger.info("Using OpenAI as LLM provider")
            result = _analyze_with_openai(user_prompt)
        else:
            raise EnvironmentError(
                "No LLM API key found. Please set GEMINI_API_KEY or OPENAI_API_KEY "
                "in your .env file. See .env.example for details."
            )

        # Generate the structured AI Fix Prompt
        result["ai_fix_prompt"] = generate_ai_fix_prompt(
            root_cause=result.get("root_cause", ""),
            severity=result.get("severity", "Medium"),
            confidence=result.get("confidence", "High"),
            evidence=result.get("evidence", []),
            affected_files=result.get("affected_files", []),
            suggested_fix=result.get("suggested_fix", ""),
            explanation=result.get("explanation", ""),
            repository_url=repo_context.get("repo_url", ""),
            error_log=error_log or "",
        )

        return result

    def generate_fix_prompt(
        self,
        root_cause: str,
        severity: str = "Medium",
        confidence: str = "High",
        evidence: list = None,
        affected_files: list = None,
        suggested_fix: str = "",
        explanation: str = "",
        repository_url: str = "",
        error_log: str = "",
    ) -> str:
        """Generate a standalone AI Fix Prompt from diagnosis components."""
        return generate_ai_fix_prompt(
            root_cause=root_cause,
            severity=severity,
            confidence=confidence,
            evidence=evidence,
            affected_files=affected_files,
            suggested_fix=suggested_fix,
            explanation=explanation,
            repository_url=repository_url,
            error_log=error_log,
        )
