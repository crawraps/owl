import type { MotionStrength } from '@repo/ui'

export const strengths: readonly { value: MotionStrength; label: string }[] = [
  { value: 'full', label: 'Full' },
  { value: 'reduced', label: 'Reduced' },
  { value: 'none', label: 'None' },
]
