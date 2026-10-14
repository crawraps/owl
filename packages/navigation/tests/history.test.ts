import { describe, expect, it } from '@rstest/core'
import { computeBack, createTabHistory, tabHistoryReducer } from '../src/model/history'

function applyBackAction(state: ReturnType<typeof createTabHistory>, result: NonNullable<ReturnType<typeof computeBack>>) {
  return tabHistoryReducer(state, { type: 'applyBack', result })
}

describe('tab history reducer - pushLocation', () => {
  it('initializes active tab', () => {
    const state = createTabHistory()
    const next = tabHistoryReducer(state, { type: 'init', tabId: '/docs', path: '/tabs/docs' })
    expect(next.activeTab).toBe('/docs')
    expect(next.tabStacks['/docs']).toEqual(['/tabs/docs'])
  })

  it('pushes new location onto active tab stack', () => {
    let state = createTabHistory()
    state = tabHistoryReducer(state, { type: 'init', tabId: '/docs', path: '/tabs/docs' })
    state = tabHistoryReducer(state, { type: 'pushLocation', tabId: '/docs', path: '/tabs/docs/components/button' })
    expect(state.tabStacks['/docs']).toEqual(['/tabs/docs', '/tabs/docs/components/button'])
  })

  it('ignores duplicate top location', () => {
    let state = createTabHistory()
    state = tabHistoryReducer(state, { type: 'init', tabId: '/docs', path: '/tabs/docs' })
    state = tabHistoryReducer(state, { type: 'pushLocation', tabId: '/docs', path: '/tabs/docs' })
    expect(state.tabStacks['/docs']).toEqual(['/tabs/docs'])
  })
})

describe('tab history reducer - switchTab', () => {
  it('records previous tab in switch stack', () => {
    let state = createTabHistory()
    state = tabHistoryReducer(state, { type: 'init', tabId: '/docs', path: '/tabs/docs' })
    state = tabHistoryReducer(state, { type: 'switchTab', tabId: '/home', path: '/tabs/home' })
    expect(state.activeTab).toBe('/home')
    expect(state.switchStack).toEqual(['/docs'])
    expect(state.tabStacks['/home']).toEqual(['/tabs/home'])
  })
})

describe('applyBack action', () => {
  function buildScenario() {
    let state = createTabHistory()
    state = tabHistoryReducer(state, { type: 'init', tabId: '/docs', path: '/tabs/docs' })
    state = tabHistoryReducer(state, { type: 'pushLocation', tabId: '/docs', path: '/tabs/docs/components/button' })
    state = tabHistoryReducer(state, { type: 'switchTab', tabId: '/home', path: '/tabs/home' })
    state = tabHistoryReducer(state, { type: 'switchTab', tabId: '/docs', path: '/tabs/docs/components/button' })
    return state
  }

  it('starts on docs tab with restored deep route', () => {
    const state = buildScenario()
    expect(state.activeTab).toBe('/docs')
    expect(state.tabStacks['/docs']).toEqual(['/tabs/docs', '/tabs/docs/components/button'])
    expect(state.switchStack).toEqual(['/docs', '/home'])
  })

  it('first back pops docs stack to root', () => {
    let state = buildScenario()
    const result = computeBack(state)
    expect(result).not.toBeNull()
    expect(result?.tabId).toBe('/docs')
    expect(result?.path).toBe('/tabs/docs')
    expect(result?.switchedTab).toBe(false)
    state = applyBackAction(state, result!)
    expect(state.tabStacks['/docs']).toEqual(['/tabs/docs'])
  })

  it('second back switches to home tab', () => {
    let state = buildScenario()
    state = applyBackAction(state, computeBack(state)!)
    const result = computeBack(state)
    expect(result).not.toBeNull()
    expect(result?.tabId).toBe('/home')
    expect(result?.path).toBe('/tabs/home')
    expect(result?.switchedTab).toBe(true)
    state = applyBackAction(state, result!)
    expect(state.activeTab).toBe('/home')
  })

  it('third back returns to docs root', () => {
    let state = buildScenario()
    state = applyBackAction(state, computeBack(state)!)
    state = applyBackAction(state, computeBack(state)!)
    const result = computeBack(state)
    expect(result).not.toBeNull()
    expect(result?.tabId).toBe('/docs')
    expect(result?.path).toBe('/tabs/docs')
    expect(result?.switchedTab).toBe(true)
  })

  it('full back sequence matches required behavior', () => {
    let state = buildScenario()
    const sequence: string[] = []

    const r1 = computeBack(state)
    sequence.push(r1!.path)
    state = applyBackAction(state, r1!)

    const r2 = computeBack(state)
    sequence.push(r2!.path)
    state = applyBackAction(state, r2!)

    const r3 = computeBack(state)
    sequence.push(r3!.path)
    state = applyBackAction(state, r3!)

    expect(sequence).toEqual(['/tabs/docs', '/tabs/home', '/tabs/docs'])
  })

  it('returns null when nothing to go back to', () => {
    let state = createTabHistory()
    state = tabHistoryReducer(state, { type: 'init', tabId: '/docs', path: '/tabs/docs' })
    expect(computeBack(state)).toBeNull()
  })
})

describe('stack depth cap', () => {
  it('caps tab stack at 50 entries', () => {
    let state = createTabHistory()
    state = tabHistoryReducer(state, { type: 'init', tabId: '/docs', path: '/docs' })
    for (let i = 0; i < 60; i++) {
      state = tabHistoryReducer(state, { type: 'pushLocation', tabId: '/docs', path: `/docs/page-${i}` })
    }
    expect(state.tabStacks['/docs'].length).toBe(50)
    expect(state.tabStacks['/docs'][0]).toBe('/docs/page-10')
  })

  it('caps switch stack at 50 entries', () => {
    let state = createTabHistory()
    state = tabHistoryReducer(state, { type: 'init', tabId: '/a', path: '/a' })
    for (let i = 0; i < 60; i++) {
      state = tabHistoryReducer(state, { type: 'switchTab', tabId: `/tab-${i}`, path: `/tab-${i}` })
    }
    expect(state.switchStack.length).toBe(50)
  })
})
