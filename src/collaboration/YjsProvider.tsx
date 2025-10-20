/**
 * YjsProvider - React component for Yjs collaboration
 * Manages Yjs document, WebSocket provider, and IndexedDB persistence
 * @module collaboration/YjsProvider
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'
import { createLogger } from '../utils/logger'
import type { YjsProviderProps, YjsContextValue } from './types'

const logger = createLogger('YjsProvider')

/**
 * Yjs Context
 */
const YjsContext = createContext<YjsContextValue | null>(null)

/**
 * YjsProvider Component
 * Initializes Yjs document and providers, provides context to children
 *
 * @param props - Provider props
 */
export function YjsProvider(props: YjsProviderProps): React.ReactElement {
  const { documentId, webSocket, indexedDB, children } = props

  // Create Yjs document (stable reference)
  const ydoc = useMemo(() => new Y.Doc(), [])

  // State for providers
  const [wsProvider, setWsProvider] = useState<WebsocketProvider | null>(null)
  const [indexedDBProvider, setIndexedDBProvider] = useState<IndexeddbPersistence | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isSynced, setIsSynced] = useState(false)

  // Initialize WebSocket provider
  useEffect(() => {
    if (!webSocket) return

    logger.info('Initializing WebSocket provider', {
      url: webSocket.url,
      roomName: webSocket.roomName || documentId,
      enableAwareness: webSocket.enableAwareness !== false
    })

    // 让 WebsocketProvider 创建自己的 awareness 实例
    // 这样 provider.doc 和 provider.awareness 都会正确设置
    const provider = new WebsocketProvider(
      webSocket.url,
      webSocket.roomName || documentId,
      ydoc,
      {
        connect: true
      }
    )

    provider.on('status', ({ status }: { status: string }) => {
      setIsConnected(status === 'connected')
      logger.info('WebSocket status changed', { status })
    })

    provider.on('sync', (isSynced: boolean) => {
      setIsSynced(isSynced)
      logger.info('Sync status changed', { isSynced })
    })

    // 监听 WebSocket 连接错误
    provider.on('connection-error', (event) => {
      logger.error('WebSocket connection error', event)
    })

    // 监听 WebSocket 关闭
    provider.on('connection-close', (event) => {
      logger.warn('WebSocket connection closed', event)
    })

    // 添加调试信息
    logger.debug('WebSocket provider created', {
      hasDoc: !!provider.doc,
      hasAwareness: !!provider.awareness
    })

    setWsProvider(provider)

    return () => {
      provider.destroy()
      setWsProvider(null)
    }
  }, [webSocket, documentId, ydoc])

  // Initialize IndexedDB provider
  useEffect(() => {
    if (!indexedDB || indexedDB.enabled === false) return

    const provider = new IndexeddbPersistence(
      indexedDB.dbName || `yjs-${documentId}`,
      ydoc
    )

    provider.on('synced', () => {
      logger.info('IndexedDB synced')
    })

    setIndexedDBProvider(provider)

    return () => {
      provider.destroy()
      setIndexedDBProvider(null)
    }
  }, [indexedDB, documentId, ydoc])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ydoc.destroy()
    }
  }, [ydoc])

  // Context value
  const contextValue: YjsContextValue = useMemo(() => ({
    ydoc,
    wsProvider,
    indexedDBProvider,
    awareness: wsProvider?.awareness || null,  // 使用 provider 的 awareness
    isConnected,
    isSynced
  }), [ydoc, wsProvider, indexedDBProvider, isConnected, isSynced])

  return (
    <YjsContext.Provider value={contextValue}>
      {children}
    </YjsContext.Provider>
  )
}

/**
 * useYjsContext Hook
 * Get Yjs context
 *
 * @returns Yjs context value
 * @throws If used outside YjsProvider
 */
export function useYjsContext(): YjsContextValue {
  const context = useContext(YjsContext)

  if (!context) {
    throw new Error('useYjsContext must be used within YjsProvider')
  }

  return context
}
