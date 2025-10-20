/**
 * Theme Configuration
 *
 * Defines color schemes for light and dark themes.
 * All colors are applied via CSS variables for efficient runtime switching.
 */

/**
 * Theme name enumeration
 */
export type ThemeName = 'light' | 'dark';

/**
 * Theme color configuration interface
 * Contains all UI element color definitions
 */
export interface ThemeColors {
  // Background colors
  /** Primary background color (editor, page background) */
  background: string;
  /** Secondary background color (toolbar, sidebar) */
  backgroundSecondary: string;
  /** Tertiary background color (hover state, dropdown menus) */
  backgroundTertiary: string;

  // Text colors
  /** Primary text color (body content) */
  text: string;
  /** Secondary text color (description text) */
  textSecondary: string;
  /** Muted text color (disabled state, placeholder) */
  textMuted: string;

  // Border colors
  /** Primary border color (dividers, button borders) */
  border: string;
  /** Light border color (hover state, table borders) */
  borderLight: string;

  // Interactive colors
  /** Primary interaction color (buttons, links) */
  primary: string;
  /** Primary interaction color hover state */
  primaryHover: string;
  /** Active button background color (toolbar active state) */
  activeButtonBg: string;
  /** Active button text color (toolbar active state) */
  activeButtonText: string;

  // Functional colors
  /** Success state color */
  success: string;
  /** Warning state color */
  warning: string;
  /** Error state color */
  error: string;

  // Editor-specific colors
  /** Highlight background color (Highlight extension) */
  highlight: string;
  /** Code block background color (Code extension) */
  codeBackground: string;
  /** Blockquote border color (Blockquote extension) */
  blockquoteBorder: string;
}

/**
 * Light theme color configuration
 * Based on TipTap official template design
 * Optimized for well-lit environments
 */
const lightTheme: ThemeColors = {
  background: 'rgb(255, 255, 255)',
  backgroundSecondary: 'rgb(250, 250, 250)',
  backgroundTertiary: 'rgb(244, 244, 245)',

  text: 'rgb(34, 35, 37)',
  textSecondary: 'rgba(64, 65, 69, 0.85)',
  textMuted: 'rgba(125, 127, 130, 0.75)',

  border: 'rgba(37, 39, 45, 0.1)',
  borderLight: 'rgba(15, 22, 36, 0.05)',

  primary: 'rgb(98, 41, 255)',
  primaryHover: 'rgb(98, 41, 255)',
  activeButtonBg: 'rgb(234, 234, 235)',
  activeButtonText: 'rgba(29, 30, 32, 0.98)',

  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',

  highlight: 'rgba(255, 245, 102, 0.5)',
  codeBackground: 'rgba(37, 39, 45, 0.05)',
  blockquoteBorder: 'rgba(37, 39, 45, 0.1)'
};

/**
 * Dark theme color configuration
 * Based on TipTap official template design
 * Optimized for low-light environments, reduces eye strain
 */
const darkTheme: ThemeColors = {
  background: 'rgb(14, 14, 17)',
  backgroundSecondary: 'rgb(25, 25, 26)',
  backgroundTertiary: 'rgb(32, 32, 34)',

  text: 'rgb(245, 245, 245)',
  textSecondary: 'rgba(247, 247, 253, 0.64)',
  textMuted: 'rgba(239, 239, 245, 0.22)',

  border: 'rgba(238, 238, 246, 0.11)',
  borderLight: 'rgba(232, 232, 253, 0.05)',

  primary: 'rgb(122, 82, 255)',
  primaryHover: 'rgb(98, 41, 255)',
  activeButtonBg: 'rgba(231, 231, 243, 0.07)',
  activeButtonText: 'rgba(255, 255, 255, 0.96)',

  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',

  highlight: '#6b6524',
  codeBackground: 'rgba(238, 238, 246, 0.11)',
  blockquoteBorder: 'rgba(238, 238, 246, 0.11)'
};

/**
 * Theme configuration collection
 * Contains all available themes
 */
export const themes: Record<ThemeName, ThemeColors> = {
  light: lightTheme,
  dark: darkTheme
};

/**
 * Type guard to validate theme name at runtime
 *
 * @param value - Value to validate
 * @returns True if value is a valid ThemeName
 */
export function isValidThemeName(value: unknown): value is ThemeName {
  return value === 'light' || value === 'dark';
}
