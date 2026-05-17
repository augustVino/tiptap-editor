import { Editor, Extension } from '@tiptap/core';

export interface SubmitConfig {
  name?: string;
  onSubmit: () => void;
  shouldSubmit?: (editor: Editor) => boolean;
  isSuggestionActive?: (editor: Editor) => boolean;
}

function isMentionSuggestionActive(editor: Editor): boolean {
  return (editor.storage as Record<string, any>).mentionSuggestion?.active === true;
}

export function createSubmitExtension(config: SubmitConfig) {
  return Extension.create<SubmitConfig>({
    name: config.name ?? 'submitOnEnter',

    addOptions() {
      return {
        onSubmit: () => {},
        shouldSubmit: undefined,
        isSuggestionActive: undefined,
      };
    },

    addKeyboardShortcuts() {
      return {
        Enter: ({ editor }) => {
          const customCheck = config.isSuggestionActive;
          if (customCheck ? customCheck(editor) : isMentionSuggestionActive(editor)) {
            return false;
          }

          if (config.shouldSubmit && !config.shouldSubmit(editor)) {
            return false;
          }

          config.onSubmit();
          return true;
        },
        'Shift-Enter': () => {
          return this.editor.commands.first(({ commands }) => [
            () => commands.newlineInCode(),
            () => commands.createParagraphNear(),
            () => commands.liftEmptyBlock(),
            () => commands.splitBlock(),
          ]);
        },
      };
    },
  });
}
