import { useState } from 'react'
import AnalyzeForm from './components/AnalyzeForm'
import LoadingState from './components/LoadingState'
import ResultReport from './components/ResultReport'

const rawApi = import.meta.env.VITE_API_URL
const API_BASE = rawApi !== undefined ? rawApi.replace(/\/$/, '') : (import.meta.env.DEV ? 'http://localhost:8000' : '')

export default function App() {
  const [phase, setPhase] = useState('form')  // 'form' | 'loading' | 'result' | 'error'
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loadingStep, setLoadingStep] = useState(0)

  const handleAnalyze = async ({ repositoryUrl, errorLog }) => {
    setPhase('loading')
    setError(null)
    setLoadingStep(0)

    // Simulate stepped progress for UX
    const stepTimer = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, 2))
    }, 4000)

    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repository_url: repositoryUrl,
          error_log: errorLog,
        }),
      })

      clearInterval(stepTimer)

      if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: 'Unknown server error' }))
        throw new Error(err.detail || `Server error ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
      setPhase('result')
    } catch (err) {
      clearInterval(stepTimer)
      setError(err.message || 'An unexpected error occurred')
      setPhase('error')
    }
  }

  const handleReset = () => {
    setPhase('form')
    setResult(null)
    setError(null)
    setLoadingStep(0)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ── Header ──────────────────────────────────────── */}
      <header className="border-b border-bg-border bg-bg-secondary/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#0d1117" strokeWidth="1.5" fill="#0d1117"/>
                <path d="M8 5L11 7V11L8 13L5 11V7L8 5Z" fill="#58a6ff"/>
              </svg>
            </div>
            <div>
              <span className="font-semibold text-text-primary tracking-tight">DevGuard AI</span>
              <span className="ml-2 badge bg-accent-blue/10 text-accent-blue border border-accent-blue/20 text-[10px]">
                Beta
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className="hidden sm:block">AI-Powered Root-Cause Debugging</span>
            {phase === 'result' && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-accent-blue hover:text-blue-300 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
                New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {phase === 'form' && (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-bg-secondary border border-bg-border rounded-full px-4 py-1.5 text-xs text-text-secondary mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-slow"></span>
                Prototype v1 — Powered by Gemini AI
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 tracking-tight">
                Stop guessing.<br />
                <span className="text-accent-blue">Find the root cause.</span>
              </h1>
              <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
                Paste a GitHub repository URL and your error log. DevGuard AI analyzes your codebase,
                dependencies, and configuration to pinpoint what actually broke.
              </p>
            </div>

            <AnalyzeForm onAnalyze={handleAnalyze} />

            {/* How it works */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: '⬇️', label: 'Clone Repository', desc: 'Reads your code & deps' },
                { icon: '🔍', label: 'Analyze Context', desc: 'Maps error to codebase' },
                { icon: '🤖', label: 'AI Diagnosis', desc: 'Identifies root cause' },
                { icon: '📋', label: 'Structured Report', desc: 'Evidence + fix' },
              ].map((step, i) => (
                <div key={i} className="card text-center p-4">
                  <div className="text-2xl mb-2">{step.icon}</div>
                  <div className="text-sm font-medium text-text-primary">{step.label}</div>
                  <div className="text-xs text-text-secondary mt-1">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === 'loading' && (
          <div className="animate-fade-in">
            <LoadingState step={loadingStep} />
          </div>
        )}

        {phase === 'result' && result && (
          <div className="animate-slide-up">
            <ResultReport result={result} onReset={handleReset} />
          </div>
        )}

        {phase === 'error' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="card border-accent-red/30 bg-accent-red/5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-red/10 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="#f85149">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-accent-red mb-1">Analysis Failed</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{error}</p>
                  <button
                    onClick={handleReset}
                    className="mt-4 btn-primary text-sm px-4 py-2"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-bg-border mt-24 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-text-muted text-xs">
          DevGuard AI — Prototype v1 &nbsp;·&nbsp; Not for production use
        </div>
      </footer>
    </div>
  )
}
