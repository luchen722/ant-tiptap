import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import CommandButton from '@/components/MenuCommands/CommandButton.vue';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textIndent: {
      /**
       * Set the indent attribute
       */
      textIndent: () => ReturnType;
      /**
       * Set the outdent attribute
       */
      textOutdent: () => ReturnType;
    };
  }
}
const IS_NUMBER_VALUE_REGEXP = /^\d+(.\d+)?$/;
const TextIndent = Extension.create({
  name: 'TextIndent',

  addOptions() {
    return {
      types: ['paragraph'],
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return [
          {
            component: CommandButton,
            componentProps: {
              command: () => {
                editor.commands.textIndent();
              },
              icon: 'text-indent',
              tooltip: t('editor.extensions.TextIndent.buttons.indent.tooltip'),
            },
          }
        ];
      },
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textIndent: {
            default: 0,
            parseHTML: (element) => {
              const identAttr = element.getAttribute('data-text-indent') || element.style.textIndent;
              const textIndent = (IS_NUMBER_VALUE_REGEXP.test(identAttr) ? parseInt(identAttr, 10) : identAttr) || 0;

              return textIndent;
            },
            renderHTML: (attributes) => {
              if (!attributes.textIndent) {
                return {};
              }
              let textIndent = attributes.textIndent;
              if (textIndent < 0) {
                textIndent = 0;
              }
              return { 'data-text-indent': textIndent, style: IS_NUMBER_VALUE_REGEXP.test(textIndent) ? `text-indent: ${textIndent * 2}em` : `text-indent: ${textIndent}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      textIndent: () => (arg) => {
        const { state, dispatch } = arg;
        const { selection } = state;
        const { from, to } = selection;
        const tr = state.tr;
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (node.isBlock) {
            let currentIndent = node.attrs.textIndent || 0;
            const newIndent = currentIndent >= 0 ? ++currentIndent : 0;
            tr.setNodeMarkup(pos, null, {
              ...node.attrs,
              textIndent: newIndent
            });
          }
        });

        if (tr.docChanged) {
          dispatch && dispatch(tr);
          return true;
        }
        return false;
      },
      textOutdent: () => (arg) => {
        const { state, dispatch } = arg;
        const { selection } = state;
        const { from, to } = selection;
        const tr = state.tr;
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (node.isBlock) {
            let currentIndent = node.attrs.textIndent || 0;
            const newIndent = currentIndent >= 0 ? --currentIndent : 0;
            tr.setNodeMarkup(pos, null, {
              ...node.attrs,
              textIndent: newIndent
            });
          }
        });

        if (tr.docChanged) {
          dispatch && dispatch(tr);
          return true;
        }
        return false;
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      Tab: () => this.editor.commands.textIndent(),
      'Shift-Tab': () => this.editor.commands.textOutdent(),
    };
  },
});

export default TextIndent;
