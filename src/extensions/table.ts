import { Editor, mergeAttributes } from '@tiptap/core';
import { DOMOutputSpec } from '@tiptap/pm/model';
import { Table as TiptapTable } from '@tiptap/extension-table';
import TableRow from './table-row';
import TableHeader from './table-header';
import TableCell from './table-cell';
import TablePopover from '@/components/MenuCommands/TablePopover/index.vue';
import { createColGroup, tableAlign } from '@/utils/table';
import { TableView } from '@/components/ExtensionViews/TableView';
import { TableController } from '@/plugins/table';

const Table = TiptapTable.extend({
  content: 'tableRow+',
  selectable: true,
  // @ts-ignore
  addOptions() {
    return {
      ...this.parent?.(),
      View: TableView,
      button({ editor }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          component: TablePopover,
          componentProps: {
            editor,
          },
        };
      },
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      // 默认合并单元格
      borderCollapse: {
        default: 'collapse',
        renderHTML: (attrs) => {
          if (!attrs.borderCollapse) return;
          return {
            style: `border-collapse: ${attrs.borderCollapse}`,
          };
        },
      },
      // 对齐方式
      tableAlign: {
        default: 'left',
        parseHTML: (el) => {
          const {
            marginLeft,
            marginRight,
          } = el.style;
          if (marginLeft === 'auto' && marginRight === '0') {
            return 'left';
          } else if (marginLeft === 'auto' && marginRight === 'auto') {
            return 'center';
          } else if (marginLeft === '0' && marginRight === 'auto') {
            return 'right';
          } else {
            return 'left';
          }
        },
        renderHTML: (attrs) => {
          if (!attrs.tableAlign) return;
          return {
            // @ts-ignore
            style: `${tableAlign[attrs.tableAlign]}`,
          };
        },
      },
    };
  },
  renderHTML({
    node,
    HTMLAttributes,
  }) {
    const {
      colgroup,
      tableWidth,
      tableMinWidth,
    } = createColGroup(
      node,
      this.options.cellMinWidth,
    );
    const table: DOMOutputSpec = [
      'table',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style: tableWidth
          ? `width: ${tableWidth}`
          : `min-width: ${tableMinWidth}`,
      }),
      colgroup,
      ['tbody', 0],
    ];
    return table;
    // return [
    //   'table',
    //   mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    //   [
    //     'colgroup',
    //   ],
    //   ['tbody', 0],
    // ];
  },
  addProseMirrorPlugins() {
    // @ts-ignore
    return [...this.parent?.(), TableController(this.editor)];
  },
  addExtensions() {
    return [TableRow, TableHeader, TableCell];
  },
});

export default Table;
