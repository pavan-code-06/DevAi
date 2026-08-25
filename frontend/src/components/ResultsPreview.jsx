export default function ResultsPreview() {
  return (
    <section className="py-12 border-t border-bg-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-heading text-accent-blue">Output Format</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1 mb-3">
            Structured Diagnosis Preview
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
            Every analysis delivers an evidence-backed report and an actionable AI fix prompt.
          </p>
        </div>

        {/* Example Diagnosis Card */}
        <div className="card border-accent-blue/30 bg-bg-secondary relative overflow-hidden shadow-xl">
          {/* Example Banner */}
          <div className="bg-bg-tertiary px-4 py-2 border-b border-bg-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="badge bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30 text-[10px]">
                Example Diagnosis Preview
              </span>
              <span className="text-xs text-text-muted font-mono truncate">
                repo: example-org/payment-service
              </span>
            </div>
            <span className="text-[11px] text-text-muted">Illustrative UI Preview</span>
          </div>

          <div className="p-6 space-y-4">
            {/* Root Cause */}
            <div className="p-4 rounded-xl bg-bg-tertiary/60 border-l-4 border-l-accent-blue border border-bg-border">
              <div className="text-[11px] font-mono font-bold uppercase text-accent-blue tracking-wider mb-1">
                Root Cause
              </div>
              <p className="text-sm font-semibold text-text-primary">
                Flask 3.0+ removed ImmutableDict from werkzeug.datastructures, causing an unresolved import crash on application startup.
              </p>
            </div>

            {/* Severity + Confidence Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-accent-red/5 border border-accent-red/30">
                <div className="text-[10px] font-mono font-bold uppercase text-accent-red tracking-wider mb-1">
                  Severity
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-red"></span>
                  <span className="text-lg font-bold text-accent-red">Critical</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-bg-tertiary/60 border border-bg-border">
                <div className="text-[10px] font-mono font-bold uppercase text-text-secondary tracking-wider mb-1">
                  Confidence
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-accent-green">90%</span>
                  <span className="text-xs text-text-muted">(High Confidence)</span>
                </div>
              </div>
            </div>

            {/* Evidence */}
            <div className="p-4 rounded-xl bg-bg-tertiary/60 border border-bg-border">
              <div className="text-[10px] font-mono font-bold uppercase text-text-secondary tracking-wider mb-2">
                Evidence
              </div>
              <ul className="space-y-1.5 text-xs text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-accent-blue font-bold">·</span>
                  <span><code className="text-text-primary bg-bg-primary px-1 py-0.5 rounded">requirements.txt</code> pins <code className="text-accent-blue font-mono">werkzeug&gt;=3.0.0</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-blue font-bold">·</span>
                  <span><code className="text-text-primary bg-bg-primary px-1 py-0.5 rounded">app.py:L14</code> directly imports deprecated symbol <code className="text-accent-red font-mono">from werkzeug.datastructures import ImmutableDict</code></span>
                </li>
              </ul>
            </div>

            {/* Affected Files */}
            <div className="p-4 rounded-xl bg-bg-tertiary/60 border border-bg-border">
              <div className="text-[10px] font-mono font-bold uppercase text-text-secondary tracking-wider mb-2">
                Affected Files
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded bg-bg-primary border border-bg-border text-xs font-mono text-accent-blue">
                  app.py
                </span>
                <span className="px-2.5 py-1 rounded bg-bg-primary border border-bg-border text-xs font-mono text-accent-blue">
                  requirements.txt
                </span>
              </div>
            </div>

            {/* Suggested Fix */}
            <div className="p-4 rounded-xl bg-bg-tertiary/60 border-l-4 border-l-accent-green border border-bg-border">
              <div className="text-[10px] font-mono font-bold uppercase text-accent-green tracking-wider mb-1">
                Suggested Fix
              </div>
              <p className="text-xs text-text-secondary font-mono leading-relaxed">
                Replace ImmutableDict import in app.py with types.MappingProxyType or pin werkzeug&lt;3.0.0 in requirements.txt.
              </p>
            </div>

            {/* AI Fix Prompt Preview */}
            <div className="p-4 rounded-xl bg-accent-purple/[0.04] border border-accent-purple/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🛠️</span>
                  <span className="text-[10px] font-mono font-bold uppercase text-accent-purple tracking-wider">
                    AI Fix Prompt
                  </span>
                </div>
                <span className="text-[10px] text-accent-purple/80 bg-accent-purple/10 px-2 py-0.5 rounded">
                  Generate Fix Prompt
                </span>
              </div>
              <div className="bg-bg-primary p-3 rounded-lg border border-bg-border text-[11px] font-mono text-text-muted leading-relaxed line-clamp-3">
                # AI Remediation Prompt: Fix ImmutableDict Deprecation in app.py<br/>
                Role: Senior Python Engineer. Apply fix to app.py replacing werkzeug.datastructures.ImmutableDict...
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
