import type { MentionItem } from '../src/extensions/mention/types';

// ─── 用户数据（模拟远程 API）───

const users: MentionItem[] = [
  { id: 'u1', label: '张三', avatar: '👨', department: '技术部', role: '前端工程师' },
  { id: 'u2', label: '李四', avatar: '👩', department: '产品部', role: '产品经理' },
  { id: 'u3', label: '王五', avatar: '👨', department: '设计部', role: 'UI 设计师' },
  { id: 'u4', label: '赵六', avatar: '👩', department: '运营部', role: '运营专员' },
  { id: 'u5', label: '刘备', avatar: '👑', department: '管理层', role: 'CEO' },
  { id: 'u6', label: '关羽', avatar: '⚔️', department: '安全部', role: '安全工程师' },
  { id: 'u7', label: '张飞', avatar: '🔥', department: '技术部', role: '后端工程师' },
  { id: 'u8', label: '诸葛亮', avatar: '🧠', department: '技术部', role: '架构师' },
];

// 模拟带延迟的异步查询
export function fetchUsers(query: string): Promise<MentionItem[]> {
  return new Promise((resolve) => {
    const delay = 200 + Math.random() * 300;
    setTimeout(() => {
      const result = users
        .filter(
          (u) =>
            u.label.includes(query) ||
            u.department.includes(query) ||
            u.role.includes(query),
        )
        .slice(0, 6);
      resolve(result);
    }, delay);
  });
}

// ─── 命令数据 ───

const commands: MentionItem[] = [
  { id: 'todo', label: '待办事项', icon: '📝', description: '创建一个新的待办事项' },
  { id: 'meeting', label: '会议', icon: '📅', description: '安排一个会议' },
  { id: 'deadline', label: '截止日期', icon: '⏰', description: '设置重要截止日期' },
  { id: 'reminder', label: '提醒', icon: '🔔', description: '设置提醒事项' },
  { id: 'file', label: '文件', icon: '📎', description: '附加文件' },
  { id: 'assign', label: '指派', icon: '👤', description: '指派任务给团队成员' },
];

export function fetchCommands(query: string): Promise<MentionItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        commands.filter((c) => c.label.includes(query) || c.description.includes(query)).slice(0, 5),
      );
    }, 100);
  });
}

// ─── 标签数据 ───

const hashtags: MentionItem[] = [
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'css', label: 'CSS' },
  { id: 'html', label: 'HTML' },
  { id: 'nodejs', label: 'Node.js' },
];

export function fetchHashtags(query: string): Promise<MentionItem[]> {
  return Promise.resolve(
    hashtags.filter((h) => h.label.toLowerCase().includes(query.toLowerCase())).slice(0, 5),
  );
}
