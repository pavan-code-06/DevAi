import { useState } from 'react'

// Severity color mapping
const SEVERITY_CONFIG = {
  Critical: { bg: 'bg-accent-red/10', border: 'border-accent-red/30', text: 'text-accent-red', dot: 'bg-accent-red' },
  High:     { bg: 'bg-accent-orange/10', border: 'border-accent-orange/30', text: 'text-accent-orange', dot: 'bg-accent-orange' },
  Medium:   { bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/30', text: 'text-accent-yellow', dot: 'bg-accent-yellow' },
  Low:      { bg: 'bg-accent-green/10', border: 'border-accent-green/30', text: 'text-accent-green', dot: 'bg-accent-green' },
}

// Parse confidence percentage from string like "High (90%)" or "85%"
function parseConfidencePct(confidence) {
  const match = String(confidence).match(/(\d+)%/)
  if (match) return parseInt(match[1], 10)
  if (/high/i.test(confidence)) return 85
  if (/medium/i.test(confidence)) return 60
  if (/low/i.test(confidence)) return 35
  return 50
}

function SectionHeader({ icon, label, subtitle }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">{icon}</span>
        <span className="section-heading !mb-0">{label}</span>
      </div>
      {subtitle && (
        <p className="text-xs text-text-muted mt-1">{subtitle}</p>
      )}
    </div>
  )
}

function FileChip({ path }) {
  const parts = path.split('/')
  const filename = parts[parts.length - 1]
  const dir = parts.slice(0, -1).join('/')
  return (
    <div className="inline-flex items-center gap-1.5 bg-bg-tertiary border border-bg-border rounded-md px-3 py-1.5 font-mono text-xs">
      {dir && <span className="text-text-muted">{dir}/</span>}
      <span className="text-accent-blue font-medium">{filename}</span>
    </div>
  )
}

