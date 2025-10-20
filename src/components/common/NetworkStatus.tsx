/**
 * NetworkStatus Component
 * Displays connection status (connected/offline/connecting)
 * @module components/common/NetworkStatus
 */

import React from 'react'
import { ConnectionStatus } from '../../types'
import styles from './NetworkStatus.module.less'

export interface NetworkStatusProps {
  /** Connection status */
  status: ConnectionStatus
  /** Show label text */
  showLabel?: boolean
}

/**
 * Get status display info
 */
function getStatusInfo(status: ConnectionStatus) {
  switch (status) {
    case ConnectionStatus.Connected:
      return {
        label: '已连接',
        icon: '●',
        className: styles.connected
      }
    case ConnectionStatus.Connecting:
      return {
        label: '连接中...',
        icon: '○',
        className: styles.connecting
      }
    case ConnectionStatus.Offline:
      return {
        label: '离线',
        icon: '●',
        className: styles.offline
      }
    case ConnectionStatus.Error:
      return {
        label: '连接错误',
        icon: '●',
        className: styles.error
      }
    default:
      return {
        label: '未知',
        icon: '○',
        className: ''
      }
  }
}

export function NetworkStatus(props: NetworkStatusProps): React.ReactElement {
  const { status, showLabel = true } = props
  const info = getStatusInfo(status)

  return (
    <div className={`${styles.container} ${info.className}`}>
      <span className={styles.icon}>{info.icon}</span>
      {showLabel && <span className={styles.label}>{info.label}</span>}
    </div>
  )
}
