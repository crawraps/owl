import type { EnvIssue } from 'src/error'

export interface EnvEntry {
  key: string
  value: string
  /** Single-quoted values skip interpolation and escapes. */
  literal: boolean
  file: string
  line: number
}

const assignment = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/

function unquote(raw: string): { value: string; literal: boolean } | undefined {
  const quote = raw[0]
  if (quote !== '"' && quote !== "'") {
    return raw.endsWith('"') || raw.endsWith("'") ? undefined : { value: raw, literal: false }
  }
  if (raw.length < 2 || !raw.endsWith(quote)) return undefined
  return { value: raw.slice(1, -1), literal: quote === "'" }
}

export function parseEnvFile(text: string, file: string): { entries: EnvEntry[]; issues: EnvIssue[] } {
  const entries: EnvEntry[] = []
  const issues: EnvIssue[] = []
  const seen = new Set<string>()

  text.split(/\r?\n/).forEach((source, index) => {
    const line = index + 1
    const trimmed = source.trim()
    if (trimmed === '' || trimmed.startsWith('#')) return

    const match = assignment.exec(trimmed)
    if (!match) {
      issues.push({ file, line, message: 'Invalid line, expected KEY=value' })
      return
    }
    const key = match[1]!
    const parsed = unquote(match[2]!.trim())
    if (!parsed) {
      issues.push({ file, line, message: `Unbalanced quote in ${key}` })
      return
    }
    if (seen.has(key)) {
      issues.push({ file, line, message: `Duplicate key ${key}` })
      return
    }
    seen.add(key)
    entries.push({ key, ...parsed, file, line })
  })

  return { entries, issues }
}
