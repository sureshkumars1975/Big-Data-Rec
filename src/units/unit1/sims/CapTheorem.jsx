import { useState } from 'react'

// Three-node distributed key-value store holding key "x".
// Nodes N1 & N2 form the majority partition, N3 is isolated when partitioned.
export default function CapTheorem() {
  const [partitioned, setPartitioned] = useState(false)
  const [mode, setMode] = useState('C') // 'C' = choose Consistency, 'A' = choose Availability
  const [values, setValues] = useState({ N1: 100, N2: 100, N3: 100 })
  const [log, setLog] = useState([])
  const [writeVal, setWriteVal] = useState(150)

  function addLog(text, type = 'info') {
    setLog((l) => [{ text, type, id: Date.now() + Math.random() }, ...l].slice(0, 6))
  }

  function togglePartition() {
    const next = !partitioned
    setPartitioned(next)
    addLog(next ? 'Network partition: N3 is now isolated from N1 & N2.' : 'Partition healed — all nodes reconnected.', next ? 'err' : 'ok')
    if (!next) {
      // heal: reconcile to majority value
      setValues((v) => ({ N1: v.N1, N2: v.N2, N3: v.N1 }))
      addLog('Reconciliation: N3 adopts the majority partition\'s value.', 'ok')
    }
  }

  function writeX() {
    if (!partitioned) {
      setValues({ N1: writeVal, N2: writeVal, N3: writeVal })
      addLog(`Write x=${writeVal} replicated to all 3 nodes.`, 'ok')
      return
    }
    if (mode === 'C') {
      // Consistency: minority partition (N3) rejects writes/reads to avoid returning stale data
      setValues((v) => ({ ...v, N1: writeVal, N2: writeVal }))
      addLog(`CP mode: majority (N1, N2) accepts x=${writeVal}. N3 REJECTS the request — unavailable rather than inconsistent.`, 'err')
    } else {
      // Availability: every reachable node accepts writes locally, causing divergence
      setValues((v) => ({ ...v, N1: writeVal, N2: writeVal }))
      addLog(`AP mode: N1 & N2 accept x=${writeVal}. N3 stays available too, but still serves its stale local value (${values.N3}) — the replicas have diverged.`, 'amber')
    }
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Three nodes replicate key <code>x</code>. Trigger a network partition, choose whether the system
        favors <b>Consistency</b> or <b>Availability</b>, then perform a write and watch what each node
        returns — the CAP theorem in miniature (Partition tolerance is a given in any distributed system).
      </p>

      <div className="row" style={{ justifyContent: 'center', gap: 40, margin: '20px 0', flexWrap: 'wrap' }}>
        {['N1', 'N2'].map((n) => (
          <div key={n} className={`node ${partitioned ? 'active' : 'active'}`} style={{ width: 110 }}>
            {n}
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 4 }}>x = {values[n]}</div>
          </div>
        ))}
        <div style={{ alignSelf: 'center', fontFamily: 'var(--mono)', color: partitioned ? 'var(--coral)' : 'var(--muted)', fontWeight: 700 }}>
          {partitioned ? '⚡ partitioned ⚡' : '— connected —'}
        </div>
        <div className={`node ${partitioned ? 'down' : 'active'}`} style={{ width: 110 }}>
          N3
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 4 }}>x = {values.N3}</div>
        </div>
      </div>

      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div className="row">
          <button className={`btn ${partitioned ? 'coral' : ''}`} onClick={togglePartition}>
            {partitioned ? 'Heal partition' : 'Trigger network partition'}
          </button>
        </div>
        <div className="row">
          <label className="ctl">
            Prefer:
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="C">Consistency (CP)</option>
              <option value="A">Availability (AP)</option>
            </select>
          </label>
          <input
            type="number"
            value={writeVal}
            onChange={(e) => setWriteVal(Number(e.target.value))}
            style={{ width: 90 }}
          />
          <button className="btn amber" onClick={writeX}>
            Write x = {writeVal}
          </button>
        </div>
      </div>

      <div className="term" style={{ marginTop: 16, maxHeight: 160 }}>
        {log.length === 0 && <div className="out">Try a write with and without a partition, in both CP and AP mode.</div>}
        {log.map((l) => (
          <div key={l.id} className={l.type === 'err' ? 'err' : l.type === 'amber' ? 'out' : 'out'} style={l.type === 'amber' ? { color: '#e0b060' } : undefined}>
            › {l.text}
          </div>
        ))}
      </div>
    </div>
  )
}
