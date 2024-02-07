<template>
  <command-button
    :command="removeImage"
    :enable-tooltip="enableTooltip"
    :tooltip="t('editor.extensions.Image.buttons.remove_image.tooltip')"
    icon="trash-alt"
  />
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { Editor } from '@tiptap/vue-3';
import CommandButton from '../CommandButton.vue';
import { message } from 'ant-design-vue';
export default defineComponent({
  name: 'RemoveImageCommandButton',

  components: {
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

    return { t, enableTooltip };
  },
  mounted() {
    message.config({
      getContainer: () => this.editor?.view.dom.parentNode || document.body,
    });
  },
  unmounted() {
    message.config({
      getContainer: () => document.body,
    });
  },
  methods: {
    removeImage() {
      const a = this.editor?.commands.deleteSelection();
      if (a) {
        message.success({
          content: this.t('editor.extensions.Image.buttons.remove_image.success'),
        });
      } else {
        message.error({
          content: this.t('editor.extensions.Image.buttons.remove_image.fail'),
        });
      }
    },
  },
});
</script>
