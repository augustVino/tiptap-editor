/**
 * TaskItem Extension (任务列表项)
 * @module extensions/blocks/TaskItem
 */

import TaskItem from '@tiptap/extension-task-item';

/**
 * 任务列表项扩展
 * TaskList 的子元素，支持复选框
 */
export const TaskItemExtension = TaskItem.configure({
  HTMLAttributes: {
    class: 'task-item'
  },
  nested: true // 支持嵌套任务列表
});

export default TaskItemExtension;
