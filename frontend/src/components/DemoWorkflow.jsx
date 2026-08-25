export default function DemoWorkflow() {
  const steps = [
    {
      num: '01',
      title: 'Enter Repository',
      desc: 'Paste a public GitHub repository URL.',
      icon: '🔗',
      accent: 'border-accent-blue/30 text-accent-blue',
    },
    {
      num: '02',
      title: 'Analyze',
      desc: 'DevGuard inspects source code, dependencies, and configuration.',
      icon: '🔍',
      accent: 'border-accent-yellow/30 text-accent-yellow',
    },
    {
      num: '03',
      title: 'Understand',
      desc: 'AI provides root cause, evidence, severity, confidence, and affected files.',
      icon: '🧠',
      accent: 'border-accent-green/30 text-accent-green',
    },
    {
      num: '04',
      title: 'Fix',
      desc: 'Generate an AI Fix Prompt that can be given to a coding agent.',
      icon: '🛠️',
      accent: 'border-accent-purple/30 text-accent-purple',
    },
  ]

  return (
    <section className="py-12 border-t border-bg-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-heading text-accent-purple">Step-by-Step Flow</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1 mb-3">
            How It Works
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
            From raw repository link to structured diagnosis in four streamlined steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`card relative border ${step.accent} bg-bg-secondary/70 hover:bg-bg-secondary transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xl font-bold text-text-primary/70">{step.num}</span>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
