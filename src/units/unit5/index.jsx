import UnitPage from '../../components/UnitPage.jsx'
import Sim from '../../components/Sim.jsx'
import { UNITS } from '../../data/course.js'
import SparkTimeline from './sims/SparkTimeline.jsx'
import SetupChecklist from './sims/SetupChecklist.jsx'
import ClusterVisualizer from './sims/ClusterVisualizer.jsx'
import ApiLayers from './sims/ApiLayers.jsx'
import LazyEvalDAG from './sims/LazyEvalDAG.jsx'
import SqlSandbox from './sims/SqlSandbox.jsx'

const meta = UNITS.find((u) => u.id === 'unit-5')

const topics = [
  {
    id: 'spark-history',
    title: 'What is Apache Spark? History, Present & Future',
    summary: 'A fast, general-purpose engine for distributed data processing, born from a Berkeley research project.',
    content: (
      <>
        <p>
          Apache Spark is a distributed computing engine for processing large datasets across a cluster of
          machines. Its defining idea, relative to Hadoop MapReduce, is <b>in-memory computation</b>: instead of
          writing intermediate results to disk between every step, Spark keeps data cached in RAM across
          executors whenever possible. For iterative workloads — machine learning training loops, graph
          algorithms, interactive exploration — this makes Spark dramatically faster than disk-bound MapReduce
          jobs doing the same work.
        </p>
        <p>
          Spark is also <b>general-purpose</b>: the same engine powers batch ETL, SQL analytics, streaming
          pipelines, machine learning and graph processing, through a family of libraries built on one core.
          That breadth, plus APIs in Scala, Java, Python and R, is a big reason it became the default choice
          for large-scale data processing.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Spark Timeline" color="blue">
        <SparkTimeline />
      </Sim>
    ),
  },
  {
    id: 'spark-local-setup',
    title: 'Downloading & Running Spark Locally',
    summary: 'Java, a Spark download, SPARK_HOME, and a REPL — the four ingredients of a local install.',
    content: (
      <>
        <p>
          Getting Spark running on your own machine takes a handful of steps: install a JDK (Spark runs on the
          JVM), download a prebuilt Spark distribution from <span className="mono">spark.apache.org</span> (or
          simply <span className="mono">pip install pyspark</span> for a Python-only setup), point the{' '}
          <span className="mono">SPARK_HOME</span> environment variable at the extracted folder, and add its{' '}
          <span className="mono">bin/</span> directory to your <span className="mono">PATH</span>.
        </p>
        <p>
          Once that's done, launching <span className="mono">spark-shell</span> (Scala) or{' '}
          <span className="mono">pyspark</span> (Python) drops you into an interactive REPL with a{' '}
          <span className="mono">SparkSession</span> already created for you as the variable{' '}
          <span className="mono">spark</span> — ready to load data and start experimenting without writing a
          full application first.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Environment Setup Checklist" color="blue">
        <SetupChecklist />
      </Sim>
    ),
  },
  {
    id: 'spark-architecture',
    title: "Spark's Basic Architecture: Driver, Executors & Cluster Manager",
    summary: 'One driver coordinates many executors, with a cluster manager brokering the resources between them.',
    content: (
      <>
        <p>
          Every Spark application has a <b>Driver</b> process, which runs your program's{' '}
          <span className="mono">main()</span>, creates the <span className="mono">SparkSession</span> /{' '}
          <span className="mono">SparkContext</span>, and turns your code into a plan of tasks — then schedules
          and tracks those tasks across the cluster.
        </p>
        <p>
          The <b>Cluster Manager</b> — Standalone, YARN, or Kubernetes — is a separate service that allocates
          CPU and memory resources to the application. It doesn't run your code; it just grants the driver a
          pool of worker slots.
        </p>
        <p>
          <b>Executors</b> are the worker processes that actually run tasks and cache data in memory or on disk
          for reuse across stages. Each executor stays alive for the life of the application, reporting status
          back to the driver.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Spark Cluster Visualizer" color="blue">
        <ClusterVisualizer />
      </Sim>
    ),
  },
  {
    id: 'spark-apis-session',
    title: 'Spark Applications, APIs & SparkSession',
    summary: 'SparkSession is the single entry point into every layer of the Spark API.',
    content: (
      <>
        <p>
          A <b>Spark application</b> is the driver and its executors working together on one job, from launch
          to completion. Inside that application, <b>SparkSession</b> is the unified entry point you code
          against — it replaced the older, separate{' '}
          <span className="mono">SparkContext</span> / <span className="mono">SQLContext</span> /{' '}
          <span className="mono">HiveContext</span> objects, and is what you use to build DataFrames, run SQL
          queries and configure the application.
        </p>
        <p>
          On top of that session sit several API layers, from the low-level RDD up to specialized libraries for
          SQL, streaming, machine learning and graphs — all sharing the same execution engine underneath.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Spark API Layers" color="blue">
        <ApiLayers />
      </Sim>
    ),
  },
  {
    id: 'partitions-lazy-eval',
    title: 'Partitions & Lazy Evaluation',
    summary: 'Data is split into partitions for parallelism; transformations only run once an action demands a result.',
    content: (
      <>
        <p>
          Spark splits a dataset into <b>partitions</b> — chunks distributed across executors so operations run
          on them in parallel. More partitions generally means more parallelism, up to the number of available
          cores, but also more scheduling overhead.
        </p>
        <p>
          Operations like <span className="mono">.filter()</span>, <span className="mono">.select()</span> and{' '}
          <span className="mono">.map()</span> are <b>transformations</b> — they are <b>lazy</b>: Spark just
          records them as steps in a logical plan (a DAG), without touching any data. Nothing actually runs
          until an <b>action</b> — <span className="mono">.collect()</span>,{' '}
          <span className="mono">.count()</span>, <span className="mono">.show()</span>,{' '}
          <span className="mono">.save()</span> — is called. At that point Spark optimizes the whole chain and
          executes it in one pass across the partitions.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Lazy Evaluation & DAG Builder" color="blue">
        <LazyEvalDAG />
      </Sim>
    ),
  },
  {
    id: 'dataframes-sql',
    title: 'DataFrames and Spark SQL',
    summary: 'Distributed, typed tables you can query with SQL, optimized by the Catalyst planner.',
    content: (
      <>
        <p>
          A <b>DataFrame</b> is a distributed collection of data organized into named, typed columns — the same
          mental model as a table in a relational database or a pandas DataFrame, except the rows can be spread
          across many machines.
        </p>
        <p>
          <b>Spark SQL</b> lets you query that DataFrame with familiar SQL syntax by registering it as a
          temporary view. Under the hood, Spark's <b>Catalyst optimizer</b> parses the query, applies
          rule-based and cost-based optimizations, and compiles it down to a physical execution plan — the
          same plan you'd see with <span className="mono">df.explain()</span>.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Spark SQL Sandbox" color="blue">
        <SqlSandbox />
      </Sim>
    ),
  },
]

export default function Unit5() {
  return <UnitPage meta={meta} topics={topics} />
}
