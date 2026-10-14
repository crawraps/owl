export interface TabHistory {
  activeTab: string | null
  switchStack: string[]
  tabStacks: Record<string, string[]>
}

export type TabHistoryAction =
  | { type: 'init'; tabId: string; path: string }
  | { type: 'pushLocation'; tabId: string; path: string }
  | { type: 'switchTab'; tabId: string; path: string }
  | { type: 'applyBack'; result: BackResult }

export interface BackResult {
  tabId: string
  path: string
  switchedTab: boolean
}

const MAX_STACK_DEPTH = 50

export function createTabHistory(): TabHistory {
  return { activeTab: null, switchStack: [], tabStacks: {} }
}

function ensureStack(state: TabHistory, tabId: string): string[] {
  if (state.tabStacks[tabId]) return state.tabStacks[tabId]
  return []
}

export function tabHistoryReducer(state: TabHistory, action: TabHistoryAction): TabHistory {
  switch (action.type) {
    case 'init': {
      if (state.activeTab !== null) return state
      const stack = ensureStack(state, action.tabId)
      return {
        activeTab: action.tabId,
        switchStack: [],
        tabStacks: { ...state.tabStacks, [action.tabId]: stack.length ? stack : [action.path] },
      }
    }

    case 'pushLocation': {
      if (state.activeTab === null) return state
      const stack = ensureStack(state, action.tabId)
      const top = stack[stack.length - 1]
      if (top === action.path) return state
      const newStack = [...stack, action.path]
      if (newStack.length > MAX_STACK_DEPTH) {
        newStack.splice(0, newStack.length - MAX_STACK_DEPTH)
      }
      return {
        ...state,
        tabStacks: { ...state.tabStacks, [action.tabId]: newStack },
      }
    }

    case 'switchTab': {
      if (state.activeTab === action.tabId) return state
      const previousActive = state.activeTab
      const newSwitchStack = previousActive === null ? state.switchStack : [...state.switchStack, previousActive]
      if (newSwitchStack.length > MAX_STACK_DEPTH) {
        newSwitchStack.splice(0, newSwitchStack.length - MAX_STACK_DEPTH)
      }
      const targetStack = ensureStack(state, action.tabId)
      const updatedStack = targetStack.length === 0 ? [action.path] : targetStack
      return {
        activeTab: action.tabId,
        switchStack: newSwitchStack,
        tabStacks: { ...state.tabStacks, [action.tabId]: updatedStack },
      }
    }

    case 'applyBack': {
      const result = action.result
      const activeStack = ensureStack(state, state.activeTab as string)

      if (!result.switchedTab) {
        const newStack = activeStack.slice(0, -1)
        return { ...state, tabStacks: { ...state.tabStacks, [result.tabId]: newStack } }
      }

      const newSwitchStack = state.switchStack.slice(0, -1)
      const previousStack = ensureStack(state, result.tabId)
      const poppedPreviousStack = previousStack.length > 1 ? previousStack.slice(0, -1) : previousStack
      return {
        activeTab: result.tabId,
        switchStack: newSwitchStack,
        tabStacks: { ...state.tabStacks, [result.tabId]: poppedPreviousStack },
      }
    }

    default:
      return state
  }
}

export function computeBack(state: TabHistory): BackResult | null {
  if (state.activeTab === null) return null
  const activeStack = ensureStack(state, state.activeTab)

  if (activeStack.length > 1) {
    const newStack = activeStack.slice(0, -1)
    const newPath = newStack[newStack.length - 1]
    return { tabId: state.activeTab, path: newPath, switchedTab: false }
  }

  if (state.switchStack.length === 0) return null

  const previousTab = state.switchStack[state.switchStack.length - 1]
  const previousStack = ensureStack(state, previousTab)
  if (previousStack.length === 0) return null

  const poppedPreviousStack = previousStack.length > 1 ? previousStack.slice(0, -1) : previousStack
  const newPath = poppedPreviousStack[poppedPreviousStack.length - 1]
  return { tabId: previousTab, path: newPath, switchedTab: true }
}
