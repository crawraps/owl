const token = /\\\\|\\\$\{|\$\{([^}]*)(\})?/g
const name = /^[A-Za-z_][A-Za-z0-9_]*$/

export function interpolate(value: string, os: Record<string, string | undefined>): { value: string; errors: string[] } {
  const errors: string[] = []
  const result = value.replace(token, (match, reference: string | undefined, closed: string | undefined) => {
    if (match === '\\\\') return '\\'
    if (match === '\\${') return '${'
    if (!closed || !name.test(reference!)) {
      errors.push(`Invalid reference ${match}, expected \${NAME}`)
      return match
    }
    const resolved = os[reference!]
    if (resolved === undefined) {
      errors.push(`Variable ${reference} is not set in the environment (is it declared in turbo.json \`env\`?)`)
      return match
    }
    return resolved
  })
  return { value: result, errors }
}
