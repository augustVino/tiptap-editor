/**
 * Ant Design Theme Bridge
 *
 * 桥接现有主题系统与 Ant Design 主题系统
 * 确保 antd 组件跟随应用主题自动切换
 *
 * @module theme/AntdThemeBridge
 */

import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import type { ReactNode } from 'react';
import { useTheme } from './useTheme';

export interface AntdThemeBridgeProps {
  children: ReactNode;
}

/**
 * Ant Design 主题桥接组件
 *
 * 功能：
 * 1. 根据当前主题自动切换 antd 的亮色/暗色算法
 * 2. 映射自定义主题颜色到 antd design tokens
 * 3. 提供中文国际化支持
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <AntdThemeBridge>
 *     <App />
 *   </AntdThemeBridge>
 * </ThemeProvider>
 * ```
 */
export function AntdThemeBridge({ children }: AntdThemeBridgeProps): JSX.Element {
  const { theme: currentTheme, colors } = useTheme();

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        // 使用 antd 内置的主题算法
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,

        // 映射自定义主题颜色
        token: {
          // 主色调 - 使用项目的紫色
          colorPrimary: colors.primary,

          // 功能色 - 与项目保持一致
          colorSuccess: colors.success,
          colorWarning: colors.warning,
          colorError: colors.error,

          // 背景色
          colorBgContainer: colors.background,
          colorBgElevated: colors.backgroundSecondary,
          colorBgLayout: colors.background,

          // 文本色
          colorText: colors.text,
          colorTextSecondary: colors.textSecondary,
          colorTextDisabled: colors.textMuted,

          // 边框色
          colorBorder: colors.border,
          colorBorderSecondary: colors.borderLight,

          // 圆角 - 与项目风格保持一致
          borderRadius: 4,

          // 字体
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        },

        // 组件级别的自定义
        components: {
          Tooltip: {
            // Tooltip 样式优化
            colorBgSpotlight:
              currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.75)',
            colorTextLightSolid: currentTheme === 'dark' ? 'rgba(0, 0, 0, 0.88)' : '#fff'
          },
          Dropdown: {
            // 下拉菜单样式
            controlItemBgHover: colors.backgroundTertiary,
            controlItemBgActive: colors.activeButtonBg
          },
          Button: {
            // 按钮样式
            colorPrimaryHover: colors.primaryHover
          }
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
}
