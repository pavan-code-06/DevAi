import { useState } from 'react'

const DEMO_URL = 'https://github.com/pallets/flask'

export default function AnalyzeForm({ onAnalyze }) {
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [urlError, setUrlError] = useState('')

  const validate = () => {
    let valid = true
    if (!repositoryUrl.trim()) {
      setUrlError('Repository URL is required')
      valid = false
    } else if (!repositoryUrl.startsWith('http') && !repositoryUrl.startsWith('git@')) {
      setUrlError('Please enter a valid https:// URL')
      valid = false
    } else {
      setUrlError('')
    }
    return valid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onAnalyze({ repositoryUrl: repositoryUrl.trim() })
    }
  }

  const loadDemo = () => {
    setRepositoryUrl(DEMO_URL)
    setUrlError('')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Repository URL Input */}
        <div className="card">
          <label className="section-heading block">
            GitHub Repository URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="#8b949e">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </div>
            <input
              type="url"
              value={repositoryUrl}
              onChange={e => { setRepositoryUrl(e.target.value); setUrlError('') }}
              placeholder="https://github.com/owner/repository"
              className={`w-full bg-bg-tertiary border rounded-xl pl-10 pr-4 py-3.5 text-sm text-text-primary
                         placeholder-text-muted outline-none transition-all font-mono shadow-inner
                         ${urlError
                           ? 'border-accent-red focus:border-accent-red focus:ring-1 focus:ring-accent-red/30'
                           : 'border-bg-border focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30'}`}
            />
          </div>
          {urlError && (
            <p className="mt-2 text-xs text-accent-red font-medium">{urlError}</p>
          )}
          <p className="mt-2 text-xs text-text-muted">
            Enter any public GitHub repository. DevGuard inspects source files, dependencies, and configuration automatically.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 text-sm shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
            </svg>
            Analyze Repository
          </button>

          <button
            type="button"
            onClick={loadDemo}
            className="px-5 py-3.5 text-sm font-medium border border-bg-border rounded-xl text-text-secondary
                       hover:border-accent-blue hover:text-accent-blue active:bg-bg-tertiary transition-colors"
          >
            Load Demo
          </button>
        </div>

        {/* Note */}
        <p className="text-xs text-text-muted text-center pt-1">
          Deep codebase inspection typically takes 20–50 seconds depending on repository size
        </p>
      </form>
    </div>
  )
}
