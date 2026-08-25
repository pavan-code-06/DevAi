export default function ArchitectureDiagram() {
  return (
    <section id="architecture" className="py-12 border-t border-bg-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-heading text-accent-blue">Technical Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1 mb-3">
            How DevGuard Works
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
            Accurate, real-world system design representing the actual codebase implementation.
          </p>
        </div>

        {/* Visual Architecture Card */}
        <div className="card border-accent-blue/30 bg-bg-secondary/90 shadow-xl overflow-hidden p-6 sm:p-8">
          
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-bg-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-blue animate-pulse"></span>
              <span className="text-sm font-semibold text-text-primary">DevGuard System Architecture</span>
            </div>
            <span className="badge bg-accent-blue/10 text-accent-blue border border-accent-blue/20 text-[10px]">
              Current Implementation
            </span>
          </div>

          {/* Node 1: User & Input */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md p-3.5 rounded-xl bg-bg-tertiary border border-bg-border text-center shadow-sm">
              <div className="text-xs font-mono font-semibold text-accent-blue mb-1">USER</div>
              <div className="text-xs text-text-secondary">Enters Public GitHub Repository URL</div>
            </div>

            {/* Connector */}
            <div className="h-6 w-0.5 bg-accent-blue/40 my-1 relative">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-r border-b border-accent-blue"></div>
            </div>

            {/* Node 2: Frontend */}
            <div className="w-full max-w-md p-3.5 rounded-xl bg-bg-tertiary border border-accent-blue/40 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-bold text-text-primary">FRONTEND / WEB UI</span>
                <span className="text-[10px] text-text-muted font-mono">(React + Vite + Tailwind)</span>
              </div>
              <div className="text-xs text-text-secondary mt-1">Input validation &amp; reactive dashboard</div>
            </div>

            {/* Connector */}
            <div className="h-6 w-0.5 bg-accent-blue/40 my-1 relative">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-r border-b border-accent-blue"></div>
            </div>

            {/* Node 3: Backend */}
            <div className="w-full max-w-md p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/50 text-center shadow-md">
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-bold text-accent-blue">FASTAPI BACKEND</span>
                <span className="text-[10px] text-accent-blue/80 font-mono">POST /api/analyze</span>
              </div>
              <div className="text-xs text-text-secondary mt-1">Orchestrates repository extraction &amp; AI analysis</div>
            </div>

            {/* Branch Connector */}
            <div className="w-full max-w-md flex flex-col items-center my-2">
              <div className="h-4 w-0.5 bg-accent-blue/40"></div>
              <div className="w-3/4 h-0.5 bg-accent-blue/40 relative">
                <div className="absolute -bottom-3 left-0 w-0.5 h-3 bg-accent-blue/40"></div>
                <div className="absolute -bottom-3 right-0 w-0.5 h-3 bg-accent-blue/40"></div>
              </div>
            </div>

            {/* Parallel Inspection Nodes */}
            <div className="w-full max-w-lg grid grid-cols-2 gap-3 mt-1 mb-2">
              <div className="p-3 rounded-lg bg-bg-tertiary border border-bg-border text-center">
                <div className="text-xs font-semibold text-text-primary">Repository Clone</div>
                <div className="text-[11px] text-text-muted mt-0.5">Shallow git clone with size limits</div>
              </div>
              <div className="p-3 rounded-lg bg-bg-tertiary border border-bg-border text-center">
                <div className="text-xs font-semibold text-text-primary">Project Inspection</div>
                <div className="text-[11px] text-text-muted mt-0.5">Manifests, configs &amp; AST parsing</div>
              </div>
            </div>

            {/* Rejoin Connector */}
            <div className="w-full max-w-lg flex flex-col items-center my-2">
              <div className="w-3/4 h-0.5 bg-accent-blue/40 relative">
                <div className="absolute -top-3 left-0 w-0.5 h-3 bg-accent-blue/40"></div>
                <div className="absolute -top-3 right-0 w-0.5 h-3 bg-accent-blue/40"></div>
              </div>
              <div className="h-4 w-0.5 bg-accent-blue/40 relative">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-r border-b border-accent-blue"></div>
              </div>
            </div>

            {/* Node 4: Context Extractor */}
            <div className="w-full max-w-md p-3.5 rounded-xl bg-bg-tertiary border border-bg-border text-center shadow-sm">
              <div className="text-xs font-bold text-text-primary">Code / Dependency / Configuration Analysis</div>
              <div className="text-[11px] text-text-muted mt-0.5">Formats structured context budget (~60KB)</div>
            </div>

            {/* Connector */}
            <div className="h-6 w-0.5 bg-accent-purple/60 my-1 relative">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-r border-b border-accent-purple"></div>
            </div>

            {/* Node 5: Gemini AI */}
            <div className="w-full max-w-md p-4 rounded-xl bg-accent-purple/10 border border-accent-purple/50 text-center shadow-md">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🤖</span>
                <span className="text-sm font-bold text-accent-purple">GEMINI AI</span>
                <span className="text-[10px] text-accent-purple/80 font-mono">(Google AI Studio)</span>
              </div>
              <div className="text-xs text-text-secondary mt-1">Deep semantic reasoning &amp; strict evidence correlation</div>
            </div>

            {/* Connector */}
            <div className="h-6 w-0.5 bg-accent-purple/60 my-1 relative">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-r border-b border-accent-purple"></div>
            </div>

            {/* Node 6: Structured Diagnosis */}
            <div className="w-full max-w-md p-3 rounded-xl bg-bg-tertiary border border-bg-border text-center">
              <div className="text-xs font-bold text-text-primary">Structured Diagnosis</div>
            </div>

            {/* Branch to 3 diagnosis items */}
            <div className="w-full max-w-lg flex flex-col items-center my-2">
              <div className="h-3 w-0.5 bg-accent-green/40"></div>
              <div className="w-4/5 h-0.5 bg-accent-green/40 relative">
                <div className="absolute -bottom-3 left-0 w-0.5 h-3 bg-accent-green/40"></div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-accent-green/40"></div>
                <div className="absolute -bottom-3 right-0 w-0.5 h-3 bg-accent-green/40"></div>
              </div>
            </div>

            {/* 3 Structured outputs */}
            <div className="w-full max-w-lg grid grid-cols-3 gap-2 mt-1 mb-2">
              <div className="p-2.5 rounded-lg bg-bg-tertiary border border-accent-blue/30 text-center">
                <div className="text-[11px] font-bold text-accent-blue">Root Cause</div>
                <div className="text-[10px] text-text-muted">Direct defect</div>
              </div>
              <div className="p-2.5 rounded-lg bg-bg-tertiary border border-accent-yellow/30 text-center">
                <div className="text-[11px] font-bold text-accent-yellow">Evidence</div>
                <div className="text-[10px] text-text-muted">Lines &amp; versions</div>
              </div>
              <div className="p-2.5 rounded-lg bg-bg-tertiary border border-accent-purple/30 text-center">
                <div className="text-[11px] font-bold text-accent-purple">Affected Files</div>
                <div className="text-[10px] text-text-muted">Target paths</div>
              </div>
            </div>

            {/* Connector to Suggested Fix */}
            <div className="h-5 w-0.5 bg-accent-green/40 my-1 relative">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-r border-b border-accent-green"></div>
            </div>

            {/* Suggested Fix */}
            <div className="w-full max-w-md p-3 rounded-xl bg-bg-tertiary border border-accent-green/40 text-center">
              <div className="text-xs font-bold text-accent-green">Suggested Fix</div>
              <div className="text-[11px] text-text-muted mt-0.5">Code remediation guidance</div>
            </div>

            {/* Connector to AI Fix Prompt */}
            <div className="h-5 w-0.5 bg-accent-purple/50 my-1 relative">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-r border-b border-accent-purple"></div>
            </div>

            {/* AI Fix Prompt */}
            <div className="w-full max-w-md p-3.5 rounded-xl bg-accent-purple/10 border border-accent-purple/50 text-center">
              <div className="text-xs font-bold text-accent-purple">AI Fix Prompt Generator</div>
              <div className="text-[11px] text-text-muted mt-0.5">Comprehensive 10-section prompt ready for agents</div>
            </div>

            {/* Final Connector */}
            <div className="h-5 w-0.5 bg-accent-blue/50 my-1 relative">
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-r border-b border-accent-blue"></div>
            </div>

            {/* Final Consumer */}
            <div className="w-full max-w-md p-3.5 rounded-xl bg-accent-blue/15 border border-accent-blue text-center shadow-lg">
              <div className="text-xs font-bold text-text-primary">Developer / Coding Agent</div>
              <div className="text-[11px] text-text-secondary mt-0.5">Antigravity · Gemini · Cursor · Copilot · ChatGPT</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
