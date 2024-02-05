import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import CommandButton from '@/components/MenuCommands/CommandButton.vue';
import { createIndentCommand, IndentProps } from '@/utils/indent';
import { TextIndentProps } from '@/utils/text-indent';
export interface IndentOptions {
  types: string[];
  minIndent: number;
  maxIndent: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textIndent: {
      /**
       * Set the indent attribute
       */
      indent: () => ReturnType;
      /**
       * Set the outdent attribute
       */
      outdent: () => ReturnType;
    };
  }
}

const Indent = Extension.create<IndentOptions>({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'blockquote'],
      minIndent: IndentProps.min,
      maxIndent: IndentProps.max,
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return [
          {
            component: CommandButton,
            componentProps: {
              command: () => {
                editor.commands.indent();
              },
              icon: 'text-indent',
              tooltip: t('editor.extensions.Indent.buttons.indent.tooltip'),
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
              const identAttr = element.getAttribute('data-text-indent');
              return (identAttr ? parseInt(identAttr, 10) : 0) || 0;
            },
            renderHTML: (attributes) => {
              if (!attributes.textIndent) {
                return {};
              }

              return { 'data-text-indent': attributes.textIndent };
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
            let currentIndent = node.attrs.indent || 0;
            const newIndent = currentIndent >= 0 ? ++currentIndent : 0;
            tr.setNodeMarkup(pos, null, {
              ...node.attrs,
              indent: newIndent
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
            let currentIndent = node.attrs.indent || 0;
            const newIndent = currentIndent >= 0 ? --currentIndent : 0;
            tr.setNodeMarkup(pos, null, {
              ...node.attrs,
              indent: newIndent
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

export default Indent;
