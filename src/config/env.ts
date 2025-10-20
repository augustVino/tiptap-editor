/**
 * 环境变量配置
 * 统一管理所有环境变量，提供类型安全的访问接口
 * @module config/env
 */

/**
 * 获取字符串类型的环境变量
 */
function getEnvString(key: string, defaultValue: string): string {
  return import.meta.env[key] || defaultValue
}

/**
 * 获取布尔类型的环境变量
 */
function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key]
  if (value === undefined || value === '') return defaultValue
  return value === 'true'
}

/**
 * 获取数字类型的环境变量
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = import.meta.env[key]
  if (value === undefined || value === '') return defaultValue
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * 环境变量配置对象
 */
export const env = {
  /** 是否为开发环境 */
  isDev: import.meta.env.DEV,

  /** 是否为生产环境 */
  isProd: import.meta.env.PROD,

  /** WebSocket 服务器 URL */
  wsUrl: getEnvString('VITE_WS_URL', 'ws://localhost:1234'),

  /** 是否启用调试日志 */
  enableDebugLogs: getEnvBoolean('VITE_ENABLE_DEBUG_LOGS', true),

  /** 是否启用 IndexedDB */
  indexedDBEnabled: getEnvBoolean('VITE_INDEXEDDB_ENABLED', true),

  /** 编辑器默认占位符 */
  editorPlaceholder: getEnvString('VITE_EDITOR_PLACEHOLDER', '开始输入...'),

  /** WebSocket 重连超时时间（毫秒） */
  wsReconnectTimeout: getEnvNumber('VITE_WS_RECONNECT_TIMEOUT', 1000),

  /** WebSocket 最大重连次数 */
  wsMaxReconnectAttempts: getEnvNumber('VITE_WS_MAX_RECONNECT_ATTEMPTS', 10)
} as const

/**
 * 验证环境变量配置
 * 在应用启动时调用，确保关键配置存在
 */
export function validateEnv(): void {
  if (!env.wsUrl) {
    throw new Error('VITE_WS_URL is required')
  }

  console.log('[ENV] Environment configuration loaded:', {
    mode: env.isDev ? 'development' : 'production',
    wsUrl: env.wsUrl,
    debugLogs: env.enableDebugLogs,
    indexedDB: env.indexedDBEnabled
  })
}
