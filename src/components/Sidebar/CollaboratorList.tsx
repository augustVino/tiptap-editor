/**
 * CollaboratorList Component
 * Displays list of online collaborators
 * @module components/Sidebar/CollaboratorList
 */

import React from 'react';
import { CollaboratorAvatar } from './CollaboratorAvatar';
import type { AwarenessUser } from '../../collaboration/types';
import styles from './CollaboratorList.module.less';

export interface CollaboratorListProps {
  /** List of online collaborators */
  collaborators: AwarenessUser[];
  /** Current user ID */
  currentUserId?: string;
}

export function CollaboratorList(props: CollaboratorListProps): React.ReactElement {
  const { collaborators, currentUserId } = props;

  if (collaborators.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>在线用户</h3>
        <div className={styles.emptyState}>暂无其他用户在线</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>在线用户 ({collaborators.length})</h3>
      <div className={styles.list}>
        {collaborators.map((collaborator) => {
          const isCurrentUser = collaborator.id === currentUserId;

          return (
            <div
              key={collaborator.id}
              className={`${styles.item} ${isCurrentUser ? styles.currentUser : ''}`}
            >
              <CollaboratorAvatar
                name={collaborator.name}
                color={collaborator.color}
                size="small"
              />
              <span className={styles.name}>
                {collaborator.name}
                {isCurrentUser && ' (你)'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
