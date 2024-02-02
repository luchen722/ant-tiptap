<template>
  <a-popover v-model:open="open" :disabled="isCodeViewMode" trigger="click" placement="bottom" overlayClassName="el-tiptap-popper" ref="popoverRef">
    <template #content>
      <div class="color-set">
        <div v-for="color in colorSet" :key="color" class="color__wrapper">
          <div
            :style="{
              'background-color': color,
            }"
            :class="{ 'color--selected': selectedColor === color }"
            class="color"
            @mousedown.prevent
            @click.stop="confirmColor(color)"
          />
        </div>

        <div class="color__wrapper">
          <div
            class="color color--remove"
            @mousedown.prevent
            @click.stop="confirmColor()"
          />
        </div>
      </div>
    </template>
    <span>
      <command-button
        :enable-tooltip="enableTooltip"
        :tooltip="t('editor.extensions.TextHighlight.tooltip')"
        icon="highlight"
        :readonly="isCodeViewMode"
      />
    </span>
  </a-popover>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue';
import { Editor, getMarkAttributes } from '@tiptap/vue-3';
import { Popover } from 'ant-design-vue';

import CommandButton from './CommandButton.vue';

export default defineComponent({
  name: 'HighlightPopover',

  components: {
    APopover: Popover,
    CommandButton,
  },

  props: {
    editor: {
      type: Editor,
      required: true,
    },
  },

  setup(props) {
    const t = inject('t');
    const enableTooltip = inject('enableTooltip', true);
    const isCodeViewMode = inject('isCodeViewMode', false);
    const open = ref(false);
    const popoverRef = ref();
    const popoverVisible = ref(false);

    function confirmColor(color?: string) {
      if (color) {
        props.editor.commands.setHighlight({ color });
      } else {
        props.editor.commands.unsetHighlight();
      }
    }

    const selectedColor = computed<string>(() => {
      return getMarkAttributes(props.editor.state, 'highlight').color || '';
    });

    return {
      t,
      enableTooltip,
      isCodeViewMode,
      popoverRef,
      selectedColor,
      popoverVisible,
      confirmColor,
      open
    };
  },

  computed: {
    colorSet(): string[] {
      const colorOptions = this.editor.extensionManager.extensions.find(
        (e) => e.name === 'highlight'
      )!.options;
      return colorOptions.colors;
    },
  },
});
</script>
