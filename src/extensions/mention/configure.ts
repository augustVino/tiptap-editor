import { ReactRenderer } from '@tiptap/react';
import tippy, { type Instance as TippyInstance } from 'tippy.js';
import type { MentionConfig, MentionItem } from './types';
import { createSafeItems } from './utils';
import { withMentionInteraction } from './withMentionInteraction';
import { List } from './List';
import { getMentionNodeView } from './MentionNodeView';

import './tippy.less';

const MENTION_SOURCE_ATTR = 'mentionSource';

export function createMentionConfigure(option: MentionConfig) {
  const {
    name,
    trigger,
    fetchItems,
    listComponent,
    tagComponent,
    insertToEditor = true,
    onSelect,
    addSourceAttr = false,
  } = option;

  const ListComponent = listComponent ?? List;
  const InteractiveList = withMentionInteraction(ListComponent);
  const safeItems = createSafeItems(fetchItems);

  let popup: TippyInstance[] | null = null;
  let reactRenderer: ReactRenderer | null = null;
  let currentEditor: any = null;

  const render = () => ({
    onStart: (props: any) => {
      currentEditor = props.editor;
      currentEditor.storage.mentionSuggestion = { active: true };

      reactRenderer = new ReactRenderer(InteractiveList, {
        props: {
          items: props.items,
          command: props.command,
          query: props.query,
          fieldNames: option.fieldNames,
          onSelect,
        },
        editor: props.editor,
      });

      if (!props.clientRect) return;

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect as () => DOMRect,
        appendTo: () => document.body,
        content: reactRenderer.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
        theme: 'mention',
      });
    },

    onUpdate: (props: any) => {
      reactRenderer?.updateProps({
        items: props.items,
        command: props.command,
        query: props.query,
        fieldNames: option.fieldNames,
        onSelect,
      });

      popup?.[0]?.setProps({
        getReferenceClientRect: props.clientRect as () => DOMRect,
      });
    },

    onKeyDown: (props: any) => {
      if (props.event.key === 'Escape') {
        popup?.[0]?.hide();
        return true;
      }
      return (reactRenderer?.ref as any)?.onKeyDown?.(props) ?? false;
    },

    onExit: () => {
      if (currentEditor) {
        currentEditor.storage.mentionSuggestion = { active: false };
        currentEditor = null;
      }

      popup?.[0]?.destroy();
      popup = null;

      reactRenderer?.destroy();
      reactRenderer = null;
    },
  });

  const command = (commandCtx: any) => {
    const { editor: cmdEditor, range, props: itemProps } = commandCtx;
    const { onSelect: itemOnSelect, ...mentionItem } = itemProps;

    if (!insertToEditor) {
      cmdEditor.chain().focus().deleteRange(range).run();
      itemOnSelect?.(mentionItem as MentionItem, {
        editor: cmdEditor,
        query: mentionItem.mentionSuggestionChar ?? '',
      });
      return;
    }

    const nodeAfter = cmdEditor.view.state.selection.$to.nodeAfter;
    const overrideSpace = nodeAfter?.text?.startsWith(' ');
    if (overrideSpace) {
      range.to += 1;
    }

    cmdEditor
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: name,
          attrs: {
            ...mentionItem,
            ...(addSourceAttr ? { [MENTION_SOURCE_ATTR]: mentionItem } : {}),
          },
        },
        { type: 'text', text: ' ' },
      ])
      .run();

    itemOnSelect?.(mentionItem as MentionItem, {
      editor: cmdEditor,
      query: mentionItem.mentionSuggestionChar ?? '',
    });
  };

  const configOptions = {
    suggestion: {
      char: trigger,
      allowedPrefixes: null,
      items: safeItems,
      render: render as any,
      command: command as any,
    },
    deleteTriggerWithBackspace: true,
  };

  const extensionMethods = {
    addAttributes(this: { parent?: () => Record<string, unknown> }) {
      return {
        ...(this.parent?.() || {}),
        kind: {
          default: null,
          parseHTML: (element: HTMLElement) =>
            element.getAttribute('data-kind'),
          renderHTML: (attributes: Record<string, unknown>) => {
            if (!attributes.kind) return {};
            return { 'data-kind': attributes.kind };
          },
        },
        ...(addSourceAttr
          ? {
              [MENTION_SOURCE_ATTR]: {
                default: null,
                parseHTML: (element: HTMLElement) => {
                  const raw = element.getAttribute('data-source');
                  if (!raw) return null;
                  try {
                    return JSON.parse(raw);
                  } catch {
                    return null;
                  }
                },
                renderHTML: () => ({}),
              },
            }
          : {}),
      };
    },
    addNodeView() {
      return getMentionNodeView(tagComponent);
    },
  };

  return { configOptions, extensionMethods };
}
