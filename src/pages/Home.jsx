import { Link } from 'react-router-dom'
import { COURSE, UNITS } from '../data/course.js'

export default function Home() {
  return (
    <div>
      <div className="hero">
        <div className="eyebrow">
          <span className="n">10 WEEKS</span> Course Overview
        </div>
        <h1>{COURSE.title}</h1>
        <p className="lead">
          {COURSE.level} · {COURSE.duration} — a hands-on path through the big data landscape, from the
          fundamentals of digital data through Hadoop, NoSQL databases, the Hive/Pig ecosystem, and Apache
          Spark. Every topic below pairs a short explanation with an in-browser simulation you can drive
          yourself.
        </p>
      </div>

      <div className="card">
        <h3>Learning Objectives</h3>
        <ul className="obj-list">
          {COURSE.objectives.map((o, i) => (
            <li key={i}>
              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>

      <h3 style={{ margin: '30px 0 4px' }}>Units</h3>
      <p className="lead" style={{ marginBottom: 8 }}>
        Five units, each covering a slice of the syllabus with dedicated interactive simulations per topic.
      </p>
      <div className="unit-grid">
        {UNITS.map((u) => (
          <Link key={u.id} to={`/${u.id}`} className="unit-card">
            <span className="bar-accent" style={{ background: `var(--${u.color})` }} />
            <span className="num">
              UNIT {u.number} · {u.weeks}
            </span>
            <h3>{u.title}</h3>
            <p>{u.tagline}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
