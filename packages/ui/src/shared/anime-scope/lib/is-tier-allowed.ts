import type { MotionStrength } from 'src/shared/theming'
import type { MotionTier } from '../model/properties'

export function isTierAllowed(tier: MotionTier, strength: MotionStrength): boolean {
  if (strength === 'full') return true
  if (strength === 'reduced') return tier === 'accessibility'
  return false
}
