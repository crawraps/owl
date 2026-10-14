import type { Theme } from '../model/properties'

/**
 * Material Design 3 baseline (light) theme. Used for every token a consumer theme does not define.
 */
export const fallbackTheme: Theme = {
  palette: {
    primary: '#6750A4',
    'on-primary': '#FFFFFF',
    'primary-container': '#EADDFF',
    'on-primary-container': '#21005D',
    'primary-fixed': '#EADDFF',
    'primary-fixed-dim': '#D0BCFF',
    'on-primary-fixed': '#21005D',
    'on-primary-fixed-variant': '#4F378B',
    secondary: '#625B71',
    'on-secondary': '#FFFFFF',
    'secondary-container': '#E8DEF8',
    'on-secondary-container': '#1D192B',
    'secondary-fixed': '#E8DEF8',
    'secondary-fixed-dim': '#CCC2DC',
    'on-secondary-fixed': '#1D192B',
    'on-secondary-fixed-variant': '#4A4458',
    tertiary: '#7D5260',
    'on-tertiary': '#FFFFFF',
    'tertiary-container': '#FFD8E4',
    'on-tertiary-container': '#31111D',
    'tertiary-fixed': '#FFD8E4',
    'tertiary-fixed-dim': '#EFB8C8',
    'on-tertiary-fixed': '#31111D',
    'on-tertiary-fixed-variant': '#633B48',
    error: '#B3261E',
    'on-error': '#FFFFFF',
    'error-container': '#F9DEDC',
    'on-error-container': '#410E0B',
    background: '#FEF7FF',
    'on-background': '#1D1B20',
    surface: '#FEF7FF',
    'on-surface': '#1D1B20',
    'surface-variant': '#E7E0EC',
    'on-surface-variant': '#49454F',
    'surface-dim': '#DED8E1',
    'surface-bright': '#FEF7FF',
    'surface-container-lowest': '#FFFFFF',
    'surface-container-low': '#F7F2FA',
    'surface-container': '#F3EDF7',
    'surface-container-high': '#ECE6F0',
    'surface-container-highest': '#E6E0E9',
    'surface-tint': '#6750A4',
    outline: '#79747E',
    'outline-variant': '#CAC4D0',
    shadow: '#000000',
    scrim: '#000000',
    'inverse-surface': '#322F35',
    'inverse-on-surface': '#F5EFF7',
    'inverse-primary': '#D0BCFF',
  },
  shape: {
    none: 0,
    'extra-small': 0.25,
    small: 0.5,
    medium: 0.75,
    large: 1,
    'extra-large': 1.75,
    full: 999,
  },
  typeface: {
    brandFamily: 'Roboto, system-ui, sans-serif',
    plainFamily: 'Roboto, system-ui, sans-serif',
    monospaceFamily: "'Roboto Mono', ui-monospace, monospace",
    typeScale: {
      display: {
        large: { size: 3.5625, lineHeight: 1.123, weight: 400 },
        medium: { size: 2.8125, lineHeight: 1.156, weight: 400 },
        small: { size: 2.25, lineHeight: 1.222, weight: 400 },
      },
      headline: {
        large: { size: 2, lineHeight: 1.25, weight: 400 },
        medium: { size: 1.75, lineHeight: 1.286, weight: 400 },
        small: { size: 1.5, lineHeight: 1.333, weight: 400 },
      },
      title: {
        large: { size: 1.375, lineHeight: 1.273, weight: 400 },
        medium: { size: 1, lineHeight: 1.5, weight: 500 },
        small: { size: 0.875, lineHeight: 1.429, weight: 500 },
      },
      body: {
        large: { size: 1, lineHeight: 1.5, weight: 400 },
        medium: { size: 0.875, lineHeight: 1.429, weight: 400 },
        small: { size: 0.75, lineHeight: 1.333, weight: 400 },
      },
      label: {
        large: { size: 0.875, lineHeight: 1.429, weight: 500 },
        medium: { size: 0.75, lineHeight: 1.333, weight: 500 },
        small: { size: 0.6875, lineHeight: 1.455, weight: 500 },
      },
    },
  },
  motion: {
    expressive: {
      fast: {
        effects: { duration: 150, curve: 'cubic-bezier(0.31, 0.94, 0.34, 1)', bounce: 0 },
        spatial: { duration: 350, curve: 'cubic-bezier(0.42, 1.67, 0.21, 0.9)', bounce: 0.4 },
      },
      default: {
        effects: { duration: 200, curve: 'cubic-bezier(0.34, 0.8, 0.34, 1)', bounce: 0 },
        spatial: { duration: 500, curve: 'cubic-bezier(0.38, 1.21, 0.22, 1)', bounce: 0.2 },
      },
      slow: {
        effects: { duration: 300, curve: 'cubic-bezier(0.34, 0.88, 0.34, 1)', bounce: 0 },
        spatial: { duration: 650, curve: 'cubic-bezier(0.39, 1.29, 0.35, 0.98)', bounce: 0.2 },
      },
    },
    standart: {
      fast: {
        effects: { duration: 150, curve: 'cubic-bezier(0.31, 0.94, 0.34, 1)', bounce: 0 },
        spatial: { duration: 350, curve: 'cubic-bezier(0.27, 1.06, 0.18, 1)', bounce: 0.1 },
      },
      default: {
        effects: { duration: 200, curve: 'cubic-bezier(0.34, 0.8, 0.34, 1)', bounce: 0 },
        spatial: { duration: 500, curve: 'cubic-bezier(0.27, 1.06, 0.18, 1)', bounce: 0.1 },
      },
      slow: {
        effects: { duration: 300, curve: 'cubic-bezier(0.34, 0.88, 0.34, 1)', bounce: 0 },
        spatial: { duration: 750, curve: 'cubic-bezier(0.27, 1.06, 0.18, 1)', bounce: 0.1 },
      },
    },
  },
  surface: {
    type: 'plain',
    blur: 0,
    opacity: 1,
    grain: {
      density: 0,
      opacity: 0,
      light: { surfaceScale: 0, elevation: 0, specularity: 0 },
    },
  },
}
