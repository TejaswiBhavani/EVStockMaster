/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('theme')
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
          return saved
        }
      }
    } catch {
      // ignore storage access errors and fall back
    }
    return 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState('light')

  useEffect(() => {
    const supportsMatchMedia =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'

    const updateResolvedTheme = () => {
      let newResolvedTheme = theme

      if (theme === 'system') {
        const prefersDark =
          supportsMatchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        newResolvedTheme = prefersDark ? 'dark' : 'light'
      }

      setResolvedTheme(newResolvedTheme)

      // Apply theme to document if available
      if (typeof document !== 'undefined') {
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(newResolvedTheme)
        root.setAttribute('data-theme', newResolvedTheme)
      }
    }

    updateResolvedTheme()

    if (supportsMatchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        if (theme === 'system') {
          updateResolvedTheme()
        }
      }

      mediaQuery.addEventListener?.('change', handleChange)
      return () => mediaQuery.removeEventListener?.('change', handleChange)
    }

    // No cleanup when matchMedia isn't supported
    return undefined
  }, [theme])

  const changeTheme = (newTheme) => {
    if (['light', 'dark', 'system'].includes(newTheme)) {
      setTheme(newTheme)
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('theme', newTheme)
        }
      } catch {
        // ignore storage access errors
      }
    }
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
    changeTheme(newTheme)
  }

  const value = {
    theme,
    resolvedTheme,
    changeTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
