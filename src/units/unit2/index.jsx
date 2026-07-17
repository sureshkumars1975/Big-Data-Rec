import UnitPage from '../../components/UnitPage.jsx'
import Sim from '../../components/Sim.jsx'
import { UNITS } from '../../data/course.js'
import HadoopVersionExplorer from './sims/HadoopVersionExplorer.jsx'
import EcosystemMap from './sims/EcosystemMap.jsx'
import FeatureTugOfWar from './sims/FeatureTugOfWar.jsx'
import HdfsBlockSimulator from './sims/HdfsBlockSimulator.jsx'
import MapReduceVisualizer from './sims/MapReduceVisualizer.jsx'
import CompressionSortBench from './sims/CompressionSortBench.jsx'

const meta = UNITS.find((u) => u.id === 'unit-2')

const topics = [
  {
    id: 'hadoop-intro',
    title: 'Introduction to Hadoop: Features, Advantages & Versions',
    summary: 'An open-source framework for storing and processing enormous datasets across clusters of commodity hardware.',
    content: (
      <>
        <p>
          <b>Apache Hadoop</b> is an open-source framework that lets ordinary, inexpensive servers work
          together as a single system to store and process datasets far larger than any one machine could
          handle. Instead of one powerful (and expensive) computer, Hadoop spreads both data and computation
          across a cluster of commodity machines.
        </p>
        <ul>
          <li><b>Distributed storage &amp; processing</b> — the Hadoop Distributed File System (HDFS) stores data across many nodes, and processing frameworks like MapReduce run computation right where the data lives.</li>
          <li><b>Fault tolerance</b> — every block of data is replicated across multiple nodes, so a hardware failure doesn't mean data loss or job failure.</li>
          <li><b>Horizontal scalability</b> — need more capacity? Add more commodity nodes to the cluster rather than buying a bigger single machine.</li>
          <li><b>Cost efficiency</b> — runs on cheap, off-the-shelf hardware instead of specialized, expensive enterprise storage/compute appliances.</li>
        </ul>
        <p>
          Several vendors package and support Hadoop: the community-driven <b>Apache Hadoop</b> project itself,
          <b> Cloudera</b> and <b>Hortonworks</b> (which merged in 2019 into a single Cloudera), <b>MapR</b>
          (later acquired by HPE), and managed cloud offerings like <b>Amazon EMR</b> that run Hadoop/Spark
          clusters without any on-premises hardware at all.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Hadoop Version Explorer" color="amber">
        <HadoopVersionExplorer />
      </Sim>
    ),
  },
  {
    id: 'hadoop-ecosystem',
    title: 'Hadoop Ecosystem Overview',
    summary: 'A whole family of tools has grown up around the two Hadoop foundations: HDFS and YARN.',
    content: (
      <>
        <p>
          "Hadoop" rarely refers to a single piece of software in production — it's shorthand for an entire
          <b> ecosystem</b> of projects that plug into the same two foundations: HDFS for distributed storage
          and YARN for cluster resource management. On top of those sit processing engines (MapReduce), SQL
          layers (Hive), scripting tools (Pig), NoSQL databases (HBase), data-movement tools (Sqoop, Flume),
          coordination services (Zookeeper) and workflow schedulers (Oozie).
        </p>
        <p>
          Understanding the ecosystem as layers — storage, resource management, processing, and higher-level
          tools built on top — makes it much easier to see how a real production pipeline is assembled from
          individual, replaceable pieces rather than one monolithic product.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Ecosystem Map" color="amber">
        <EcosystemMap />
      </Sim>
    ),
  },
  {
    id: 'hadoop-vs-sql',
    title: 'Hadoop vs. SQL & RDBMS vs. Hadoop',
    summary: 'Two very different philosophies: rigid, governed structure vs. flexible, massive scale.',
    content: (
      <>
        <p>
          A traditional RDBMS enforces <b>schema-on-write</b>: every table's structure is defined up front,
          and data must conform to it before it can be stored. Hadoop instead favors <b>schema-on-read</b>:
          raw data of any shape lands in HDFS first, and structure is applied only when it's read for a
          particular job or query.
        </p>
        <p>
          RDBMS systems are built around strong <b>ACID</b> transactional guarantees and scale <b>vertically</b>
          — you buy a bigger machine when you outgrow the current one. Hadoop trades strict transactional
          guarantees for massive <b>horizontal</b> scale-out on cheap hardware, and can natively hold
          structured, semi-structured and unstructured data side by side, not just clean rows and columns.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Feature Tug-of-War" color="amber">
        <FeatureTugOfWar />
      </Sim>
    ),
  },
  {
    id: 'hdfs-architecture',
    title: 'Hadoop Components & HDFS Architecture',
    summary: 'A master-slave architecture: a NameNode holds metadata, DataNodes hold the actual blocks.',
    content: (
      <>
        <p>
          HDFS follows a <b>master-slave</b> architecture. The <b>NameNode</b> is the master: it holds all
          filesystem metadata — the directory tree, file-to-block mapping, and which DataNodes host each
          block — entirely in memory for speed. It never stores actual file data itself. For high
          availability, a cluster typically runs one active NameNode plus one or more standby NameNodes ready
          to take over.
        </p>
        <p>
          <b>DataNodes</b> are the slaves: they store the actual data blocks on local disk and send periodic
          <b> heartbeats</b> to the NameNode to prove they're alive; a missed heartbeat triggers re-replication
          of that node's blocks elsewhere. On the processing side, YARN mirrors this pattern with a
          <b> ResourceManager</b> (master) allocating cluster resources and a <b>NodeManager</b> (slave) on
          each node actually running containers.
        </p>
      </>
    ),
    simulation: (
      <Sim title="HDFS Block Simulator" color="amber">
        <HdfsBlockSimulator />
      </Sim>
    ),
  },
  {
    id: 'mapreduce',
    title: 'MapReduce: Mapper, Reducer, Combiner, Partitioner',
    summary: 'A programming model that processes huge datasets in parallel across a cluster, in two phases.',
    content: (
      <>
        <p>
          MapReduce breaks a job into two main phases connected by a shuffle. The <b>Mapper</b> processes an
          input split and emits intermediate key-value pairs (e.g. a word and the count 1). An optional
          <b> Combiner</b> runs a mini-reduce locally on each mapper's output before it leaves the node,
          cutting down how much data must cross the network. The <b>Partitioner</b> then decides which
          reducer each key goes to, and the framework performs a <b>shuffle &amp; sort</b> that groups all
          values for the same key together. Finally the <b>Reducer</b> aggregates each key's values into the
          final output.
        </p>
        <p>
          The full pipeline is: <b>Input Split → Map → Combine (optional) → Shuffle &amp; Sort → Reduce →
          Output</b>. Because the combiner runs before data leaves the mapper's node, it can dramatically
          reduce network I/O for aggregation-friendly operations like counting or summing — the difference is
          easy to see on a large dataset with many repeated keys.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Word Count MapReduce Visualizer" color="amber">
        <MapReduceVisualizer />
      </Sim>
    ),
  },
  {
    id: 'searching-sorting-compression',
    title: 'Searching, Sorting & Compression',
    summary: 'How MapReduce orders output with secondary sort, and how compression codecs trade ratio for speed and splittability.',
    content: (
      <>
        <p>
          By default, MapReduce sorts intermediate data by key only. <b>Secondary sort</b> extends this by
          building a composite key (e.g. department + salary) so that values arrive at the reducer already
          grouped by the primary field <i>and</i> ordered by the secondary field within each group — useful
          for "top-N per group" style problems without buffering everything in the reducer's memory.
        </p>
        <p>
          Because so much data moves across the network during shuffle, Hadoop supports pluggable
          <b> compression codecs</b>. <b>Gzip</b> and <b>Bzip2</b> favor a high compression ratio at the cost
          of CPU time; <b>Snappy</b> and <b>LZO</b> favor speed over ratio. <b>Splittability</b> matters too:
          a splittable codec lets a single compressed file be divided across multiple Map tasks, while a
          non-splittable one forces the whole file to one task, hurting parallelism.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Compression & Sort Bench" color="amber">
        <CompressionSortBench />
      </Sim>
    ),
  },
]

export default function Unit2() {
  return <UnitPage meta={meta} topics={topics} />
}
