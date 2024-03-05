<template>
  <div>
    <command-button
      :command="openEditImageDialog"
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
      @ok="updateImageAttrs"
    >
      <a-form :model="tableAttrs" label-position="top" size="small">
        <a-form-item
          :label="t('editor.extensions.Image.control.edit_image.form.src')"
        >
          <a-input :value="tableAttrs.src" autocomplete="off" />
        </a-form-item>

        <a-form-item
          :label="t('editor.extensions.Image.control.edit_image.form.alt')"
        >
          <a-input v-model:value="tableAttrs.alt" autocomplete="off" />
        </a-form-item>

        <a-form-item>
          <a-col>
            <a-row>
              <a-col :span="11">
                <a-form-item
                  :label="
                    t('editor.extensions.Image.control.edit_image.form.width')
                  "
                >
                  <a-input-number v-model:value="tableAttrs.width" />
                </a-form-item>
              </a-col>
              <a-col :span="11">
                <a-form-item
                  :label="
                    t('editor.extensions.Image.control.edit_image.form.height')
                  "
                >
                  <a-input-number v-model:value="tableAttrs.height" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="24">
            <a-row>
              <a-col :span="11">
                <a-form-item :label="t('editor.extensions.Image.control.edit_image.form.align')">
                  <a-select v-model:value="tableAttrs.align" :getPopupContainer="tirggerNode => tirggerNode.parentNode">
                    <a-select-option value="left">{{ t('editor.extensions.Image.buttons.align.left') }}
                    </a-select-option>
                    <a-select-option value="center">{{ t('editor.extensions.Image.buttons.align.center') }}
                    </a-select-option>
                    <a-select-option value="right">{{ t('editor.extensions.Image.buttons.align.right') }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="24">
            <a-form-item
              :label="
                t('editor.extensions.Image.control.edit_image.form.description')
              "
            >
              <a-input v-model:value="tableAttrs.description" :maxlength="30" />
            </a-form-item>
          </a-col>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { Editor } from '@tiptap/vue-3';
import { Col, Form, FormItem, Input, InputNumber, Modal } from 'ant-design-vue';
import CommandButton from '../CommandButton.vue';

export default defineComponent({
  components: {
    AModal: Modal,
    AInput: Input,
    AInputNumber: InputNumber,
    AForm: Form,
    AFormItem: FormItem,
    ACol: Col,
    CommandButton,
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
    syncImageAttrs() {
      this.tableAttrs = this.getImageAttrs();
    },

    getImageAttrs() {
      console.log(this.editor.state);
      console.log(this.editor.getAttributes('table'));
      console.log(this.editor.getAttributes('tableCell'));

      console.log(this.editor.getAttributes('tableRow'));

      return {};
    },

    updateImageAttrs() {
      this.closeEditImageDialog();
    },

    openEditImageDialog() {
      this.editTableDialogVisible = true;
      this.syncImageAttrs();
    },

    closeEditImageDialog() {
      this.editTableDialogVisible = false;
    },
  },
});
</script>

<style scoped lang="scss">

</style>
