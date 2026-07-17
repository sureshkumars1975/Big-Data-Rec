import { useMemo, useState } from 'react'

const NODE_COUNT = 6
const RADIUS = 110
const SIZE = 300

function hashKey(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return hash
}

export default function HashRing() {
  const [key, setKey] = useState('sureshkumar')
  const [rf, setRf] = useState(2)
  const [downNodes, setDownNodes] = useState(() => new Set())
  const [placement, setPlacement] = useState(null)

  const nodes = useMemo(
    () =>
      Array.from({ length: NODE_COUNT }, (_, i) => {
        const angle = (i / NODE_COUNT) * 2 * Math.PI - Math.PI / 2
        return {
          id: i,
          label: `N${i}`,
          x: SIZE / 2 + RADIUS * Math.cos(angle),
          y: SIZE / 2 + RADIUS * Math.sin(angle),
        }
      }),
    [],
  )

  function toggleDown(id) {
    setDownNodes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function insert() {
    if (!key.trim()) return
    const primary = hashKey(key.trim()) % NODE_COUNT
    const holders = []
    let cursor = primary
    let guard = 0
    while (holders.length < rf && guard < NODE_COUNT * 2) {
      holders.push(cursor)
      cursor = (cursor + 1) % NODE_COUNT
      guard++
    }
    const effective = holders.map((n) => {
      if (!downNodes.has(n)) return n
      let failover = (n + 1) % NODE_COUNT
      let g = 0
      while (downNodes.has(failover) && g < NODE_COUNT) {
        failover = (failover + 1) % NODE_COUNT
        g++
      }
      return failover
    })
    setPlacement({ key: key.trim(), primary, holders, effective })
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Cassandra hashes a row's <b>partition key</b> to a token, and places it on the node owning that part of
        the ring. The next (<i>replication factor</i> − 1) nodes clockwise hold replicas. Type a key, insert it,
        and try taking a node down to see how its range fails over to the next node clockwise.
      </p>

      <div className="row" style={{ gap: 10, marginBottom: 14, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <label className="ctl" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          Partition key
          <input type="text" value={key} onChange={(e) => setKey(e.target.value)} style={{ width: 180 }} />
        </label>
        <label className="ctl" style={{ flexDirection: 'column', alignItems: 'stretch', width: 200 }}>
          Replication factor: {rf}
          <input type="range" min={1} max={3} step={1} value={rf} onChange={(e) => setRf(Number(e.target.value))} />
        </label>
        <button className="btn amber" onClick={insert}>
          Insert
        </button>
      </div>

      <div style={{ position: 'relative', width: SIZE, height: SIZE, margin: '0 auto 16px' }}>
        <svg width={SIZE} height={SIZE} style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--line)" strokeWidth="2" />
        </svg>
        {nodes.map((n) => {
          const isDown = downNodes.has(n.id)
          const isPrimary = placement && placement.effective[0] === n.id && placement.primary === n.id
          const isPrimaryFailedOver = placement && placement.holders[0] === n.id && placement.effective[0] !== n.id
          const isReplica = placement && placement.effective.slice(1).includes(n.id)
          let cls = 'node'
          if (isDown) cls += ' down'
          else if (isPrimary) cls += ' highlight'
          else if (isReplica) cls += ' active'
          return (
            <div
              key={n.id}
              className={cls}
              onClick={() => toggleDown(n.id)}
              title="Click to toggle node down/up"
              style={{
                position: 'absolute',
                left: n.x - 34,
                top: n.y - 26,
                width: 68,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {n.label}
              {isDown && <div style={{ fontSize: '.65rem' }}>down</div>}
              {isPrimaryFailedOver && <div style={{ fontSize: '.6rem', color: 'var(--coral)' }}>(owner down)</div>}
            </div>
          )
        })}
      </div>

      {placement && (
        <div className="note teal">
          Key <code>"{placement.key}"</code> hashes to primary node <b>N{placement.primary}</b>. With RF={rf},
          replicas are stored on: {placement.holders.map((n) => `N${n}`).join(', ')}.
          {placement.holders.some((n, i) => n !== placement.effective[i]) && (
            <>
              {' '}
              Because a node in that set is down, its range is served by the next live node clockwise instead:
              effective holders are {placement.effective.map((n) => `N${n}`).join(', ')}.
            </>
          )}
        </div>
      )}

      <p className="note" style={{ marginTop: 10 }}>
        Cluster and schema metadata itself lives in system tables like <code>system.peers</code> (info about
        every node in the cluster) and <code>system_schema.tables</code> (keyspace/table definitions) — CQLSH
        can query these just like any other table.
      </p>
    </div>
  )
}
