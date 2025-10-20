/**
 * CollaboratorAvatar Component
 * Displays a collaborator's avatar with color and initials
 * @module components/Sidebar/CollaboratorAvatar
 */

import React from 'react'
import styles from './CollaboratorAvatar.module.less'

export interface CollaboratorAvatarProps {
  name: string
  color: string
  size?: 'small' | 'medium' | 'large'
}

/**
 * Get initials from name (first 2 characters)
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function CollaboratorAvatar(props: CollaboratorAvatarProps): React.ReactElement {
  const { name, color, size = 'medium' } = props
  const initials = getInitials(name)

  return (
    <div
      className={`${styles.avatar} ${styles[size]}`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  )
}
