import { describe, it, expect, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { createSubmitExtension } from '../submit';

function createTestEditor(extensions: any[] = []) {
  return new Editor({
    extensions: [Document, Paragraph, Text, ...extensions],
    content: '<p>Test content</p>',
  });
}

describe('createSubmitExtension', () => {
  it('should call onSubmit on Enter key', () => {
    const onSubmit = vi.fn();
    const ext = createSubmitExtension({ onSubmit });
    const editor = createTestEditor([ext]);

    editor.commands.keyboardShortcut('Enter');
    expect(onSubmit).toHaveBeenCalledTimes(1);

    editor.destroy();
  });

  it('should NOT call onSubmit when suggestion is active', () => {
    const onSubmit = vi.fn();
    const ext = createSubmitExtension({ onSubmit });
    const editor = createTestEditor([ext]);

    editor.storage.mentionSuggestion = { active: true };

    editor.commands.keyboardShortcut('Enter');
    expect(onSubmit).not.toHaveBeenCalled();

    editor.destroy();
  });

  it('should NOT call onSubmit when shouldSubmit returns false', () => {
    const onSubmit = vi.fn();
    const ext = createSubmitExtension({
      onSubmit,
      shouldSubmit: () => false,
    });
    const editor = createTestEditor([ext]);

    editor.commands.keyboardShortcut('Enter');
    expect(onSubmit).not.toHaveBeenCalled();

    editor.destroy();
  });

  it('should insert newline on Shift+Enter', () => {
    const onSubmit = vi.fn();
    const ext = createSubmitExtension({ onSubmit });
    const editor = createTestEditor([ext]);

    const htmlBefore = editor.getHTML();
    editor.commands.keyboardShortcut('Shift-Enter');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(editor.getHTML()).not.toBe(htmlBefore);

    editor.destroy();
  });

  it('should call shouldSubmit with editor instance', () => {
    const shouldSubmit = vi.fn(() => true);
    const onSubmit = vi.fn();
    const ext = createSubmitExtension({ onSubmit, shouldSubmit });
    const editor = createTestEditor([ext]);

    editor.commands.keyboardShortcut('Enter');
    expect(shouldSubmit).toHaveBeenCalledWith(editor);
    expect(onSubmit).toHaveBeenCalledTimes(1);

    editor.destroy();
  });
});
