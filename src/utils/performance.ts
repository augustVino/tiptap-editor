/**
 * 性能监控工具
 * @module utils/performance
 */

import { createLogger } from './logger'
import { PERFORMANCE } from '../config/constants'

const logger = createLogger('Performance')

/**
 * 性能指标类型
 */
export interface PerformanceMetric {
  /** 指标名称 */
  name: string
  /** 耗时（毫秒） */
  duration: number
  /** 时间戳 */
  timestamp: number
}

/**
 * 性能监控器类
 * 用于跟踪编辑器关键操作的性能指标
 */
class PerformanceMonitor {
  private metrics: Map<string, number> = new Map()
  private readonly enabled: boolean

  constructor(enabled = PERFORMANCE.ENABLE_MONITORING) {
    this.enabled = enabled && typeof performance !== 'undefined'
  }

  /**
   * 开始记录性能指标
   * @param name - 指标名称
   */
  start(name: string): void {
    if (!this.enabled) return
    this.metrics.set(name, performance.now())
  }

  /**
   * 结束记录并返回性能指标
   * @param name - 指标名称
   * @returns 性能指标对象，如果指标不存在则返回 null
   */
  end(name: string): PerformanceMetric | null {
    if (!this.enabled) return null

    const startTime = this.metrics.get(name)
    if (startTime === undefined) {
      logger.warn(`Performance metric "${name}" was not started`)
      return null
    }

    const duration = performance.now() - startTime
    this.metrics.delete(name)

    return {
      name,
      duration,
      timestamp: Date.now()
    }
  }

  /**
   * 记录并打印性能指标
   * @param name - 指标名称
   * @param callback - 可选的回调函数，接收性能指标
   */
  log(name: string, callback?: (metric: PerformanceMetric) => void): void {
    const metric = this.end(name)
    if (metric) {
      const message = `${metric.name}: ${metric.duration.toFixed(2)}ms`

      // 根据阈值决定日志级别
      if (metric.duration > PERFORMANCE.SLOW_OPERATION_THRESHOLD) {
        logger.warn(message, metric)
      } else {
        logger.debug(message, metric)
      }

      callback?.(metric)
    }
  }

  /**
   * 清除所有未完成的性能记录
   */
  clear(): void {
    this.metrics.clear()
  }
}

// 全局性能监控实例
const monitor = new PerformanceMonitor()

/**
 * 获取性能监控实例
 * @returns 性能监控器实例
 */
export function getPerformanceMonitor(): PerformanceMonitor {
  return monitor
}

/**
 * 测量异步函数的执行时间
 * @param name - 指标名称
 * @param fn - 待测量的异步函数
 * @returns 函数执行结果
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  monitor.start(name)
  try {
    return await fn()
  } finally {
    monitor.log(name)
  }
}

/**
 * 测量同步函数的执行时间
 * @param name - 指标名称
 * @param fn - 待测量的同步函数
 * @returns 函数执行结果
 */
export function measureSync<T>(name: string, fn: () => T): T {
  monitor.start(name)
  try {
    return fn()
  } finally {
    monitor.log(name)
  }
}

/**
 * 性能阈值检查
 */
export const PERFORMANCE_THRESHOLDS = {
  /** 编辑器初始化时间阈值（毫秒） */
  INITIALIZATION: 200,
  /** 按键响应时间阈值（毫秒） */
  KEYSTROKE: 16,
  /** 格式应用时间阈值（毫秒） */
  FORMAT_APPLY: 100,
  /** 协作同步时间阈值（毫秒） */
  COLLABORATION_SYNC: 1000
} as const

/**
 * 检查性能指标是否超过阈值
 * @param metric - 性能指标
 * @param threshold - 阈值（毫秒）
 * @returns 是否超过阈值
 */
export function exceedsThreshold(
  metric: PerformanceMetric,
  threshold: number
): boolean {
  return metric.duration > threshold
}
