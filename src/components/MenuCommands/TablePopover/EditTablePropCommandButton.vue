<template>
  <div>
    <command-button
      :command="openEditTableDialog"
      :enable-tooltip="enableTooltip"
      :tooltip="t('editor.extensions.Table.buttons.table_prop')"
      icon="ellipsis-h"
    />
    <a-modal
      v-model:open="editTableDialogVisible"
      :zIndex="9999"
      :title="t('editor.extensions.Table.control.edit_table.title')"
      :cancelText="t('editor.extensions.Table.control.edit_table.cancel')"
      :okText="t('editor.extensions.Table.control.edit_table.confirm')"
      @ok="updateTableAttrs"
    >
      <a-form :model="tableAttrs" label-position="top" size="small">
        <a-row>
          <a-col :span="11">
            <a-form-item
              :label="t('editor.extensions.Table.control.edit_table.form.colwidth')"
            >
              <a-input v-model:value.number="tableAttrs.colwidth" addon-after="px" />
            </a-form-item>
          </a-col>
          <a-col :span="11" :offset="2">
            <a-form-item
              :label="t('editor.extensions.Table.control.edit_table.form.rowheight')"
            >
              <a-input v-model:value.number="tableAttrs.height" addon-after="px" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item
          :label="t('editor.extensions.Table.control.edit_table.form.tableAlign.title')"
        >
          <a-select v-model:value="tableAttrs.tableAlign" :getPopupContainer="(trigger) => trigger.parentNode">
            <a-select-option value="left">
              {{ t('editor.extensions.Table.control.edit_table.form.tableAlign.left') }}
            </a-select-option>
            <a-select-option value="center">
              {{ t('editor.extensions.Table.control.edit_table.form.tableAlign.center') }}
            </a-select-option>
            <a-select-option value="right">
              {{ t('editor.extensions.Table.control.edit_table.form.tableAlign.right') }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import {
  Col,
  Form,
  FormItem,
  Input,
  InputNumber,
  Modal,
  Select as ASelect,
  SelectOption as ASelectOption,
} from 'ant-design-vue';
import CommandButton from '../CommandButton.vue';
import { Editor } from '@tiptap/vue-3';

export default defineComponent({
  components: {
    AModal: Modal,
    AInput: Input,
    AInputNumber: InputNumber,
    AForm: Form,
    AFormItem: FormItem,
    ACol: Col,
    CommandButton,
    ASelect,
    ASelectOption,
  },

  props: {
    editor: {
      type: Editor,
      required: true,
    },
  },

  data() {
    return {
      editTableDialogVisible: false,

      tableAttrs: {},
    };
  },

  setup() {
    const t = inject('t');
    const enableTooltip = inject('enableTooltip', true);

    return {
      t,
      enableTooltip,
    };
  },
  mounted() {
  },
  methods: {
    syncTableAttrs() {
      const attrs = this.getTableAttrs();
      if (attrs) {
        this.tableAttrs = {
          ...attrs,
          colwidth: Array.isArray(attrs.colwidth) ? attrs.colwidth[0] : attrs.colwidth,
          height: attrs.height ? parseFloat(attrs.height) : undefined,
        };
      }
    },

    getTableAttrs() {
      return {
        ...this.editor.getAttributes('table'),
        ...this.editor.getAttributes('tableCell'),
        ...this.editor.getAttributes('tableRow'),
      };
    },

    updateTableAttrs() {
      const attr = {
        ...this.tableAttrs,
        colwidth: [this.tableAttrs.colwidth],
        height: this.tableAttrs.height ? this.tableAttrs.height + 'px' : undefined,
      };
      this.editor.commands.updateAttributes('table', attr);
      this.editor.commands.updateAttributes('tableCell', attr);
      this.editor.commands.updateAttributes('tableHeader', attr);
      this.editor.commands.updateAttributes('tableRow', attr);
      this.closeEditTableDialog();
    },

    openEditTableDialog() {
      this.editTableDialogVisible = true;
      this.syncTableAttrs();
    },

    closeEditTableDialog() {
      this.editTableDialogVisible = false;
    },
  },
});
</script>

<style scoped lang="scss">

</style>
