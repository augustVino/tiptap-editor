/**
 * 文档 ID 生成工具
 * @module utils/documentId
 */

/**
 * 生成 UUID v4 格式的文档 ID
 * @returns 符合 UUID v4 格式的文档唯一标识符
 */
export function generateDocumentId(): string {
  // 使用 crypto.randomUUID() 生成标准 UUID v4
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback: 手动生成 UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 验证文档 ID 是否符合 UUID v4 格式
 * @param id - 待验证的文档 ID
 * @returns 是否为有效的 UUID v4 格式
 */
export function isValidDocumentId(id: string): boolean {
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidV4Regex.test(id)
}
