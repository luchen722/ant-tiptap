<template>
  <a-dropdown :disabled="isCodeViewMode" trigger="click" placement="bottom">
    <template #overlay>
      <a-menu @click="(item) => editor.commands.setLineHeight(item.key)">
        <a-menu-item v-for="lineHeight in lineHeights" :key="lineHeight">
          <div
            :class="{
              'el-tiptap-dropdown-menu__item--active':
                isLineHeightActive(lineHeight),
            }"
            class="el-tiptap-dropdown-menu__item"
          >
            <span>{{ lineHeight }}</span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
    <command-button
      :enable-tooltip="enableTooltip"
      :tooltip="t('editor.extensions.LineHeight.tooltip')"
      :readonly="isCodeViewMode"
      icon="text-height"
    />
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { Editor } from '@tiptap/vue-3';
import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
import { isLineHeightActive } from '@/utils/line-height';
import CommandButton from './CommandButton.vue';

export default defineComponent({
  name: 'LineHeightDropdown',

  components: {
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: MenuItem,
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

  computed: {
    lineHeights() {
      const lineHeightOptions = this.editor.extensionManager.extensions.find(
        (e) => e.name === 'lineHeight'
      )!.options;
      return lineHeightOptions.lineHeights;
    },
  },

  methods: {
    isLineHeightActive(lineHeight: string) {
      return isLineHeightActive(this.editor.state, lineHeight);
    },
  },
});
</script>
