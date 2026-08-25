import { useState } from 'react'

const GITHUB_REPO_URL = 'https://github.com/pavan-code-06/DevAi'

export default function Navbar({ onNavigateToDemo, phase, onReset }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (id) => {
    setMobileMenuOpen(false)
    if (phase !== 'form') {
      onReset()
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleDemoClick = (e) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (onNavigateToDemo) {
      onNavigateToDemo()
    } else {
      scrollToSection('demo-section')
    }
  }

  return (
    <header className="border-b border-bg-border bg-bg-secondary/90 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollToSection('hero') }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-accent-blue/15 border border-accent-blue/40 flex items-center justify-center group-hover:border-accent-blue transition-colors">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#58a6ff" strokeWidth="1.5" fill="#0d1117"/>
                <path d="M8 5L11 7V11L8 13L5 11V7L8 5Z" fill="#58a6ff"/>
              </svg>
            </div>
            <span className="font-bold text-text-primary text-base tracking-tight group-hover:text-accent-blue transition-colors">
              DevGuard AI
            </span>
          </a>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse"></span>
            Working Prototype
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
          <button
            onClick={() => scrollToSection('problem')}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            Problem
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('architecture')}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            Architecture
          </button>
          <button
            onClick={() => scrollToSection('demo-section')}
            className="hover:text-text-primary transition-colors cursor-pointer text-accent-blue/90 hover:text-accent-blue font-medium"
          >
            Demo
          </button>
          <button
            onClick={() => scrollToSection('vision')}
            className="hover:text-text-primary transition-colors cursor-pointer"
          >
            iQOO Vision
          </button>
        </nav>

        {/* Right CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {phase === 'result' && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs text-accent-blue hover:text-blue-300 transition-colors px-3 py-1.5 border border-accent-blue/30 rounded-lg bg-accent-blue/5"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>
              New Analysis
            </button>
          )}

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-bg-border bg-bg-tertiary/50 hover:bg-bg-tertiary hover:border-text-secondary/40 text-text-primary text-xs font-medium transition-all"
            title="View Source on GitHub"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>GitHub</span>
          </a>

          <button
            onClick={handleDemoClick}
            className="px-3.5 py-1.5 rounded-lg bg-accent-blue text-bg-primary text-xs font-semibold hover:bg-blue-400 active:bg-blue-600 transition-colors shadow-sm cursor-pointer"
          >
            Try Live Demo
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-bg-border bg-bg-secondary px-6 py-4 space-y-3 animate-fade-in">
          <button
            onClick={() => scrollToSection('problem')}
            className="block w-full text-left py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            Problem
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('architecture')}
            className="block w-full text-left py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            Architecture
          </button>
          <button
            onClick={() => scrollToSection('demo-section')}
            className="block w-full text-left py-2 text-sm text-accent-blue font-medium"
          >
            Demo
          </button>
          <button
            onClick={() => scrollToSection('vision')}
            className="block w-full text-left py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            iQOO Vision
          </button>
          <div className="pt-3 border-t border-bg-border flex flex-col gap-2">
            <button
              onClick={handleDemoClick}
              className="w-full text-center py-2.5 rounded-lg bg-accent-blue text-bg-primary text-sm font-semibold"
            >
              Try Live Demo
            </button>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 rounded-lg border border-bg-border bg-bg-tertiary text-text-primary text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              View GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
