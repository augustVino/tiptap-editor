/**
 * 统一日志工具
 * 根据环境配置控制日志输出，生产环境自动关闭 debug 日志
 * @module utils/logger
 */

import { env } from '../config/env'

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

/**
 * 日志颜色配置
 */
const LOG_COLORS = {
  [LogLevel.DEBUG]: '#6c757d',
  [LogLevel.INFO]: '#0d6efd',
  [LogLevel.WARN]: '#ffc107',
  [LogLevel.ERROR]: '#dc3545'
} as const

/**
 * 格式化日志消息
 */
function formatMessage(level: LogLevel, module: string, message: string): string {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0]
  return `[${timestamp}] [${level}] [${module}] ${message}`
}

/**
 * 输出带样式的日志
 */
function logWithStyle(level: LogLevel, module: string, message: string, ...args: unknown[]): void {
  const formattedMessage = formatMessage(level, module, message)
  const color = LOG_COLORS[level]

  console.log(
    `%c${formattedMessage}`,
    `color: ${color}; font-weight: bold`,
    ...args
  )
}

/**
 * Logger 类
 */
class Logger {
  private module: string

  constructor(module: string) {
    this.module = module
  }

  /**
   * 调试日志（仅开发环境）
   */
  debug(message: string, ...args: unknown[]): void {
    if (env.enableDebugLogs) {
      logWithStyle(LogLevel.DEBUG, this.module, message, ...args)
    }
  }

  /**
   * 信息日志（仅开发环境）
   */
  info(message: string, ...args: unknown[]): void {
    if (env.enableDebugLogs) {
      logWithStyle(LogLevel.INFO, this.module, message, ...args)
    }
  }

  /**
   * 警告日志（所有环境）
   */
  warn(message: string, ...args: unknown[]): void {
    logWithStyle(LogLevel.WARN, this.module, message, ...args)
  }

  /**
   * 错误日志（所有环境）
   */
  error(message: string, ...args: unknown[]): void {
    logWithStyle(LogLevel.ERROR, this.module, message, ...args)
  }

  /**
   * 分组日志开始
   */
  group(label: string): void {
    if (env.enableDebugLogs) {
      console.group(`[${this.module}] ${label}`)
    }
  }

  /**
   * 分组日志结束
   */
  groupEnd(): void {
    if (env.enableDebugLogs) {
      console.groupEnd()
    }
  }

  /**
   * 性能计时开始
   */
  time(label: string): void {
    if (env.enableDebugLogs) {
      console.time(`[${this.module}] ${label}`)
    }
  }

  /**
   * 性能计时结束
   */
  timeEnd(label: string): void {
    if (env.enableDebugLogs) {
      console.timeEnd(`[${this.module}] ${label}`)
    }
  }
}

/**
 * 创建模块专属的 Logger 实例
 *
 * @param module - 模块名称
 * @returns Logger 实例
 *
 * @example
 * const logger = createLogger('YjsProvider')
 * logger.debug('Initializing provider', { url: 'ws://localhost:1234' })
 * logger.info('Connection established')
 * logger.warn('Connection unstable')
 * logger.error('Connection failed', error)
 */
export function createLogger(module: string): Logger {
  return new Logger(module)
}

/**
 * 默认全局 Logger
 */
export const logger = createLogger('App')
