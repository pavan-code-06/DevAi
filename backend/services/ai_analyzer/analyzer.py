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

SYSTEM_PROMPT = """You are DevGuard AI, an expert software debugging assistant.

Your job is to perform root-cause analysis on a software project failure.
You will receive:
1. An error log or stack trace
2. The repository structure
3. Dependency files (package.json, requirements.txt, etc.)
4. Configuration files
5. Relevant source code

Your task:
- Identify the PROBABLE ROOT CAUSE of the failure
- Distinguish clearly between: confirmed evidence, probable cause, and suggested fix
- Do NOT make unsupported claims
- Do NOT generate large amounts of code unless the fix is trivial
- Be specific: reference exact file names, line patterns, version numbers when visible

You MUST return ONLY valid JSON (no markdown, no code fences, no extra text) matching exactly this schema:

{
  "root_cause": "One clear sentence describing the most probable root cause",
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
- Critical: App cannot start / data loss risk
- High: Core feature broken, no workaround
- Medium: Feature degraded, workaround exists
- Low: Minor issue, cosmetic, or edge case

Confidence guidelines:
- High: Strong direct evidence in files provided
- Medium: Indirect evidence, requires verification
- Low: Hypothesis based on limited context
"""


def _build_user_prompt(error_log: str, context: dict) -> str:
    parts = []

    parts.append("## ERROR LOG / STACK TRACE\n")
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
        "\nAnalyze the above and return ONLY the JSON object described in the system prompt."
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


# ── Main Entry Point ───────────────────────────────────────────────────────────

class AIAnalyzer:

    def analyze(self, error_log: str, repo_context: dict) -> dict:
        """
        Run AI root-cause analysis.
        Returns a dict matching AnalysisResult fields.
        """
        user_prompt = _build_user_prompt(error_log, repo_context)

        # Auto-detect provider from environment
        if os.getenv("GEMINI_API_KEY"):
            logger.info("Using Gemini as LLM provider")
            return _analyze_with_gemini(user_prompt)
        elif os.getenv("OPENAI_API_KEY"):
            logger.info("Using OpenAI as LLM provider")
            return _analyze_with_openai(user_prompt)
        else:
            raise EnvironmentError(
                "No LLM API key found. Please set GEMINI_API_KEY or OPENAI_API_KEY "
                "in your .env file. See .env.example for details."
            )
