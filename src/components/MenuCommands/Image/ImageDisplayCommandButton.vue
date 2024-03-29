<template>
  <a-popover
    v-model:open="open"
    placement="top"
    trigger="click"
    popper-class="el-tiptap-popper"
  >
    <template #content>
      <div class="el-tiptap-popper__menu">
        <div
          v-for="display in displayCollection"
          :key="display"
          :class="{
            'el-tiptap-popper__menu__item--active': display === currDisplay,
          }"
          class="el-tiptap-popper__menu__item"
          @mouseup="hidePopover"
          @click="updateAttrs!({ display })"
        >
          <span>{{
            t(`editor.extensions.Image.buttons.display.${display}`)
          }}</span>
        </div>
      </div>
    </template>
    <span>
      <command-button
        :enable-tooltip="enableTooltip"
        :tooltip="t('editor.extensions.Image.buttons.display.tooltip')"
        icon="image-align"
      />
    </span>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { nodeViewProps } from '@tiptap/vue-3';
import { Popover } from 'ant-design-vue';
import { ImageDisplay } from '@/utils/image';
import CommandButton from '../CommandButton.vue';

export default defineComponent({
  name: 'ImageDisplayCommandButton',

  components: {
    APopover: Popover,
    CommandButton,
  },
  props: {
    node: nodeViewProps.node,
    updateAttrs: nodeViewProps.updateAttributes,
  },

  data() {
    return {
      displayCollection: [
        ImageDisplay.INLINE,
        ImageDisplay.BREAK_TEXT,
        ImageDisplay.FLOAT_LEFT,
        ImageDisplay.FLOAT_RIGHT,
      ],
    };
  },

  setup() {
    const t = inject('t');
    const enableTooltip = inject('enableTooltip', true);
    const open = ref(false);
    function hidePopover() {
      open.value = false;
    }
    return { t, enableTooltip, open, hidePopover };
  },

  computed: {
    currDisplay() {
      return this.node!.attrs.display;
    },
  }
});
</script>
