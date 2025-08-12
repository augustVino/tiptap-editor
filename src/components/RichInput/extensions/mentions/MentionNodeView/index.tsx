import React from 'react';
import { NodeViewWrapper, ReactNodeViewProps, ReactNodeViewRenderer } from '@tiptap/react';
import DefaultMentionTag from './DefaultMentionTag';

/**
 * 获取自定义的MentionNodeView渲染器
 * @param CustomComponent 自定义的React组件
 */
export function getMentionNodeView(CustomComponent?: React.ComponentType<ReactNodeViewProps>) {
  const Component = CustomComponent || DefaultMentionTag;
  return ReactNodeViewRenderer(Component);
}

export { NodeViewWrapper };
