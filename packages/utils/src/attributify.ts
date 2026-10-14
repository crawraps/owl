/**
 * Attributify (atr) - convert a primitive value to a valid jsx custom attribute value.
 *
 * @argument value - source value to convert
 *
 * @returns converted value
 */
export function attributify(value: string | number | boolean | null | undefined): string | undefined {
  if (typeof value === 'boolean') return value ? '' : undefined
  if (value === null || value === undefined) return undefined
  return value.toString()
}
export const atr = attributify
