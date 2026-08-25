export default function WhyDevGuard() {
  const cards = [
    {
      title: 'Repository-First',
      tagline: 'Start with the codebase, not just an error message.',
      desc: 'No need to reproduce complicated runtime crashes or craft lengthy logs. DevGuard inspects the full repository context automatically.',
      icon: '📂',
      borderColor: 'border-accent-blue/30',
      tagColor: 'text-accent-blue',
    },
    {
      title: 'Evidence-Backed',
      tagline: 'Connect AI reasoning to actual repository evidence.',
      desc: 'Every diagnosis is anchored directly to manifest lines, configuration files, and source code. No ungrounded hallucinations.',
      icon: '🔬',
      borderColor: 'border-accent-green/30',
      tagColor: 'text-accent-green',
    },
    {
      title: 'Actionable',
      tagline: 'Go from diagnosis to a structured AI Fix Prompt.',
      desc: 'Get an immediate, agent-ready fix prompt designed to be copied directly into Antigravity, Gemini, Cursor, Copilot, or ChatGPT.',
      icon: '⚡',
      borderColor: 'border-accent-purple/30',
      tagColor: 'text-accent-purple',
    },
  ]

  return (
    <section className="py-12 border-t border-bg-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-heading text-accent-blue">Core Advantages</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-1 mb-3">
            Why DevGuard
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
            Engineered specifically to eliminate the friction of modern software troubleshooting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`card border ${card.borderColor} bg-bg-secondary hover:bg-bg-tertiary/40 transition-all flex flex-col justify-between`}
            >
              <div>
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className={`text-base font-bold mb-1 ${card.tagColor}`}>{card.title}</h3>
                <p className="text-xs font-semibold text-text-primary mb-3 leading-snug">
                  &ldquo;{card.tagline}&rdquo;
                </p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
