import { useEffect, useMemo, useRef } from 'react';
import { useEditor as useTiptapEditor } from '@tiptap/react';
import type { Editor, JSONContent, Extensions } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Placeholder from '@tiptap/extension-placeholder';
import type { UseEditorOptions, ContentHelpers } from './types';
import { createContentHelpers } from './types';
import { useLatest } from './useLatest';

function shallowEqualArrays<T>(a: T[] | undefined, b: T[] | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  return a.every((item, i) => item === b[i]);
}

export function useEditor(options: UseEditorOptions = {}) {
  const {
    placeholder,
    extensions: consumerExtensions,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    onSelectionUpdate,
    onCreate,
    onDestroy,
    editable = true,
    autoFocus,
    editorProps,
  } = options;

  // ─── Stale closure protection ───
  const onChangeRef = useLatest(onChange);
  const onFocusRef = useLatest(onFocus);
  const onBlurRef = useLatest(onBlur);
  const onSelectionUpdateRef = useLatest(onSelectionUpdate);
  const onCreateRef = useLatest(onCreate);
  const onDestroyRef = useLatest(onDestroy);

  // ─── Extensions stability ───
  const stableExtensionsRef = useRef<Extensions | undefined>(consumerExtensions);
  if (!shallowEqualArrays(consumerExtensions, stableExtensionsRef.current)) {
    stableExtensionsRef.current = consumerExtensions;
  }
  const stableExtensions = stableExtensionsRef.current;

  // ─── Extensions assembly ───
  const extensions: Extensions = useMemo(() => {
    const builtIn: Extensions = [Document, Paragraph, Text];
    if (placeholder) {
      builtIn.push(Placeholder.configure({ placeholder }));
    }
    if (stableExtensions) {
      builtIn.push(...stableExtensions);
    }
    return builtIn;
  }, [placeholder, stableExtensions]);

  // ─── Editor instance ───
  const editor = useTiptapEditor({
    extensions,
    content: defaultValue,
    editable,
    autofocus: autoFocus,
    ...(editorProps ? { editorProps } : {}),
    onUpdate: ({ editor }: { editor: Editor }) => {
      const content: ContentHelpers = createContentHelpers(editor);
      lastSyncedValueRef.current = content.html;
      onChangeRef.current?.(content);
    },
    onFocus: (props: { editor: Editor; event: FocusEvent }) => {
      onFocusRef.current?.(props);
    },
    onBlur: (props: { editor: Editor; event: FocusEvent }) => {
      onBlurRef.current?.(props);
    },
    onSelectionUpdate: (props: { editor: Editor; transaction: unknown }) => {
      onSelectionUpdateRef.current?.(props as Parameters<NonNullable<UseEditorOptions['onSelectionUpdate']>>[0]);
    },
    onCreate: (props: { editor: Editor }) => {
      onCreateRef.current?.(props);
    },
    onDestroy: () => {
      onDestroyRef.current?.();
    },
  }, [extensions]);

  // ─── Controlled value sync ───
  const lastSyncedValueRef = useRef<string | JSONContent | undefined>(value);

  useEffect(() => {
    if (!editor || editor.isDestroyed || value === undefined) return;
    const synced = lastSyncedValueRef.current;
    const isSame =
      value === synced ||
      (typeof value === 'object' && typeof synced === 'object'
        && JSON.stringify(value) === JSON.stringify(synced));
    if (!isSame) {
      lastSyncedValueRef.current = value;
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  // ─── Editable declarative update ───
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    editor.setEditable(editable);
  }, [editable, editor]);

  // ─── Extensions hot update ───
  const prevExtensionsRef = useRef<Extensions | undefined>(stableExtensions);

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (prevExtensionsRef.current !== stableExtensions) {
      prevExtensionsRef.current = stableExtensions;
      editor.setOptions({ extensions });
    }
  }, [stableExtensions, editor, extensions]);

  return editor;
}
