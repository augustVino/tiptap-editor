/**
 * Toolbar 工具栏组件
 * @module components/Toolbar/Toolbar
 */

import React from 'react'
import { FormattingTools } from './FormattingTools'
import { BlockTools } from './BlockTools'
import { ToolbarDivider } from './ToolbarDivider'
import styles from './Toolbar.module.less'

export interface ToolbarProps {
  /** 子组件 */
  children?: React.ReactNode
}

/**
 * 编辑器工具栏
 * 包含所有编辑工具的顶部栏
 */
export function Toolbar(props: ToolbarProps): React.ReactElement {
  const { children } = props

  return (
    <div className={styles.toolbar}>
      <FormattingTools />
      <BlockTools />
      {children && (
        <>
          <ToolbarDivider />
          {children}
        </>
      )}
    </div>
  )
}
