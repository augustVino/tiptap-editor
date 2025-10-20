/**
 * Theme Provider Component
 *
 * Provides theme state management via React Context.
 * Handles theme switching, localStorage persistence, and CSS variable updates.
 */

import { createContext, useState, useEffect, useMemo, type ReactNode } from 'react'
import type { ThemeName, ThemeColors } from './themeConfig'
import { themes } from './themeConfig'
import { getStoredTheme, setStoredTheme } from '../utils/storage'
import { createLogger } from '../utils/logger'

const logger = createLogger('ThemeProvider')

/**
 * Theme context value interface
 */
export interface ThemeContextValue {
  /** Current active theme name */
  theme: ThemeName
  /** Current theme colors */
  colors: ThemeColors
  /** Toggle between light and dark themes */
  toggleTheme: () => void
  /** Set a specific theme */
  setTheme: (theme: ThemeName) => void
}

/**
 * Theme context
 * Provides theme state and functions to all descendant components
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

/**
 * Theme Provider Props
 */
export interface ThemeProviderProps {
  /** Child components */
  children: ReactNode
  /** Default theme (used if no stored preference exists) */
  defaultTheme?: ThemeName
}

/**
 * Theme Provider Component
 *
 * Wraps the application to provide theme management functionality.
 * Automatically loads user's saved theme preference on mount.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <YourApp />
 *     </ThemeProvider>
 *   )
 * }
 * ```
 */
export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps): JSX.Element {
  // Initialize theme from localStorage or use default
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const stored = getStoredTheme()
    return stored || defaultTheme
  })

  // Get current theme colors (memoized for performance)
  const colors = useMemo(() => themes[theme], [theme])

  /**
   * Apply theme colors to CSS variables
   * This enables instant theme switching without React re-renders
   */
  useEffect(() => {
    const root = document.documentElement

    // Apply all theme colors as CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })

    logger.debug(`Theme applied: ${theme}`)
  }, [theme, colors])

  /**
   * Set a specific theme
   * Updates state and persists to localStorage
   */
  const setTheme = (newTheme: ThemeName): void => {
    setThemeState(newTheme)
    setStoredTheme(newTheme)
    logger.info(`Theme changed to: ${newTheme}`)
  }

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = (): void => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colors,
      toggleTheme,
      setTheme,
    }),
    [theme, colors]
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}
