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

    (editor.storage as Record<string, any>).mentionSuggestion = { active: true };

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

  it('should NOT insert newline on Enter when shouldSubmit returns false', () => {
    const onSubmit = vi.fn();
    const ext = createSubmitExtension({
      onSubmit,
      shouldSubmit: () => false,
    });
    const editor = new Editor({
      extensions: [Document, Paragraph, Text, ext],
      content: '<p></p>',
    });

    const htmlBefore = editor.getHTML();
    editor.commands.keyboardShortcut('Enter');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(editor.getHTML()).toBe(htmlBefore);

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

  it('should support custom extension name', () => {
    const onSubmit = vi.fn();
    const ext = createSubmitExtension({ name: 'customSubmit', onSubmit });
    expect(ext.name).toBe('customSubmit');
    const editor = createTestEditor([ext]);
    editor.commands.keyboardShortcut('Enter');
    expect(onSubmit).toHaveBeenCalledTimes(1);
    editor.destroy();
  });

  it('should use custom isSuggestionActive when provided', () => {
    const onSubmit = vi.fn();
    const customCheck = vi.fn(() => true);
    const ext = createSubmitExtension({
      onSubmit,
      isSuggestionActive: customCheck,
    });
    const editor = createTestEditor([ext]);

    editor.commands.keyboardShortcut('Enter');
    expect(customCheck).toHaveBeenCalledWith(editor);
    expect(onSubmit).not.toHaveBeenCalled();

    editor.destroy();
  });

  it('should fall back to default suggestion check when custom returns false', () => {
    const onSubmit = vi.fn();
    const ext = createSubmitExtension({
      onSubmit,
      isSuggestionActive: () => false,
    });
    const editor = createTestEditor([ext]);

    editor.commands.keyboardShortcut('Enter');
    expect(onSubmit).toHaveBeenCalledTimes(1);

    editor.destroy();
  });

  it('should block onSubmit when isSuggestionActive returns true even if shouldSubmit returns true', () => {
    const onSubmit = vi.fn();
    const ext = createSubmitExtension({
      onSubmit,
      isSuggestionActive: () => true,
      shouldSubmit: () => true,
    });
    const editor = createTestEditor([ext]);

    editor.commands.keyboardShortcut('Enter');
    expect(onSubmit).not.toHaveBeenCalled();

    editor.destroy();
  });
});
