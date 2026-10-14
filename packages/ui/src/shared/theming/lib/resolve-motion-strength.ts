import type { MotionStrength } from '../model/properties'

const ORDER: readonly MotionStrength[] = ['full', 'reduced', 'none']

export function isMotionStrength(value: unknown): value is MotionStrength {
  return ORDER.includes(value as MotionStrength)
}

/**
 * Picks the user's choice when there is one, otherwise the weaker of the default and the OS preference
 */
export function resolveMotionStrength(selected: MotionStrength | null, fallback: MotionStrength, prefersReducedMotion: boolean): MotionStrength {
  if (selected !== null) return selected
  if (prefersReducedMotion && ORDER.indexOf(fallback) < ORDER.indexOf('reduced')) return 'reduced'
  return fallback
}
