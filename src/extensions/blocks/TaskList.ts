/**
 * TaskList Extension (任务列表)
 * @module extensions/blocks/TaskList
 */

import TaskList from '@tiptap/extension-task-list';

/**
 * 任务列表扩展
 * 支持可勾选的任务列表项
 *
 * 快捷键: Ctrl/Cmd+Shift+9
 */
export const TaskListExtension = TaskList.configure({
  HTMLAttributes: {
    class: 'task-list'
  }
});

export default TaskListExtension;
