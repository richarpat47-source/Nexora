import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'nexora:'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw == null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

/** useState persistido en localStorage. Falla en silencio si el storage no está disponible. */
export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => read(key, initial))

  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
      window.dispatchEvent(new CustomEvent('nexora-storage', { detail: key }))
    } catch {
      /* storage bloqueado: seguimos en memoria */
    }
  }, [key, value])

  // Sincroniza instancias del mismo key en distintos componentes.
  useEffect(() => {
    const onChange = (e: Event) => {
      if ((e as CustomEvent).detail !== key) return
      const next = read(key, initial)
      setValue((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    }
    window.addEventListener('nexora-storage', onChange)
    return () => window.removeEventListener('nexora-storage', onChange)
  }, [key])

  return [value, setValue] as const
}

export interface Profile {
  name: string
  income: number
  expenses: number
  savings: number
  debt: number
  goal: string
  goalAmount: number
  goalMonths: number
  fearLevel: number
}

export const defaultProfile: Profile = {
  name: '',
  income: 1500,
  expenses: 1100,
  savings: 800,
  debt: 2000,
  goal: 'Fondo de emergencia',
  goalAmount: 6000,
  goalMonths: 12,
  fearLevel: 3,
}

export function useProfile() {
  return usePersisted<Profile>('profile', defaultProfile)
}

/** Lecciones completadas: ids "moduloId/leccionId". */
export function useProgress() {
  const [done, setDone] = usePersisted<string[]>('progress', [])
  const toggle = useCallback(
    (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id])),
    [setDone],
  )
  const complete = useCallback((id: string) => setDone((d) => (d.includes(id) ? d : [...d, id])), [setDone])
  return { done, toggle, complete, reset: () => setDone([]) }
}
