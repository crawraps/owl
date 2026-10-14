import { createContext, useContext } from 'react'

export interface NestContextValue {
  prefix: string
}

export const NestContext = createContext<NestContextValue | undefined>(undefined)

export function useNestPrefix(): string {
  const ctx = useContext(NestContext)
  return ctx?.prefix ?? ''
}
