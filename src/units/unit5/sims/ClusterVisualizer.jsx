import { useEffect, useRef, useState } from 'react'
import Slider from '../../../components/sim/Slider.jsx'

export default function ClusterVisualizer() {
  const [numExecutors, setNumExecutors] = useState(3)
  const [driverState, setDriverState] = useState('idle')
  const [executorState, setExecutorState] = useState([])
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function submitJob() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setResult(null)
    setRunning(true)
    setDriverState('highlight')
    setExecutorState(Array(numExecutors).fill('idle'))

    const start = Date.now()
    const baseTime = 6

    for (let i = 0; i < numExecutors; i++) {
      const t = setTimeout(() => {
        setExecutorState((prev) => {
          const next = [...prev]
          next[i] = 'active'
          return next
        })
      }, 350 + i * 260)
      timers.current.push(t)
    }

    const totalDelay = 350 + numExecutors * 260 + 600
    const finish = setTimeout(() => {
      const simulated = Math.max(0.8, baseTime / numExecutors + 0.4)
      setDriverState('active')
      setExecutorState(Array(numExecutors).fill('done'))
      setResult(simulated.toFixed(1))
      setRunning(false)
    }, totalDelay)
    timers.current.push(finish)
  }

  function reset() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setDriverState('idle')
    setExecutorState([])
    setResult(null)
    setRunning(false)
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        The <b>Driver</b> owns the SparkContext and hands out tasks; the <b>Cluster Manager</b> (not drawn — it
        just negotiates resources) grants a pool of <b>Executors</b> that actually run those tasks. Pick a
        cluster size and submit a job to see it fan out.
      </p>

      <Slider
        label="Number of executors"
        value={numExecutors}
        min={2}
        max={6}
        step={1}
        onChange={(v) => !running && setNumExecutors(v)}
      />

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div className={`node ${driverState === 'highlight' ? 'highlight' : driverState === 'active' ? 'active' : ''}`} style={{ width: 160 }}>
          Driver
          <div style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: 4 }}>SparkContext / SparkSession</div>
        </div>

        <div style={{ fontFamily: 'var(--mono)', fontSize: '.72rem', color: 'var(--muted)' }}>↓ cluster manager allocates ↓</div>

        <div className="row" style={{ justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          {Array.from({ length: numExecutors }).map((_, i) => (
            <div
              key={i}
              className={`node ${executorState[i] === 'active' ? 'active' : executorState[i] === 'done' ? 'active' : ''}`}
              style={{ width: 100, opacity: executorState[i] === 'done' ? 0.75 : 1 }}
            >
              Executor {i + 1}
              <div style={{ fontSize: '.7rem', color: 'var(--muted)', marginTop: 4 }}>
                {executorState[i] === 'active' ? 'running task…' : executorState[i] === 'done' ? 'complete' : 'idle'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row" style={{ marginTop: 18 }}>
        <button className="btn" style={{ background: 'var(--blue)', borderColor: 'var(--blue)' }} disabled={running} onClick={submitJob}>
          {running ? 'Running…' : 'Submit Job'}
        </button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>

      {result && (
        <div className="note teal" style={{ marginTop: 14 }}>
          Job complete in {result}s with {numExecutors} executor{numExecutors > 1 ? 's' : ''}. More executors
          split the work into smaller pieces that run in parallel — up to the point where coordination
          overhead and data skew start to dominate.
        </div>
      )}
    </div>
  )
}
