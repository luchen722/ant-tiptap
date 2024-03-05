import { mergeCells, splitCell } from '@tiptap/pm/tables';
import { EditorState } from '@tiptap/pm/state';
import { DOMOutputSpec, Node as ProseMirrorNode } from '@tiptap/pm/model';

export function getTableNode(state: EditorState) {
  const {
    doc,
  } = state;
  let currentTableNode = null;
  let currentTablePos: number;
  doc.descendants((node, pos) => {
    if (node.type.name === 'table') {
      currentTableNode = node;
      currentTablePos = pos;
    }
  });
  return {
    node: currentTableNode,
    pos: currentTablePos,
  };
}

export function isTableActive(state: EditorState): boolean {
  const {
    selection,
    doc,
  } = state;
  const {
    from,
    to,
  } = selection;

  let keepLooking = true;
  let active = false;
  doc.nodesBetween(from, to, (node) => {
    const name = node.type.name;
    if (
      keepLooking &&
      (name === 'table' ||
        name === 'table_row' ||
        name === 'table_column' ||
        name === 'table_cell')
    ) {
      keepLooking = false;
      active = true;
    }
    return keepLooking;
  });

  return active;
}

export function enableMergeCells(state: EditorState): boolean {
  return isTableActive(state) && mergeCells(state);
}

export function enableSplitCell(state: EditorState): boolean {
  return isTableActive(state) && splitCell(state);
}

/**
 * Creates a colgroup element for a table node in ProseMirror.
 *
 * @param node - The ProseMirror node representing the table.
 * @param cellMinWidth - The minimum width of a cell in the table.
 * @param overrideCol - (Optional) The index of the column to override the width of.
 * @param overrideValue - (Optional) The width value to use for the overridden column.
 * @returns An object containing the colgroup element, the total width of the table, and the minimum width of the table.
 */
export function createColGroup(
  node: ProseMirrorNode,
  cellMinWidth: number,
  overrideCol?: number,
  overrideValue?: any,
) {
  let totalWidth = 0;
  let fixedWidth = true;
  const cols: DOMOutputSpec[] = [];
  const row = node.firstChild;

  if (!row) {
    return {};
  }

  for (let i = 0, col = 0; i < row.childCount; i += 1) {
    const {
      colspan,
      colwidth,
    } = row.child(i).attrs;

    for (let j = 0; j < colspan; j += 1, col += 1) {
      const hasWidth = overrideCol === col ? overrideValue : colwidth && colwidth[j];
      const cssWidth = hasWidth ? `${hasWidth}px` : '';

      totalWidth += hasWidth || cellMinWidth;
      if (!hasWidth) {
        fixedWidth = false;
      }
      cols.push(['col', cssWidth ? { style: `width: ${cssWidth}` } : {}]);
    }
  }
  const tableWidth = fixedWidth ? `${totalWidth}px` : '';
  const tableMinWidth = fixedWidth ? '' : `${totalWidth}px`;

  const colgroup: DOMOutputSpec = ['colgroup', {}, ...cols];

  return {
    colgroup,
    tableWidth,
    tableMinWidth,
  };
}

export const tableAlign: { left: string, center: string, right: string } = {
  left: 'margin-left: 0;margin-right: auto',
  center: 'margin: 0 auto;',
  right: 'margin-left: auto;margin-right: 0',
};

export const DEFAULT_CELL_WIDTH = 60;
export const DEFAULT_ROW_HEIGHT = '30px';
export const DEFAULT_BORDER_WIDTH = '1px';
export const DEFAULT_BORDER_COLOR = 'rgba(0,0,0,.1)';
