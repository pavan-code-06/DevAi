const GITHUB_REPO_URL = 'https://github.com/pavan-code-06/DevAi'

export default function HeroSection({ onTryDemo }) {
  return (
    <section id="hero" className="pt-10 pb-16 text-center animate-fade-in">
      {/* Top Prototype Badge */}
      <div className="inline-flex items-center gap-2 bg-bg-secondary border border-bg-border rounded-full px-4 py-1.5 text-xs text-text-secondary mb-6 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow"></span>
        <span className="font-semibold text-text-primary">Working Prototype</span>
        <span className="text-text-muted">|</span>
        <span>Repository-First AI Debugging</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-text-primary tracking-tight mb-4">
        DEVGUARD <span className="text-accent-blue">AI</span>
      </h1>

      {/* Tagline */}
      <p className="text-xl sm:text-2xl font-semibold text-text-primary/90 max-w-2xl mx-auto mb-6 tracking-tight">
        &ldquo;Give us the repository. Let AI investigate the problem.&rdquo;
      </p>

      {/* Short explanation */}
      <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
        DevGuard is a repository-first AI debugging assistant that analyzes a GitHub repository,
        identifies the probable root cause of software problems, provides evidence and affected files,
        and generates a ready-to-use AI Fix Prompt.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <button
          type="button"
          onClick={onTryDemo}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent-blue text-bg-primary font-bold text-sm hover:bg-blue-400 active:bg-blue-600 transition-all shadow-lg hover:shadow-accent-blue/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
          </svg>
          Try Live Demo
        </button>

        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-bg-border bg-bg-secondary hover:bg-bg-tertiary hover:border-text-secondary/50 text-text-primary font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          View GitHub
        </a>
      </div>

      {/* Quick Spec Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
        <div className="p-3.5 rounded-xl bg-bg-secondary/70 border border-bg-border flex items-center gap-3">
          <span className="text-xl">📂</span>
          <div>
            <div className="text-xs font-semibold text-text-primary">Repo-First</div>
            <div className="text-[11px] text-text-muted">No stack trace needed</div>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-bg-secondary/70 border border-bg-border flex items-center gap-3">
          <span className="text-xl">⚡</span>
          <div>
            <div className="text-xs font-semibold text-text-primary">FastAPI Backend</div>
            <div className="text-[11px] text-text-muted">Automated inspection</div>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-bg-secondary/70 border border-bg-border flex items-center gap-3">
          <span className="text-xl">🧠</span>
          <div>
            <div className="text-xs font-semibold text-text-primary">Gemini Reasoning</div>
            <div className="text-[11px] text-text-muted">Evidence-backed diagnosis</div>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-bg-secondary/70 border border-bg-border flex items-center gap-3">
          <span className="text-xl">🛠️</span>
          <div>
            <div className="text-xs font-semibold text-text-primary">AI Fix Prompt</div>
            <div className="text-[11px] text-text-muted">Direct to coding agents</div>
          </div>
        </div>
      </div>
    </section>
  )
}
