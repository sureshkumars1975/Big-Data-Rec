import { useEffect, useState } from 'react'

// Generic renderer for a unit's page: hero + sticky topic sidebar + topic sections.
// meta: { number, title, tagline, weeks, color }
// topics: [{ id, title, summary, content: JSX, simulation: JSX | null }]
export default function UnitPage({ meta, topics }) {
  const [activeId, setActiveId] = useState(topics[0]?.id)

  useEffect(() => {
    const handler = () => {
      let current = topics[0]?.id
      for (const t of topics) {
        const el = document.getElementById(t.id)
        if (el && el.getBoundingClientRect().top <= 120) {
          current = t.id
        }
      }
      setActiveId(current)
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [topics])

  return (
    <div>
      <div className="unit-hero">
        <span className="tag" style={{ background: `var(--${meta.color})` }}>
          Unit {meta.number} · {meta.weeks}
        </span>
        <h1>{meta.title}</h1>
        <p className="lead">{meta.tagline}</p>
      </div>

      <div className="unit-layout">
        <nav className="topic-nav">
          {topics.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className={activeId === t.id ? 'active' : ''}
            >
              {t.title}
            </a>
          ))}
        </nav>

        <div>
          {topics.map((t) => (
            <section key={t.id} id={t.id} className="topic-block">
              <h2>{t.title}</h2>
              {t.summary && <p className="sub">{t.summary}</p>}
              {t.content}
              {t.simulation}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
