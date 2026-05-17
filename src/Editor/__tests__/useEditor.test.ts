import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { Editor as TiptapEditor, Extensions } from '@tiptap/core';

// ─── Mock @tiptap/react ───
// tiptap v3's Editor constructor calls ProseMirror EditorView which fails in jsdom
// (dispatchTransaction is undefined). We mock useEditor from @tiptap/react to test
// our own wrapper logic in isolation.

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
let capturedOptions: Record<string, unknown> = {};

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn((options: Record<string, unknown>) => {
    capturedOptions = options;
    return mockEditorInstance;
  }),
}));

// ─── Import after mocks ───
import { useEditor } from '../useEditor';

beforeEach(() => {
  vi.clearAllMocks();
  mockEditorInstance = createMockEditor();
  capturedOptions = {};
});

describe('useEditor', () => {
  it('should pass default extensions to tiptap useEditor', () => {
    const { result } = renderHook(() => useEditor({}));
    expect(result.current).toBe(mockEditorInstance);
    // Should have extensions configured
    expect(capturedOptions.extensions).toBeDefined();
    expect((capturedOptions.extensions as Extensions).length).toBeGreaterThan(0);
  });

  it('should include Placeholder extension when placeholder is provided', () => {
    renderHook(() => useEditor({ placeholder: 'Type here...' }));
    const extensions = capturedOptions.extensions as Extensions;
    // Default: Document + Paragraph + Text + Placeholder = 4
    expect(extensions.length).toBe(4);
  });

  it('should include only built-in extensions without placeholder', () => {
    renderHook(() => useEditor({}));
    const extensions = capturedOptions.extensions as Extensions;
    // Default: Document + Paragraph + Text = 3
    expect(extensions.length).toBe(3);
  });

  it('should merge consumer extensions with built-in', () => {
    const customExt = { name: 'custom' } as never;
    renderHook(() => useEditor({ extensions: [customExt] }));
    const extensions = capturedOptions.extensions as Extensions;
    // Document + Paragraph + Text + custom = 4
    expect(extensions.length).toBe(4);
  });

  it('should pass editable option to tiptap useEditor', () => {
    renderHook(() => useEditor({ editable: false }));
    expect(capturedOptions.editable).toBe(false);
  });

  it('should default editable to true', () => {
    renderHook(() => useEditor({}));
    expect(capturedOptions.editable).toBe(true);
  });

  it('should pass defaultValue as content', () => {
    renderHook(() => useEditor({ defaultValue: '<p>hello</p>' }));
    expect(capturedOptions.content).toBe('<p>hello</p>');
  });

  it('should pass autoFocus as autofocus', () => {
    renderHook(() => useEditor({ autoFocus: 'end' }));
    expect(capturedOptions.autofocus).toBe('end');
  });

  it('should wire onUpdate callback', () => {
    const onChange = vi.fn();
    renderHook(() => useEditor({ onChange }));
    expect(capturedOptions.onUpdate).toBeDefined();
    expect(typeof capturedOptions.onUpdate).toBe('function');
  });

  it('should wire lifecycle callbacks', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onCreate = vi.fn();
    const onDestroy = vi.fn();
    const onSelectionUpdate = vi.fn();

    renderHook(() =>
      useEditor({ onFocus, onBlur, onCreate, onDestroy, onSelectionUpdate }),
    );

    expect(typeof capturedOptions.onFocus).toBe('function');
    expect(typeof capturedOptions.onBlur).toBe('function');
    expect(typeof capturedOptions.onCreate).toBe('function');
    expect(typeof capturedOptions.onDestroy).toBe('function');
    expect(typeof capturedOptions.onSelectionUpdate).toBe('function');
  });

  it('should call onChange via onUpdate with content helpers', () => {
    const onChange = vi.fn();
    renderHook(() => useEditor({ onChange }));

    // Simulate tiptap firing onUpdate
    const onUpdate = capturedOptions.onUpdate as (props: { editor: TiptapEditor }) => void;
    act(() => {
      onUpdate({ editor: mockEditorInstance! });
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    const callArg = onChange.mock.calls[0][0];
    expect(callArg).toHaveProperty('html');
    expect(callArg).toHaveProperty('text');
    expect(callArg).toHaveProperty('json');
    expect(callArg).toHaveProperty('isEmpty');
  });
});