export default function ResultReport({ result, errorLog = '', apiBase = '', onReset }) {
  const severity = result.severity || 'Medium'
  const sev = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.Medium
  const confidencePct = parseConfidencePct(result.confidence)

  // AI Fix Prompt state
  const [fixPrompt, setFixPrompt] = useState(result.ai_fix_prompt || '')
  const [isCopied, setIsCopied] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [regenError, setRegenError] = useState(null)

  const handleCopyPrompt = async () => {
    if (!fixPrompt) return
    try {
      await navigator.clipboard.writeText(fixPrompt)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2500)
    } catch (err) {
      console.error('Failed to copy prompt to clipboard:', err)
    }
  }

  const handleRegeneratePrompt = async () => {
    setIsRegenerating(true)
    setRegenError(null)

    try {
      const response = await fetch(`${apiBase}/api/generate-fix-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          root_cause: result.root_cause,
          severity: result.severity,
          confidence: result.confidence,
          evidence: result.evidence || [],
          affected_files: result.affected_files || [],
          suggested_fix: result.suggested_fix,
          explanation: result.explanation || '',
          repository_url: result.repo_url || '',
          error_log: errorLog,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to regenerate prompt (${response.status})`)
      }

      const data = await response.json()
      if (data.ai_fix_prompt) {
        setFixPrompt(data.ai_fix_prompt)
      }
    } catch (err) {
      setRegenError(err.message || 'Could not regenerate prompt')
    } finally {
      setIsRegenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">

      {/* ── Header Banner ─────────────────────────────── */}
      <div className="card mb-6 border-accent-blue/20 bg-accent-blue/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-blue/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="#58a6ff">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">Analysis Complete</div>
              <div className="text-xs text-text-secondary">
                {result.repo_url && (
                  <a
                    href={result.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-blue hover:underline font-mono truncate max-w-xs inline-block"
                  >
                    {result.repo_url.replace('https://github.com/', '')}
                  </a>
                )}
                {result.analysis_duration_seconds && (
                  <span className="ml-2 text-text-muted">· {result.analysis_duration_seconds}s</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onReset}
            className="text-sm text-accent-blue hover:text-blue-300 flex items-center gap-1.5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
            New Analysis
          </button>
        </div>
      </div>

      {/* ── ROOT CAUSE (Primary — most prominent) ─────── */}
      <div className="card mb-4 border-l-4 border-l-accent-blue">
        <SectionHeader icon="🎯" label="Root Cause" />
        <p className="text-text-primary text-base leading-relaxed font-medium">
          {result.root_cause}
        </p>
      </div>

      {/* ── SEVERITY + CONFIDENCE (side by side) ──────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Severity */}
        <div className={`card border ${sev.border} ${sev.bg}`}>
          <SectionHeader icon="⚡" label="Severity" />
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${sev.dot} shadow-lg`} />
            <span className={`text-2xl font-bold ${sev.text}`}>{severity}</span>
          </div>
        </div>

        {/* Confidence */}
        <div className="card">
          <SectionHeader icon="📊" label="Confidence" />
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-text-primary">{confidencePct}%</span>
            <span className="text-sm text-text-secondary">{result.confidence}</span>
          </div>
          <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000
                ${confidencePct >= 75 ? 'bg-accent-green' : confidencePct >= 50 ? 'bg-accent-yellow' : 'bg-accent-red'}`}
              style={{ width: `${confidencePct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── EVIDENCE ──────────────────────────────────── */}
      {result.evidence && result.evidence.length > 0 && (
        <div className="card mb-4">
          <SectionHeader icon="🔬" label="Evidence" />
          <ul className="space-y-2.5">
            {result.evidence.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-full bg-accent-blue/10 border border-accent-blue/20
                                 flex items-center justify-center text-accent-blue text-xs font-mono font-bold">
                  {i + 1}
                </span>
                <span className="text-text-secondary text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── AFFECTED FILES ─────────────────────────────── */}
      {result.affected_files && result.affected_files.length > 0 && (
        <div className="card mb-4">
          <SectionHeader icon="📁" label="Affected Files" />
          <div className="flex flex-wrap gap-2">
            {result.affected_files.map((file, i) => (
              <FileChip key={i} path={file} />
            ))}
          </div>
        </div>
      )}

      {/* ── SUGGESTED FIX ─────────────────────────────── */}
      <div className="card mb-4 border-l-4 border-l-accent-green">
        <SectionHeader icon="🔧" label="Suggested Fix" />
        <div className="code-block text-sm leading-relaxed whitespace-pre-wrap">
          {result.suggested_fix}
        </div>
      </div>

      {/* ── EXPLANATION ──────────────────────────────── */}
      <div className="card mb-6">
        <SectionHeader icon="💡" label="Explanation" />
        <p className="text-text-secondary text-sm leading-relaxed">
          {result.explanation}
        </p>
      </div>

      {/* ── 🛠️ AI FIX PROMPT (New Feature) ─────────────── */}
      {fixPrompt && (
        <div className="card mb-6 border-2 border-accent-purple/30 bg-accent-purple/[0.03]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🛠️</span>
                <span className="text-sm font-bold text-text-primary uppercase tracking-wider">AI Fix Prompt</span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Ready-to-use prompt for coding agents (Antigravity, Gemini, Cursor, Copilot, ChatGPT)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRegeneratePrompt}
                disabled={isRegenerating}
                className="px-3 py-1.5 text-xs font-medium border border-bg-border rounded-lg text-text-secondary
                           hover:border-accent-purple hover:text-accent-purple active:bg-bg-tertiary transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={isRegenerating ? 'animate-spin' : ''}
                >
                  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-7.068 2H.534a.25.25 0 0 1-.192-.41l1.966-2.36a.25.25 0 0 1 .384 0l1.966 2.36a.25.25 0 0 1-.192.41z"/>
                  <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                </svg>
                {isRegenerating ? 'Regenerating...' : 'Regenerate Prompt'}
              </button>

              <button
                type="button"
                onClick={handleCopyPrompt}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5
                  ${isCopied
                    ? 'bg-accent-green text-bg-primary shadow-sm'
                    : 'bg-accent-purple text-bg-primary hover:bg-purple-400 active:bg-purple-600'
                  }`}
              >
                {isCopied ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                    Prompt copied!
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/>
                      <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/>
                    </svg>
                    Copy Prompt
                  </>
                )}
              </button>
            </div>
          </div>

          {regenError && (
            <div className="mb-3 p-2.5 rounded-lg bg-accent-red/10 border border-accent-red/20 text-xs text-accent-red">
              {regenError}
            </div>
          )}

          {/* Prompt Content Area */}
          <div className="code-block text-xs leading-relaxed max-h-[380px] overflow-y-auto whitespace-pre-wrap border-bg-border bg-bg-secondary selection:bg-accent-purple/30">
            {fixPrompt}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-text-muted">
            <span>Copy this prompt directly into your AI coding assistant to implement the fix.</span>
            <span>~{fixPrompt.split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>
      )}

      {/* ── Disclaimer footer ─────────────────────────── */}
      <div className="text-center text-xs text-text-muted py-4 border-t border-bg-border">
        This diagnosis is AI-generated and should be verified by a developer before applying changes.
        &nbsp;Confidence ratings reflect the quality of evidence found — not a guarantee.
      </div>
    </div>
  )
}
