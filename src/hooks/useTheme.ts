import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

type Theme = 'light' | 'dark'

function systemTheme(): Theme {
  // Si la página está embebida y el anfitrión ya fijó un tema, lo respetamos
  const forced = typeof document !== 'undefined' ? document.documentElement.dataset.theme : undefined
  if (forced === 'dark' || forced === 'light') return forced
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Tema claro/oscuro: respeta el sistema la primera vez y recuerda la elección */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('fd:theme', systemTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggle }
}
