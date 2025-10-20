/**
 * 协作者相关类型定义
 * @module types/collaborator
 */

/**
 * 协作者表示当前正在编辑文档的用户，包含身份信息和在线状态
 */
export interface Collaborator {
  /** 协作者唯一标识符（UUID 或用户 ID） */
  id: string

  /** 协作者显示名称（用户名或匿名名称如 "访客 1"） */
  name: string

  /** 协作者头像 URL（可选，默认使用首字母生成） */
  avatar?: string

  /** 协作者光标颜色（用于区分不同用户） */
  cursorColor: string

  /** 在线状态 */
  status: CollaboratorStatus

  /** 最后活跃时间戳（用于超时检测） */
  lastActiveAt: number

  /** 当前光标位置和选中范围 */
  selection?: EditorSelection
}

/**
 * 协作者在线状态
 */
export enum CollaboratorStatus {
  /** 在线并活跃编辑 */
  Active = 'active',

  /** 在线但暂无操作（>2分钟未编辑） */
  Idle = 'idle',

  /** 离线（网络断开或关闭页面） */
  Offline = 'offline'
}

/**
 * 编辑器选中范围
 */
export interface EditorSelection {
  /** 选中范围起始位置（ProseMirror position） */
  from: number

  /** 选中范围结束位置 */
  to: number

  /** 是否为光标（from === to） */
  empty: boolean

  /** 光标所在的文本内容（用于显示协作者编辑位置） */
  text?: string
}
