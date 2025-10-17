// import Mention, { MentionNodeAttrs, MentionOptions } from '@tiptap/extension-mention';
import Mention, {
  MentionNodeAttrs,
  MentionOptions
} from '../../../../../core/extension-mention/src';
import { Editor, ReactRenderer, Range, ReactNodeViewProps } from '@tiptap/react';
import tippy from 'tippy.js';
import { CommandArgs, MentionItem, MentionListPureDisplayProps } from './types';
import List from './List';
import { withMentionInteraction } from './withMentionInteraction';
import { CompositionStateManager } from './CompositionStateManager';
import './tippy.less';
import { findSuggestionMatch } from './findSuggestionMatch';

/**
 * 自定义mention插件
 * @see https://tiptap.dev/docs/editor/extensions/nodes/mention
 * @see https://tiptap.dev/docs/editor/api/utilities/suggestion
 */
export interface MentionExtensionOption
  extends Partial<
    Omit<
      MentionOptions<any, MentionNodeAttrs>,
      'suggestion' | 'suggestions' | 'renderLabel' | 'renderHTML' | 'renderText'
    >
  > {
  /** Mention 名称（不同的name，会创建不同的mention插件） */
  name: string;
  suggestion: MentionOptions['suggestion'];
  /** 自定义列表组件（支持纯展示组件，系统会自动用HOC包装） */
  listComponent?: React.ComponentType<MentionListPureDisplayProps>;
  /** 选中项是否回填到输入框，默认为true。如果为false，则不会回填到输入框，但会触发onSelect */
  showSelectedInEditor?: boolean;
  fieldNames?: Record<keyof Pick<MentionItem, 'label' | 'id'>, string>;
  /** 选中item的事件 */
  onSelect?: (props: MentionItem) => void;
  /** 在标签中属性中添加源数据 */
  addSourceAttr?: boolean;
  /**
   * 自定义渲染标签组件，用于自定义mention标签的渲染
   */
  renderComponent?: React.ComponentType<ReactNodeViewProps>;
  /**
   * 是否启用自定义composition状态管理，用于解决中文输入法问题
   * 默认为true
   */
  enableCustomCompositionState?: boolean;
}

