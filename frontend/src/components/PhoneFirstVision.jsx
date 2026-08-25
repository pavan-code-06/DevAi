export default function PhoneFirstVision() {
  return (
    <section id="vision" className="py-12 border-t border-bg-border">
      <div className="max-w-4xl mx-auto">
        <div className="card border-accent-blue/30 bg-gradient-to-r from-bg-secondary via-bg-tertiary/60 to-bg-secondary p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-accent-blue/15 border border-accent-blue/40 flex items-center justify-center flex-shrink-0 text-2xl">
              📱
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="badge bg-accent-orange/10 text-accent-orange border border-accent-orange/20 text-[10px]">
                  iQOO Hackathon Vision
                </span>
                <span className="text-xs text-text-muted">Future Roadmap</span>
              </div>

              <h3 className="text-xl font-bold text-text-primary">
                Built for a Phone-First Future
              </h3>

              <p className="text-sm text-text-secondary leading-relaxed">
                The current prototype demonstrates the core repository-analysis engine. During the iQOO Hackathon, DevGuard can evolve into a phone-first debugging experience where the iQOO device becomes an active part of the debugging workflow rather than simply displaying the application.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-xs text-text-muted">
                <span className="bg-bg-primary px-2.5 py-1 rounded-md border border-bg-border">
                  ✨ On-Device Diagnostic Alerts
                </span>
                <span className="bg-bg-primary px-2.5 py-1 rounded-md border border-bg-border">
                  ⚡ Mobile Companion for Dev Workflows
                </span>
                <span className="bg-bg-primary px-2.5 py-1 rounded-md border border-bg-border">
                  🛡️ Core Engine in Working Prototype
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
