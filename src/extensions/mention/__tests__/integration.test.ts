import { describe, it, expect, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { createMentionExtension } from '../index';

describe('createMentionExtension', () => {
  it('should throw on multi-character trigger', () => {
    expect(() =>
      createMentionExtension({
        name: 'test',
        trigger: '@@',
        fetchItems: vi.fn(),
      }),
    ).toThrow('single character');
  });

  it('should create a valid tiptap extension', () => {
    const ext = createMentionExtension({
      name: 'atMention',
      trigger: '@',
      fetchItems: vi.fn(),
    });
    expect(ext).toBeDefined();
    expect(ext.name).toBe('atMention');
  });

  it('should warn on duplicate name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    createMentionExtension({ name: 'dup', trigger: '@', fetchItems: vi.fn() });
    createMentionExtension({ name: 'dup', trigger: '#', fetchItems: vi.fn() });

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Duplicate name "dup"'),
    );

    warn.mockRestore();
  });
});

describe('createMentionExtension with Editor', () => {
  it('should integrate with tiptap editor', () => {
    const ext = createMentionExtension({
      name: 'atMention',
      trigger: '@',
      fetchItems: vi.fn().mockResolvedValue([]),
    });

    const editor = new Editor({
      extensions: [Document, Paragraph, Text, ext],
      content: '<p>Hello</p>',
    });

    expect(editor).toBeDefined();
    expect(editor.getHTML()).toContain('Hello');
    editor.destroy();
  });
});
