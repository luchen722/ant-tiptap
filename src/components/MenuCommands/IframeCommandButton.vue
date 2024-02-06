<template>
  <div>
    <command-button
      :command="openInsertVideoControl"
      :enable-tooltip="enableTooltip"
      :tooltip="t('editor.extensions.Iframe.tooltip')"
      :readonly="isCodeViewMode"
      icon="video"
    />
    <a-modal
      v-model:open="open"
      :title="t('editor.extensions.Iframe.control.title')"
      :ok-text="t('editor.extensions.Iframe.control.confirm')"
      :cancel-text="t('editor.extensions.Iframe.control.cancel')"
      @ok="insertIframe"
    >
      <a-input v-model:value="value" :placeholder="t('editor.extensions.Iframe.control.placeholder')"></a-input>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { Editor } from '@tiptap/vue-3';
import { Modal, Input } from 'ant-design-vue';
import CommandButton from './CommandButton.vue';

export default defineComponent({
  name: 'IframeCommandButton',

  components: {
    CommandButton,
    AModal: Modal,
    AInput: Input,
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
    const value = ref('');
    return { t, enableTooltip, isCodeViewMode, value, open };
  },

  methods: {
    async openInsertVideoControl() {
      this.open = true;
    },
    insertIframe() {
      this.editor.commands.setIframe({ src: this.value });
      this.open = false;
      this.value = '';
    }
  },
});
</script>
