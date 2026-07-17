import { useState } from 'react'
import Terminal from '../../../components/sim/Terminal.jsx'

const EMPLOYEES = [
  { id: 1, name: 'Anita Rao', dept: 'Engineering', salary: 95000 },
  { id: 2, name: 'Vikram Shah', dept: 'Sales', salary: 72000 },
  { id: 3, name: 'Priya Menon', dept: 'Engineering', salary: 105000 },
  { id: 4, name: 'Karthik Iyer', dept: 'Marketing', salary: 68000 },
  { id: 5, name: 'Sneha Pillai', dept: 'Sales', salary: 81000 },
  { id: 6, name: 'Rahul Dev', dept: 'Engineering', salary: 89000 },
]

function jobProgress() {
  const id = `hive_20260702${Math.floor(100000 + Math.random() * 900000)}_${Math.floor(1000 + Math.random() * 9000)}`
  return [
    `Query ID = ${id}`,
    'Total jobs = 1',
    'Launching Job 1 out of 1',
    'Stage-1 map = 0%,  reduce = 0%',
    'Stage-1 map = 100%,  reduce = 0%',
    'Stage-1 map = 100%,  reduce = 100%',
    'OK',
  ].join('\n')
}

function formatTable(headers, rows) {
  const lines = [headers.join('\t')]
  for (const r of rows) lines.push(r.map(String).join('\t'))
  return lines.join('\n')
}

function timeTaken(n) {
  const secs = (1.1 + Math.random() * 1.5).toFixed(3)
  return `Time taken: ${secs} seconds, Fetched: ${n} row(s)`
}

export default function HiveQuerySandbox() {
  const [rows] = useState(EMPLOYEES)

  function resolver(cmd) {
    const clean = cmd.trim().replace(/;$/, '')

    if (/^SELECT\s+\*\s+FROM\s+employees$/i.test(clean)) {
      const table = formatTable(['id', 'name', 'dept', 'salary'], rows.map((r) => [r.id, r.name, r.dept, r.salary]))
      return { output: `${jobProgress()}\n${table}\n${timeTaken(rows.length)}` }
    }

    const whereMatch = clean.match(/^SELECT\s+\*\s+FROM\s+employees\s+WHERE\s+dept\s*=\s*'([^']+)'$/i)
    if (whereMatch) {
      const dept = whereMatch[1]
      const filtered = rows.filter((r) => r.dept.toLowerCase() === dept.toLowerCase())
      const table = formatTable(['id', 'name', 'dept', 'salary'], filtered.map((r) => [r.id, r.name, r.dept, r.salary]))
      return { output: `${jobProgress()}\n${table}\n${timeTaken(filtered.length)}` }
    }

    if (/^SELECT\s+dept\s*,\s*COUNT\(\*\)\s+FROM\s+employees\s+GROUP\s+BY\s+dept$/i.test(clean)) {
      const counts = {}
      for (const r of rows) counts[r.dept] = (counts[r.dept] || 0) + 1
      const table = formatTable(['dept', '_c1'], Object.entries(counts).map(([d, c]) => [d, c]))
      return { output: `${jobProgress()}\n${table}\n${timeTaken(Object.keys(counts).length)}` }
    }

    if (/^SELECT\s+dept\s*,\s*AVG\(salary\)\s+FROM\s+employees\s+GROUP\s+BY\s+dept$/i.test(clean)) {
      const sums = {}
      const counts = {}
      for (const r of rows) {
        sums[r.dept] = (sums[r.dept] || 0) + r.salary
        counts[r.dept] = (counts[r.dept] || 0) + 1
      }
      const table = formatTable(
        ['dept', '_c1'],
        Object.keys(sums).map((d) => [d, (sums[d] / counts[d]).toFixed(2)]),
      )
      return { output: `${jobProgress()}\n${table}\n${timeTaken(Object.keys(sums).length)}` }
    }

    return {
      output:
        `FAILED: ParseException / unrecognized statement: ${cmd}\n` +
        'Try one of:\n' +
        '  SELECT * FROM employees;\n' +
        "  SELECT * FROM employees WHERE dept = 'Engineering';\n" +
        '  SELECT dept, COUNT(*) FROM employees GROUP BY dept;\n' +
        '  SELECT dept, AVG(salary) FROM employees GROUP BY dept;',
      isError: true,
    }
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        A live <code>employees</code> table (6 rows). Run real HiveQL below — notice that even a simple SELECT
        first prints simulated MapReduce job-progress lines, because Hive compiles your SQL into a job before
        it ever touches data.
      </p>
      <Terminal
        prompt="hive>"
        welcome={[
          'Hive session sandbox — employees table loaded (6 rows: id, name, dept, salary).',
          'Try: SELECT * FROM employees;',
          "Try: SELECT * FROM employees WHERE dept = 'Engineering';",
          'Try: SELECT dept, COUNT(*) FROM employees GROUP BY dept;',
          'Try: SELECT dept, AVG(salary) FROM employees GROUP BY dept;',
        ]}
        resolver={resolver}
        placeholder="SELECT * FROM employees;"
      />
    </div>
  )
}
