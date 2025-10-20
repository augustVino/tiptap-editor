/**
 * useTheme Hook
 *
 * Custom hook for accessing theme context in components.
 * Provides type-safe access to theme state and functions.
 */

import { useContext } from 'react'
import { ThemeContext, type ThemeContextValue } from './ThemeProvider'

/**
 * Custom hook to access theme context
 *
 * Must be used within a ThemeProvider component tree.
 *
 * @returns Theme context value with current theme and control functions
 * @throws Error if used outside ThemeProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleTheme, colors } = useTheme()
 *
 *   return (
 *     <button onClick={toggleTheme}>
 *       Current theme: {theme}
 *     </button>
 *   )
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