export function createMentionConfigure(
  option: MentionExtensionOption
): Partial<MentionOptions<any, MentionNodeAttrs>> {
  const {
    name,
    suggestion,
    showSelectedInEditor = true,
    enableCustomCompositionState = true,
    ...opts
  } = option;

  // 创建composition状态管理器
  const compositionManager = enableCustomCompositionState ? new CompositionStateManager() : null;

  let popup: any;
  let reactRenderer: any;
  let isDestroyed = false;
  let updateTimeout: NodeJS.Timeout | null = null;

  const onRender = () => {
    return {
      onStart: (props: any) => {
        console.log('onStart called with props:', {
          query: props.query,
          items: props.items,
          itemsLength: props.items?.length,
          clientRect: !!props.clientRect
        });

        isDestroyed = false;
        if (opts.onSelect) {
          props.onSelect = opts.onSelect;
        }
        if (opts.fieldNames) {
          props.fieldNames = opts.fieldNames;
        }

        // 统一为所有组件应用HOC包装，确保交互逻辑一致
        const ListComponent = withMentionInteraction(
          (option.listComponent || List) as React.ComponentType<MentionListPureDisplayProps>
        );

        reactRenderer = new ReactRenderer(ListComponent, {
          props,
          editor: props.editor
        });

        // 创建 popup，如果 clientRect 不存在则使用备用定位

        // 备用策略：使用编辑器位置
        const getFallbackRect = () => {
          try {
            const editorRect = props.editor?.view?.dom?.getBoundingClientRect();
            if (editorRect) {
              return new DOMRect(editorRect.left, editorRect.bottom, 0, 20);
            }
          } catch (error) {
            console.warn('Error getting editor rect:', error);
          }
          // 最后的备用方案
          return new DOMRect(100, 100, 0, 20);
        };

        popup = tippy('body', {
          arrow: false,
          theme: 'light',
          getReferenceClientRect: props.clientRect ?? getFallbackRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start'
        });

        // 开始监听composition事件
        if (compositionManager && props.editor?.view?.dom) {
          compositionManager.startListening(props.editor.view.dom as HTMLElement);
        }

        return popup;
      },
      onUpdate: (props: any) => {
        console.log('onUpdate called with props:', {
          query: props.query,
          items: props.items,
          itemsLength: props.items?.length,
          clientRect: !!props.clientRect,
          composing: compositionManager?.getComposingState()
        });

        // 立即更新组件 props，确保数据及时传递到组件
        if (reactRenderer) {
          reactRenderer.updateProps(props);
        } else {
          console.warn('onUpdate: reactRenderer is null, cannot update props');
          return;
        }

        // 如果没有 popup，就无需处理位置更新
        if (!popup || !popup[0]) {
          console.warn('onUpdate: no popup instance, skipping position update');
          return;
        }

        // 在输入法期间，避免频繁的位置更新
        if (compositionManager?.getComposingState()) {
          console.log('onUpdate: composition in progress, skipping position update');
          return;
        }

        // 清除之前的位置更新定时器
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }

        // 位置更新使用防抖，但不影响组件数据更新
        if (!props.clientRect) {
          console.warn('onUpdate: clientRect is null, skipping position update only');
          return;
        }

        // 使用防抖机制来避免频繁更新位置
        updateTimeout = setTimeout(() => {
          if (isDestroyed || !popup || !popup[0]) {
            return;
          }

          // 只在有效的位置信息时才更新 tippy
          try {
            popup[0].setProps({
              getReferenceClientRect: props.clientRect
            });
          } catch (error) {
            console.warn('onUpdate: Error updating tippy position:', error);
          }
        }, 16); // 约 60fps
      },
      onKeyDown: (props: any) => {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        return reactRenderer.ref?.onKeyDown(props);
      },
      onExit: (props: any) => {
        // 清理防抖定时器
        if (updateTimeout) {
          clearTimeout(updateTimeout);
          updateTimeout = null;
        }

        // 如果在输入法组字期间，延迟销毁 popup，避免影响输入体验
        if (compositionManager?.getComposingState()) {
          // 设置一个短暂的延迟，等待输入法完成
          setTimeout(() => {
            if (!compositionManager?.getComposingState() && !isDestroyed) {
              if (popup && popup[0]) {
                popup[0].destroy();
              }
              if (reactRenderer) {
                reactRenderer.destroy();
              }
              isDestroyed = true;
            }
          }, 100);
          return;
        }

        if (isDestroyed) {
          console.warn('Popup already destroyed');
          return;
        }

        // 停止监听composition事件
        if (compositionManager) {
          compositionManager.stopListening();
        }

        // 安全销毁 popup 和 renderer
        try {
          if (popup && popup[0]) {
            popup[0].destroy();
          }
          if (reactRenderer) {
            reactRenderer.destroy();
          }
        } catch (error) {
          console.warn('Error destroying popup or renderer:', error);
        }

        isDestroyed = true;
      }
    };
  };

  const onCommand = (args: {
    editor: Editor;
    range: Range;
    props: MentionNodeAttrs & Pick<CommandArgs, 'onSelect'>;
  }) => {
    const { editor, range, props } = args;
    const { onSelect, ...mentionItem } = props;

    onSelect?.(mentionItem as MentionItem);

    if (!showSelectedInEditor) {
      // 清除触发字符
      editor.chain().focus().deleteRange(range).run();
      return;
    }

    const nodeAfter = editor.view.state.selection.$to.nodeAfter;
    const overrideSpace = nodeAfter?.text?.startsWith(' ');

    if (overrideSpace) {
      range.to += 1;
    }

    editor
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: name,
          attrs: props
        },
        {
          type: 'text',
          text: ' '
        }
      ])
      .run();

    editor.view.dom.ownerDocument.defaultView?.getSelection()?.collapseToEnd();
  };

  const render = suggestion.render || onRender;
  const command = suggestion.command || onCommand;
  // 确保 items 函数能够访问到最新的数据
  const wrappedItems = suggestion.items;

  return {
    // 启用或禁用在删除提及节点时是否同时删除建议字符。默认为 false 。
    deleteTriggerWithBackspace: true,
    ...opts,

    // 自定义应添加到渲染 HTML 标签上的自定义 HTML 属性。
    HTMLAttributes: {
      ...(opts.HTMLAttributes || {})
    },

    suggestion: {
      char: suggestion.char,
      // 允许触发建议的前缀字符。设置为 null 表示允许任何前缀字符。默认为: [' ']
      allowedPrefixes: null,
      ...suggestion,
      // 确保 items 函数能够访问到最新的数据
      items: wrappedItems,
      render,
      command,
      allowSpaces: false,
      // 集成自定义的 composition 状态管理器到 suggestion 核心逻辑中
      getComposingState: compositionManager
        ? () => compositionManager.getComposingState()
        : undefined
      //   findSuggestionMatch: findSuggestionMatch
      //   allow: (props: { editor: Editor; state: any; range: Range; isActive?: boolean }) => {
      //     // 如果使用了自定义 composition 状态管理器，核心逻辑已经处理了 composing 状态
      //     // 这里只需要处理其他自定义逻辑
      //     if (compositionManager) {
      //       // 触发编辑器重新渲染，确保 UI 状态同步
      //       requestAnimationFrame(() => {
      //         props.editor?.view?.dom.dispatchEvent(new Event('click'));
      //       });
      //     }

      //     // 其他自定义逻辑
      //     return true;
      //   }
    }
  };
}

export { withMentionInteraction };
export type { MentionItem, MentionListPureDisplayProps };
