import AnalyzeForm from './AnalyzeForm'

const GITHUB_REPO_URL = 'https://github.com/pavan-code-06/DevAi'

export default function LiveDemoSection({ onAnalyze }) {
  return (
    <section id="demo-section" className="py-12 border-t border-bg-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/30 rounded-full px-4 py-1 text-xs text-accent-blue font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></span>
            Live Working Prototype
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            Try the Working Prototype
          </h2>

          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6">
            Want to see DevGuard in action?<br className="hidden sm:inline" />
            Enter a public GitHub repository and let DevGuard investigate it.
          </p>

          <div className="flex items-center justify-center gap-3 mb-8">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-bg-border bg-bg-secondary text-xs text-text-secondary hover:text-text-primary hover:border-accent-blue transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              View Source on GitHub
            </a>
          </div>
        </div>

        {/* Live Analysis Form */}
        <div className="card border-accent-blue/30 bg-bg-secondary shadow-2xl p-6 sm:p-8">
          <AnalyzeForm onAnalyze={onAnalyze} />
        </div>
      </div>
    </section>
  )
}
