/**
 * Toolbar 按钮组件
 * @module components/Toolbar/ToolbarButton
 */

import React from 'react';
import { Tooltip } from 'antd';

export interface ToolbarButtonProps {
  /** 图标或文本 */
  icon: React.ReactNode;
  /** 提示文本 */
  tooltip: string;
  /** 是否激活 */
  isActive?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击事件 */
  onClick: () => void;
}

/**
 * Toolbar 按钮组件
 * 带图标和提示的工具栏按钮
 */
export function ToolbarButton(props: ToolbarButtonProps): React.ReactElement {
  const { icon, tooltip, isActive = false, disabled = false, onClick } = props;

  const className = [
    'toolbar-button',
    isActive && 'toolbar-button--active',
    disabled && 'toolbar-button--disabled'
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tooltip title={tooltip} placement="top" arrow mouseEnterDelay={0.3}>
      <button
        type="button"
        className={className}
        onClick={onClick}
        disabled={disabled}
        aria-label={tooltip}
      >
        {icon}
      </button>
    </Tooltip>
  );
}
