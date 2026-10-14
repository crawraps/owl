import { useLocalStorage, useMediaQuery } from 'usehooks-ts'
import { isMotionStrength, resolveMotionStrength } from '../lib/resolve-motion-strength'
import type { MotionStrength } from './properties'

const MOTION_STORAGE_KEY = 'muir-motion-strength'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function deserialize(value: string): MotionStrength | null {
  try {
    const parsed: unknown = JSON.parse(value)
    return isMotionStrength(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function useMotionStrength(fallback: MotionStrength = 'full') {
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY)
  const [selected, setSelected] = useLocalStorage<MotionStrength | null>(MOTION_STORAGE_KEY, null, { deserializer: deserialize })

  return { motionStrength: resolveMotionStrength(selected, fallback, prefersReducedMotion), setMotionStrength: setSelected }
}
