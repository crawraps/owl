import type { Grain } from '../model/properties'

const PX_PER_REM = 16

/**
 * A transparent SVG noise tile with specks only, as a CSS `url()` value.
 * Alpha is `opacity × clamp((noise − 0.42) × 3.4)`.
 */
export function grainTexture(grain: Grain): string {
  const ink = grain.tone === 'light' ? 1 : 0
  const size = grain.tileSize * PX_PER_REM
  const alpha = `${(3.4 * grain.opacity).toFixed(3)} 0 0 0 ${(-1.43 * grain.opacity).toFixed(3)}`
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
    '<filter id="g" x="0" y="0" width="100%" height="100%">' +
    `<feTurbulence type="fractalNoise" baseFrequency="${grain.frequency}" numOctaves="${grain.octaves}" stitchTiles="stitch"/>` +
    `<feColorMatrix type="matrix" values="0 0 0 0 ${ink} 0 0 0 0 ${ink} 0 0 0 0 ${ink} ${alpha}"/>` +
    '</filter><rect width="100%" height="100%" filter="url(#g)"/></svg>'

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
