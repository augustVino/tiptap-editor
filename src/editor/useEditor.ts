/**
 * useEditor Hook - 编辑器初始化和管理
 * @module editor/useEditor
 */

import React from 'react'
import { useEditor as useTiptapEditor } from '@tiptap/react'
import type { AnyExtension } from '@tiptap/core'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { History } from '@tiptap/extension-history'
import { Placeholder } from '@tiptap/extension-placeholder'
import type { UseEditorOptions, CollaborationConfig } from './types'
import { Bold, Italic, Underline, Strike, Heading, TextAlign } from '../extensions/formatting'
import { OrderedList, BulletList, ListItem, CodeBlock } from '../extensions/blocks'
import { Table, TableRow, TableCell, TableHeader } from '../extensions/tables'
import { createCollaborationExtension, createCollaborationCursorExtension } from '../extensions/collaboration'
import { getPerformanceMonitor } from '../utils/performance'
import { createLogger } from '../utils/logger'
import { CSS_CLASSES, EDITOR } from '../config/constants'

const logger = createLogger('useEditor')

// Re-export CollaborationConfig for other modules
export type { CollaborationConfig }

/**
 * 自定义 useEditor Hook
 * 初始化 TipTap 编辑器并配置扩展
 *
 * 内置键盘快捷键：
 * - Ctrl/Cmd+B: 加粗
 * - Ctrl/Cmd+I: 斜体
 * - Ctrl/Cmd+U: 下划线
 * - Ctrl/Cmd+Shift+X: 删除线
 * - Ctrl/Cmd+Alt+1/2/3: 标题 1/2/3
 * - Ctrl/Cmd+Z: 撤销
 * - Ctrl/Cmd+Shift+Z: 重做
 *
 * @param options - 编辑器选项
 * @returns TipTap 编辑器实例
 */
export function useEditor(options: UseEditorOptions) {
  const {
    documentId,
    initialContent,
    placeholder = '开始输入...',
    editable = true,
    onEditorReady,
    onChange,
    collaboration
  } = options

  const monitor = getPerformanceMonitor()

  // 构建扩展列表（使用 useMemo 确保稳定性）
  const extensions = React.useMemo(() => {
    const exts: AnyExtension[] = [
      // 基础扩展
      Document,
      Paragraph,
      Text,

      // 占位符
      Placeholder.configure({
        placeholder: placeholder || EDITOR.DEFAULT_PLACEHOLDER
      }),

      // 格式化扩展
      Bold,
      Italic,
      Underline,
      Strike,
      Heading,
      TextAlign,

      // 块级扩展
      OrderedList,
      BulletList,
      ListItem,
      CodeBlock,

      // 表格扩展
      Table.configure({
        resizable: true,  // 允许调整列宽
        HTMLAttributes: {
          class: CSS_CLASSES.TABLE
        }
      }),
      TableRow,
      TableHeader,
      TableCell
    ]

    // 如果启用协作，添加协作扩展
    if (collaboration && collaboration.ydoc && collaboration.wsProvider) {
      logger.debug('Adding collaboration extensions', {
        hasYdoc: !!collaboration.ydoc,
        hasWsProvider: !!collaboration.wsProvider,
        user: collaboration.user
      })

      exts.push(
        createCollaborationExtension({
          document: collaboration.ydoc
        }),
        // CollaborationCaret (TipTap 3.x) - 显示其他用户的光标位置
        createCollaborationCursorExtension({
          provider: collaboration.wsProvider,
          user: collaboration.user
        })
      )
    } else {
      logger.debug('Not adding collaboration extensions', {
        hasCollaboration: !!collaboration,
        hasYdoc: !!collaboration?.ydoc,
        hasWsProvider: !!collaboration?.wsProvider
      })
      // 非协作模式才启用历史记录（协作模式下由 Yjs 处理历史）
      exts.push(
        History.configure({
          depth: EDITOR.HISTORY_DEPTH
        })
      )
    }

    return exts
  }, [collaboration, placeholder])

  const editor = useTiptapEditor({
    extensions,

    content: initialContent || '',
    editable,

    // 编辑器创建时的回调
    onCreate({ editor: createdEditor }) {
      monitor.log('editor-initialization')
      logger.info('Editor created', {
        documentId,
        hasCollaboration: !!collaboration,
        extensionCount: extensions.length
      })

      if (onEditorReady) {
        onEditorReady(createdEditor)
      }
    },

    // 内容更新回调
    onUpdate({ editor: updatedEditor }) {
      logger.debug('Editor updated')

      if (onChange) {
        const html = updatedEditor.getHTML()
        onChange(html)
      }
    },

    // 编辑器启用时开始监控初始化时间
    editorProps: {
      attributes: {
        class: CSS_CLASSES.EDITOR,
        'data-document-id': documentId
      }
    }
  }, [extensions, documentId, initialContent, editable]) // 确保在关键属性变化时重新创建编辑器

  // 监控编辑器初始化性能
  if (editor && !editor.isDestroyed) {
    monitor.start('editor-initialization')
  }

  return editor
}
