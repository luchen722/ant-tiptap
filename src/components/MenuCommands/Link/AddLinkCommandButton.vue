<template>
  <div>
    <command-button
      :is-active="editor.isActive('link')"
      :readonly="isCodeViewMode"
      :command="openAddLinkDialog"
      :enable-tooltip="enableTooltip"
      :tooltip="t('editor.extensions.Link.add.tooltip')"
      icon="link"
    />
    <a-modal
      :zIndex="9999"
      v-model:open="addLinkDialogVisible"
      :title="t('editor.extensions.Link.add.control.title')"
      :cancelText="t('editor.extensions.Link.add.control.cancel')"
      :okText="t('editor.extensions.Link.add.control.ok')"
      @ok="addLink"
    >
      <a-form :model="linkAttrs" label-position="right" size="small">
        <a-form-item
          :label="t('editor.extensions.Link.add.control.href')"
          name="href"
        >
          <a-input ref="inputRef" v-model:value="linkAttrs.href" autocomplete="off" />
        </a-form-item>

        <a-form-item name="openInNewTab">
          <a-checkbox v-model:checked="linkAttrs.openInNewTab">
            {{ t('editor.extensions.Link.add.control.open_in_new_tab') }}
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, nextTick, ref } from 'vue';
import {
  Modal,
  Form,
  FormItem,
  Input,
  Checkbox,
  Button,
} from 'ant-design-vue';
import { Editor } from '@tiptap/core';
import CommandButton from '../CommandButton.vue';

export default defineComponent({
  name: 'AddLinkCommandButton',

  components: {
    AModal: Modal,
    AForm: Form,
    AFormItem: FormItem,
    AInput: Input,
    ACheckbox: Checkbox,
    AButton: Button,
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
    const isCodeViewMode = inject('isCodeViewMode', true);
    const inputRef = ref();
    return { t, enableTooltip, isCodeViewMode, inputRef };
  },

  data() {
    return {
      linkAttrs: {
        href: '',
        openInNewTab: true,
      },

      addLinkDialogVisible: false,
    };
  },

  watch: {
    addLinkDialogVisible() {
      this.linkAttrs = { href: '', openInNewTab: true };
    },
  },

  methods: {
    openAddLinkDialog() {
      this.addLinkDialogVisible = true;
      nextTick(() => {
        this.inputRef.focus();
      });
    },

    closeAddLinkDialog() {
      this.addLinkDialogVisible = false;
    },

    addLink() {
      if (this.linkAttrs.openInNewTab) {
        this.editor.commands.setLink({
          href: this.linkAttrs.href,
          target: '_blank',
        });
      } else {
        this.editor.commands.setLink({ href: this.linkAttrs.href });
      }

      this.closeAddLinkDialog();
    },
  },
});
</script>
