import { TableCell as TiptapTableCell } from '@tiptap/extension-table-cell';
import { DEFAULT_BORDER_COLOR, DEFAULT_BORDER_WIDTH, DEFAULT_CELL_WIDTH } from '@/utils/table';

const TableCell = TiptapTableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      colwidth: {
        default: DEFAULT_CELL_WIDTH,
        parseHTML: element => {
          const colwidth = element.getAttribute('colwidth');
          const value = colwidth
            ? [parseInt(colwidth, 10)]
            : null;

          return value;
        },
        renderHTML: (attrs) => {
          if (!attrs.colwidth) return;
          return {
            colwidth: attrs.colwidth,
            style: `width: ${attrs.colwidth}px`,
          };
        },
      },
      borderTop: {
        default: `${DEFAULT_BORDER_WIDTH} solid ${DEFAULT_BORDER_COLOR}`,
        parseHTML: (ele) => {
          return ele.style.borderTop;
        },
        renderHTML: (attrs) => {
          if (!attrs.borderTop) return;
          return {
            style: `border-top: ${attrs.borderTop}`,
          };
        },
      },
      borderRight: {
        default: `${DEFAULT_BORDER_WIDTH} solid ${DEFAULT_BORDER_COLOR}`,
        parseHTML: (ele) => {
          return ele.style.borderRight;
        },
        renderHTML: (attrs) => {
          if (!attrs.borderRight) return;
          return {
            style: `border-right: ${attrs.borderRight}`,
          };
        },
      },
      borderBottom: {
        default: `${DEFAULT_BORDER_WIDTH} solid ${DEFAULT_BORDER_COLOR}`,
        parseHTML: (ele) => {
          return ele.style.borderBottom;
        },
        renderHTML: (attrs) => {
          if (!attrs.borderBottom) return;
          return {
            style: `border-bottom: ${attrs.borderBottom}`,
          };
        },
      },
      borderLeft: {
        default: `${DEFAULT_BORDER_WIDTH} solid ${DEFAULT_BORDER_COLOR}`,
        parseHTML: (ele) => {
          return ele.style.borderLeft;
        },
        renderHTML: (attrs) => {
          if (!attrs.borderLeft) return;
          return {
            style: `border-left: ${attrs.borderLeft}`,
          };
        },
      },
    };
  },
});

export default TableCell;
