import { useEffect, useRef, useState } from 'react'

const STEPS = [
  { id: 'java', label: 'Java installed', detail: 'Spark runs on the JVM — install a supported JDK (8, 11 or 17) and confirm with `java -version`.' },
  { id: 'download', label: 'Spark downloaded & extracted', detail: 'Grab a prebuilt release from spark.apache.org (or `pip install pyspark`) and extract the tarball.' },
  { id: 'home', label: 'SPARK_HOME configured', detail: 'Point the SPARK_HOME environment variable at the extracted folder and add its bin/ directory to PATH.' },
  { id: 'shell', label: 'spark-shell launched', detail: 'Run `spark-shell` (Scala REPL) or `pyspark` (Python REPL) to confirm the install works end to end.' },
]

const BANNER = `Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\\ \\/ _ \\/ _ \`/ __/  '_/
   /___/ .__/\\_,_/_/ /_/\\_\\   version 3.5.0
      /_/

Using Scala version 2.12.18
Spark context available as 'sc'.
Spark session available as 'spark'.
scala>`

export default function SetupChecklist() {
  const [status, setStatus] = useState(() => Object.fromEntries(STEPS.map((s) => [s.id, 'idle'])))
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function runCheck(id) {
    if (status[id] !== 'idle') return
    setStatus((s) => ({ ...s, [id]: 'running' }))
    const t = setTimeout(() => {
      setStatus((s) => ({ ...s, [id]: 'done' }))
    }, 500 + Math.random() * 300)
    timers.current.push(t)
  }

  function reset() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setStatus(Object.fromEntries(STEPS.map((s) => [s.id, 'idle'])))
  }

  const allDone = STEPS.every((s) => status[s.id] === 'done')

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Walk through the local install checklist. Run each check in order — once every step passes, the
        simulated <code>spark-shell</code> banner appears below.
      </p>

      <div className="col">
        {STEPS.map((s) => (
          <div
            key={s.id}
            className="card"
            style={{
              margin: 0,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
              background: status[s.id] === 'done' ? 'var(--blue-soft)' : '#fff',
              borderColor: status[s.id] === 'done' ? '#b9cbe0' : 'var(--line)',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    fontSize: '.72rem',
                    color: '#fff',
                    background: status[s.id] === 'done' ? 'var(--blue)' : status[s.id] === 'running' ? 'var(--amber)' : 'var(--muted)',
                  }}
                >
                  {status[s.id] === 'done' ? '✓' : status[s.id] === 'running' ? '…' : ''}
                </span>
                {s.label}
              </div>
              <div style={{ fontSize: '.82rem', color: 'var(--muted)', marginTop: 4 }}>{s.detail}</div>
            </div>
            <button
              className="btn"
              style={status[s.id] === 'idle' ? { background: 'var(--blue)', borderColor: 'var(--blue)' } : undefined}
              disabled={status[s.id] !== 'idle'}
              onClick={() => runCheck(s.id)}
            >
              {status[s.id] === 'done' ? 'Passed' : status[s.id] === 'running' ? 'Checking…' : 'Run check'}
            </button>
          </div>
        ))}
      </div>

      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>

      {allDone && (
        <div className="term" style={{ marginTop: 18 }}>
          <div className="out">{BANNER}</div>
        </div>
      )}
    </div>
  )
}
