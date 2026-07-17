import { useEffect, useRef, useState } from 'react'
import Slider from '../../../components/sim/Slider.jsx'

const DATA = [
  { id: 1, name: 'alice', age: 34 },
  { id: 2, name: 'bharath', age: 29 },
  { id: 3, name: 'carla', age: 41 },
  { id: 4, name: 'devi', age: 26 },
  { id: 5, name: 'esha', age: 38 },
  { id: 6, name: 'farhan', age: 45 },
  { id: 7, name: 'gita', age: 22 },
  { id: 8, name: 'harish', age: 33 },
  { id: 9, name: 'ines', age: 31 },
]

const AVAILABLE = [
  { type: 'filter', code: '.filter(age > 30)' },
  { type: 'select', code: '.select(name, age)' },
  { type: 'map', code: '.map(uppercase name)' },
]

function applyStep(rows, type) {
  if (type === 'filter') return rows.filter((r) => r.age > 30)
  if (type === 'select') return rows.map((r) => ({ name: r.name, age: r.age }))
  if (type === 'map') return rows.map((r) => ({ ...r, name: (r.name || '').toUpperCase() }))
  return rows
}

export default function LazyEvalDAG() {
  const [queued, setQueued] = useState([])
  const [partitions, setPartitions] = useState(4)
  const [executing, setExecuting] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)
  const [activePartition, setActivePartition] = useState(-1)
  const [result, setResult] = useState(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function addStep(type) {
    if (executing) return
    setResult(null)
    setQueued((q) => [...q, { type, key: `${type}-${q.length}-${Date.now()}` }])
  }

  function reset() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setQueued([])
    setResult(null)
    setExecuting(false)
    setActiveStep(-1)
    setActivePartition(-1)
  }

  function runCollect() {
    if (queued.length === 0 || executing) return
    timers.current.forEach(clearTimeout)
    timers.current = []
    setExecuting(true)
    setResult(null)

    let delay = 0
    queued.forEach((step, i) => {
      const t1 = setTimeout(() => setActiveStep(i), delay)
      timers.current.push(t1)
      for (let p = 0; p < partitions; p++) {
        const t2 = setTimeout(() => setActivePartition(p), delay + 140 + p * 110)
        timers.current.push(t2)
      }
      delay += 140 + partitions * 110 + 140
    })

    const finalTimer = setTimeout(() => {
      let rows = DATA
      queued.forEach((step) => {
        rows = applyStep(rows, step.type)
      })
      setResult(rows)
      setExecuting(false)
      setActiveStep(-1)
      setActivePartition(-1)
    }, delay)
    timers.current.push(finalTimer)
  }

  const columns = result && result.length > 0 ? Object.keys(result[0]) : ['id', 'name', 'age']

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Transformations like <code>.filter()</code>, <code>.select()</code> and <code>.map()</code> are{' '}
        <b>lazy</b> — Spark only records them as a logical plan. Build a chain below, then trigger an{' '}
        <b>action</b> like <code>.collect()</code> and watch it actually flow across the partitions.
      </p>

      <div className="row" style={{ marginBottom: 12 }}>
        {AVAILABLE.map((a) => (
          <button key={a.type} className="btn ghost" disabled={executing} onClick={() => addStep(a.type)}>
            + {a.code}
          </button>
        ))}
      </div>

      <div className="card" style={{ margin: '0 0 14px', padding: '14px 18px' }}>
        {queued.length === 0 ? (
          <p style={{ margin: 0, color: 'var(--muted)' }}>No transformations queued yet. Add some above.</p>
        ) : (
          <>
            {!result && (
              <div className="chip amber" style={{ marginBottom: 10 }}>
                queued — nothing has run yet
              </div>
            )}
            <ol style={{ margin: 0, paddingLeft: 20 }}>
              {queued.map((step, i) => (
                <li
                  key={step.key}
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: '.86rem',
                    color: activeStep === i ? 'var(--blue)' : 'var(--ink-soft)',
                    fontWeight: activeStep === i ? 700 : 400,
                  }}
                >
                  {AVAILABLE.find((a) => a.type === step.type).code}
                  {activeStep === i && <span style={{ marginLeft: 8 }}>⚡ running…</span>}
                </li>
              ))}
            </ol>
          </>
        )}
      </div>

      <Slider label="Partitions" value={partitions} min={2} max={6} step={1} onChange={(v) => !executing && setPartitions(v)} />

      <div className="row" style={{ justifyContent: 'center', gap: 10, margin: '16px 0', flexWrap: 'wrap' }}>
        {Array.from({ length: partitions }).map((_, p) => (
          <div key={p} className={`node ${activePartition === p ? 'active' : ''}`} style={{ width: 84 }}>
            P{p}
          </div>
        ))}
      </div>

      <div className="row">
        <button
          className="btn amber"
          disabled={queued.length === 0 || executing}
          onClick={runCollect}
        >
          Action: .collect()
        </button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>

      {result && (
        <div style={{ marginTop: 16 }}>
          <p className="note teal" style={{ margin: '0 0 10px' }}>
            Action triggered execution — {result.length} row{result.length === 1 ? '' : 's'} returned to the driver.
          </p>
          <table className="data">
            <thead>
              <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {result.map((r, i) => (
                <tr key={i}>{columns.map((c) => <td key={c}>{String(r[c])}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
