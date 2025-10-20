/**
 * Error Boundary 组件
 * 捕获 React 组件树中的错误，防止整个应用崩溃
 * @module components/common/ErrorBoundary
 */

import { Component, ErrorInfo, ReactNode } from 'react'
import { createLogger } from '../../utils/logger'
import styles from './ErrorBoundary.module.less'

const logger = createLogger('ErrorBoundary')

export interface ErrorBoundaryProps {
  /** 子组件 */
  children: ReactNode
  /** 发生错误时的回退 UI */
  fallback?: ReactNode
  /** 错误回调 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export interface ErrorBoundaryState {
  /** 是否有错误 */
  hasError: boolean
  /** 错误对象 */
  error: Error | null
  /** 错误信息 */
  errorInfo: ErrorInfo | null
}

/**
 * ErrorBoundary 组件
 * 用于捕获 React 组件树中的 JavaScript 错误
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  /**
   * 当组件抛出错误时调用
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  /**
   * 组件捕获错误后调用
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('Component error caught', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })

    this.setState({
      error,
      errorInfo
    })

    // 调用错误回调
    this.props.onError?.(error, errorInfo)
  }

  /**
   * 重置错误状态
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      // 如果提供了自定义回退 UI，使用它
      if (fallback) {
        return fallback
      }

      // 默认错误 UI
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>出错了</h2>
            <p className={styles.errorMessage}>
              抱歉，编辑器遇到了一个问题。您可以尝试刷新页面或联系支持团队。
            </p>

            {error && (
              <details className={styles.errorDetails}>
                <summary>错误详情</summary>
                <div className={styles.errorDetailContent}>
                  <p><strong>错误消息：</strong></p>
                  <pre>{error.message}</pre>

                  {error.stack && (
                    <>
                      <p><strong>错误堆栈：</strong></p>
                      <pre>{error.stack}</pre>
                    </>
                  )}

                  {errorInfo?.componentStack && (
                    <>
                      <p><strong>组件堆栈：</strong></p>
                      <pre>{errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className={styles.errorActions}>
              <button
                className={styles.resetButton}
                onClick={this.handleReset}
              >
                重试
              </button>
              <button
                className={styles.reloadButton}
                onClick={() => window.location.reload()}
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      )
    }

    return children
  }
}
