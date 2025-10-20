/**
 * 编辑器默认配置
 * @module editor/EditorConfig
 */

import type { EditorConfig } from '../types'

/**
 * 默认编辑器配置
 */
export const DEFAULT_EDITOR_CONFIG: Partial<EditorConfig> = {
  placeholder: '开始输入...',
  editable: true,
  extensions: [],
  performance: {
    enableCodeSplitting: false,
    syncDebounce: 100,
    historyDepth: 50
  }
}

/**
 * 验证文档 ID 格式
 * @param documentId - 文档 ID
 * @returns 是否为有效的文档 ID
 */
export function validateDocumentId(documentId: string): boolean {
  if (!documentId || typeof documentId !== 'string') {
    return false
  }

  // 允许任何非空字符串作为文档 ID
  // 如需严格验证 UUID，可使用 src/utils/documentId.ts 中的函数
  return documentId.trim().length > 0
}

/**
 * 合并编辑器配置
 * @param userConfig - 用户提供的配置
 * @returns 合并后的完整配置
 */
export function mergeEditorConfig(
  userConfig: Partial<EditorConfig>
): EditorConfig {
  if (!validateDocumentId(userConfig.documentId || '')) {
    throw new Error('Invalid documentId: documentId is required and must be a non-empty string')
  }

  return {
    ...DEFAULT_EDITOR_CONFIG,
    ...userConfig,
    documentId: userConfig.documentId!,
    extensions: userConfig.extensions || [],
    performance: {
      ...DEFAULT_EDITOR_CONFIG.performance,
      ...userConfig.performance
    },
    collaboration: userConfig.collaboration
      ? {
          ...userConfig.collaboration
        }
      : undefined
  }
}
