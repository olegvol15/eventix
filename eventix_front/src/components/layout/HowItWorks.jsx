import { memo } from 'react'
import '../../styles/how-it-works.css'

const STEPS = [
  {
    title: 'Find an event',
    text: 'Use search and filters to discover concerts, sports and theatre near you.',
    icon: '🎟️',
  },
  {
    title: 'Grab your tickets',
    text: 'Secure checkout, instant e-tickets and email confirmation.',
    icon: '⚡',
  },
  {
    title: 'Enjoy the show',
    text: 'Scan your QR at the venue. Support is here 24/7.',
    icon: '🎉',
  },
]

function HowItWorks() {
  return (
    <section className="hiw container">
      <header className="hiw__head">
        <h2>How it works</h2>
        <p>Three simple steps from search to the show.</p>
      </header>

      {/* Cards */}
      <div className="hiw__grid">
        {STEPS.map((s, i) => (
          <article key={s.title} className="hiw__card card">
            <div className="hiw__icon" aria-hidden>
              {s.icon}
            </div>
            <h3 className="hiw__title">
              <span className="hiw__index">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </h3>
            <p className="hiw__text">{s.text}</p>
          </article>
        ))}
      </div>

      {/* Animated progress */}
      {/* <div className="hiw__progress">
        <div className="hiw__progress-bar" />
        <div className="hiw__checks">
          <span className="hiw__check" aria-label="Step 1 done">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="hiw__check" aria-label="Step 2 done">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="hiw__check" aria-label="Step 3 done">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div> */}
    </section>
  )
}

export default memo(HowItWorks)
