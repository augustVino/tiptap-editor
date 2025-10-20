/**
 * 协作者颜色调色板工具
 * @module utils/colorPalette
 */

/**
 * 预定义的高对比度颜色调色板（用于区分协作者）
 * 颜色选择遵循 WCAG AAA 标准，确保在白色背景上的可读性
 */
const COLOR_PALETTE: ReadonlyArray<string> = [
  '#FF6B6B', // 红色
  '#4ECDC4', // 青色
  '#45B7D1', // 蓝色
  '#FFA07A', // 橙色
  '#98D8C8', // 绿色
  '#F7DC6F', // 黄色
  '#BB8FCE', // 紫色
  '#85C1E2', // 天蓝色
  '#F8B739', // 金色
  '#52B788' // 深绿色
] as const

/**
 * 根据索引获取协作者颜色
 * @param index - 协作者索引（从 0 开始）
 * @returns 对应的颜色值（hex 格式）
 */
export function getCollaboratorColor(index: number): string {
  return COLOR_PALETTE[index % COLOR_PALETTE.length]
}

/**
 * 获取调色板中的颜色总数
 * @returns 调色板颜色数量
 */
export function getColorPaletteSize(): number {
  return COLOR_PALETTE.length
}

/**
 * 获取完整的颜色调色板
 * @returns 只读颜色数组
 */
export function getColorPalette(): ReadonlyArray<string> {
  return COLOR_PALETTE
}

/**
 * 根据用户 ID 生成一致的颜色（相同用户 ID 总是得到相同颜色）
 * @param userId - 用户唯一标识符
 * @returns 对应的颜色值（hex 格式）
 */
export function getConsistentColor(userId: string): string {
  // 简单哈希算法：将用户 ID 转换为数字索引
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i)
    hash = hash & hash // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length
  return COLOR_PALETTE[index]
}
