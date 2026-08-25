import { useState, useRef } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ProblemSection from './components/ProblemSection'
import SolutionSection from './components/SolutionSection'
import ArchitectureDiagram from './components/ArchitectureDiagram'
import DemoWorkflow from './components/DemoWorkflow'
import ResultsPreview from './components/ResultsPreview'
import WhyDevGuard from './components/WhyDevGuard'
import LiveDemoSection from './components/LiveDemoSection'
import PhoneFirstVision from './components/PhoneFirstVision'
import Footer from './components/Footer'
import LoadingState from './components/LoadingState'
import ResultReport from './components/ResultReport'

const rawApi = import.meta.env.VITE_API_URL
const API_BASE = rawApi !== undefined ? rawApi.replace(/\/$/, '') : (import.meta.env.DEV ? 'http://localhost:8000' : '')

export default function App() {
  const [phase, setPhase] = useState('form') // 'form' | 'loading' | 'result' | 'error'
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loadingStep, setLoadingStep] = useState(0)

  const handleAnalyze = async ({ repositoryUrl }) => {
    setPhase('loading')
    setError(null)
    setLoadingStep(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Stepped progress simulation for UX
    const stepTimer = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, 2))
    }, 4000)

    try {
      const response = await fetch(`${API_BASE}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repository_url: repositoryUrl,
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      clearInterval(stepTimer)
      setError(err.message || 'An unexpected error occurred')
      setPhase('error')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleReset = () => {
    setPhase('form')
    setResult(null)
    setError(null)
    setLoadingStep(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateToDemo = () => {
    if (phase !== 'form') {
      handleReset()
      setTimeout(() => {
        const el = document.getElementById('demo-section')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById('demo-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollTo = (id) => {
    if (phase !== 'form') {
      handleReset()
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-blue/20 selection:text-accent-blue">
      {/* ── Top Navbar ────────────────────────────────────────── */}
      <Navbar
        onNavigateToDemo={handleNavigateToDemo}
        phase={phase}
        onReset={handleReset}
      />

      {/* ── Main View Area ────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        {phase === 'form' && (
          <div className="animate-fade-in">
            {/* 1. Hero Section */}
            <HeroSection onTryDemo={handleNavigateToDemo} />

            {/* 2. Problem Section */}
            <ProblemSection />

            {/* 3. DevGuard Solution Section */}
            <SolutionSection />

            {/* 4. Architecture Section */}
            <ArchitectureDiagram />

            {/* 5. Demo Workflow Section */}
            <DemoWorkflow />

            {/* 6. Results Preview Section */}
            <ResultsPreview />

            {/* 7. Why DevGuard Section */}
            <WhyDevGuard />

            {/* 8. Live Demo & Analyzer Section */}
            <LiveDemoSection onAnalyze={handleAnalyze} />

            {/* 9. Phone-First Vision Section */}
            <PhoneFirstVision />
          </div>
        )}

        {phase === 'loading' && (
          <div className="py-16 animate-fade-in">
            <LoadingState step={loadingStep} />
          </div>
        )}

        {phase === 'result' && result && (
          <div className="py-10 animate-slide-up">
            <ResultReport
              result={result}
              apiBase={API_BASE}
              onReset={handleReset}
            />
          </div>
        )}

        {phase === 'error' && (
          <div className="py-16 animate-fade-in max-w-2xl mx-auto">
            <div className="card border-accent-red/40 bg-accent-red/5 p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent-red/15 border border-accent-red/30 flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 16 16" fill="#f85149">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-accent-red mb-1">Analysis Failed</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">{error}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleReset}
                      className="btn-primary text-xs px-5 py-2.5 shadow-md"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2.5 text-xs rounded-lg border border-bg-border text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <Footer onScrollTo={handleScrollTo} />
    </div>
  )
}
