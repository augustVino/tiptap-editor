/**
 * LocalStorage Utility Functions
 *
 * Provides type-safe localStorage operations with error handling
 * and fallback mechanisms for when localStorage is unavailable.
 */

import type { ThemeName } from '../theme/themeConfig'
import { isValidThemeName } from '../theme/themeConfig'
import { createLogger } from './logger'

const logger = createLogger('Storage')

const THEME_STORAGE_KEY = 'tiptap-editor-theme'

/**
 * Retrieves the stored theme preference from localStorage
 *
 * @returns Stored theme name, or null if not found or invalid
 */
export function getStoredTheme(): ThemeName | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)

    if (!stored) {
      return null
    }

    // Validate the stored value
    if (!isValidThemeName(stored)) {
      logger.warn('Invalid theme name in localStorage:', stored)
      return null
    }

    return stored
  } catch (error) {
    // localStorage might be unavailable (private browsing, browser settings)
    logger.error('Failed to read theme from localStorage:', error)
    return null
  }
}

/**
 * Stores the theme preference to localStorage
 *
 * @param theme - Theme name to store
 * @returns True if storage succeeded, false otherwise
 */
export function setStoredTheme(theme: ThemeName): boolean {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    return true
  } catch (error) {
    // localStorage might be unavailable or quota exceeded
    logger.error('Failed to save theme to localStorage:', error)
    return false
  }
}

/**
 * Validates if a string is a valid URL
 * Used by Link extension for URL input validation
 *
 * @param url - URL string to validate
 * @returns True if URL is valid with http/https protocol
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}
