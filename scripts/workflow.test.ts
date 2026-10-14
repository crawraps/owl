import { expect, test } from 'bun:test'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { writeFile, rm, mkdir } from 'node:fs/promises'
import mobileConfig from '../apps/mobile/rsbuild.config'

const cwd = fileURLToPath(new URL('../', import.meta.url))

async function taskGraph(command: string, filter: string) {
  const child = Bun.spawn(['bun', 'run', command, `--filter=${filter}`, '--dry=json'], { cwd, stdout: 'pipe', stderr: 'pipe' })
  const [output, errors, status] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited])
  expect(status, errors).toBe(0)
  return JSON.parse(output) as { tasks: Array<{ taskId: string; dependencies: string[]; with: string[] }> }
}

test('filtered build includes prerequisite libraries but not unrelated consumers', async () => {
  const mobile = await taskGraph('build', 'mobile')
  expect(mobile.tasks.map(task => task.taskId).sort()).toEqual(['@repo/navigation#build', '@repo/ui#build', '@repo/utils#build', 'mobile#build'])
  const utils = await taskGraph('build', '@repo/utils')
  expect(utils.tasks.map(task => task.taskId)).toEqual(['@repo/utils#build'])
})

test('filtered mobile dev includes library watchers and initial dependency builds', async () => {
  const graph = await taskGraph('dev', 'mobile')
  expect(graph.tasks.map(task => task.taskId).sort()).toEqual([
    '@repo/navigation#build',
    '@repo/navigation#dev',
    '@repo/ui#build',
    '@repo/ui#dev',
    '@repo/utils#build',
    '@repo/utils#dev',
    'mobile#dev',
  ])
  expect(graph.tasks.find(task => task.taskId === 'mobile#dev')?.dependencies).toContain('@repo/ui#build')
  expect(graph.tasks.find(task => task.taskId === '@repo/ui#dev')?.dependencies).toContain('@repo/ui#build')
  expect(graph.tasks.find(task => task.taskId === '@repo/utils#dev')?.dependencies).toContain('@repo/utils#build')
})

test('a library watcher preserves existing output during startup', async () => {
  await mkdir(fileURLToPath(new URL('../packages/utils/dist/', import.meta.url)), { recursive: true })
  const marker = fileURLToPath(new URL(`../packages/utils/dist/watch-startup-${crypto.randomUUID()}.txt`, import.meta.url))
  await writeFile(marker, 'existing output')
  let output = ''
  const child = spawn('bun', ['run', 'dev'], { cwd: fileURLToPath(new URL('../packages/utils/', import.meta.url)), detached: true, stdio: ['ignore', 'pipe', 'pipe'] })
  child.stdout.on('data', data => {
    output += data
  })
  child.stderr.on('data', data => {
    output += data
  })
  const exited = new Promise<void>(done => child.on('exit', () => done()))
  try {
    const deadline = Date.now() + 10000
    while (!output.includes('ready') && Date.now() < deadline && child.exitCode === null) await Bun.sleep(50)
    expect(output).toContain('ready')
    expect(await Bun.file(marker).exists()).toBe(true)
  } finally {
    if (child.exitCode === null) process.kill(-child.pid!, 'SIGTERM')
    await exited
    await rm(marker, { force: true })
  }
}, 15000)

test('mobile dev emits disk assets with eager compilation and fixed loopback port', () => {
  expect(mobileConfig.dev).toMatchObject({ writeToDisk: true, lazyCompilation: false })
  expect(mobileConfig.server).toMatchObject({ host: '127.0.0.1', port: 3000, strictPort: true })
})

test('Capacitor loads the app configuration without a JavaScript TypeScript compiler API', async () => {
  const require = createRequire(new URL('../apps/mobile/package.json', import.meta.url))
  const cliConfig = fileURLToPath(new URL('./dist/config.js', `file://${require.resolve('@capacitor/cli/package.json')}`))
  const child = Bun.spawn(
    ['node', '-e', `require(${JSON.stringify(cliConfig)}).loadConfig().then(config => console.log(JSON.stringify({ appId: config.app.appId, webDir: config.app.webDir })))`],
    {
      cwd: fileURLToPath(new URL('../apps/mobile/', import.meta.url)),
      stdout: 'pipe',
      stderr: 'pipe',
    },
  )
  const [output, errors, status] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited])
  expect(status, errors || output).toBe(0)
  expect(JSON.parse(output)).toEqual({ appId: 'com.familyfinance.owl', webDir: 'dist' })
})
