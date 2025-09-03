import { useEffect, useState } from 'react'

function getPreferredTheme() {
  if (typeof localStorage !== 'undefined' && localStorage.theme) {
    return localStorage.theme
  }
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(getPreferredTheme())

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.theme = theme
    } catch {}
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (!('theme' in localStorage)) {
        setTheme(mq.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  return { theme, setTheme }
}
