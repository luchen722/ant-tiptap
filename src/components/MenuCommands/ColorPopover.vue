<template>
  <a-popover
    v-model:open="open"
    :disabled="isCodeViewMode"
    placement="bottom"
    trigger="click"
    popper-class="el-tiptap-popper"
    ref="popoverRef"
  >
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

      <div class="color-hex">
        <a-input
          v-model:value="colorText"
          placeholder="HEX"
          autofocus="true"
          maxlength="7"
          size="small"
          class="color-hex__input"
        />

        <a-button
          text
          type="primary"
          size="small"
          class="color-hex__button"
          @click="confirmColor(colorText)"
        >
          OK
        </a-button>
      </div>
    </template>
    <span>
      <command-button
        :enable-tooltip="enableTooltip"
        :tooltip="t('editor.extensions.TextColor.tooltip')"
        icon="font-color"
        :readonly="isCodeViewMode"
      />
    </span>
  </a-popover>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, watch } from 'vue';
import { Editor, getMarkAttributes } from '@tiptap/vue-3';
import { Popover, Button, Input } from 'ant-design-vue';
import CommandButton from './CommandButton.vue';

export default defineComponent({
  name: 'ColorPopover',

  components: {
    APopover: Popover,
    AButton: Button,
    AInput: Input,
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

    const popoverRef = ref();
    const colorText = ref('');
    const open = ref(false);
    function confirmColor(color?: string) {
      if (color) {
        props.editor.commands.setColor(color);
      } else {
        props.editor.commands.unsetColor();
      }
      open.value = false;
    }

    const selectedColor = computed<string>(() => {
      return getMarkAttributes(props.editor.state, 'textStyle').color || '';
    });

    watch(selectedColor, (color) => {
      colorText.value = color;
    });

    return {
      t,
      enableTooltip,
      isCodeViewMode,
      popoverRef,
      colorText,
      open,
      selectedColor,
      confirmColor,
    };
  },

  computed: {
    colorSet(): string[] {
      const colorOptions = this.editor.extensionManager.extensions.find(
        (e) => e.name === 'color'
      )!.options;
      return colorOptions.colors;
    },
  },
});
</script>
