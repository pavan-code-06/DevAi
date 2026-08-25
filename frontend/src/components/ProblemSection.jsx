export default function ProblemSection() {
  const traditionalSteps = [
    { label: 'Error', desc: 'Unexpected crash or failure' },
    { label: 'Read Stack Trace', desc: 'Sifting through noisy terminal logs' },
    { label: 'Search Code', desc: 'Hunting through modules and files' },
    { label: 'Check Dependencies', desc: 'Auditing package lockfiles & versions' },
    { label: 'Inspect Configuration', desc: 'Reviewing env vars, build scripts, flags' },
    { label: 'Find Root Cause', desc: 'Correlating evidence manually' },
    { label: 'Figure Out How To Fix It', desc: 'Drafting remediation code' },
  ]

  return (
    <section id="problem" className="py-12 border-t border-bg-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-heading text-accent-red">The Challenge</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1 mb-3">
            The Problem
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
            Traditional debugging is a manual, multi-step chore requiring extensive cognitive overhead.
          </p>
        </div>

        {/* Traditional Debugging Pipeline */}
        <div className="card border-accent-red/20 bg-gradient-to-b from-bg-secondary to-bg-primary">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-bg-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-red"></span>
              <span className="text-sm font-semibold text-text-primary">Traditional Debugging Workflow</span>
            </div>
            <span className="text-xs text-accent-red/90 font-mono font-medium">Slow &amp; Manual</span>
          </div>

          <div className="space-y-2">
            {traditionalSteps.map((step, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary/60 border border-bg-border/60 hover:border-accent-red/30 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-accent-red/10 border border-accent-red/30 text-accent-red text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4">
                    <span className="text-sm font-semibold text-text-primary">{step.label}</span>
                    <span className="text-xs text-text-muted">{step.desc}</span>
                  </div>
                </div>

                {index < traditionalSteps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="#f85149" className="opacity-60">
                      <path d="M8 1a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V1.75A.75.75 0 0 1 8 1Z"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Problem Summary Quote */}
          <div className="mt-6 pt-5 border-t border-bg-border text-center">
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl mx-auto">
              This process can be difficult and time-consuming, especially for <span className="text-text-primary font-medium">students, beginners, solo developers, and small teams</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
