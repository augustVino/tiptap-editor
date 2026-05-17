import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import type { Editor as TiptapEditor } from '@tiptap/core';

// ─── Mock @tiptap/react ───
// tiptap v3's Editor constructor creates a ProseMirror EditorView which
// requires a real DOM (not available in jsdom). We mock useEditor to return
// a fake editor instance so we can test our own Editor component logic.

const mockCommands = {
  focus: vi.fn(),
  blur: vi.fn(),
  clearContent: vi.fn(),
  setContent: vi.fn(),
  insertContent: vi.fn(),
};

function createMockEditor(): TiptapEditor {
  return {
    commands: mockCommands,
    setEditable: vi.fn(),
    getHTML: vi.fn(() => '<p></p>'),
    getText: vi.fn(() => ''),
    getJSON: vi.fn(() => ({ type: 'doc', content: [] })),
    isEmpty: true,
    isDestroyed: false,
    options: { editable: true },
    extensionManager: { extensions: [] },
  } as unknown as TiptapEditor;
}

let mockEditorInstance: TiptapEditor | null = null;

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(() => mockEditorInstance),
  EditorContent: ({ className }: { className?: string }) => (
    <div className={className} data-testid="editor-content" />
  ),
}));

// ─── Mock CSS module ───
// Return class name mapping so styles['xuanji-editor-root'] resolves
vi.mock('../index.module.less', () => ({
  default: {
    'xuanji-editor-root': 'xuanji-editor-root',
  },
}));

// ─── Import after mocks ───
import { Editor } from '../index';

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
  mockEditorInstance = createMockEditor();
});

describe('Editor', () => {
  it('should render editor root with correct class', () => {
    const { container } = render(<Editor placeholder="test" />);
    const root = container.querySelector('.xuanji-editor-root');
    expect(root).toBeTruthy();
  });

  it('should pass id prop to root element', () => {
    const { container } = render(<Editor id="my-editor" placeholder="test" />);
    expect(container.querySelector('#my-editor')).toBeTruthy();
  });

  it('should pass className to root element', () => {
    const { container } = render(
      <Editor className="custom-class" placeholder="test" />,
    );
    const root = container.querySelector('.xuanji-editor-root');
    expect(root?.classList.contains('custom-class')).toBe(true);
  });

  it('should render nothing when editor is null', () => {
    mockEditorInstance = null;
    const { container } = render(<Editor placeholder="test" />);
    expect(container.innerHTML).toBe('');
  });

  it('should render EditorContent inside root', () => {
    const { container } = render(<Editor placeholder="test" />);
    expect(container.querySelector('[data-testid="editor-content"]')).toBeTruthy();
  });

  it('should pass editorClassName to EditorContent', () => {
    const { container } = render(
      <Editor editorClassName="my-editor" placeholder="test" />,
    );
    const content = container.querySelector('[data-testid="editor-content"]');
    expect(content?.classList.contains('my-editor')).toBe(true);
  });
});
