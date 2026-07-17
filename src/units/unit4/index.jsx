import UnitPage from '../../components/UnitPage.jsx'
import Sim from '../../components/Sim.jsx'
import { UNITS } from '../../data/course.js'
import HiveArchitectureExplorer from './sims/HiveArchitectureExplorer.jsx'
import HiveQuerySandbox from './sims/HiveQuerySandbox.jsx'
import PigLatinFlowSimulator from './sims/PigLatinFlowSimulator.jsx'
import HdfsCliSandbox from './sims/HdfsCliSandbox.jsx'

const meta = UNITS.find((u) => u.id === 'unit-4')

const topics = [
  {
    id: 'hive-architecture',
    title: 'Hive: Architecture, Data Types & File Formats',
    summary: 'A data-warehouse layer on top of Hadoop that turns SQL-like queries into distributed execution jobs.',
    content: (
      <>
        <p>
          <b>Apache Hive</b> gives Hadoop a data-warehouse interface: analysts write familiar SQL-like queries
          instead of hand-writing MapReduce jobs, and Hive's engine translates those queries into execution
          plans that run across the cluster. It doesn't store data itself — it reads and writes files sitting on
          HDFS, describing their structure through a schema layered on top.
        </p>
        <ul>
          <li><b>Driver</b> — manages the session and the lifecycle of each submitted query.</li>
          <li><b>Compiler</b> — parses, type-checks and optimizes the query into an execution plan.</li>
          <li><b>Metastore</b> — the catalog: stores every table's schema, column types and HDFS location.</li>
          <li><b>Execution Engine</b> — runs the plan as MapReduce, Tez or Spark jobs on the cluster.</li>
        </ul>
        <p>
          Hive supports <b>primitive types</b> (INT, STRING, BOOLEAN, DOUBLE, TIMESTAMP, …) as well as{' '}
          <b>complex types</b> — ARRAY, MAP and STRUCT — for nesting data inside a single column. The file
          format a table is stored in matters a lot: TextFile and SequenceFile are simple and row-based, while
          columnar formats like <b>ORC</b> and <b>Parquet</b> compress far better and answer analytical queries
          much faster because they only read the columns a query actually needs.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Hive Architecture Explorer" color="violet">
        <HiveArchitectureExplorer />
      </Sim>
    ),
  },
  {
    id: 'hive-hql',
    title: 'HQL, SerDe & User Defined Functions',
    summary: 'SQL-flavored querying, pluggable read/write formats, and extending Hive with custom code.',
    content: (
      <>
        <p>
          <b>HiveQL (HQL)</b> looks and feels like SQL — SELECT, WHERE, GROUP BY and JOIN all work roughly as
          expected — but every statement is compiled down into one or more distributed jobs rather than being
          evaluated directly against an index, which is why even a simple query shows job-progress output before
          returning rows.
        </p>
        <p>
          A <b>SerDe</b> (Serializer/Deserializer) tells Hive how to turn raw bytes on disk into table rows and
          back again. Built-in SerDes handle formats like CSV and JSON; custom SerDes let Hive read almost any
          format you can describe.
        </p>
        <p>
          When built-in SQL functions aren't enough, Hive supports <b>User Defined Functions</b>: a <b>UDF</b>{' '}
          operates on one row and returns one value (like a scalar function), a <b>UDAF</b> aggregates many rows
          into one value (like SUM or AVG), and a <b>UDTF</b> takes one row in and can generate multiple rows
          out (like exploding an array column).
        </p>
      </>
    ),
    simulation: (
      <Sim title="Hive Query Sandbox" color="violet">
        <HiveQuerySandbox />
      </Sim>
    ),
  },
  {
    id: 'pig-basics',
    title: 'Pig: Features, Anatomy & Philosophy',
    summary: 'A high-level dataflow scripting platform for Hadoop, built around the procedural Pig Latin language.',
    content: (
      <>
        <p>
          <b>Apache Pig</b> offers an alternative way to process data on Hadoop: instead of declarative SQL, you
          write <b>Pig Latin</b> — a sequence of dataflow steps that load, transform and combine data,
          compiling down to MapReduce (or Tez/Spark) under the hood, much like Hive does.
        </p>
        <div className="badge-row">
          <span className="chip">Pig Latin: procedural, step-by-step</span>
          <span className="chip">SQL: declarative, describe the result</span>
          <span className="chip amber">Pig Latin: schema optional</span>
          <span className="chip amber">SQL: schema required upfront</span>
          <span className="chip">Pig Latin: great for ETL pipelines</span>
          <span className="chip amber">SQL: great for ad-hoc reporting</span>
        </div>
        <p>The <b>Pig Philosophy</b> is usually summarized in four playful principles:</p>
        <ul>
          <li><b>Pigs eat anything</b> — Pig can process structured, semi-structured or unstructured data without demanding a schema first.</li>
          <li><b>Pigs live anywhere</b> — scripts run in local mode, on MapReduce, or on Tez, without rewriting logic.</li>
          <li><b>Pigs are domestic animals</b> — easily controlled and extended through User Defined Functions.</li>
          <li><b>Pigs fly</b> — Pig is built to process data fast, at Hadoop scale.</li>
        </ul>
      </>
    ),
    simulation: null,
  },
  {
    id: 'pig-latin',
    title: 'Pig Latin, Data Types & Execution Modes',
    summary: 'A script is a sequence of relation-building statements — LOAD, FILTER, GROUP, FOREACH, ORDER — run locally or on the cluster.',
    content: (
      <>
        <p>
          A Pig Latin script builds up a chain of named <b>relations</b>, each one derived from the last:{' '}
          <code>LOAD</code> reads data in, <code>FILTER</code> keeps only matching tuples, <code>GROUP</code>{' '}
          buckets tuples by a key into bags, <code>FOREACH … GENERATE</code> projects and aggregates fields, and{' '}
          <code>ORDER BY</code> sorts the result before <code>DUMP</code> (print) or <code>STORE</code> (save)
          writes it out.
        </p>
        <p>
          Pig's type system includes simple scalars (<code>int</code>, <code>chararray</code>, <code>float</code>)
          alongside three structures built for nested, semi-structured data: a <b>tuple</b> (an ordered set of
          fields, like a row), a <b>bag</b> (an unordered collection of tuples, produced by GROUP), and a{' '}
          <b>map</b> (a set of key-value pairs).
        </p>
        <p>
          Pig scripts can run in two modes: <b>Local mode</b> executes entirely on the local filesystem with no
          cluster involved — fast to start, ideal for small data and testing. <b>MapReduce mode</b> submits the
          same script as jobs to the Hadoop cluster — slower to start because of job-submission overhead, but
          able to scale to enormous datasets.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Pig Latin Data Flow Simulator" color="violet">
        <PigLatinFlowSimulator />
      </Sim>
    ),
  },
  {
    id: 'hdfs-commands',
    title: 'HDFS Shell Commands',
    summary: 'The hdfs dfs command-line interface for browsing, moving and inspecting files stored on HDFS.',
    content: (
      <>
        <p>
          Regardless of which engine ultimately processes the data — Hive, Pig, MapReduce or Spark — the files
          themselves live on HDFS, and the <code>hdfs dfs</code> command gives you direct shell-style access to
          that filesystem.
        </p>
        <ul>
          <li><code>-ls</code> — list the contents of a directory.</li>
          <li><code>-mkdir</code> — create a new directory.</li>
          <li><code>-put</code> — upload a file from the local filesystem into HDFS.</li>
          <li><code>-get</code> — download a file from HDFS to the local filesystem.</li>
          <li><code>-rm</code> — delete a file.</li>
          <li><code>-cat</code> — print a file's contents to the terminal.</li>
          <li><code>-du</code> — show how much space a file or directory uses.</li>
        </ul>
      </>
    ),
    simulation: (
      <Sim title="HDFS CLI Sandbox" color="violet">
        <HdfsCliSandbox />
      </Sim>
    ),
  },
]

export default function Unit4() {
  return <UnitPage meta={meta} topics={topics} />
}
