<template>
  <div>
    <command-button
      :command="openEditLinkDialog"
      :enable-tooltip="enableTooltip"
      :tooltip="t('editor.extensions.Link.edit.tooltip')"
      icon="edit"
    />
    <a-modal
      :zIndex="9999"
      v-model:open="editLinkDialogVisible"
      :title="t('editor.extensions.Link.edit.control.title')"
      :cancelText="t('editor.extensions.Link.edit.control.cancel')"
      :okText="t('editor.extensions.Link.edit.control.ok')"
      @ok="updateLinkAttrs"
    >
      <a-form :model="linkAttrs" label-position="right" size="small">
        <a-form-item
          :label="t('editor.extensions.Link.edit.control.href')"
          prop="href"
        >
          <a-input v-model:value="linkAttrs.href" autocomplete="off" />
        </a-form-item>

        <a-form-item prop="openInNewTab">
          <a-checkbox v-model:checked="linkAttrs.openInNewTab">
            {{ t('editor.extensions.Link.edit.control.open_in_new_tab') }}
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { Editor } from '@tiptap/vue-3';
import {
  Modal,
  Form,
  FormItem,
  Input,
  Checkbox,
  Button,
} from 'ant-design-vue';
import CommandButton from '../CommandButton.vue';

export default defineComponent({
  name: 'EditLinkCommandButton',

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

    initLinkAttrs: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const t = inject('t');
    const enableTooltip = inject('enableTooltip', true);

    return { t, enableTooltip };
  },

  data() {
    return {
      linkAttrs: this.initLinkAttrs,
      editLinkDialogVisible: false,
    };
  },

  methods: {
    updateLinkAttrs() {
      this.editor.commands.setLink(this.linkAttrs);

      this.closeEditLinkDialog();
    },

    openEditLinkDialog() {
      this.editLinkDialogVisible = true;
    },

    closeEditLinkDialog() {
      this.editLinkDialogVisible = false;
    },
  },
});
</script>
