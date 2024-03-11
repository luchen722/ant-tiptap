import { EditorState, Plugin, PluginKey, Transaction } from '@tiptap/pm/state';
import { cellAround, pointsAtCell, TableMap } from '@tiptap/pm/tables';
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view';
import { Editor } from '@tiptap/core';

// function cellAround($pos: ResolvedPos): ResolvedPos | null {
//   for (let d = $pos.depth - 1; d > 0; d--) {
//     if ($pos.node(d).type.spec.tableRole == 'row') {
//       return $pos.node(0).resolve($pos.before(d + 1));
//     }
//   }
//   return null;
// }

export const TableControllerPluginKey = new PluginKey('TableControllerPluginKey');

export class ControllerState {
  /**
   * @param activeHandle -1表示光标不在表格中
   * @param focused
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(public activeHandle: number, public focused: number) {
  }

  apply(tr: Transaction): ControllerState {
    const state = this;
    const action = tr.getMeta(TableControllerPluginKey);
    if (action && action.setHandle !== null) {
      return new ControllerState(action.setHandle || state.activeHandle, action.setFocused || state.focused);
    }
    if (tr.docChanged && state.activeHandle > -1) {
      let handle = tr.mapping.map(state.activeHandle, -1);
      if (!pointsAtCell(tr.doc.resolve(handle))) {
        handle = -1;
      }
      return new ControllerState(handle, 0);
    }
    return state;
  }
}

function handleDecorations(
  state: EditorState,
  cell: number,
): DecorationSet {
  const decorations: Decoration[] = [];
  const $cell = state.doc.resolve(cell);
  const table = $cell.node(-1);

  if (!table) {
    return DecorationSet.empty;
  }
  // const map = TableMap.get(table);
  // const start = $cell.start(-1);
  // const col = map.colCount($cell.pos - start) + $cell.nodeAfter!.attrs.colspan;
  // for (let row = 0; row < map.height; row++) {
  //   const index = col + row * map.width - 1;
  //   // For positions that have either a different cell or the end
  //   // of the table to their right, and either the top of the table or
  //   // a different cell above them, add a decoration
  //   if (
  //     (col == map.width || map.map[index] != map.map[index + 1]) &&
  //     (row == 0 || map.map[index] != map.map[index - map.width])
  //   ) {
  //     const cellPos = map.map[index];
  //     const pos = start + cellPos + table.nodeAt(cellPos)!.nodeSize - 1;
  //     // const dom = document.createElement('div');
  //     // dom.className = 'column-resize-handle1';
  //     // decorations.push(Decoration.widget(pos, dom));
  //   }
  // }
  return DecorationSet.create(state.doc, decorations);
}

function updateHandle(view: EditorView, value: number, focused: number): void {
  view.dispatch(
    view.state.tr.setMeta(TableControllerPluginKey, {
      setHandle: value,
      setFocused: focused,
    }),
  );
}

export function TableController(editor: Editor) {
  return new Plugin<ControllerState>({
    key: TableControllerPluginKey,
    state: {
      init() {
        return new ControllerState(-1, -1);
      },
      // @ts-ignore
      apply(tr, prev) {
        return prev.apply(tr);
      },
    },
    props: {
      // attributes: (state): Record<string, string> => {
      //   const pluginState = TableControllerPluginKey.getState(state);
      //   console.log(pluginState, 'attributes pluginState');
      //   return {};
      // },
      handleDOMEvents: {
        mousedown: (view, event) => {
          handleMouseDown(editor, view, event);
        },
      },
      decorations: (state) => {
        const pluginState = TableControllerPluginKey.getState(state);
        if (pluginState && pluginState.activeHandle > -1 && pluginState.focused > -1) {
          return handleDecorations(state, pluginState.activeHandle);
        }
      },
    },
  });
}

function handleMouseDown(
  editor: Editor,
  view: EditorView,
  event: MouseEvent,
): boolean {
  const eventTarget = event.target as HTMLElement;
  const target = domCellAround(eventTarget);
  const currentTable = getTable(eventTarget);
  const tableAll = getAllTable(eventTarget);
  let focused = -1;
  // eslint-disable-next-line no-unused-expressions
  tableAll?.forEach((table) => {
    table.classList.remove('current-table-focused');
    focused = -1;
  });
  if (eventTarget?.classList.contains('tableWrapper')) {
    if (eventTarget.children[0].nodeName === 'TABLE') {
      eventTarget.children[0].classList.add('current-table-focused');
    }
  }
  if (currentTable) {
    currentTable.classList.add('current-table-focused');
    focused = 1;
  }
  let cell = -1;
  if (target) {
    cell = edgeCell(view, event);
    const pluginState = TableControllerPluginKey.getState(view.state);
    if (cell !== pluginState.activeHandle) {
      if (cell !== -1) {
        const $cell = view.state.doc.resolve(cell);
        const table = $cell.node(-1);
        const map = TableMap.get(table);
        const tableStart = $cell.start(-1);
        // 当前列索引
        const col =
          map.colCount($cell.pos - tableStart) +
          $cell.nodeAfter!.attrs.colspan -
          1;
        if (col === map.width - 1) {
          // @ts-ignore
          return;
        }
      }
    }
  }
  updateHandle(view, cell, focused);
  return true;
}

// 获取所有表格
function getAllTable(target: HTMLElement | null): HTMLElement[] | null {
  let tableAll: HTMLElement[];
  let editorWarpper;
  if (target) {
    do {
      if (target?.classList?.contains('ProseMirror')) {
        editorWarpper = target;
      }
      target = target.parentNode as HTMLElement;
    } while (target && !target?.classList?.contains('el-tiptap-editor__content'));
  }
  // eslint-disable-next-line prefer-const
  tableAll = editorWarpper?.querySelectorAll('table') as HTMLElement[] | undefined || [] as HTMLElement[];

  return tableAll;
}

// 获取表格
function getTable(target: HTMLElement | null): HTMLElement | null {
  while (target && target.nodeName !== 'TABLE') {
    target =
      target.classList && target.classList.contains('ProseMirror')
        ? null
        : (target.parentNode as HTMLElement);
  }
  return target;
}

function domCellAround(target: HTMLElement | null): HTMLElement | null {
  while (target && target.nodeName !== 'TD' && target.nodeName !== 'TH') {
    target =
      target.classList && target.classList.contains('ProseMirror')
        ? null
        : (target.parentNode as HTMLElement);
  }
  return target;
}

function edgeCell(
  view: EditorView,
  event: MouseEvent,
): number {
  // posAtCoords returns inconsistent positions when cursor is moving
  // across a collapsed table border. Use an offset to adjust the
  // target viewport coordinates away from the table border.
  const offset = 5;
  const found = view.posAtCoords({
    left: event.clientX + offset,
    top: event.clientY,
  });
  if (!found) return -1;
  const { pos } = found;
  const $cell = cellAround(view.state.doc.resolve(pos));
  if (!$cell) return -1;
  return $cell.pos;
  // const map = TableMap.get($cell.node(-1));
  // const start = $cell.start(-1);
  // const index = map.map.indexOf($cell.pos - start);
  // return index % map.width === 0 ? -1 : start + map.map[index - 1];
}
