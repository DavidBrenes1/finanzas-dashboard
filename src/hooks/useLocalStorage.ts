import { useEffect, useState } from 'react'

/**
 * Igual que useState, pero guarda el valor en localStorage
 * para que los datos sobrevivan al recargar la página.
 */
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved !== null) return JSON.parse(saved) as T
    } catch {
      // localStorage puede no estar disponible (modo privado, etc.)
    }
    return initialValue instanceof Function ? initialValue() : initialValue
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Si no se puede guardar, la app sigue funcionando en memoria
    }
  }, [key, value])

  return [value, setValue] as const
}
