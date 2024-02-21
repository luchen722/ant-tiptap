<template>
  <a-dropdown :disabled="isCodeViewMode" trigger="click" placement="bottom">
    <template #overlay>
      <a-menu @click="(item) => toggleFontSize(item.key)" class="el-tiptap-dropdown-menu">
        <a-menu-item :key="defaultSize">
          <div
            :class="{
              'el-tiptap-dropdown-menu__item--active':
                activeFontSize === defaultSize,
            }"
            class="el-tiptap-dropdown-menu__item"
          >
            <span data-font-size="default">{{
              t('editor.extensions.FontSize.default')
            }}</span>
          </div>
        </a-menu-item>
        <a-menu-item v-for="fontSize in fontSizes" :key="fontSize">
          <div
            :class="{
              'el-tiptap-dropdown-menu__item--active':
                fontSize === activeFontSize,
            }"
            class="el-tiptap-dropdown-menu__item"
          >
            <span :data-font-size="fontSize">{{ fontSize }}</span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
    <command-button
      :enable-tooltip="enableTooltip"
      :tooltip="t('editor.extensions.FontSize.tooltip')"
      :readonly="isCodeViewMode"
      icon="font-size"
    />
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { Editor, getMarkAttributes } from '@tiptap/vue-3';
import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
import { DEFAULT_FONT_SIZE } from '@/utils/font-size';
import CommandButton from './CommandButton.vue';

export default defineComponent({
  name: 'FontSizeDropdown',

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

    return { t, enableTooltip, isCodeViewMode, defaultSize: DEFAULT_FONT_SIZE };
  },

  computed: {
    fontSizes(): string[] {
      const fontSizeOptions = this.editor.extensionManager.extensions.find(
        (e) => e.name === 'fontSize'
      )!.options;
      return fontSizeOptions.fontSizes;
    },

    activeFontSize() {
      return getMarkAttributes(this.editor.state, 'textStyle').fontSize || '';
    },
  },

  methods: {
    toggleFontSize(size: string) {
      if (size === this.activeFontSize) {
        this.editor.commands.unsetFontSize();
      } else {
        this.editor.commands.setFontSize(size);
      }
    },
  },
});
</script>
