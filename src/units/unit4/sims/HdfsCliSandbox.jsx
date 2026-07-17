import { useState } from 'react'
import Terminal from '../../../components/sim/Terminal.jsx'

const INITIAL_FS = {
  '/': ['user'],
  '/user': ['data.csv', 'reports.txt', 'logs'],
  '/user/logs': ['app.log', 'error.log'],
}

const INITIAL_FILES = {
  '/user/data.csv': 'id,name,dept\n1,Anita,CS\n2,Vikram,ECE\n3,Priya,CS',
  '/user/reports.txt': 'Q1 revenue: 4.2Cr\nQ2 revenue: 4.6Cr',
  '/user/logs/app.log': '2026-07-01 10:03:12 INFO Job started\n2026-07-01 10:03:45 INFO Job completed',
  '/user/logs/error.log': '2026-06-30 22:14:02 ERROR Connection timeout',
}

function norm(p) {
  if (!p) return '/'
  let out = p.trim()
  if (!out.startsWith('/')) out = '/' + out
  if (out.length > 1 && out.endsWith('/')) out = out.slice(0, -1)
  return out
}

function parentOf(p) {
  if (p === '/') return null
  const idx = p.lastIndexOf('/')
  return idx === 0 ? '/' : p.slice(0, idx)
}

function baseName(p) {
  const idx = p.lastIndexOf('/')
  return p.slice(idx + 1)
}

export default function HdfsCliSandbox() {
  const [fs, setFs] = useState(INITIAL_FS)
  const [files, setFiles] = useState(INITIAL_FILES)

  function isDir(p, fsState) {
    return Object.prototype.hasOwnProperty.call(fsState, p)
  }

  function isFile(p, fsState) {
    const parent = parentOf(p)
    return parent !== null && Array.isArray(fsState[parent]) && fsState[parent].includes(baseName(p))
  }

  function resolver(cmd) {
    const parts = cmd.trim().split(/\s+/)
    if (parts[0] !== 'hdfs' || parts[1] !== 'dfs') {
      return { output: `bash: ${parts[0]}: command not found\nTry an 'hdfs dfs -...' command.`, isError: true }
    }
    const op = parts[2]
    const args = parts.slice(3)

    if (op === '-ls') {
      const target = norm(args[0] || '/')
      if (isDir(target, fs)) {
        const entries = fs[target]
        if (entries.length === 0) return { output: `Found 0 items` }
        const lines = entries.map((name) => {
          const full = target === '/' ? `/${name}` : `${target}/${name}`
          if (isDir(full, fs)) {
            return `drwxr-xr-x   - hadoop supergroup          0 2026-07-02 10:00 ${full}`
          }
          const size = (files[full] || '').length || 128
          return `-rw-r--r--   3 hadoop supergroup       ${size} 2026-07-02 10:00 ${full}`
        })
        return { output: `Found ${entries.length} items\n${lines.join('\n')}` }
      }
      if (isFile(target, fs)) {
        const size = (files[target] || '').length || 128
        return { output: `-rw-r--r--   3 hadoop supergroup       ${size} 2026-07-02 10:00 ${target}` }
      }
      return { output: `ls: \`${target}': No such file or directory`, isError: true }
    }

    if (op === '-mkdir') {
      const target = norm(args[0])
      if (!args[0]) return { output: 'mkdir: missing operand', isError: true }
      if (isDir(target, fs) || isFile(target, fs)) {
        return { output: `mkdir: \`${target}': File exists`, isError: true }
      }
      const parent = parentOf(target)
      if (parent === null || !isDir(parent, fs)) {
        return { output: `mkdir: \`${target}': No such file or directory`, isError: true }
      }
      setFs((f) => ({ ...f, [parent]: [...f[parent], baseName(target)], [target]: [] }))
      return { output: '' }
    }

    if (op === '-put') {
      if (args.length < 2) return { output: 'put: missing local or destination operand', isError: true }
      const local = args[0]
      let dest = norm(args[1])
      let targetDir = dest
      let name = local
      if (!isDir(dest, fs)) {
        targetDir = parentOf(dest)
        name = baseName(dest)
        if (targetDir === null || !isDir(targetDir, fs)) {
          return { output: `put: \`${dest}': No such file or directory`, isError: true }
        }
      }
      const fullPath = targetDir === '/' ? `/${name}` : `${targetDir}/${name}`
      setFs((f) => ({
        ...f,
        [targetDir]: f[targetDir].includes(name) ? f[targetDir] : [...f[targetDir], name],
      }))
      setFiles((fl) => ({ ...fl, [fullPath]: `-- uploaded from local filesystem: ${local} --` }))
      return { output: '' }
    }

    if (op === '-rm') {
      const target = norm(args[0])
      if (!args[0]) return { output: 'rm: missing operand', isError: true }
      if (isDir(target, fs)) {
        return { output: `rm: \`${target}': Is a directory`, isError: true }
      }
      if (!isFile(target, fs)) {
        return { output: `rm: \`${target}': No such file or directory`, isError: true }
      }
      const parent = parentOf(target)
      setFs((f) => ({ ...f, [parent]: f[parent].filter((n) => n !== baseName(target)) }))
      setFiles((fl) => {
        const next = { ...fl }
        delete next[target]
        return next
      })
      return { output: `Deleted ${target}` }
    }

    if (op === '-cat') {
      const target = norm(args[0])
      if (!args[0]) return { output: 'cat: missing operand', isError: true }
      if (isDir(target, fs)) return { output: `cat: \`${target}': Is a directory`, isError: true }
      if (!isFile(target, fs)) return { output: `cat: \`${target}': No such file or directory`, isError: true }
      return { output: files[target] || '(empty file)' }
    }

    if (op === '-du') {
      const target = norm(args[0] || '/')
      if (!isDir(target, fs) && !isFile(target, fs)) {
        return { output: `du: \`${target}': No such file or directory`, isError: true }
      }
      function sizeOf(p) {
        if (isFile(p, fs)) return (files[p] || '').length || 128
        return (fs[p] || []).reduce((sum, name) => sum + sizeOf(p === '/' ? `/${name}` : `${p}/${name}`), 0)
      }
      return { output: `${sizeOf(target)}  ${target}` }
    }

    return {
      output: `hdfs dfs: '${op}': unknown command\nSupported: -ls, -mkdir, -put, -rm, -cat, -du`,
      isError: true,
    }
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        A tiny virtual HDFS tree lives in this sandbox. Use real <code>hdfs dfs</code> shell commands to browse,
        create, upload, read and delete files.
      </p>
      <Terminal
        prompt="$"
        welcome={[
          'HDFS CLI sandbox — virtual filesystem rooted at /user loaded.',
          'Try: hdfs dfs -ls /user',
          'Try: hdfs dfs -cat /user/data.csv',
          'Try: hdfs dfs -mkdir /user/backup',
          'Try: hdfs dfs -put notes.txt /user/',
          'Try: hdfs dfs -rm /user/reports.txt',
        ]}
        resolver={resolver}
        placeholder="hdfs dfs -ls /user"
      />
    </div>
  )
}
