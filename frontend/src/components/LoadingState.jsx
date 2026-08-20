const STEPS = [
  {
    id: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    ),
    title: 'Cloning Repository',
    description: 'Fetching source code, dependencies, and configuration files...',
  },
  {
    id: 1,
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
      </svg>
    ),
    title: 'Analyzing Codebase',
    description: 'Inspecting project structure, dependencies, and configuration...',
  },
  {
    id: 2,
    icon: (
      <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
        <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.188.082l-.87.903-.884-1.79a.25.25 0 0 0-.187-.141z"/>
      </svg>
    ),
    title: 'Generating Diagnosis',
    description: 'AI is identifying root cause from evidence in your codebase...',
  },
]

export default function LoadingState({ step }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Animated logo */}
      <div className="flex items-center justify-center mb-10">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-accent-blue/10 border border-accent-blue/30 animate-pulse-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#58a6ff" strokeWidth="1.2"/>
              <path d="M8 5L11 7V11L8 13L5 11V7L8 5Z" fill="#58a6ff" fillOpacity="0.6"/>
            </svg>
          </div>
          {/* Rotating ring */}
          <div className="absolute -inset-2 rounded-full border-2 border-transparent border-t-accent-blue animate-spin" style={{ animationDuration: '1.5s' }} />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-text-primary mb-2">Analyzing your repository</h2>
      <p className="text-text-secondary text-sm mb-10">
        This usually takes 20–60 seconds. Don't close this page.
      </p>

      {/* Steps */}
      <div className="space-y-3 text-left">
        {STEPS.map((s) => {
          const isDone = s.id < step
          const isActive = s.id === step
          const isPending = s.id > step

          return (
            <div
              key={s.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-500
                ${isDone ? 'bg-accent-green/5 border-accent-green/20' : ''}
                ${isActive ? 'bg-accent-blue/5 border-accent-blue/30' : ''}
                ${isPending ? 'bg-bg-secondary border-bg-border opacity-40' : ''}
              `}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                ${isDone ? 'bg-accent-green/20 text-accent-green' : ''}
                ${isActive ? 'bg-accent-blue/20 text-accent-blue' : ''}
                ${isPending ? 'bg-bg-tertiary text-text-muted' : ''}
              `}>
                {isDone ? (
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                  </svg>
                ) : isActive ? (
                  <div className="animate-spin">{s.icon}</div>
                ) : (
                  s.icon
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-sm
                  ${isDone ? 'text-accent-green' : ''}
                  ${isActive ? 'text-text-primary' : ''}
                  ${isPending ? 'text-text-muted' : ''}
                `}>
                  {s.title}
                  {isDone && <span className="ml-2 text-xs text-accent-green/70">✓ Complete</span>}
                  {isActive && <span className="ml-2 text-xs text-accent-blue/70">In progress...</span>}
                </div>
                <div className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                  {s.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-8 bg-bg-tertiary rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-accent-blue rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-text-muted">
        Step {step + 1} of {STEPS.length}
      </p>
    </div>
  )
}
