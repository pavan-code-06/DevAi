const GITHUB_REPO_URL = 'https://github.com/pavan-code-06/DevAi'

export default function Footer({ onScrollTo }) {
  return (
    <footer className="border-t border-bg-border mt-20 py-12 bg-bg-secondary/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-bg-border">
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/20 border border-accent-blue/40 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#58a6ff" strokeWidth="1.5" fill="#0d1117"/>
                <path d="M8 5L11 7V11L8 13L5 11V7L8 5Z" fill="#58a6ff"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-text-primary text-sm">DevGuard AI</span>
              <span className="text-xs text-text-muted ml-2">· iQOO Hackathon Prototype</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-text-secondary">
            <button onClick={() => onScrollTo('hero')} className="hover:text-text-primary transition-colors">
              Home
            </button>
            <button onClick={() => onScrollTo('problem')} className="hover:text-text-primary transition-colors">
              The Problem
            </button>
            <button onClick={() => onScrollTo('how-it-works')} className="hover:text-text-primary transition-colors">
              How It Works
            </button>
            <button onClick={() => onScrollTo('architecture')} className="hover:text-text-primary transition-colors">
              Architecture
            </button>
            <button onClick={() => onScrollTo('demo-section')} className="hover:text-accent-blue transition-colors">
              Live Demo
            </button>
            <button onClick={() => onScrollTo('vision')} className="hover:text-text-primary transition-colors">
              Vision
            </button>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-blue transition-colors flex items-center gap-1"
            >
              <span>GitHub</span>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.75 3a.75.75 0 0 0 0 1.5h4.69L2.22 11.72a.75.75 0 1 0 1.06 1.06L10.5 5.56v4.69a.75.75 0 0 0 1.5 0v-7a.75.75 0 0 0-.75-.75h-7Z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom text */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-3">
          <p>
            DevGuard AI — Repository-First AI Debugging &amp; AI Fix Prompt Generator.
          </p>
          <p className="font-mono text-[11px]">
            Working Prototype · Verified Implementation
          </p>
        </div>
      </div>
    </footer>
  )
}
