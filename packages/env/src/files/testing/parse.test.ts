import { describe, expect, it } from 'vitest'
import { parseEnvFile } from '../model/parse'

function values(text: string) {
  return parseEnvFile(text, 'dev').entries.map(({ key, value, literal }) => ({ key, value, literal }))
}

function issues(text: string) {
  return parseEnvFile(text, 'dev').issues
}

describe('parseEnvFile', () => {
  it('parses KEY=value lines with their location', () => {
    expect(parseEnvFile('A=1\n\nB=two', 'dev').entries).toEqual([
      { key: 'A', value: '1', literal: false, file: 'dev', line: 1 },
      { key: 'B', value: 'two', literal: false, file: 'dev', line: 3 },
    ])
  })

  it('skips blank lines and full-line comments', () => {
    expect(values('# comment\n   \n  # indented comment\nA=1\n')).toEqual([{ key: 'A', value: '1', literal: false }])
  })

  it('treats an empty value as an empty string', () => {
    expect(values('A=')).toEqual([{ key: 'A', value: '', literal: false }])
  })

  it('keeps # inside unquoted values', () => {
    expect(values('COLOR=#fff # not a comment')).toEqual([{ key: 'COLOR', value: '#fff # not a comment', literal: false }])
  })

  it('trims unquoted values and normalizes CRLF', () => {
    expect(values('A=  spaced  \r\nB=2\r\n')).toEqual([
      { key: 'A', value: 'spaced', literal: false },
      { key: 'B', value: '2', literal: false },
    ])
  })

  it('preserves whitespace inside double quotes', () => {
    expect(values('A="  spaced  "')).toEqual([{ key: 'A', value: '  spaced  ', literal: false }])
  })

  it('marks single-quoted values as literal', () => {
    expect(values("A='${NOT_INTERPOLATED}'")).toEqual([{ key: 'A', value: '${NOT_INTERPOLATED}', literal: true }])
  })

  it.each([
    ['export A=1', 1],
    ['A 1', 1],
    ['A = 1', 1],
    ['1A=1', 1],
    ['A=1\nnot a line', 2],
  ])('rejects malformed line %j', (text, line) => {
    expect(issues(text)).toEqual([{ file: 'dev', line, message: expect.stringContaining('Invalid line') }])
  })

  it.each(['A="open', "A='open", 'A="', 'A=closed"'])('rejects unbalanced quotes in %j', text => {
    expect(issues(text)).toEqual([{ file: 'dev', line: 1, message: expect.stringContaining('quote') }])
  })

  it('rejects duplicate keys within one file', () => {
    expect(issues('A=1\nA=2')).toEqual([{ file: 'dev', line: 2, message: expect.stringContaining('A') }])
  })

  it('reports every malformed line at once', () => {
    expect(issues('bad\nA=1\nworse')).toHaveLength(2)
  })
})
