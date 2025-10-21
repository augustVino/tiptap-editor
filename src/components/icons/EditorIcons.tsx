/**
 * Editor Icons Component
 *
 * 使用 antd Icon 组件包裹 SVG 图标
 * SVG 文件位于 src/images/ 目录
 *
 * @module components/icons/EditorIcons
 */

import Icon from '@ant-design/icons';

// 导入 SVG 作为 React 组件
import BoldSvg from '../../images/bold.svg?react';
import ItalicSvg from '../../images/italic.svg?react';
import UnderlineSvg from '../../images/underline.svg?react';
import StrikeSvg from '../../images/strike.svg?react';
import CodeSvg from '../../images/code.svg?react';
import UndoSvg from '../../images/undo.svg?react';
import RedoSvg from '../../images/redo.svg?react';
import HSvg from '../../images/H.svg?react';
import BlockquoteSvg from '../../images/blockquote.svg?react';
import CodeblockSvg from '../../images/codeblock.svg?react';
import ListSvg from '../../images/list.svg?react';
import LinkSvg from '../../images/link.svg?react';
import HighlightSvg from '../../images/highlight.svg?react';
import SuperscriptSvg from '../../images/superscript.svg?react';
import SubscriptSvg from '../../images/subscript.svg?react';
import AlignLeftSvg from '../../images/alignLeft.svg?react';
import AlignCenterSvg from '../../images/alignCenter.svg?react';
import AlignRightSvg from '../../images/alignRight.svg?react';
import AlignJustifySvg from '../../images/alignJustify.svg?react';
import DarkSvg from '../../images/dark.svg?react';
import LightSvg from '../../images/light.svg?react';
import H1Svg from '../../images/h1.svg?react';
import H2Svg from '../../images/h2.svg?react';
import H3Svg from '../../images/h3.svg?react';
import H4Svg from '../../images/h4.svg?react';
import TaskListSvg from '../../images/tasklist.svg?react';
import OrderedListSvg from '../../images/orderedList.svg?react';
import BulletListSvg from '../../images/bulletList.svg?react';

export interface IconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

/**
 * 创建 Icon 组件的工厂函数
 * 将 SVG 组件包装为 antd Icon 组件
 */
const createIcon = (SvgComponent: React.FC<React.SVGProps<SVGSVGElement>>) => {
  return ({ size = 16, className, style }: IconProps) => (
    <Icon component={SvgComponent} style={{ fontSize: size, ...style }} className={className} />
  );
};

// 导出图标组件
export const BoldIcon = createIcon(BoldSvg);
export const ItalicIcon = createIcon(ItalicSvg);
export const UnderlineIcon = createIcon(UnderlineSvg);
export const StrikeIcon = createIcon(StrikeSvg);
export const CodeIcon = createIcon(CodeSvg);
export const UndoIcon = createIcon(UndoSvg);
export const RedoIcon = createIcon(RedoSvg);
export const HeadingIcon = createIcon(HSvg);
export const BlockquoteIcon = createIcon(BlockquoteSvg);
export const CodeBlockIcon = createIcon(CodeblockSvg);
export const ListIcon = createIcon(ListSvg);
export const LinkIcon = createIcon(LinkSvg);
export const HighlightIcon = createIcon(HighlightSvg);
export const SuperscriptIcon = createIcon(SuperscriptSvg);
export const SubscriptIcon = createIcon(SubscriptSvg);
export const AlignLeftIcon = createIcon(AlignLeftSvg);
export const AlignCenterIcon = createIcon(AlignCenterSvg);
export const AlignRightIcon = createIcon(AlignRightSvg);
export const AlignJustifyIcon = createIcon(AlignJustifySvg);
export const DarkModeIcon = createIcon(DarkSvg);
export const LightModeIcon = createIcon(LightSvg);
export const H1Icon = createIcon(H1Svg);
export const H2Icon = createIcon(H2Svg);
export const H3Icon = createIcon(H3Svg);
export const H4Icon = createIcon(H4Svg);
export const TaskListIcon = createIcon(TaskListSvg);
export const OrderedListIcon = createIcon(OrderedListSvg);
export const BulletListIcon = createIcon(BulletListSvg);
