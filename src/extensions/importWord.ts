import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import { handleImportWordChange2 } from '@/utils/importWord.ts';
import CommandButton from '@/components/MenuCommands/CommandButton.vue';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ImportWord: {
      /**
       * print the editor content
       */
      importWord: () => ReturnType;
    };
  }
}

const ImportWord = Extension.create({
  name: 'ImportWord',

  addOptions() {
    return {
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          component: CommandButton,
          componentProps: {
            command: () => {
              editor.commands.importWord();
            },
            icon: 'import-word',
            tooltip: t('editor.extensions.Print.tooltip'),
          },
        };
      },
    };
  },

  addCommands() {
    return {
      importWord:
        () =>
          ({ editor }) => {
            return handleImportWordChange2(editor);
          },
    };
  },
});

export default ImportWord;
