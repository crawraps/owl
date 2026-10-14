import { readFile, rm, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import capacitorConfig from '../apps/mobile/capacitor.config.json'

export interface CommandOptions {
  cwd: string
  env?: Record<string, string>
  signal?: AbortSignal
}

type Execute = (argv: string[], options?: CommandOptions) => Promise<string>

interface PreviewOptions {
  execute: Execute
  cwd?: string
  checkReady?: (cwd: string) => Promise<void>
  signal?: AbortSignal
}

const mobileDirectory = fileURLToPath(new URL('../apps/mobile/', import.meta.url))
const devServerUrl = 'http://localhost:3000'

export async function checkPreviewReady(cwd: string, url = 'http://127.0.0.1:3000'): Promise<void> {
  const indexPath = join(cwd, 'dist/index.html')
  const index = await stat(indexPath).catch(() => undefined)
  if (!index?.isFile()) {
    throw new Error('Missing dist/index.html. Start `bun run dev --filter=mobile` and wait for compilation before preview.')
  }
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
  } catch (error) {
    throw new Error('Dev server unavailable. Start `bun run dev --filter=mobile` on port 3000 before preview.', { cause: error })
  }
}

export function createAndroidDevRunner({ execute, cwd = mobileDirectory, checkReady = checkPreviewReady, signal }: PreviewOptions): () => Promise<void> {
  async function command(argv: string[], options?: CommandOptions) {
    signal?.throwIfAborted()
    const result = await execute(argv, { cwd, ...options, signal })
    signal?.throwIfAborted()
    return result
  }
  return async () => {
    const output = await command(['adb', 'devices'])
    const devices = output.split(/\r?\n/).flatMap(line => {
      const match = /^(\S+)\s+(device|offline|unauthorized|recovery|sideload|bootloader)\b/.exec(line)
      return match ? [{ serial: match[1]!, state: match[2]! }] : []
    })
    if (devices.length === 0) {
      throw new Error('No Android device found. Connect your phone with ADB before running preview.')
    }
    if (devices.length !== 1) {
      throw new Error('Multiple Android devices found. Leave exactly one device connected before running preview.')
    }
    const device = devices[0]!
    if (device.state !== 'device') {
      throw new Error(`Android device ${device.serial} is ${device.state}. Resolve the ADB connection before running preview.`)
    }
    await checkReady(cwd)

    const androidDirectory = join(cwd, 'android')
    const configPath = join(androidDirectory, 'app/src/main/assets/capacitor.config.json')
    const originalConfig = await readFile(configPath).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== 'ENOENT') throw error
      return undefined
    })
    await command(['adb', '-s', device.serial, 'reverse', 'tcp:3000', 'tcp:3000'])
    try {
      await command(['bun', 'run', 'cap:sync'])
      const nativeConfig = JSON.parse(await readFile(configPath, 'utf8'))
      nativeConfig.server = { ...nativeConfig.server, url: devServerUrl, cleartext: true }
      await writeFile(configPath, JSON.stringify(nativeConfig, null, 2))
      await command(['./gradlew', 'assembleDebug'], { cwd: androidDirectory })
      await command(['adb', '-s', device.serial, 'install', '-r', join(androidDirectory, 'app/build/outputs/apk/debug/app-debug.apk')])
      await command(['adb', '-s', device.serial, 'shell', 'monkey', '-p', capacitorConfig.appId!, '-c', 'android.intent.category.LAUNCHER', '1'])
    } finally {
      // Only the installed preview APK keeps the development URL, never future production builds.
      if (originalConfig) await writeFile(configPath, originalConfig)
      else await rm(configPath, { force: true })
    }
  }
}

async function execute(argv: string[], options?: CommandOptions): Promise<string> {
  options?.signal?.throwIfAborted()
  const child = Bun.spawn(argv, {
    cwd: options?.cwd ?? mobileDirectory,
    env: { ...process.env, ...options?.env },
    stdout: 'pipe',
    stderr: 'inherit',
  })
  const abort = () => child.kill('SIGTERM')
  options?.signal?.addEventListener('abort', abort, { once: true })
  try {
    const output = await new Response(child.stdout).text()
    const status = await child.exited
    options?.signal?.throwIfAborted()
    if (status !== 0) throw new Error(`Command failed (${status}): ${argv.join(' ')}\n${output}`)
    return output
  } finally {
    options?.signal?.removeEventListener('abort', abort)
  }
}

if (import.meta.main) {
  const controller = new AbortController()
  const cancel = () => controller.abort(new Error('Preview cancelled'))
  process.on('SIGINT', cancel)
  process.on('SIGTERM', cancel)
  try {
    await createAndroidDevRunner({ execute, signal: controller.signal })()
    console.log('Android preview launched. Keep `bun run dev --filter=mobile` running for hot reload.')
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  } finally {
    process.off('SIGINT', cancel)
    process.off('SIGTERM', cancel)
  }
}
