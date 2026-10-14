import { afterEach, expect, test } from 'bun:test'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { checkPreviewReady, createAndroidDevRunner, type CommandOptions } from './android-dev'

const temporaryDirectories: string[] = []

async function workspace() {
  const cwd = await mkdtemp('/tmp/opencode/owl-preview-')
  temporaryDirectories.push(cwd)
  await mkdir(join(cwd, 'android/app/src/main/assets'), { recursive: true })
  await writeFile(join(cwd, 'android/app/src/main/assets/capacitor.config.json'), '{"appId":"com.familyfinance.owl"}\n')
  return cwd
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true })))
})

test.each([
  ['List of devices attached\n', 'No Android device'],
  ['List of devices attached\nphone\tunauthorized\n', 'unauthorized'],
  ['List of devices attached\nphone\toffline\n', 'offline'],
  ['List of devices attached\nphone\tdevice\nemulator-5554\tdevice\n', 'Multiple Android devices'],
])('rejects invalid device selection without deployment: %s', async (devices, message) => {
  const calls: string[][] = []
  const run = createAndroidDevRunner({
    execute: async argv => {
      calls.push(argv)
      return devices
    },
    checkReady: async () => {},
  })
  await expect(run()).rejects.toThrow(message)
  expect(calls).toEqual([['adb', 'devices']])
})

test('requires emitted index.html before checking the dev server', async () => {
  await expect(checkPreviewReady(await workspace())).rejects.toThrow('dist/index.html')
})

test('rejects missing dev server with actionable instructions', async () => {
  const cwd = await workspace()
  await mkdir(join(cwd, 'dist'))
  await writeFile(join(cwd, 'dist/index.html'), '<div id="root"></div>')
  await expect(checkPreviewReady(cwd, 'http://127.0.0.1:1')).rejects.toThrow('bun run dev --filter=mobile')
})

test('accepts disk output when the server returns a successful response', async () => {
  const cwd = await workspace()
  await mkdir(join(cwd, 'dist'))
  await writeFile(join(cwd, 'dist/index.html'), '<div id="root"></div>')
  const server = Bun.serve({ hostname: '127.0.0.1', port: 0, fetch: () => new Response('<div id="root"></div>') })
  try {
    await checkPreviewReady(cwd, server.url.href)
  } finally {
    server.stop(true)
  }
})

test('prepares and launches a remote device without building web output and restores native configuration', async () => {
  const cwd = await workspace()
  const configPath = join(cwd, 'android/app/src/main/assets/capacitor.config.json')
  const calls: Array<{ argv: string[]; options?: CommandOptions }> = []
  let ready = false
  const run = createAndroidDevRunner({
    cwd,
    checkReady: async () => {
      ready = true
    },
    execute: async (argv, options) => {
      calls.push({ argv, options })
      if (argv[0] === 'adb' && argv[1] === 'devices') return 'List of devices attached\n192.168.1.10:37245\tdevice\n'
      expect(ready).toBe(true)
      if (argv[0] === 'bun') await writeFile(configPath, '{"appId":"com.familyfinance.owl","server":{"allowNavigation":["example.org"]}}')
      if (argv[0] === './gradlew')
        expect(JSON.parse(await readFile(configPath, 'utf8')).server).toEqual({ allowNavigation: ['example.org'], url: 'http://localhost:3000', cleartext: true })
      return ''
    },
  })
  await run()
  expect(calls.map(call => call.argv)).toEqual([
    ['adb', 'devices'],
    ['adb', '-s', '192.168.1.10:37245', 'reverse', 'tcp:3000', 'tcp:3000'],
    ['bun', 'run', 'cap:sync'],
    ['./gradlew', 'assembleDebug'],
    ['adb', '-s', '192.168.1.10:37245', 'install', '-r', join(cwd, 'android/app/build/outputs/apk/debug/app-debug.apk')],
    ['adb', '-s', '192.168.1.10:37245', 'shell', 'monkey', '-p', 'com.familyfinance.owl', '-c', 'android.intent.category.LAUNCHER', '1'],
  ])
  expect(calls[2]?.options).toMatchObject({ cwd })
  expect(calls[3]?.options?.cwd).toBe(join(cwd, 'android'))
  expect(await readFile(configPath, 'utf8')).toBe('{"appId":"com.familyfinance.owl"}\n')
})

test.each(['reverse', 'cap:sync', 'assembleDebug', 'install', 'monkey'])('stops at failed %s and restores native configuration', async failingCommand => {
  const cwd = await workspace()
  const configPath = join(cwd, 'android/app/src/main/assets/capacitor.config.json')
  const commands: string[][] = []
  const run = createAndroidDevRunner({
    cwd,
    checkReady: async () => {},
    execute: async argv => {
      commands.push(argv)
      if (argv[1] === 'devices') return 'List of devices attached\nphone\tdevice\n'
      if (argv.includes('cap:sync')) await writeFile(configPath, '{"server":{"url":"http://localhost:3000"}}')
      if (argv.includes(failingCommand)) throw new Error(`Failed ${failingCommand}`)
      return ''
    },
  })
  await expect(run()).rejects.toThrow(`Failed ${failingCommand}`)
  expect(commands.at(-1)).toContain(failingCommand)
  expect(await readFile(configPath, 'utf8')).toBe('{"appId":"com.familyfinance.owl"}\n')
})

test('readiness failure prevents port forwarding and deployment', async () => {
  const commands: string[][] = []
  const run = createAndroidDevRunner({
    checkReady: async () => {
      throw new Error('dev not running')
    },
    execute: async argv => {
      commands.push(argv)
      return 'List of devices attached\nphone\tdevice\n'
    },
  })
  await expect(run()).rejects.toThrow('dev not running')
  expect(commands).toEqual([['adb', 'devices']])
})

test('cancelling native compilation stops deployment and restores generated config', async () => {
  const cwd = await workspace()
  const configPath = join(cwd, 'android/app/src/main/assets/capacitor.config.json')
  const controller = new AbortController()
  const commands: string[][] = []
  const run = createAndroidDevRunner({
    cwd,
    signal: controller.signal,
    checkReady: async () => {},
    execute: async (argv, options) => {
      commands.push(argv)
      if (argv[1] === 'devices') return 'List of devices attached\nphone\tdevice\n'
      if (argv[0] === './gradlew') {
        expect(options?.signal).toBe(controller.signal)
        controller.abort(new Error('Preview cancelled'))
        options?.signal?.throwIfAborted()
      }
      return ''
    },
  })
  await expect(run()).rejects.toThrow('Preview cancelled')
  expect(commands.at(-1)).toEqual(['./gradlew', 'assembleDebug'])
  expect(await readFile(configPath, 'utf8')).toBe('{"appId":"com.familyfinance.owl"}\n')
})
