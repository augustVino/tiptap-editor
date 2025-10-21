/**
 * CollaborativeToolbar Component - 协作编辑器工具栏
 * 不依赖 EditorProvider，直接接收 editor 实例
 * @module components/Toolbar/CollaborativeToolbar
 */

import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarDivider } from './ToolbarDivider';
import { ToolbarDropdown } from './ToolbarDropdown';
import { ThemeToggle } from './ThemeToggle';
import * as Icons from '../icons/EditorIcons';
import styles from './Toolbar.module.less';

export interface CollaborativeToolbarProps {
  /** TipTap 编辑器实例 */
  editor: Editor | null;
}

export function CollaborativeToolbar(props: CollaborativeToolbarProps): React.ReactElement | null {
  const { editor } = props;
  const [, forceUpdate] = useState({});

  // 监听编辑器状态更新，强制组件重新渲染
  useEffect(() => {
    if (!editor) {
      return;
    }

    const handleUpdate = (): void => {
      forceUpdate({});
    };

    // 监听选区变化和事务更新
    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.toolbar}>
      {/* 左侧spacer用于居中 */}
      <div style={{ flex: 1 }} />

      {/* 历史操作 */}
      <ToolbarButton
        icon={<Icons.UndoIcon />}
        tooltip="撤销 (Ctrl+Z)"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <ToolbarButton
        icon={<Icons.RedoIcon />}
        tooltip="重做 (Ctrl+Y)"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      />

      <ToolbarDivider />

      {/* 标题下拉菜单 */}
      <ToolbarDropdown
        icon={<Icons.HeadingIcon />}
        tooltip="Format text as heading"
        isActive={editor.isActive('heading')}
        items={[
          {
            label: 'Heading 1',
            value: 'h1',
            icon: <Icons.H1Icon size={16} />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editor.isActive('heading', { level: 1 })
          },
          {
            label: 'Heading 2',
            value: 'h2',
            icon: <Icons.H2Icon size={16} />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive('heading', { level: 2 })
          },
          {
            label: 'Heading 3',
            value: 'h3',
            icon: <Icons.H3Icon size={16} />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editor.isActive('heading', { level: 3 })
          },
          {
            label: 'Heading 4',
            value: 'h4',
            icon: <Icons.H4Icon size={16} />,
            onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
            isActive: editor.isActive('heading', { level: 4 })
          }
        ]}
      />

      {/* 列表下拉菜单 */}
      <ToolbarDropdown
        icon={<Icons.ListIcon />}
        tooltip="List options"
        isActive={
          editor.isActive('bulletList') ||
          editor.isActive('orderedList') ||
          editor.isActive('taskList')
        }
        items={[
          {
            label: 'Bullet List',
            value: 'bulletList',
            icon: <Icons.BulletListIcon size={16} />,
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList')
          },
          {
            label: 'Ordered List',
            value: 'orderedList',
            icon: <Icons.OrderedListIcon size={16} />,
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive('orderedList')
          },
          {
            label: 'Task List',
            value: 'taskList',
            icon: <Icons.TaskListIcon size={16} />,
            onClick: () => editor.chain().focus().toggleTaskList().run(),
            isActive: editor.isActive('taskList')
          }
        ]}
      />

      <ToolbarDivider />

      {/* 引用 */}
      <ToolbarButton
        icon={<Icons.BlockquoteIcon />}
        tooltip="引用 (Ctrl+Shift+B)"
        isActive={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />

      {/* 代码块 */}
      <ToolbarButton
        icon={<Icons.CodeBlockIcon />}
        tooltip="代码块 (Ctrl+Alt+C)"
        isActive={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />

      <ToolbarDivider />

      {/* 格式化工具 */}
      <ToolbarButton
        icon={<Icons.BoldIcon />}
        tooltip="加粗 (Ctrl+B)"
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={<Icons.ItalicIcon />}
        tooltip="斜体 (Ctrl+I)"
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={<Icons.StrikeIcon />}
        tooltip="删除线 (Ctrl+Shift+X)"
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <ToolbarButton
        icon={<Icons.CodeIcon />}
        tooltip="行内代码"
        isActive={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />
      <ToolbarButton
        icon={<Icons.UnderlineIcon />}
        tooltip="下划线 (Ctrl+U)"
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        icon={<Icons.HighlightIcon />}
        tooltip="高亮"
        isActive={editor.isActive('highlight')}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      />
      <ToolbarButton
        icon={<Icons.LinkIcon />}
        tooltip="链接"
        isActive={editor.isActive('link')}
        onClick={() => {
          const url = window.prompt('输入链接URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      />
      <ToolbarButton
        icon={<Icons.SuperscriptIcon />}
        tooltip="上标"
        isActive={editor.isActive('superscript')}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      />
      <ToolbarButton
        icon={<Icons.SubscriptIcon />}
        tooltip="下标"
        isActive={editor.isActive('subscript')}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
      />

      <ToolbarDivider />

      {/* 文本对齐 */}
      <ToolbarButton
        icon={<Icons.AlignLeftIcon />}
        tooltip="左对齐"
        isActive={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />
      <ToolbarButton
        icon={<Icons.AlignCenterIcon />}
        tooltip="居中"
        isActive={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />
      <ToolbarButton
        icon={<Icons.AlignRightIcon />}
        tooltip="右对齐"
        isActive={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      />
      <ToolbarButton
        icon={<Icons.AlignJustifyIcon />}
        tooltip="两端对齐"
        isActive={editor.isActive({ textAlign: 'justify' })}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      />

      {/* 右侧spacer用于居中 */}
      <div style={{ flex: 1 }} />

      {/* 主题切换 */}
      <ThemeToggle />
    </div>
  );
}
