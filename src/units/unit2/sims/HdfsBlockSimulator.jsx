import { useState } from 'react'
import Slider from '../../../components/sim/Slider.jsx'

const DATANODES = ['DN1', 'DN2', 'DN3', 'DN4', 'DN5']

export default function HdfsBlockSimulator() {
  const [fileSize, setFileSize] = useState(500)
  const [blockSize, setBlockSize] = useState(128)
  const [replication, setReplication] = useState(3)
  const [result, setResult] = useState(null)

  function splitAndDistribute() {
    const numBlocks = Math.max(1, Math.ceil(fileSize / blockSize))
    const blocks = Array.from({ length: numBlocks }, (_, i) => {
      const hosts = Array.from({ length: replication }, (_, r) => DATANODES[(i + r) % DATANODES.length])
      return { id: `B${i}`, hosts }
    })
    const nodeContents = DATANODES.map((dn) => ({
      node: dn,
      blocks: blocks.filter((b) => b.hosts.includes(dn)).map((b) => b.id),
    }))
    setResult({ numBlocks, blocks, nodeContents })
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Configure a file and watch HDFS split it into fixed-size blocks, then spread replicas of each block
        round-robin across DataNodes so no single node holds every copy.
      </p>

      <div className="grid3" style={{ marginBottom: 6 }}>
        <label className="ctl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
          <span>File size (MB)</span>
          <input
            type="number"
            min={1}
            value={fileSize}
            onChange={(e) => setFileSize(Math.max(1, Number(e.target.value)))}
          />
        </label>
        <label className="ctl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
          <span>Block size (MB)</span>
          <select value={blockSize} onChange={(e) => setBlockSize(Number(e.target.value))}>
            <option value={64}>64 MB</option>
            <option value={128}>128 MB</option>
            <option value={256}>256 MB</option>
          </select>
        </label>
        <Slider
          label="Replication factor"
          value={replication}
          min={1}
          max={5}
          onChange={setReplication}
          formatValue={(v) => `${v}x`}
        />
      </div>

      <button className="btn amber" onClick={splitAndDistribute}>
        Split &amp; Distribute
      </button>

      {result && (
        <>
          <div className="badge-row">
            <span className="chip amber">{result.numBlocks} blocks</span>
            <span className="chip amber">{replication}x replication</span>
            <span className="chip amber">≈ {(result.numBlocks * replication * blockSize).toLocaleString()} MB written to disk cluster-wide</span>
          </div>

          <div className="grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${DATANODES.length}, 1fr)`, gap: 10, marginTop: 10 }}>
            {result.nodeContents.map((nc) => (
              <div key={nc.node} className="node active" style={{ textAlign: 'left', padding: '10px 12px' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{nc.node}</div>
                {nc.blocks.length === 0 ? (
                  <div style={{ opacity: 0.6 }}>—</div>
                ) : (
                  nc.blocks.map((b) => (
                    <div key={b} className="pill" style={{ margin: '2px 0', fontSize: '.72rem' }}>{b}</div>
                  ))
                )}
              </div>
            ))}
          </div>

          <h4 style={{ marginTop: 18, marginBottom: 8, fontSize: '1rem' }}>NameNode metadata (block → hosts)</h4>
          <table className="data">
            <thead>
              <tr>
                <th>Block ID</th>
                <th>Replica hosts</th>
              </tr>
            </thead>
            <tbody>
              {result.blocks.map((b) => (
                <tr key={b.id}>
                  <td className="mono">{b.id}</td>
                  <td className="mono">{b.hosts.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="note" style={{ marginTop: 14 }}>
            With a replication factor of <b>{replication}</b>, every block has {replication} copies on distinct
            DataNodes, so the cluster can survive up to <b>{replication - 1}</b> simultaneous DataNode failures
            without losing any data. {replication === 1 && 'With no replication, losing a single DataNode means permanent data loss for any block it held.'}
          </p>
        </>
      )}
    </div>
  )
}
