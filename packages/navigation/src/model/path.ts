export function normalizePath(path: string): string {
  if (!path) return '/'
  const withSlash = path.startsWith('/') ? path : `/${path}`
  const withoutTrailing = withSlash.length > 1 && withSlash.endsWith('/') ? withSlash.slice(0, -1) : withSlash
  return withoutTrailing
}

export function joinPaths(prefix: string, suffix: string): string {
  const normalizedPrefix = normalizePath(prefix)
  const normalizedSuffix = normalizePath(suffix)
  if (normalizedPrefix === '/') return normalizedSuffix
  if (normalizedSuffix === '/') return normalizedPrefix
  return `${normalizedPrefix}${normalizedSuffix}`
}

export function isPathPrefix(prefix: string, full: string): boolean {
  const normalizedPrefix = normalizePath(prefix)
  const normalizedFull = normalizePath(full)
  if (normalizedPrefix === '/') return true
  if (normalizedFull === normalizedPrefix) return true
  return normalizedFull.startsWith(`${normalizedPrefix}/`)
}

export function stripPrefix(prefix: string, full: string): string {
  const normalizedPrefix = normalizePath(prefix)
  const normalizedFull = normalizePath(full)
  if (normalizedPrefix === '/') return normalizedFull
  if (normalizedFull === normalizedPrefix) return '/'
  if (normalizedFull.startsWith(`${normalizedPrefix}/`)) {
    const rest = normalizedFull.slice(normalizedPrefix.length)
    return rest.startsWith('/') ? rest : `/${rest}`
  }
  return normalizedFull
}

export function relativeSegment(full: string, prefix: string): string {
  const stripped = stripPrefix(prefix, full)
  if (stripped === '/') return '/'
  const firstSlash = stripped.indexOf('/', 1)
  if (firstSlash === -1) return stripped
  return stripped.slice(0, firstSlash)
}
