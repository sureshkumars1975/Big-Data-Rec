import { useState } from 'react'

const VERSIONS = [
  {
    id: '1.0',
    label: 'Hadoop 1.0',
    year: '2011',
    headline: 'MapReduce-only, JobTracker-centric',
    points: [
      'Single JobTracker handles both resource management and job scheduling for the whole cluster.',
      'TaskTrackers on each node run Map/Reduce tasks and report heartbeats back to the JobTracker.',
      'The JobTracker is a single point of failure — if it goes down, all running jobs are lost.',
      'Only supports the MapReduce processing model; no other execution engines can share the cluster.',
      'Cluster scaled to roughly 4,000 nodes before the JobTracker became a bottleneck.',
    ],
  },
  {
    id: '2.0',
    label: 'Hadoop 2.0',
    year: '2013',
    headline: 'YARN separates resource management from processing',
    points: [
      'Introduces YARN (Yet Another Resource Negotiator): a global ResourceManager plus per-node NodeManagers.',
      'MapReduce becomes just one of many applications that can run on YARN — Spark, Tez and others can share the same cluster.',
      'Adds HDFS High Availability with an Active/Standby NameNode pair, removing the old single point of failure.',
      'HDFS Federation lets multiple NameNodes manage separate namespaces for better horizontal scalability.',
      'Clusters now scale well beyond 10,000 nodes.',
    ],
  },
  {
    id: '3.0',
    label: 'Hadoop 3.0',
    year: '2017',
    headline: 'Erasure coding, multiple standby NameNodes, container support',
    points: [
      'Erasure coding replaces full 3x replication for cold data — roughly the storage overhead of RAID, cutting storage cost by ~50%.',
      'Supports more than one Standby NameNode, tolerating multiple simultaneous NameNode failures.',
      'YARN adds native support for Docker containers, so applications can ship with their own runtime.',
      'Opportunistic containers and GPU / FPGA scheduling support workloads like deep learning on the same cluster.',
      'Minimum supported Java version moves to Java 8; default HDFS block size increases to 128MB.',
    ],
  },
]

export default function HadoopVersionExplorer() {
  const [sel, setSel] = useState('2.0')
  const v = VERSIONS.find((x) => x.id === sel)

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Click a release to see what changed architecturally. Hadoop's biggest inflection point was 2.0's
        introduction of YARN, which turned it from a MapReduce-only system into a general-purpose cluster
        operating system.
      </p>

      <div className="row" style={{ gap: 8, marginBottom: 16 }}>
        {VERSIONS.map((x) => (
          <button
            key={x.id}
            className={`btn ${sel === x.id ? 'amber' : 'ghost'}`}
            onClick={() => setSel(x.id)}
          >
            {x.label} <span className="mono" style={{ opacity: 0.75, fontSize: '.76rem' }}>({x.year})</span>
          </button>
        ))}
      </div>

      <div className="card" style={{ margin: 0, background: 'var(--amber-soft)', borderColor: '#e6d3a6' }}>
        <h3 style={{ color: '#7c5a17' }}>{v.label} — {v.headline}</h3>
        <ul style={{ marginBottom: 0 }}>
          {v.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div className="badge-row">
        <span className={`chip ${sel === '1.0' ? '' : 'drop'}`}>JobTracker / TaskTracker</span>
        <span className={`chip ${sel !== '1.0' ? 'amber' : 'drop'}`}>YARN (ResourceManager / NodeManager)</span>
        <span className={`chip ${sel === '3.0' ? 'amber' : 'drop'}`}>Erasure coding</span>
        <span className={`chip ${sel === '3.0' ? 'amber' : 'drop'}`}>Multiple Standby NameNodes</span>
        <span className={`chip ${sel === '3.0' ? 'amber' : 'drop'}`}>Docker / GPU scheduling</span>
      </div>
    </div>
  )
}
