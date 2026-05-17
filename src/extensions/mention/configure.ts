import type { Editor, Range } from '@tiptap/core';
import type { SuggestionProps, SuggestionKeyDownProps, SuggestionOptions } from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy, { type Instance as TippyInstance } from 'tippy.js';
import type { MentionConfig, MentionItem } from './types';
import { createSafeItems } from './utils';
import { withMentionInteraction } from './withMentionInteraction';
import { List } from './List';
import { getMentionNodeView } from './MentionNodeView';

import './tippy.less';

export const MENTION_SOURCE_ATTR = 'mentionSource';

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
    onTagClick,
    tippyOptions,
    debounceMs,
    emptyText,
    deleteTriggerWithBackspace = true,
  } = option;

  const ListComponent = listComponent ?? List;
  const InteractiveList = withMentionInteraction(ListComponent);
  const safeItems = createSafeItems(fetchItems, debounceMs);

  let popup: TippyInstance | null = null;
  let reactRenderer: ReactRenderer | null = null;
  let currentEditor: Editor | null = null;

  const render = () => ({
    onStart: (props: SuggestionProps<MentionItem>) => {
      currentEditor = props.editor;
      (currentEditor.storage as Record<string, any>).mentionSuggestion = { active: true };

      reactRenderer = new ReactRenderer(InteractiveList, {
        props: {
          items: props.items,
          command: props.command,
          query: props.query,
          fieldNames: option.fieldNames,
          onSelect,
          emptyText,
        },
        editor: props.editor,
      });

      if (!props.clientRect) return;

      popup = tippy(document.body, {
        getReferenceClientRect: props.clientRect as () => DOMRect,
        appendTo: () => document.body,
        content: reactRenderer.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
        theme: 'mention',
        ...tippyOptions,
      });
    },

    onUpdate: (props: SuggestionProps<MentionItem>) => {
      reactRenderer?.updateProps({
        items: props.items,
        command: props.command,
        query: props.query,
        fieldNames: option.fieldNames,
        onSelect,
        emptyText,
      });

      popup?.setProps({
        getReferenceClientRect: props.clientRect as () => DOMRect,
      });
    },

    onKeyDown: (props: SuggestionKeyDownProps) => {
      if (props.event.key === 'Escape') {
        popup?.hide();
        return true;
      }
      return (reactRenderer?.ref as { onKeyDown?: (props: SuggestionKeyDownProps) => boolean } | null)?.onKeyDown?.(props) ?? false;
    },

    onExit: () => {
      if (currentEditor) {
        (currentEditor.storage as Record<string, any>).mentionSuggestion = { active: false };
        currentEditor = null;
      }

      popup?.destroy();
      popup = null;

      reactRenderer?.destroy();
      reactRenderer = null;
    },
  });

  const command = (commandCtx: { editor: Editor; range: Range; props: Record<string, any> }) => {
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
            ...(addSourceAttr
              ? {
                  [MENTION_SOURCE_ATTR]:
                    Array.isArray(addSourceAttr)
                      ? Object.fromEntries(
                          addSourceAttr.filter((k) => mentionItem.hasOwnProperty(k)).map((k) => [k, mentionItem[k]])
                        )
                      : mentionItem,
                }
              : {}),
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
      render: render as NonNullable<SuggestionOptions<MentionItem>['render']>,
      command: command as NonNullable<SuggestionOptions<MentionItem>['command']>,
    },
    deleteTriggerWithBackspace,
  };

  const extensionMethods = {
    addOptions(this: { parent?: (...args: any[]) => any }) {
      return {
        ...this.parent?.(),
        onTagClick,
      };
    },
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
                renderHTML: (attributes: Record<string, unknown>) => {
                  const source = attributes[MENTION_SOURCE_ATTR];
                  if (!source) return {};
                  try {
                    return { 'data-source': JSON.stringify(source) };
                  } catch {
                    return {};
                  }
                },
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
