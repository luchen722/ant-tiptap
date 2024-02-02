<template>
  <a-popover
    v-model:open="popoverVisible"
    placement="right"
    trigger="hover"
    popper-class="el-tiptap-popper"
    @after-leave="resetTableGridSize"
  >
    <template #content>
      <div class="table-grid-size-editor">
        <div class="table-grid-size-editor__body">
          <div
            v-for="row in tableGridSize.row"
            :key="'r' + row"
            class="table-grid-size-editor__row"
          >
            <div
              v-for="col in tableGridSize.col"
              :key="'c' + col"
              :class="{
                'table-grid-size-editor__cell--selected':
                  col <= selectedTableGridSize.col &&
                  row <= selectedTableGridSize.row,
              }"
              class="table-grid-size-editor__cell"
              @mouseover="selectTableGridSize(row, col)"
              @mousedown="confirmCreateTable(row, col)"
            >
              <div class="table-grid-size-editor__cell__inner" />
            </div>
          </div>
        </div>

        <div class="table-grid-size-editor__footer">
          {{ selectedTableGridSize.row }} X {{ selectedTableGridSize.col }}
        </div>
      </div>
    </template>
    <div>
      {{ t('editor.extensions.Table.buttons.insert_table') }}
    </div>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { Popover } from 'ant-design-vue';

const INIT_GRID_SIZE = 5;
const MAX_GRID_SIZE = 10;
const DEFAULT_SELECTED_GRID_SIZE = 2;

interface GridSize {
  row: number;
  col: number;
}

export default defineComponent({
  name: 'CreateTablePopover',

  components: {
    APopover: Popover,
  },

  setup(_, { emit }) {
    const t = inject('t');

    const popoverVisible = ref(false);

    const confirmCreateTable = (row: number, col: number) => {
      popoverVisible.value = false;
      emit('createTable', { row, col });
    };

    return { t, popoverVisible, confirmCreateTable };
  },

  data() {
    return {
      tableGridSize: {
        row: INIT_GRID_SIZE,
        col: INIT_GRID_SIZE,
      },
      selectedTableGridSize: {
        row: DEFAULT_SELECTED_GRID_SIZE,
        col: DEFAULT_SELECTED_GRID_SIZE,
      },
    };
  },

  methods: {
    selectTableGridSize(row: number, col: number): void {
      if (row === this.tableGridSize.row) {
        this.tableGridSize.row = Math.min(row + 1, MAX_GRID_SIZE);
      }

      if (col === this.tableGridSize.col) {
        this.tableGridSize.col = Math.min(col + 1, MAX_GRID_SIZE);
      }

      this.selectedTableGridSize.row = row;
      this.selectedTableGridSize.col = col;
    },

    resetTableGridSize() {
      this.tableGridSize = {
        row: INIT_GRID_SIZE,
        col: INIT_GRID_SIZE,
      };

      this.selectedTableGridSize = {
        row: DEFAULT_SELECTED_GRID_SIZE,
        col: DEFAULT_SELECTED_GRID_SIZE,
      };
    },
  },
});
</script>
