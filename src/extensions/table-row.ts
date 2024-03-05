import { TableRow as TiptapTableRow } from '@tiptap/extension-table-row';
import { DEFAULT_ROW_HEIGHT } from '@/utils/table';

const TableRow = TiptapTableRow.extend({
  addAttributes() {
    return {
      height: {
        default: DEFAULT_ROW_HEIGHT,
        parseHTML: (element) => {
          return element.style.height || DEFAULT_ROW_HEIGHT;
        },
        renderHTML: (attrs) => {
          return {
            style: `height: ${attrs.height}`,
          };
        },
      },
    };
  },
});

export default TableRow;
