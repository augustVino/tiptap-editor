/**
 * TableBubbleMenu Component
 * 表格浮动操作菜单
 * @module components/Table/TableBubbleMenu
 */

import React, { useEffect, useState } from 'react'
import { BubbleMenu } from '@tiptap/react/menus'
import type { Editor } from '@tiptap/react'
import styles from './TableBubbleMenu.module.less'

export interface TableBubbleMenuProps {
  editor: Editor
}

export function TableBubbleMenu(props: TableBubbleMenuProps): React.ReactElement | null {
  const { editor } = props
  const [canMerge, setCanMerge] = useState(false)
  const [canSplit, setCanSplit] = useState(false)

  useEffect(() => {
    if (!editor) return

    // 更新按钮状态的函数
    const updateButtonStates = () => {
      setCanMerge(editor.can().mergeCells())
      setCanSplit(editor.can().splitCell())
    }

    // 初始化状态
    updateButtonStates()

    // 监听选择变化和事务
    editor.on('selectionUpdate', updateButtonStates)
    editor.on('transaction', updateButtonStates)

    return () => {
      editor.off('selectionUpdate', updateButtonStates)
      editor.off('transaction', updateButtonStates)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => {
        // 只在表格内显示
        return editor.isActive('table')
      }}
    >
      <div className={styles.tableBubbleMenu}>
        {/* 行操作 */}
        <div className={styles.menuGroup}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => editor.chain().focus().addRowBefore().run()}
            title="在上方插入行"
          >
            <span className={styles.icon}>⬆</span>
            <span className={styles.label}>行</span>
          </button>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => editor.chain().focus().addRowAfter().run()}
            title="在下方插入行"
          >
            <span className={styles.icon}>⬇</span>
            <span className={styles.label}>行</span>
          </button>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => editor.chain().focus().deleteRow().run()}
            title="删除行"
          >
            <span className={styles.icon}>🗑</span>
            <span className={styles.label}>行</span>
          </button>
        </div>

        <div className={styles.menuDivider} />

        {/* 列操作 */}
        <div className={styles.menuGroup}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            title="在左侧插入列"
          >
            <span className={styles.icon}>⬅</span>
            <span className={styles.label}>列</span>
          </button>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            title="在右侧插入列"
          >
            <span className={styles.icon}>➡</span>
            <span className={styles.label}>列</span>
          </button>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => editor.chain().focus().deleteColumn().run()}
            title="删除列"
          >
            <span className={styles.icon}>🗑</span>
            <span className={styles.label}>列</span>
          </button>
        </div>

        <div className={styles.menuDivider} />

        {/* 单元格操作 */}
        <div className={styles.menuGroup}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => editor.chain().focus().mergeCells().run()}
            disabled={!canMerge}
            title="合并单元格"
          >
            <span className={styles.label}>合并</span>
          </button>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => editor.chain().focus().splitCell().run()}
            disabled={!canSplit}
            title="拆分单元格"
          >
            <span className={styles.label}>拆分</span>
          </button>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            title="切换表头行"
          >
            <span className={styles.label}>表头</span>
          </button>
        </div>

        <div className={styles.menuDivider} />

        {/* 删除表格 */}
        <div className={styles.menuGroup}>
          <button
            type="button"
            className={`${styles.menuButton} ${styles.danger}`}
            onClick={() => editor.chain().focus().deleteTable().run()}
            title="删除表格"
          >
            <span className={styles.icon}>🗑</span>
            <span className={styles.label}>删除表格</span>
          </button>
        </div>
      </div>
    </BubbleMenu>
  )
}
