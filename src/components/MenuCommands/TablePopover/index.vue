<template>
  <a-popover
    v-model:open="open"
    :disabled="isCodeViewMode"
    placement="bottom"
    trigger="click"
    popper-class="el-tiptap-popper"
  >
    <template #content>
      <div class="el-tiptap-popper__menu">
        <div class="el-tiptap-popper__menu__item">
          <create-table-popover @createTable="createTable" />
        </div>

        <div class="el-tiptap-popper__menu__item__separator" />

        <div
          :class="{ 'el-tiptap-popper__menu__item--disabled': !isTableActive }"
          class="el-tiptap-popper__menu__item"
          @mousedown="hidePopover"
          @click="editor.commands.addColumnBefore"
        >
          <span>{{
            t('editor.extensions.Table.buttons.add_column_before')
          }}</span>
        </div>

        <div
          :class="{ 'el-tiptap-popper__menu__item--disabled': !isTableActive }"
          class="el-tiptap-popper__menu__item"
          @mousedown="hidePopover"
          @click="editor.commands.addColumnAfter"
        >
          <span>{{ t('editor.extensions.Table.buttons.add_column_after') }}</span>
        </div>

        <div
          :class="{ 'el-tiptap-popper__menu__item--disabled': !isTableActive }"
          class="el-tiptap-popper__menu__item"
          @mousedown="hidePopover"
          @click="editor.commands.deleteColumn"
        >
          <span>{{ t('editor.extensions.Table.buttons.delete_column') }}</span>
        </div>

        <div class="el-tiptap-popper__menu__item__separator" />

        <div
          :class="{ 'el-tiptap-popper__menu__item--disabled': !isTableActive }"
          class="el-tiptap-popper__menu__item"
          @mousedown="hidePopover"
          @click="editor.commands.addRowBefore"
        >
          <span>{{ t('editor.extensions.Table.buttons.add_row_before') }}</span>
        </div>

        <div
          :class="{ 'el-tiptap-popper__menu__item--disabled': !isTableActive }"
          class="el-tiptap-popper__menu__item"
          @mousedown="hidePopover"
          @click="editor.commands.addRowAfter"
        >
          <span>{{ t('editor.extensions.Table.buttons.add_row_after') }}</span>
        </div>

        <div
          :class="{ 'el-tiptap-popper__menu__item--disabled': !isTableActive }"
          class="el-tiptap-popper__menu__item"
          @mousedown="hidePopover"
          @click="editor.commands.deleteRow"
        >
          <span>{{ t('editor.extensions.Table.buttons.delete_row') }}</span>
        </div>

        <div class="el-tiptap-popper__menu__item__separator" />

        <div
          :class="{ 'el-tiptap-popper__menu__item--disabled': !enableMergeCells }"
          class="el-tiptap-popper__menu__item"
          @mousedown="hidePopover"
          @click="editor.commands.mergeCells"
        >
          <span>{{ t('editor.extensions.Table.buttons.merge_cells') }}</span>
        </div>

        <div
          :class="{ 'el-tiptap-popper__menu__item--disabled': !enableSplitCell }"
          class="el-tiptap-popper__menu__item"
          @mousedown="hidePopover"
          @click="editor.commands.splitCell"
        >
          <span>{{ t('editor.extensions.Table.buttons.split_cell') }}</span>
        </div>

        <div class="el-tiptap-popper__menu__item__separator" />

        <div
          :class="{ 'el-tiptap-popper__menu__item--disabled': !isTableActive }"
          class="el-tiptap-popper__menu__item"
          @mousedown="hidePopover"
          @click="editor.commands.deleteTable"
        >
          <span>{{ t('editor.extensions.Table.buttons.delete_table') }}</span>
        </div>
      </div>
    </template>
    <span>
      <command-button
        :is-active="isTableActive"
        :enable-tooltip="enableTooltip"
        :tooltip="t('editor.extensions.Table.tooltip')"
        :readonly="isCodeViewMode"
        icon="table"
      />
    </span>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { Editor } from '@tiptap/vue-3';
import { Popover } from 'ant-design-vue';
import {
  isTableActive,
  enableMergeCells,
  enableSplitCell,
} from '@/utils/table';
import CommandButton from '../CommandButton.vue';
import CreateTablePopover from './CreateTablePopover.vue';

export default defineComponent({
  name: 'TablePopover',

  components: {
    APopover: Popover,
    CommandButton,
    CreateTablePopover,
  },

  props: {
    editor: {
      type: Editor,
      required: true,
    },
  },

  setup() {
    const t = inject('t');
    const enableTooltip = inject('enableTooltip', true);
    const isCodeViewMode = inject('isCodeViewMode', false);

    const open = ref(false);

    const hidePopover = () => {
      open.value = false;
    };

    return { t, enableTooltip, isCodeViewMode, open, hidePopover };
  },

  computed: {
    isTableActive() {
      return isTableActive(this.editor.state);
    },

    enableMergeCells() {
      return enableMergeCells(this.editor.state);
    },

    enableSplitCell() {
      return enableSplitCell(this.editor.state);
    },
  },

  methods: {
    createTable({ row, col }: { row: number; col: number }): void {
      this.editor.commands.insertTable({
        rows: row,
        cols: col,
        withHeaderRow: true,
      });

      this.hidePopover();
    },
  },
});
</script>
