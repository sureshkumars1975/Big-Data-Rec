import { useEffect, useRef, useState } from 'react'
import Slider from '../../../components/sim/Slider.jsx'

let rowCounter = 0

export default function TtlExpiry() {
  const [name, setName] = useState('')
  const [ttl, setTtl] = useState(10)
  const [rows, setRows] = useState([])
  const [log, setLog] = useState([])
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRows((prev) => {
        const stillAlive = []
        const expired = []
        for (const r of prev) {
          const remaining = r.expiresAt - Date.now()
          if (remaining <= 0) {
            expired.push(r)
          } else {
            stillAlive.push(r)
          }
        }
        if (expired.length > 0) {
          setLog((l) => [
            ...expired.map((r) => `row '${r.name}' expired (TTL reached) — removed from table`),
            ...l,
          ].slice(0, 8))
        }
        return stillAlive
      })
    }, 250)
    return () => clearInterval(intervalRef.current)
  }, [])

  function insert() {
    if (!name.trim()) return
    rowCounter += 1
    const row = { id: rowCounter, name: name.trim(), ttl, expiresAt: Date.now() + ttl * 1000 }
    setRows((r) => [...r, row])
    setLog((l) => [`INSERT INTO users (name) VALUES ('${row.name}') USING TTL ${ttl};`, ...l].slice(0, 8))
    setName('')
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Cassandra can attach a <b>Time To Live (TTL)</b> to any write — after that many seconds, the column (or
        row, if all columns share the TTL) is automatically marked as a tombstone and disappears on the next
        read/compaction. Insert rows below and watch them expire live.
      </p>

      <div className="row" style={{ gap: 10, marginBottom: 14, alignItems: 'flex-end' }}>
        <label className="ctl" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          Name
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. session_token_47" style={{ width: 200 }} />
        </label>
        <div style={{ width: 220 }}>
          <Slider label="TTL (seconds)" value={ttl} min={5} max={30} step={1} unit="s" onChange={setTtl} />
        </div>
        <button className="btn amber" onClick={insert} disabled={!name.trim()}>
          Insert with TTL
        </button>
      </div>

      <table className="data" style={{ marginBottom: 16 }}>
        <thead>
          <tr>
            <th>name</th>
            <th>TTL set</th>
            <th>expires in</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={3}>no active rows</td>
            </tr>
          )}
          {rows.map((r) => (
            <RowCountdown key={r.id} row={r} />
          ))}
        </tbody>
      </table>

      <div className="term" style={{ maxHeight: 160 }}>
        {log.length === 0 && <div className="out">log will appear here</div>}
        {log.map((l, i) => (
          <div key={i} className={l.includes('expired') ? 'err' : 'out'}>
            › {l}
          </div>
        ))}
      </div>
    </div>
  )
}

function RowCountdown({ row }) {
  const [, force] = useState(0)
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 250)
    return () => clearInterval(id)
  }, [])
  const remaining = Math.max(0, (row.expiresAt - Date.now()) / 1000)
  return (
    <tr>
      <td>{row.name}</td>
      <td>{row.ttl}s</td>
      <td>{remaining.toFixed(1)}s</td>
    </tr>
  )
}
