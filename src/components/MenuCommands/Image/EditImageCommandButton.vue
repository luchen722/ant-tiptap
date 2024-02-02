<template>
  <div>
    <command-button
      :command="openEditImageDialog"
      :enable-tooltip="enableTooltip"
      :tooltip="t('editor.extensions.Image.buttons.image_options.tooltip')"
      icon="ellipsis-h"
    />
    <a-modal
      v-model:open="editImageDialogVisible"
      :zIndex="9999"
      :title="t('editor.extensions.Image.control.edit_image.title')"
      :cancelText="t('editor.extensions.Image.control.edit_image.cancel')"
      :okText="t('editor.extensions.Image.control.edit_image.confirm')"
      @ok="updateImageAttrs"
    >
      <a-form :model="imageAttrs" label-position="top" size="small">
        <a-form-item
          :label="t('editor.extensions.Image.control.edit_image.form.src')"
        >
          <a-input :value="imageAttrs.src" autocomplete="off" disabled />
        </a-form-item>

        <a-form-item
          :label="t('editor.extensions.Image.control.edit_image.form.alt')"
        >
          <a-input v-model:value="imageAttrs.alt" autocomplete="off" />
        </a-form-item>

        <a-form-item>
          <a-col :span="11">
            <a-form-item
              :label="
                t('editor.extensions.Image.control.edit_image.form.width')
              "
            >
              <a-input-number v-model:value="imageAttrs.width" />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item
              :label="
                t('editor.extensions.Image.control.edit_image.form.height')
              "
            >
              <a-input-number v-model:value="imageAttrs.height" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item
              :label="
                t('editor.extensions.Image.control.edit_image.form.description')
              "
            >
              <a-input v-model:value="imageAttrs.description" />
            </a-form-item>
          </a-col>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { nodeViewProps } from '@tiptap/vue-3';
import { Modal, Input, InputNumber, Form, FormItem, Col } from 'ant-design-vue';
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
    node: nodeViewProps.node,
    updateAttrs: nodeViewProps.updateAttributes,
  },

  data() {
    return {
      editImageDialogVisible: false,

      imageAttrs: this.getImageAttrs(),
    };
  },

  setup() {
    const t = inject('t');
    const enableTooltip = inject('enableTooltip', true);

    return { t, enableTooltip };
  },
  mounted() {
    console.log(this.imageAttrs);
  },
  methods: {
    syncImageAttrs() {
      this.imageAttrs = this.getImageAttrs();
    },

    getImageAttrs() {
      return {
        src: this.node!.attrs.src,
        alt: this.node!.attrs.alt,
        width: this.node!.attrs.width,
        height: this.node!.attrs.height,
        description: this.node.attrs?.description,
      };
    },

    updateImageAttrs() {
      let { width, height } = this.imageAttrs;

      // input converts it to string
      width = parseInt(width as string, 10);
      height = parseInt(height as string, 10);

      this.updateAttrs!({
        alt: this.imageAttrs.alt,
        width: width >= 0 ? width : null,
        height: height >= 0 ? height : null,
        description: this.imageAttrs.description,
      });

      this.closeEditImageDialog();
    },

    openEditImageDialog() {
      this.editImageDialogVisible = true;
    },

    closeEditImageDialog() {
      this.editImageDialogVisible = false;
    },
  },
});
</script>
