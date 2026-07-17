import { useState } from 'react'

const COMPONENTS = [
  { id: 'hdfs', label: 'HDFS', role: 'The distributed, fault-tolerant storage layer. Files are split into large blocks and spread across DataNodes, with a NameNode tracking where every block lives.' },
  { id: 'yarn', label: 'YARN', role: 'The cluster resource manager. It negotiates CPU and memory for every application (MapReduce, Spark, Tez...) so many workloads can share the same physical cluster.' },
  { id: 'mr', label: 'MapReduce', role: 'The original batch processing model: map tasks transform input records in parallel, then reduce tasks aggregate the results by key.' },
  { id: 'hive', label: 'Hive', role: 'A SQL-like query layer over data sitting in HDFS. HiveQL queries are translated into MapReduce/Tez/Spark jobs, letting analysts use familiar SQL on big data.' },
  { id: 'pig', label: 'Pig', role: 'A high-level dataflow scripting language (Pig Latin) for expressing multi-step ETL pipelines that compile down to MapReduce jobs.' },
  { id: 'hbase', label: 'HBase', role: 'A NoSQL, column-oriented database built on top of HDFS, giving random real-time read/write access to very large tables (modeled after Google Bigtable).' },
  { id: 'sqoop', label: 'Sqoop', role: 'A bulk data-transfer tool for moving structured data back and forth between relational databases (MySQL, Oracle...) and HDFS/Hive.' },
  { id: 'flume', label: 'Flume', role: 'A service for collecting and moving large volumes of streaming log/event data (e.g. web server logs) into HDFS reliably.' },
  { id: 'zookeeper', label: 'Zookeeper', role: 'A distributed coordination service that manages configuration, naming, distributed locks and leader election — used internally by HBase, YARN HA and others.' },
  { id: 'oozie', label: 'Oozie', role: 'A workflow scheduler that chains Hadoop jobs (MapReduce, Hive, Pig, Sqoop...) together into time- or data-triggered pipelines.' },
]

export default function EcosystemMap() {
  const [sel, setSel] = useState('hdfs')
  const c = COMPONENTS.find((x) => x.id === sel)

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Hadoop is really a family of projects built around two foundations — HDFS for storage and YARN for
        resource management. Click any component to see the role it plays.
      </p>

      <div className="row" style={{ gap: 8, marginBottom: 16 }}>
        {COMPONENTS.map((x) => (
          <button
            key={x.id}
            className={`btn ${sel === x.id ? 'amber' : 'ghost'}`}
            style={{ padding: '8px 13px' }}
            onClick={() => setSel(x.id)}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="note">
        <b>{c.label}</b> — {c.role}
      </div>
    </div>
  )
}
