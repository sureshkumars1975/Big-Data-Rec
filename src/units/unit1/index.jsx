import UnitPage from '../../components/UnitPage.jsx'
import Sim from '../../components/Sim.jsx'
import { UNITS } from '../../data/course.js'
import DataClassifier from './sims/DataClassifier.jsx'
import DataTimeline from './sims/DataTimeline.jsx'
import ThreeVPanel from './sims/ThreeVPanel.jsx'
import WorkloadComparator from './sims/WorkloadComparator.jsx'
import AnalyticsLadder from './sims/AnalyticsLadder.jsx'
import CapTheorem from './sims/CapTheorem.jsx'
import BaseVsAcid from './sims/BaseVsAcid.jsx'

const meta = UNITS.find((u) => u.id === 'unit-1')

const topics = [
  {
    id: 'types-of-digital-data',
    title: 'Types of Digital Data',
    summary: 'Structured, semi-structured and unstructured data — and why the distinction matters for storage and processing.',
    content: (
      <>
        <p>
          Digital data is usually grouped into three types based on how rigidly it follows a schema:
        </p>
        <ul>
          <li><b>Structured</b> — fits neatly into rows and columns with a fixed schema (e.g. an RDBMS table). Easy to query with SQL.</li>
          <li><b>Semi-structured</b> — has organizational markers like tags or key-value pairs, but no rigid schema (e.g. JSON, XML, log files).</li>
          <li><b>Unstructured</b> — no predefined model at all (e.g. images, video, free text). Makes up the vast majority of data generated today.</li>
        </ul>
      </>
    ),
    simulation: (
      <Sim title="Data Classifier" color="teal">
        <DataClassifier />
      </Sim>
    ),
  },
  {
    id: 'characteristics-and-evolution',
    title: 'Characteristics & Evolution of Big Data',
    summary: 'How data has grown from mainframe tapes to zettabyte-scale streams over five decades.',
    content: (
      <>
        <p>
          Data has always had characteristics like volume and format, but the <i>scale</i> and <i>speed</i> of
          generation have changed by orders of magnitude — from institution-generated mainframe records in the
          1970s to today's world where every phone, sensor and application is a data source.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Data Growth Timeline" color="teal">
        <DataTimeline />
      </Sim>
    ),
  },
  {
    id: 'three-vs',
    title: 'Definition & 3Vs of Big Data',
    summary: 'Big Data is data whose Volume, Velocity and Variety exceed the ability of traditional systems to handle it.',
    content: (
      <>
        <p>
          Big Data is most commonly defined through three (now often extended to five) core traits:
        </p>
        <ul>
          <li><b>Volume</b> — the sheer scale of data generated (terabytes to zettabytes).</li>
          <li><b>Velocity</b> — the speed at which data is generated and must be processed.</li>
          <li><b>Variety</b> — the range of formats and sources: structured, semi-structured, unstructured.</li>
          <li className="mono" style={{ listStyle: 'none', marginLeft: -22 }}>
            <span className="pill">+Veracity — trustworthiness/quality</span>
            <span className="pill">+Value — the insight actually extracted</span>
          </li>
        </ul>
        <p>
          These are the <b>non-definitional traits</b> too — challenges like storage cost, processing complexity
          and skill shortages arise directly from pushing these three dimensions to their limits.
        </p>
      </>
    ),
    simulation: (
      <Sim title="3V Control Panel" color="teal">
        <ThreeVPanel />
      </Sim>
    ),
  },
  {
    id: 'bi-vs-bigdata',
    title: 'Business Intelligence vs. Big Data',
    summary: 'Data warehouses and Hadoop-style platforms solve different problems — and increasingly, coexist.',
    content: (
      <>
        <p>
          Traditional Business Intelligence relies on a <b>data warehouse</b>: curated, structured, governed
          data queried with SQL for reports and dashboards. <b>Big Data</b> platforms like Hadoop are built for
          volume, velocity and variety that a warehouse schema can't accommodate economically.
        </p>
        <p>Rather than replacing one another, most real architectures let the two <b>coexist</b>: raw data lands in a Hadoop-based data lake, and curated slices flow into the warehouse for BI consumption.</p>
      </>
    ),
    simulation: (
      <Sim title="Workload Fit Comparator" color="teal">
        <WorkloadComparator />
      </Sim>
    ),
  },
  {
    id: 'analytics-classification',
    title: 'Big Data Analytics & Data Science Terminology',
    summary: 'Analytics escalates from describing the past to prescribing the future.',
    content: (
      <>
        <p>
          Big Data Analytics is classified by the kind of question it answers: <b>Descriptive</b> (what
          happened), <b>Diagnostic</b> (why it happened), <b>Predictive</b> (what will happen), and{' '}
          <b>Prescriptive</b> (what to do about it). Data Science sits underneath all four, combining statistics,
          programming and domain knowledge to extract insight from data at any of these levels.
        </p>
      </>
    ),
    simulation: (
      <Sim title="Analytics Ladder" color="teal">
        <AnalyticsLadder />
      </Sim>
    ),
  },
  {
    id: 'cap-theorem',
    title: 'CAP Theorem',
    summary: 'A distributed system can only guarantee two of Consistency, Availability and Partition tolerance at once.',
    content: (
      <>
        <p>
          The CAP theorem states that during a network partition, a distributed data store must choose between:
        </p>
        <ul>
          <li><b>Consistency (C)</b> — every read gets the most recent write, or an error.</li>
          <li><b>Availability (A)</b> — every request gets a (possibly stale) response, no errors.</li>
        </ul>
        <p>Partition tolerance (P) is non-negotiable for any real distributed system, so in practice the choice is between <b>CP</b> and <b>AP</b> systems.</p>
      </>
    ),
    simulation: (
      <Sim title="Network Partition Simulator" color="teal">
        <CapTheorem />
      </Sim>
    ),
  },
  {
    id: 'base-concept',
    title: 'BASE Concept',
    summary: 'NoSQL systems often trade ACID guarantees for Basically Available, Soft state, Eventually consistent semantics.',
    content: (
      <>
        <p>
          Where relational databases favor <b>ACID</b> (Atomicity, Consistency, Isolation, Durability), many
          NoSQL big-data stores favor <b>BASE</b>:
        </p>
        <ul>
          <li><b>Basically Available</b> — the system guarantees availability over strict consistency.</li>
          <li><b>Soft state</b> — replica state may change over time, even without new input, as it converges.</li>
          <li><b>Eventually consistent</b> — given enough time without new writes, all replicas converge to the same value.</li>
        </ul>
      </>
    ),
    simulation: (
      <Sim title="ACID vs BASE Transaction" color="teal">
        <BaseVsAcid />
      </Sim>
    ),
  },
]

export default function Unit1() {
  return <UnitPage meta={meta} topics={topics} />
}
