import { Editor, Range } from '@tiptap/core';
import { EditorState, Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view';

import { findSuggestionMatch as defaultFindSuggestionMatch } from './findSuggestionMatch.js';

export interface SuggestionOptions<I = any, TSelected = any> {
  /**
   * The plugin key for the suggestion plugin.
   * @default 'suggestion'
   * @example 'mention'
   */
  pluginKey?: PluginKey;

  /**
   * The editor instance.
   * @default null
   */
  editor: Editor;

  /**
   * The character that triggers the suggestion.
   * @default '@'
   * @example '#'
   */
  char?: string;

  /**
   * Allow spaces in the suggestion query. Not compatible with `allowToIncludeChar`. Will be disabled if `allowToIncludeChar` is set to `true`.
   * @default false
   * @example true
   */
  allowSpaces?: boolean;

  /**
   * Allow the character to be included in the suggestion query. Not compatible with `allowSpaces`.
   * @default false
   */
  allowToIncludeChar?: boolean;

  /**
   * Allow prefixes in the suggestion query.
   * @default [' ']
   * @example [' ', '@']
   */
  allowedPrefixes?: string[] | null;

  /**
   * Only match suggestions at the start of the line.
   * @default false
   * @example true
   */
  startOfLine?: boolean;

  /**
   * The tag name of the decoration node.
   * @default 'span'
   * @example 'div'
   */
  decorationTag?: string;

  /**
   * The class name of the decoration node.
   * @default 'suggestion'
   * @example 'mention'
   */
  decorationClass?: string;

  /**
   * A function that is called when a suggestion is selected.
   * @param props The props object.
   * @param props.editor The editor instance.
   * @param props.range The range of the suggestion.
   * @param props.props The props of the selected suggestion.
   * @returns void
   * @example ({ editor, range, props }) => { props.command(props.props) }
   */
  command?: (props: { editor: Editor; range: Range; props: TSelected }) => void;

  /**
   * A function that returns the suggestion items in form of an array.
   * @param props The props object.
   * @param props.editor The editor instance.
   * @param props.query The current suggestion query.
   * @returns An array of suggestion items.
   * @example ({ editor, query }) => [{ id: 1, label: 'John Doe' }]
   */
  items?: (props: { query: string; editor: Editor }) => I[] | Promise<I[]>;

  /**
   * The render function for the suggestion.
   * @returns An object with render functions.
   */
  render?: () => {
    onBeforeStart?: (props: SuggestionProps<I, TSelected>) => void;
    onStart?: (props: SuggestionProps<I, TSelected>) => void;
    onBeforeUpdate?: (props: SuggestionProps<I, TSelected>) => void;
    onUpdate?: (props: SuggestionProps<I, TSelected>) => void;
    onExit?: (props: SuggestionProps<I, TSelected>) => void;
    onKeyDown?: (props: SuggestionKeyDownProps) => boolean;
  };

  /**
   * A function that returns a boolean to indicate if the suggestion should be active.
   * @param props The props object.
   * @returns {boolean}
   */
  allow?: (props: {
    editor: Editor;
    state: EditorState;
    range: Range;
    isActive?: boolean;
  }) => boolean;
  findSuggestionMatch?: typeof defaultFindSuggestionMatch;

  /**
   * Custom composition state provider for more accurate input method composition detection.
   * When provided, this will be used instead of editor.view.composing for determining composition state.
   * @param props The props object.
   * @returns {boolean} true if currently composing, false otherwise
   * @example () => customCompositionManager.getComposingState()
   */
  getComposingState?: () => boolean;
}

export interface SuggestionProps<I = any, TSelected = any> {
  /**
   * The editor instance.
   */
  editor: Editor;

  /**
   * The range of the suggestion.
   */
  range: Range;

  /**
   * The current suggestion query.
   */
  query: string;

  /**
   * The current suggestion text.
   */
  text: string;

  /**
   * The suggestion items array.
   */
  items: I[];

  /**
   * A function that is called when a suggestion is selected.
   * @param props The props object.
   * @returns void
   */
  command: (props: TSelected) => void;

  /**
   * The decoration node HTML element
   * @default null
   */
  decorationNode: Element | null;

  /**
   * The function that returns the client rect
   * @default null
   * @example () => new DOMRect(0, 0, 0, 0)
   */
  clientRect?: (() => DOMRect | null) | null;
}

export interface SuggestionKeyDownProps {
  view: EditorView;
  event: KeyboardEvent;
  range: Range;
}

export const SuggestionPluginKey = new PluginKey('suggestion');

/**
 * This utility allows you to create suggestions.
 * @see https://tiptap.dev/api/utilities/suggestion
 */
export function Suggestion<I = any, TSelected = any>({
  pluginKey = SuggestionPluginKey,
  editor,
  char = '@',
  allowSpaces = false,
  allowToIncludeChar = false,
  allowedPrefixes = [' '],
  startOfLine = false,
  decorationTag = 'span',
  decorationClass = 'suggestion',
  command = () => null,
  items = () => [],
  render = () => ({}),
  allow = () => true,
  findSuggestionMatch = defaultFindSuggestionMatch,
  getComposingState
}: SuggestionOptions<I, TSelected>) {
  let props: SuggestionProps<I, TSelected> | undefined;
  const renderer = render?.();

  const plugin: Plugin<any> = new Plugin({
    key: pluginKey,

    view() {
      return {
        update: async (view, prevState) => {
          const prev = this.key?.getState(prevState);
          const next = this.key?.getState(view.state);

          // 获取当前的 composing 状态
          const currentComposing = getComposingState ? getComposingState() : view.composing;

          // See how the state changed
          const moved = prev.active && next.active && prev.range.from !== next.range.from;
          const started = !prev.active && next.active;
          const stopped = prev.active && !next.active;
          const changed = !started && !stopped && prev.query !== next.query;

          // 在输入法期间，只允许 handleChange，避免 handleExit 导致 popup 被意外销毁
          let handleStart = started || (moved && changed);
          let handleChange = changed || moved;
          let handleExit = stopped || (moved && changed);

          // 如果当前在输入法组字状态，调整处理逻辑
          if (currentComposing) {
            // 抑制 handleExit，避免 popup 被销毁
            if (handleExit && !handleStart) {
              handleExit = false;
            }

            // 如果是从无查询到有查询的状态变化（输入法完成时的情况）
            // 将 handleStart 转换为 handleChange，避免重新创建组件
            if (handleStart && prev.active) {
              console.log('Converting handleStart to handleChange during composition');
              handleStart = false;
              handleChange = true;
            }
          }

          // Cancel when suggestion isn't active
          if (!handleStart && !handleChange && !handleExit) {
            return;
          }

          console.log('suggestion update:', {
            handleStart,
            handleChange,
            handleExit,
            query: next.query,
            prevQuery: prev.query,
            active: next.active,
            prevActive: prev.active,
            composing: currentComposing
          });

          const state = handleExit && !handleStart ? prev : next;

          const decorationNode = view.dom.querySelector(
            `[data-decoration-id="${state.decorationId}"]`
          );

          props = {
            editor,
            range: state.range,
            query: state.query,
            text: state.text,
            items: [],
            command: (commandProps) => {
              return command({
                editor,
                range: state.range,
                props: commandProps
              });
            },
            decorationNode,
            // virtual node for popper.js or tippy.js
            // this can be used for building popups without a DOM node
            clientRect: decorationNode
              ? () => {
                  const getFallbackRect = () => {
                    try {
                      // 获取编辑器的选择范围
                      const { from } = editor.state.selection;
                      const coords = view.coordsAtPos(from);

                      if (coords) {
                        return new DOMRect(coords.left, coords.top, 0, coords.bottom - coords.top);
                      }
                    } catch (error) {
                      console.warn('Error getting fallback rect:', error);
                    }

                    // 最后的备用方案：返回编辑器元素的位置
                    try {
                      const editorRect = view.dom.getBoundingClientRect();
                      return new DOMRect(editorRect.left, editorRect.top, 0, 20);
                    } catch (error) {
                      console.warn('Error getting editor rect:', error);
                      return null;
                    }
                  };

                  try {
                    // because of `items` can be asynchrounous we'll search for the current decoration node
                    const pluginState = this.key?.getState(editor.state);
                    if (!pluginState?.decorationId || !pluginState.active) {
                      return getFallbackRect();
                    }

                    const currentDecorationNode = view.dom.querySelector(
                      `[data-decoration-id="${pluginState.decorationId}"]`
                    );

                    // 确保节点存在且仍在 DOM 中
                    if (!currentDecorationNode || !document.contains(currentDecorationNode)) {
                      return getFallbackRect();
                    }

                    // 获取位置信息并验证有效性
                    const rect = currentDecorationNode.getBoundingClientRect();

                    // 检查返回的位置信息是否有效
                    if (
                      !rect ||
                      rect.width === 0 ||
                      rect.height === 0 ||
                      (rect.top === 0 && rect.left === 0 && rect.bottom === 0 && rect.right === 0)
                    ) {
                      return getFallbackRect();
                    }

                    return rect;
                  } catch (error) {
                    console.warn('Error in clientRect function:', error);
                    return getFallbackRect();
                  }
                }
              : null
          };

          if (handleStart) {
            renderer?.onBeforeStart?.(props);
          }

          if (handleChange) {
            renderer?.onBeforeUpdate?.(props);
          }

          if (handleChange || handleStart) {
            console.log('fetching items for query:', state.query);
            props.items = await items({
              editor,
              query: state.query
            });
            console.log('items fetched:', props.items.length);
          }

          if (handleExit) {
            renderer?.onExit?.(props);
          }

          if (handleChange) {
            console.log('calling onUpdate with items:', props.items.length);
            renderer?.onUpdate?.(props);
          }

          if (handleStart) {
            console.log('calling onStart with items:', props.items.length);
            renderer?.onStart?.(props);
          }
        },

        destroy: () => {
          if (!props) {
            return;
          }

          renderer?.onExit?.(props);
        }
      };
    },

    state: {
      // Initialize the plugin's internal state.
      init() {
        const state: {
          active: boolean;
          range: Range;
          query: null | string;
          text: null | string;
          composing: boolean;
          decorationId?: string | null;
        } = {
          active: false,
          range: {
            from: 0,
            to: 0
          },
          query: null,
          text: null,
          composing: false
        };

        return state;
      },

      // Apply changes to the plugin state from a view transaction.
      apply(transaction, prev, _oldState, state) {
        const { isEditable } = editor;
        // 使用自定义的 composing 状态提供器，如果没有则回退到默认的 editor.view.composing
        const composing = getComposingState ? getComposingState() : editor.view.composing;
        const { selection } = transaction;
        const { empty, from } = selection;
        const next = { ...prev };
        next.composing = composing;

        // We can only be suggesting if the view is editable, and:
        //   * there is no selection, or
        //   * a composition is active (see: https://github.com/ueberdosis/tiptap/issues/1449)
        if (isEditable && (empty || composing)) {
          // Reset active state if we just left the previous suggestion range
          if ((from < prev.range.from || from > prev.range.to) && !composing && !prev.composing) {
            next.active = false;
          }

          // Try to match against where our cursor currently is
          const match = findSuggestionMatch({
            char,
            allowSpaces,
            allowToIncludeChar,
            allowedPrefixes,
            startOfLine,
            $position: selection.$from
          });
          const decorationId = `id_${Math.floor(Math.random() * 0xffffffff)}`;

          // If we found a match, update the current state to show it
          if (
            match &&
            allow({
              editor,
              state,
              range: match.range,
              isActive: prev.active
            })
          ) {
            next.active = true;
            next.decorationId = prev.decorationId ? prev.decorationId : decorationId;
            next.range = match.range;
            next.query = match.query;
            next.text = match.text;
          } else {
            next.active = false;
          }
        } else {
          next.active = false;
        }

        // Make sure to empty the range if suggestion is inactive
        if (!next.active) {
          next.decorationId = null;
          next.range = { from: 0, to: 0 };
          next.query = null;
          next.text = null;
        }

        return next;
      }
    },

    props: {
      // Call the keydown hook if suggestion is active.
      handleKeyDown(view, event) {
        const { active, range } = plugin.getState(view.state);

        if (!active) {
          return false;
        }

        return renderer?.onKeyDown?.({ view, event, range }) || false;
      },

      // Setup decorator on the currently active suggestion.
      decorations(state) {
        const { active, range, decorationId } = plugin.getState(state);

        if (!active) {
          return null;
        }

        return DecorationSet.create(state.doc, [
          Decoration.inline(range.from, range.to, {
            nodeName: decorationTag,
            class: decorationClass,
            'data-decoration-id': decorationId
          })
        ]);
      }
    }
  });

  return plugin;
}
