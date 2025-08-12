// import Mention from '@tiptap/extension-mention';
import Mention from '../../../../core/extension-mention/src';
import { Attributes } from '@tiptap/react';
import { getMentionNodeView, NodeViewWrapper } from './MentionNodeView';
import {
  createMentionConfigure,
  withMentionInteraction,
  type MentionExtensionOption,
  type MentionItem,
  type MentionListPureDisplayProps
} from './configure';

const addSourceAttrFn = (flag: boolean): Attributes => {
  return flag
    ? {
        source: {
          default: null,
          parseHTML: (element) => element.getAttribute('data-source'),
          renderHTML: (attributes) =>
            attributes.source ? { 'data-source': attributes.source } : {}
        }
      }
    : {};
};

function createMentionExtension(option: MentionExtensionOption) {
  const { name, addSourceAttr = false, renderComponent } = option;

  return Mention.extend({
    name,
    addAttributes() {
      return {
        ...(this.parent?.() || {}),
        ...addSourceAttrFn(addSourceAttr)
      };
    },
    // 添加自定义节点视图渲染
    addNodeView() {
      return getMentionNodeView(renderComponent);
    }
  }).configure(createMentionConfigure(option));
}

/**
 * 创建 Mention 扩展
 * @param mentions Mention 配置数组
 * @param mentionsRef 最新的 Mention 配置引用
 * @returns Mention 扩展数组
 */
export const createMentionExtensions = (
  mentions: MentionExtensionOption[],
  mentionsRef: { current: MentionExtensionOption[] }
) => {
  return mentions.map((option) => {
    const newOption = {
      ...option,
      suggestion: {
        ...option.suggestion,
        items: (props: any) => {
          // 使用 ref 中的最新 mentions 数据
          const currentMentions = mentionsRef.current;
          // 找到当前 mention 对应的最新配置
          const updatedOption = currentMentions.find((m) => m.name === option.name);

          // 如果找到了更新后的配置，使用其 items 函数
          if (updatedOption?.suggestion?.items) {
            return updatedOption.suggestion.items(props);
          }

          // 否则使用原始的 items 函数（确保其存在）
          return option.suggestion?.items?.(props) || [];
        }
      }
    };

    return createMentionExtension(newOption);
  });
};
export type { MentionExtensionOption, MentionItem, MentionListPureDisplayProps };
export { NodeViewWrapper, withMentionInteraction };
