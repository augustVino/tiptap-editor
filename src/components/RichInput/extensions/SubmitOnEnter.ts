import { Editor, Extension } from '@tiptap/core';

function isMentionActive(editor: Editor) {
  // 检查是否有mention列表处于活动状态
  let hasMentionActive = false;

  // 从editor.state中检查是否有活动的suggestion
  // 遍历所有插件的状态
  const plugins = editor.state.plugins || [];

  for (const plugin of plugins) {
    if (!plugin.spec.key) continue;

    // 获取插件状态
    const state = plugin.spec.key.getState(editor.state);

    // 检查是否是suggestion插件且处于活动状态
    if (state && typeof state === 'object' && 'active' in state) {
      if (state.active === true) {
        hasMentionActive = true;
        break;
      }
    }
  }
  return hasMentionActive;
}

export const SubmitOnEnter = Extension.create({
  name: 'submitOnEnter',

  priority: 1000, // Higher priority to override default Enter behavior

  addOptions() {
    return {
      onSubmit: () => {}
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }: { editor: Editor }) => {
        const hasMentionActive = isMentionActive(editor);

        // 如果有mention列表处于活动状态，不拦截Enter键事件
        if (hasMentionActive) {
          return false;
        }

        // 如果没有mention列表处于活动状态，调用onSubmit回调
        this.options.onSubmit();

        return true; // 阻止默认行为
      },
      'Shift-Enter': () => {
        // 换行
        const flag = this.editor.commands.first(({ commands }) => [
          () => commands.newlineInCode(),
          () => commands.createParagraphNear(),
          () => commands.liftEmptyBlock(),
          () => commands.splitBlock()
        ]);
        return flag;
      }
    };
  }
});
