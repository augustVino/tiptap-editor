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

  const onRender = () => {
    let popup: any;
    let reactRenderer: any;
    let isDestroyed = false;
    return {
      onStart: (props: any) => {
        if (!props.clientRect) {
          return;
        }
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

        popup = tippy('body', {
          arrow: false,
          theme: 'light',
          getReferenceClientRect: props.clientRect,
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
        reactRenderer.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect
        });
      },
      onKeyDown: (props: any) => {
        if (props.event.key === 'Escape') {
          popup[0].hide();

          return true;
        }

        return reactRenderer.ref?.onKeyDown(props);
      },
      onExit: () => {
        if (isDestroyed) {
          console.warn('已经卸载了！！');
          return;
        }

        isDestroyed = true;
        if (popup && popup[0]) {
          popup[0].destroy();
        }
        if (reactRenderer) {
          reactRenderer.destroy();
        }
        // 停止监听composition事件
        if (compositionManager) {
          compositionManager.stopListening();
        }
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
      allowSpaces: true,
      //   findSuggestionMatch: findSuggestionMatch
      allow: (props: { editor: Editor; state: any; range: Range; isActive?: boolean }) => {
        // 使用自定义composition状态管理器进行判断
        if (compositionManager) {
          const isComposing = compositionManager.getComposingState();
          console.log(
            'Custom composition state:',
            isComposing,
            'Tiptap composing:',
            props.editor?.view?.composing
          );

          if (isComposing) {
            return false; // 在composition期间不显示mention列表
          }
          requestAnimationFrame(() => {
            props.editor?.view?.dom.dispatchEvent(new Event('click'));
          });
        } else {
          // 回退到原有逻辑
          if (props.editor?.view?.composing) {
            return false;
          }
        }

        // 其他自定义逻辑
        return true;
      }
    }
  };
}

export { withMentionInteraction };
export type { MentionItem, MentionListPureDisplayProps };
