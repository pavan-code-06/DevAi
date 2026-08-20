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

function SectionHeader({ icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-text-secondary">{icon}</span>
      <span className="section-heading !mb-0">{label}</span>
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

export default function ResultReport({ result, onReset }) {
  const severity = result.severity || 'Medium'
  const sev = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.Medium
  const confidencePct = parseConfidencePct(result.confidence)

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

      {/* ── Disclaimer footer ─────────────────────────── */}
      <div className="text-center text-xs text-text-muted py-4 border-t border-bg-border">
        This diagnosis is AI-generated and should be verified by a developer before applying changes.
        &nbsp;Confidence ratings reflect the quality of evidence found — not a guarantee.
      </div>
    </div>
  )
}
