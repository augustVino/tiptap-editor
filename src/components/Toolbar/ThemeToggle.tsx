/**
 * Theme Toggle Component
 *
 * Provides a button to toggle between light and dark themes.
 */

import { useState } from 'react'
import { useTheme } from '../../theme/useTheme'
import { DarkModeIcon, LightModeIcon } from '../icons/EditorIcons'
import styles from './ThemeToggle.module.less'

/**
 * Theme Toggle Button
 *
 * Displays moon icon in light theme, sun icon in dark theme.
 * Positioned at the far right of the toolbar for easy access.
 * Includes debounce protection to prevent rapid clicking.
 */
export function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useTheme()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const isLight = theme === 'light'

  /**
   * Handle theme toggle with debounce
   * Prevents rapid clicking during theme transition
   */
  const handleToggle = (): void => {
    if (isTransitioning) {
      return // Ignore clicks during transition
    }

    setIsTransitioning(true)
    toggleTheme()

    // Re-enable after transition completes (300ms as per spec requirement)
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <button
      onClick={handleToggle}
      className={styles.themeToggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      disabled={isTransitioning}
      type="button"
    >
      {isLight ? <DarkModeIcon /> : <LightModeIcon />}
    </button>
  )
}
