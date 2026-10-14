export interface EnvIssue {
  message: string
  file?: string
  line?: number
}

function formatIssue({ message, file, line }: EnvIssue): string {
  if (file === undefined) return `  - ${message}`
  return `  - ${line === undefined ? file : `${file}:${line}`}: ${message}`
}

export class EnvError extends Error {
  readonly issues: EnvIssue[]

  constructor(issues: EnvIssue[]) {
    super(`Invalid environment:\n${issues.map(formatIssue).join('\n')}`)
    this.name = 'EnvError'
    this.issues = issues
  }
}
