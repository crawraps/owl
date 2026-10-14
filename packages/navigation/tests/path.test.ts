import { describe, expect, it } from '@rstest/core'
import { isPathPrefix, joinPaths, normalizePath, relativeSegment, stripPrefix } from '../src/model/path'

describe('normalizePath', () => {
  it('normalizes empty to root', () => {
    expect(normalizePath('')).toBe('/')
  })

  it('adds leading slash', () => {
    expect(normalizePath('home')).toBe('/home')
  })

  it('removes trailing slash', () => {
    expect(normalizePath('/home/')).toBe('/home')
  })

  it('keeps root as root', () => {
    expect(normalizePath('/')).toBe('/')
  })

  it('normalizes relative path with segments', () => {
    expect(normalizePath('docs/components')).toBe('/docs/components')
  })

  it('strips trailing slash from multi-segment path', () => {
    expect(normalizePath('/docs/components/')).toBe('/docs/components')
  })

  it('handles only slashes', () => {
    expect(normalizePath('///')).toBe('//')
  })
})

describe('joinPaths', () => {
  it('joins prefix and suffix', () => {
    expect(joinPaths('/tabs', '/home')).toBe('/tabs/home')
  })

  it('handles root prefix', () => {
    expect(joinPaths('/', '/home')).toBe('/home')
  })

  it('handles root suffix', () => {
    expect(joinPaths('/tabs', '/')).toBe('/tabs')
  })

  it('handles relative suffix without leading slash', () => {
    expect(joinPaths('/tabs', 'home')).toBe('/tabs/home')
  })

  it('handles both root', () => {
    expect(joinPaths('/', '/')).toBe('/')
  })

  it('joins multi-segment paths', () => {
    expect(joinPaths('/tabs/docs', '/components/button')).toBe('/tabs/docs/components/button')
  })
})

describe('isPathPrefix', () => {
  it('matches exact path', () => {
    expect(isPathPrefix('/tabs/docs', '/tabs/docs')).toBe(true)
  })

  it('matches nested path', () => {
    expect(isPathPrefix('/tabs/docs', '/tabs/docs/components/button')).toBe(true)
  })

  it('does not match sibling path', () => {
    expect(isPathPrefix('/tabs/docs', '/tabs/home')).toBe(false)
  })

  it('does not match prefix that is a substring but not a path segment', () => {
    expect(isPathPrefix('/tabs/doc', '/tabs/docs')).toBe(false)
  })

  it('root prefix matches everything', () => {
    expect(isPathPrefix('/', '/anything')).toBe(true)
  })

  it('handles unnormalized inputs', () => {
    expect(isPathPrefix('tabs', '/tabs/home')).toBe(true)
  })
})

describe('stripPrefix', () => {
  it('strips the prefix', () => {
    expect(stripPrefix('/tabs', '/tabs/home')).toBe('/home')
  })

  it('returns root when path equals prefix', () => {
    expect(stripPrefix('/tabs', '/tabs')).toBe('/')
  })

  it('returns full when prefix does not match', () => {
    expect(stripPrefix('/tabs', '/other')).toBe('/other')
  })

  it('handles root prefix', () => {
    expect(stripPrefix('/', '/tabs/home')).toBe('/tabs/home')
  })

  it('strips multi-segment prefix', () => {
    expect(stripPrefix('/tabs/docs', '/tabs/docs/components/button')).toBe('/components/button')
  })
})

describe('relativeSegment', () => {
  it('extracts first segment after prefix', () => {
    expect(relativeSegment('/tabs/docs/components/button', '/tabs')).toBe('/docs')
  })

  it('returns the segment itself when single', () => {
    expect(relativeSegment('/tabs/home', '/tabs')).toBe('/home')
  })

  it('returns root when path equals prefix', () => {
    expect(relativeSegment('/tabs', '/tabs')).toBe('/')
  })

  it('handles multi-segment paths', () => {
    expect(relativeSegment('/tabs/docs/components/button', '/tabs/docs')).toBe('/components')
  })
})
