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
        <div class="el-tiptap-popper__menu__item" @click="openUrlPrompt">
          <span>{{
            t('editor.extensions.Image.buttons.insert_image.external')
          }}</span>
        </div>

        <div
          class="el-tiptap-popper__menu__item"
          @click="openUploadModal"
        >
          <span>{{
            t('editor.extensions.Image.buttons.insert_image.upload')
          }}</span>
        </div>
      </div>
    </template>
    <span>
      <command-button
        :enable-tooltip="enableTooltip"
        :tooltip="t('editor.extensions.Image.buttons.insert_image.tooltip')"
        :readonly="isCodeViewMode"
        icon="image"
      />
    </span>

    <a-modal
      :zIndex="9999"
      v-model:open="imageUrlInsertVisible"
      :title="t('editor.extensions.Image.control.insert_by_url.title')"
      :ok-text="t('editor.extensions.Image.control.insert_by_url.ok')"
      :cancel-text="t('editor.extensions.Image.control.insert_by_url.cancel')"
      @ok="insertUrlImage"
    >
      <a-input v-model:value="imageUrl" :placeholder="t('editor.extensions.Image.control.insert_by_url.placeholder')" />
    </a-modal>
    <a-modal
      :zIndex="9999"
      v-model:open="imageUploadDialogVisible"
      :title="t('editor.extensions.Image.control.upload_image.title')"
      :footer="null"
    >
      <a-upload-dragger
        v-model:fileList="fileList"
        :show-upload-list="false"
        class="el-tiptap-upload"
        action="#"
        :custom-request="uploadImage"
        accept="image/*"
      >
        <div class="el-tiptap-upload__icon">
          <CloudUploadOutlined style="font-size: 60px;" />
        </div>
        <div class="el-tiptap-upload__text">
          {{ t('editor.extensions.Image.control.upload_image.button') }}
        </div>
      </a-upload-dragger>
    </a-modal>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { Popover, Modal, Input, UploadDragger } from 'ant-design-vue';
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { Editor } from '@tiptap/core';
import { readFileDataUrl } from '@/utils/shared';
import Logger from '@/utils/logger';
import CommandButton from '../CommandButton.vue';

export default defineComponent({
  name: 'ImageCommandButton',

  components: {
    APopover: Popover,
    AModal: Modal,
    AInput: Input,
    AUploadDragger: UploadDragger,
    CloudUploadOutlined,
    CommandButton,
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

    return { t, enableTooltip, isCodeViewMode };
  },

  data() {
    return {
      open: false,
      imageUploadDialogVisible: false,
      imageUrlInsertVisible: false,
      imageUrl: '',
      uploading: false,
      fileList: []
    };
  },

  computed: {
    imageNodeOptions() {
      return this.editor.extensionManager.extensions.find(
        (e) => e.name === 'image'
      )!.options;
    },
  },

  methods: {
    openUrlPrompt(): void {
      this.imageUrlInsertVisible = true;
    },
    insertUrlImage(): void {
      try {
        this.editor.commands.setImage({ src: this.imageUrl });
      } catch (error) {
        console.error(error);
      } finally {
        this.imageUrlInsertVisible = false;
      }
    },
    openUploadModal(): void {
      this.open = false;
      this.imageUploadDialogVisible = true;
    },
    async uploadImage(requestOptions: any) {
      const { file } = requestOptions;

      const uploadRequest = this.imageNodeOptions.uploadRequest;

      // const loadingInstance = ElLoading.service({
      //   target: '.el-tiptap-upload',
      // });
      try {
        const url = await (uploadRequest
          ? uploadRequest(file)
          : readFileDataUrl(file));
        this.editor.commands.setImage({ src: url });
        this.imageUploadDialogVisible = false;
      } catch (e) {
        Logger.error(String(e));
      } finally {
        // this.$nextTick(() => {
        //   loadingInstance.close();
        // });
      }
    },
  },
});
</script>
