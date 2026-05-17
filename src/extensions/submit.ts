import { Editor, Extension } from '@tiptap/core';

export interface SubmitConfig {
  onSubmit: () => void;
  shouldSubmit?: (editor: Editor) => boolean;
}

function isSuggestionActive(editor: Editor): boolean {
  return (editor.storage as Record<string, any>).mentionSuggestion?.active === true;
}

export function createSubmitExtension(config: SubmitConfig) {
  return Extension.create<SubmitConfig>({
    name: 'submitOnEnter',

    addOptions() {
      return {
        onSubmit: () => {},
        shouldSubmit: undefined,
      };
    },

    addKeyboardShortcuts() {
      return {
        Enter: ({ editor }) => {
          if (isSuggestionActive(editor)) {
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
