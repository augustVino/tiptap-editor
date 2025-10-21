/**
 * Toolbar Dropdown Component
 * 工具栏下拉菜单组件
 *
 * 基于 Ant Design Dropdown 的封装，提供更好的交互体验：
 * - 智能定位和边界检测
 * - 流畅的动画效果
 * - 支持键盘导航
 * - 无障碍访问支持
 */

import React from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import styles from './ToolbarDropdown.module.less';

export interface ToolbarDropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
}

export interface ToolbarDropdownProps {
  icon: React.ReactNode;
  items: ToolbarDropdownItem[];
  tooltip?: string;
  isActive?: boolean;
}

/**
 * 工具栏下拉菜单组件
 *
 * 使用 Ant Design Dropdown 提供专业级的下拉交互
 *
 * @example
 * ```tsx
 * <ToolbarDropdown
 *   icon={<HeadingIcon />}
 *   tooltip="设置标题"
 *   isActive={editor.isActive('heading')}
 *   items={[
 *     { label: 'H1', value: 'h1', onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run() }
 *   ]}
 * />
 * ```
 */
export function ToolbarDropdown(props: ToolbarDropdownProps): React.ReactElement {
  const { icon, items, tooltip, isActive = false } = props;

  // 将 ToolbarDropdownItem 转换为 antd MenuProps
  const menuItems: MenuProps['items'] = items.map((item) => ({
    key: item.value,
    label: item.label,
    icon: item.icon,
    onClick: item.onClick,
    // 使用自定义样式标记激活状态
    className: item.isActive ? styles.menuItemActive : styles.menuItem
  }));

  const buttonClass = [styles.dropdownButton, isActive && styles.active].filter(Boolean).join(' ');

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomLeft" arrow={false}>
      <button type="button" className={buttonClass} aria-label={tooltip} aria-haspopup="menu">
        {icon}
        <DownOutlined className={styles.chevron} />
      </button>
    </Dropdown>
  );
}
