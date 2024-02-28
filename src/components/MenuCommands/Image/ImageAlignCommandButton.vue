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
          v-for="align in alignCollection"
          :key="align"
          :class="{
            'el-tiptap-popper__menu__item--active': align === currDisplay,
          }"
          class="el-tiptap-popper__menu__item"
          @mouseup="hidePopover"
          @click="updateAttrs!({ align })"
        >
          <span>{{
            t(`editor.extensions.Image.buttons.align.${align}`)
          }}</span>
        </div>
      </div>
    </template>
    <span>
      <command-button
        :enable-tooltip="enableTooltip"
        :tooltip="t('editor.extensions.Image.buttons.display.tooltip')"
        icon="align-left"
      />
    </span>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { nodeViewProps } from '@tiptap/vue-3';
import { Popover } from 'ant-design-vue';
import { ImageAlign } from '@/utils/image';
import CommandButton from '../CommandButton.vue';

export default defineComponent({
  name: 'ImageAlignCommandButton',

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
      alignCollection: [
        ImageAlign.LEFT,
        ImageAlign.CENTER,
        ImageAlign.RIGHT,
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
      return this.node!.attrs.align;
    },
  },
});
</script>
