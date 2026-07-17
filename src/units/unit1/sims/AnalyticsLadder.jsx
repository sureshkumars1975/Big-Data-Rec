import { useState } from 'react'

const STAGES = [
  {
    id: 'descriptive',
    label: 'Descriptive',
    color: 'teal',
    question: '"What happened?"',
    example: 'Total sales last quarter were ₹4.2 Cr, down 6% from the previous quarter.',
    techniques: ['aggregation', 'dashboards', 'summary statistics'],
  },
  {
    id: 'diagnostic',
    label: 'Diagnostic',
    color: 'amber',
    question: '"Why did it happen?"',
    example: 'The drop is concentrated in the North region, coinciding with a 3-week logistics delay.',
    techniques: ['drill-down', 'correlation', 'root-cause analysis'],
  },
  {
    id: 'predictive',
    label: 'Predictive',
    color: 'coral',
    question: '"What will happen next?"',
    example: 'A regression model forecasts a further 4% dip next quarter if the delay isn\'t resolved.',
    techniques: ['regression', 'classification', 'machine learning models'],
  },
  {
    id: 'prescriptive',
    label: 'Prescriptive',
    color: 'violet',
    question: '"What should we do about it?"',
    example: 'Optimization suggests rerouting North-region shipments through the West hub, recovering ~3% of forecast loss.',
    techniques: ['optimization', 'simulation', 'recommendation engines'],
  },
]

export default function AnalyticsLadder() {
  const [idx, setIdx] = useState(0)
  const s = STAGES[idx]

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Big data analytics is usually classified into four escalating types. Step through the ladder using a
        single retail scenario — a quarter-over-quarter sales dip.
      </p>

      <div className="row" style={{ gap: 6, marginBottom: 18 }}>
        {STAGES.map((st, i) => (
          <button
            key={st.id}
            className="btn"
            style={{
              flex: 1,
              background: i === idx ? `var(--${st.color})` : '#fff',
              color: i === idx ? '#fff' : `var(--${st.color})`,
              borderColor: `var(--${st.color})`,
            }}
            onClick={() => setIdx(i)}
          >
            {i + 1}. {st.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ background: `var(--${s.color}-soft)`, border: `1px solid var(--${s.color})`, margin: 0 }}>
        <span className="eyebrow" style={{ margin: 0, color: `var(--${s.color})` }}>
          {s.label} analytics
        </span>
        <p style={{ fontFamily: 'var(--display)', fontSize: '1.3rem', fontWeight: 700, margin: '8px 0' }}>
          {s.question}
        </p>
        <p style={{ margin: 0, color: 'var(--ink-soft)' }}>{s.example}</p>
        <div className="badge-row">
          {s.techniques.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </div>

      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn ghost" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
          ← Previous
        </button>
        <button className="btn ghost" disabled={idx === STAGES.length - 1} onClick={() => setIdx((i) => i + 1)}>
          Next →
        </button>
      </div>
    </div>
  )
}
