import { useRef, useState } from 'react'

const START = { R1: 500, R2: 500, R3: 500 }

export default function BaseVsAcid() {
  const [model, setModel] = useState('ACID')
  const [replicas, setReplicas] = useState(START)
  const [running, setRunning] = useState(false)
  const [status, setStatus] = useState('idle')
  const timers = useRef([])

  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  function transfer() {
    clearTimers()
    setRunning(true)
    const newVal = replicas.R1 - 100

    if (model === 'ACID') {
      setStatus('Transaction locked across all replicas — committing atomically…')
      timers.current.push(
        setTimeout(() => {
          setReplicas({ R1: newVal, R2: newVal, R3: newVal })
          setStatus('Committed. All replicas are identical the instant the transaction returns (strong consistency).')
          setRunning(false)
        }, 700),
      )
    } else {
      setStatus('Soft state: R1 updates immediately, replicas propagate asynchronously…')
      setReplicas((r) => ({ ...r, R1: newVal }))
      timers.current.push(
        setTimeout(() => {
          setReplicas((r) => ({ ...r, R2: newVal }))
          setStatus('R2 has now converged. R3 is still stale — reads there return an old value (BASE = Basically Available, Soft state, Eventually consistent).')
        }, 900),
      )
      timers.current.push(
        setTimeout(() => {
          setReplicas((r) => ({ ...r, R3: newVal }))
          setStatus('All replicas eventually converged. Along the way, availability was never sacrificed — but reads could be stale.')
          setRunning(false)
        }, 2200),
      )
    }
  }

  function reset() {
    clearTimers()
    setReplicas(START)
    setStatus('idle')
    setRunning(false)
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Simulate a ₹100 debit from account balance replicated across 3 nodes, under two consistency models.
      </p>

      <div className="row" style={{ marginBottom: 14 }}>
        <label className="ctl">
          <input type="radio" checked={model === 'ACID'} onChange={() => { setModel('ACID'); reset() }} /> ACID (RDBMS)
        </label>
        <label className="ctl">
          <input type="radio" checked={model === 'BASE'} onChange={() => { setModel('BASE'); reset() }} /> BASE (NoSQL)
        </label>
      </div>

      <div className="grid3">
        {['R1', 'R2', 'R3'].map((r) => {
          const isStale = replicas[r] !== replicas.R1
          return (
            <div key={r} className={`node ${isStale ? 'down' : 'active'}`}>
              {r} {isStale && '(stale)'}
              <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: 4 }}>₹{replicas[r]}</div>
            </div>
          )
        })}
      </div>

      <p className="note" style={{ marginTop: 14 }}>{status === 'idle' ? 'Press "Transfer ₹100" to run the simulation.' : status}</p>

      <div className="row">
        <button className="btn" onClick={transfer} disabled={running}>
          Transfer ₹100 out of R1
        </button>
        <button className="btn ghost" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  )
}
