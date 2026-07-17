import UnitPage from '../../components/UnitPage.jsx'
import Sim from '../../components/Sim.jsx'
import { UNITS } from '../../data/course.js'
import BsonDocInspector from './sims/BsonDocInspector.jsx'
import MongoShell from './sims/MongoShell.jsx'
import AggregationPipeline from './sims/AggregationPipeline.jsx'
import IndexImpact from './sims/IndexImpact.jsx'
import CqlshShell from './sims/CqlshShell.jsx'
import TtlExpiry from './sims/TtlExpiry.jsx'
import HashRing from './sims/HashRing.jsx'

const meta = UNITS.find((u) => u.id === 'unit-3')

const topics = [
  {
    id: 'mongodb-intro',
    title: 'MongoDB: Introduction, Features & Data Types',
    summary: 'A document-oriented NoSQL database storing flexible, schema-free JSON-like records instead of table rows.',
    content: (
      <>
        <p>
          <b>MongoDB</b> is a <b>document-oriented</b> NoSQL database. Instead of rows in a table, it stores
          <b> documents</b> — self-contained, JSON-like records — inside <b>collections</b>. Where a relational
          table forces every row to share the exact same columns, a MongoDB collection can hold documents with
          completely different shapes side by side.
        </p>
        <ul>
          <li><b>BSON</b> — documents are stored on disk as Binary JSON, a binary-encoded superset of JSON that adds types like dates, binary data and ObjectIds, and is faster to parse/traverse than text JSON.</li>
          <li><b>Dynamic schema</b> — fields can be added or omitted per document without an ALTER TABLE-style migration, which suits rapidly evolving applications.</li>
          <li><b>Collections vs tables</b> — a collection is roughly analogous to a table, a document to a row, and a field to a column — but nesting and arrays let one document replace what would be several joined tables.</li>
          <li><b>Horizontal scalability</b> — built-in sharding distributes collections across many servers as data grows.</li>
        </ul>
        <p>Supported BSON data types include: <code>String</code>, <code>Number</code> (Int32/Int64/Double), <code>Boolean</code>, <code>Array</code>, <code>Object</code> (embedded documents), <code>ObjectId</code>, <code>Date</code>, and <code>Null</code>.</p>
      </>
    ),
    simulation: (
      <Sim title="Document Type Inspector" color="coral">
        <BsonDocInspector />
      </Sim>
    ),
  },
  {
    id: 'mongodb-crud',
    title: 'MongoDB Query Language & CRUD Operations',
    summary: 'find, insertOne/insertMany, updateOne, deleteOne, and the query operators that filter documents.',
    content: (
      <>
        <p>
          MongoDB's query language is expressed as JavaScript-style method calls on a collection, e.g.{' '}
          <code>db.students.find({'{'}dept: "CS"{'}'})</code>. The four CRUD operations map to:
        </p>
        <ul>
          <li><code>find()</code> / <code>findOne()</code> — read matching documents, optionally filtered by a query document.</li>
          <li><code>insertOne()</code> / <code>insertMany()</code> — create one or many new documents.</li>
          <li><code>updateOne()</code> / <code>updateMany()</code> — modify matching documents, typically using the <code>$set</code> operator to change specific fields without overwriting the whole document.</li>
          <li><code>deleteOne()</code> / <code>deleteMany()</code> — remove matching documents.</li>
        </ul>
        <p>
          Query operators refine filters: <code>$eq</code> (equals), <code>$gt</code>/<code>$gte</code>/<code>$lt</code>/<code>$lte</code>
          (comparisons), and <code>$in</code> (value is one of a list). Because a field can hold an array (like{' '}
          <code>grades</code>), a plain equality filter against an array field automatically matches if <i>any</i> element equals the value.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Mongo Shell Sandbox" color="coral">
        <MongoShell />
      </Sim>
    ),
  },
  {
    id: 'mongodb-aggregation',
    title: 'Aggregation: Count, Sort, Limit, Skip, Aggregate & Map-Reduce',
    summary: 'The aggregation pipeline transforms documents through chained stages to compute summaries.',
    content: (
      <>
        <p>
          Beyond simple queries, MongoDB's <b>aggregation pipeline</b> passes documents through a sequence of{' '}
          <b>stages</b>, each stage's output feeding the next — similar to Unix pipes. Common stages/operators:
        </p>
        <ul>
          <li><code>$match</code> — filter documents, like a WHERE clause (best placed early to shrink the pipeline).</li>
          <li><code>$group</code> — bucket documents by a key and compute aggregates (<code>$sum</code>, <code>$avg</code>, <code>$max</code>...) per bucket.</li>
          <li><code>$sort</code> — order documents by one or more fields.</li>
          <li><code>$limit</code> / <code>$skip</code> — page through results, e.g. for pagination.</li>
          <li><code>count()</code> — a shorthand for counting matched documents.</li>
        </ul>
        <p>
          Before the aggregation framework matured, MongoDB also supported <b>Map-Reduce</b>: a two-phase custom
          JavaScript job where a <i>map</i> function emits key-value pairs per document and a <i>reduce</i>
          function combines values sharing a key. It is more flexible but slower than the native pipeline, so
          the aggregation framework is now preferred for most use cases.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Aggregation Pipeline Builder" color="coral">
        <AggregationPipeline />
      </Sim>
    ),
  },
  {
    id: 'mongodb-cursors-indexes',
    title: 'Cursors, Indexes, Import & Export',
    summary: 'Cursors stream results lazily, indexes avoid full scans, mongoimport/mongoexport move bulk data.',
    content: (
      <>
        <p>
          A <code>find()</code> call does not return all matching documents at once — it returns a{' '}
          <b>cursor</b>, a pointer into the result set that the driver fetches in batches as you iterate,
          keeping memory usage low even for huge result sets.
        </p>
        <p>
          An <b>index</b> is a separate, ordered data structure (typically a B-tree) built on one or more
          fields. Without an index, a query must perform a <b>collection scan</b> — inspecting every document.
          With an index on the queried field, MongoDB can jump directly to matching entries, turning an O(n)
          scan into something closer to O(log n).
        </p>
        <p>
          <code>mongoimport</code> and <code>mongoexport</code> are command-line tools for moving data in and
          out of a collection in bulk — reading/writing JSON or CSV files — useful for seeding a database,
          migrating data, or taking quick backups of a collection.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Index Impact Simulator" color="coral">
        <IndexImpact />
      </Sim>
    ),
  },
  {
    id: 'cassandra-intro',
    title: 'Cassandra: Introduction, Features, Data Types & CQLSH',
    summary: 'A masterless, wide-column distributed store built for linear scalability and tunable consistency.',
    content: (
      <>
        <p>
          <b>Apache Cassandra</b> is a <b>wide-column</b> distributed database designed from the ground up for
          horizontal scale across many commodity servers, with no single point of failure.
        </p>
        <ul>
          <li><b>Masterless / peer-to-peer</b> — every node is functionally identical; there is no primary node coordinating writes, unlike MongoDB's replica-set primary. Any node can serve any request.</li>
          <li><b>Tunable consistency</b> — for each read/write you choose a consistency level (e.g. ONE, QUORUM, ALL), trading off latency against how many replicas must agree.</li>
          <li><b>CQL (Cassandra Query Language)</b> — a SQL-like language (<code>CREATE TABLE</code>, <code>SELECT</code>, <code>INSERT</code>...) run through the <code>cqlsh</code> shell, even though the underlying storage model is nothing like a relational engine.</li>
        </ul>
        <p>
          CQL data types include <code>text</code>, <code>int</code>, <code>uuid</code> (globally unique
          identifiers, often used as primary keys), <code>timestamp</code>, plus collection types{' '}
          <code>list</code>, <code>set</code> and <code>map</code>, and a special <code>counter</code> type for
          atomic increments.
        </p>
      </>
    ),
    simulation: (
      <Sim title="CQLSH Sandbox" color="coral">
        <CqlshShell />
      </Sim>
    ),
  },
  {
    id: 'cassandra-crud-ttl',
    title: 'Keyspaces, Collections, Counter, TTL & Alter Commands',
    summary: 'Replication lives at the keyspace level; TTL gives Cassandra automatic, built-in row/column expiry.',
    content: (
      <>
        <p>
          A <b>keyspace</b> is Cassandra's top-level namespace (roughly analogous to a database) and is where
          you configure the <b>replication strategy</b> and <b>replication factor</b> — how many copies of each
          row are kept, and across how many datacenters.
        </p>
        <ul>
          <li><b>Collection types</b> — <code>list</code> (ordered, duplicates allowed), <code>set</code> (unordered, unique), <code>map</code> (key-value pairs) let a single column hold structured, multi-valued data.</li>
          <li><b>Counter columns</b> — a special column type that only supports atomic increment/decrement, used for things like view counts, safely updated concurrently from many clients.</li>
          <li><b>TTL (Time To Live)</b> — any write can specify <code>USING TTL &lt;seconds&gt;</code>; after that time elapses, Cassandra automatically marks the data as a tombstone and it is removed on the next read or compaction — no cron job required.</li>
          <li><b>ALTER TABLE</b> — adds/drops/renames columns on an existing table without downtime, since Cassandra's schema is more forgiving of change than a traditional RDBMS.</li>
        </ul>
      </>
    ),
    simulation: (
      <Sim title="TTL Expiry Simulator" color="coral">
        <TtlExpiry />
      </Sim>
    ),
  },
  {
    id: 'cassandra-ring',
    title: 'Partitioning, Consistent Hashing & System Tables',
    summary: 'Cassandra arranges nodes in a ring and places data by hashing the partition key.',
    content: (
      <>
        <p>
          Cassandra distributes rows across the cluster using <b>consistent hashing</b>: each node owns a range
          of the hash space and is positioned on a conceptual <b>ring</b>. To place or find a row, Cassandra
          hashes its <b>partition key</b> to a token, then walks clockwise to the first node responsible for
          that token — the <b>primary replica</b>.
        </p>
        <p>
          The <b>replication factor (RF)</b> determines how many total copies exist: with RF = 3, the primary
          node and the next two nodes clockwise all store a copy. If a node fails, requests for its range are
          served by the next live node in line, and once it recovers, Cassandra repairs it back to consistency.
        </p>
        <p>
          Cassandra also exposes <b>system tables</b> for introspection: <code>system.peers</code> lists every
          node in the cluster and its state, while <code>system_schema.tables</code> (and related{' '}
          <code>system_schema.*</code> tables) hold the keyspace and table definitions — queryable with
          ordinary CQL <code>SELECT</code> statements.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Consistent Hashing Ring" color="coral">
        <HashRing />
      </Sim>
    ),
  },
]

export default function Unit3() {
  return <UnitPage meta={meta} topics={topics} />
}
