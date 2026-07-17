import { useState } from 'react'
import Terminal from '../../../components/sim/Terminal.jsx'

const SEED = [
  { id: 'a1f2', name: 'Meera Krishnan', email: 'meera@example.com', city: 'Chennai' },
  { id: 'b3c4', name: 'Arjun Nair', email: 'arjun@example.com', city: 'Bengaluru' },
  { id: 'c5d6', name: 'Divya Suresh', email: 'divya@example.com', city: 'Chennai' },
]

let uuidCounter = 100

function genUuid() {
  uuidCounter += 1
  return `uuid-${uuidCounter}`
}

function fmtRows(rows) {
  if (rows.length === 0) return '(0 rows)'
  const cols = ['id', 'name', 'email', 'city']
  const widths = cols.map((c) => Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length)))
  const line = (vals) => vals.map((v, i) => String(v).padEnd(widths[i])).join(' | ')
  const sep = widths.map((w) => '-'.repeat(w)).join('-+-')
  return [line(cols), sep, ...rows.map((r) => line(cols.map((c) => r[c])))].join('\n') + `\n\n(${rows.length} rows)`
}

function parseInsertValues(str) {
  const m = str.match(/\(([^)]*)\)\s*VALUES\s*\(([^)]*)\)/i)
  if (!m) return null
  const cols = m[1].split(',').map((c) => c.trim())
  const vals = m[2].split(',').map((v) => v.trim().replace(/^'(.*)'$/, '$1'))
  const row = {}
  cols.forEach((c, i) => {
    row[c] = vals[i] === 'uuid()' ? genUuid() : vals[i]
  })
  return row
}

export default function CqlshShell() {
  const [keyspaceCreated, setKeyspaceCreated] = useState(false)
  const [useDemo, setUseDemo] = useState(false)
  const [tableCreated, setTableCreated] = useState(false)
  const [rows, setRows] = useState(SEED)

  function resolver(cmd) {
    const c = cmd.trim().replace(/;$/, '')

    if (/^CREATE KEYSPACE/i.test(c)) {
      setKeyspaceCreated(true)
      return { output: "OK. Keyspace 'demo' created with the given replication strategy." }
    }

    if (/^USE\s+demo$/i.test(c)) {
      if (!keyspaceCreated) return { output: "InvalidRequest: keyspace 'demo' does not exist. Run CREATE KEYSPACE first.", isError: true }
      setUseDemo(true)
      return { output: 'OK. Now using keyspace demo.' }
    }

    if (/^CREATE TABLE\s+users/i.test(c)) {
      if (!useDemo) return { output: 'InvalidRequest: no keyspace has been specified. Run USE demo; first.', isError: true }
      setTableCreated(true)
      return { output: "OK. Table 'users' created (id uuid PRIMARY KEY, name text, email text, city text)." }
    }

    if (/^INSERT INTO\s+users/i.test(c)) {
      if (!tableCreated) return { output: "InvalidRequest: unconfigured table users. Run CREATE TABLE first.", isError: true }
      const row = parseInsertValues(c)
      if (!row || !row.id) return { output: 'SyntaxError: expected INSERT INTO users (id, name, email, city) VALUES (...)', isError: true }
      setRows((r) => [...r, { id: row.id, name: row.name, email: row.email, city: row.city }])
      return { output: 'OK.' }
    }

    if (/^SELECT \* FROM\s+users\s+WHERE/i.test(c)) {
      const whereMatch = c.match(/WHERE\s+(\w+)\s*=\s*'?([^']+?)'?$/i)
      if (!whereMatch) return { output: 'SyntaxError: malformed WHERE clause', isError: true }
      const [, col, val] = whereMatch
      if (col.toLowerCase() !== 'id') {
        return {
          output: `InvalidRequest: Cannot execute this query as it might involve data filtering and thus may have unpredictable performance.\nIf you want to execute this query despite the performance unpredictability, use ALLOW FILTERING (city is not part of the partition/primary key).`,
          isError: true,
        }
      }
      const found = rows.filter((r) => r.id === val)
      return { output: fmtRows(found) }
    }

    if (/^SELECT \* FROM\s+users\s*$/i.test(c)) {
      if (!tableCreated) return { output: "InvalidRequest: unconfigured table users.", isError: true }
      return { output: fmtRows(rows) }
    }

    if (/ALLOW FILTERING/i.test(c)) {
      const whereMatch = c.match(/WHERE\s+(\w+)\s*=\s*'?([^']+?)'?\s+ALLOW/i)
      if (whereMatch) {
        const [, col, val] = whereMatch
        const found = rows.filter((r) => String(r[col]) === val)
        return { output: fmtRows(found) + '\n\nWarning: ALLOW FILTERING scans the full table/partition — use sparingly in production.' }
      }
    }

    if (/^UPDATE\s+users\s+SET/i.test(c)) {
      const m = c.match(/SET\s+(\w+)\s*=\s*'?([^']+?)'?\s+WHERE\s+id\s*=\s*'?([^']+?)'?$/i)
      if (!m) return { output: 'SyntaxError: expected UPDATE users SET col = value WHERE id = ...', isError: true }
      const [, col, val, id] = m
      let matched = false
      setRows((r) =>
        r.map((row) => {
          if (row.id === id) {
            matched = true
            return { ...row, [col]: val }
          }
          return row
        }),
      )
      return { output: 'OK.' }
    }

    if (/^DELETE FROM\s+users\s+WHERE\s+id\s*=/i.test(c)) {
      const m = c.match(/id\s*=\s*'?([^']+?)'?$/i)
      if (!m) return { output: 'SyntaxError: expected DELETE FROM users WHERE id = ...', isError: true }
      setRows((r) => r.filter((row) => row.id !== m[1]))
      return { output: 'OK.' }
    }

    return {
      output: `Unrecognized CQL: ${cmd}\nTry: CREATE KEYSPACE demo WITH replication = {...}; USE demo; CREATE TABLE users (...); SELECT * FROM users; INSERT INTO users (...) VALUES (...);`,
      isError: true,
    }
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        A live CQLSH sandbox against an in-memory <code>users</code> table. Run the setup commands in order,
        then query, update and delete rows with real CQL syntax.
      </p>
      <Terminal
        prompt="cqlsh>"
        welcome={[
          "Connected to Test Cluster at 127.0.0.1:9042.",
          "Try: CREATE KEYSPACE demo WITH replication = {'class':'SimpleStrategy', 'replication_factor':1};",
          'Then: USE demo;',
          "Then: CREATE TABLE users (id uuid PRIMARY KEY, name text, email text, city text);",
          '(seed data is preloaded once the table is created — run SELECT * FROM users; after CREATE TABLE)',
        ]}
        resolver={resolver}
        placeholder="cqlsh command..."
      />
    </div>
  )
}
