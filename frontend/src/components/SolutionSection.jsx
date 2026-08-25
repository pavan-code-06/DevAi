export default function SolutionSection() {
  const devGuardSteps = [
    { icon: '🔗', label: 'GitHub Repository URL', desc: 'Simply supply the public repo URL' },
    { icon: '📦', label: 'Repository Inspection', desc: 'Clones and parses project files' },
    { icon: '🔍', label: 'Code + Dependency + Configuration Analysis', desc: 'Audits manifests, configs, and source' },
    { icon: '🧠', label: 'AI Reasoning', desc: 'Google Gemini correlates facts and defects' },
    { icon: '🎯', label: 'Evidence-backed Diagnosis', desc: 'Pinpoints exact root cause, severity & confidence' },
    { icon: '🔧', label: 'Suggested Fix', desc: 'Provides actionable code remediation' },
    { icon: '🛠️', label: 'AI Fix Prompt', desc: 'Generates ready prompt for coding agents' },
  ]

  return (
    <section id="how-it-works" className="py-12 border-t border-bg-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-heading text-accent-green">The Solution</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1 mb-3">
            How DevGuard Solves It
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            &ldquo;The developer does not need to know what is broken first. DevGuard investigates the repository and provides an evidence-backed diagnosis.&rdquo;
          </p>
        </div>

        {/* DevGuard Pipeline */}
        <div className="card border-accent-green/30 bg-gradient-to-b from-bg-secondary to-bg-primary">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-bg-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse-slow"></span>
              <span className="text-sm font-semibold text-text-primary">Autonomous DevGuard Pipeline</span>
            </div>
            <span className="text-xs text-accent-green font-mono font-medium">Automated &amp; Evidence-Backed</span>
          </div>

          <div className="space-y-2">
            {devGuardSteps.map((step, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 p-3.5 rounded-lg bg-bg-tertiary/70 border border-bg-border hover:border-accent-green/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-accent-green/10 border border-accent-green/30 text-accent-green text-sm flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4">
                    <span className="text-sm font-semibold text-text-primary">{step.label}</span>
                    <span className="text-xs text-text-secondary">{step.desc}</span>
                  </div>
                </div>

                {index < devGuardSteps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="#3fb950" className="opacity-70">
                      <path d="M8 1a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V1.75A.75.75 0 0 1 8 1Z"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-bg-border text-center">
            <p className="text-xs text-text-muted">
              Zero manual file tracing. Pure repository-grounded intelligence from repo to fix prompt.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
