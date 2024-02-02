<template>
  <a-dropdown :disabled="isCodeViewMode" trigger="click" placement="bottom">
    <template #overlay>
      <a-menu @click="(item) => toggleFontType(item.key)" class="el-tiptap-dropdown-menu">
        <a-menu-item v-for="name in fontFamilies" :key="name">
          <div
            :class="{
              'el-tiptap-dropdown-menu__item--active': name === activeFontFamily,
            }"
            class="el-tiptap-dropdown-menu__item"
          >
            <span :data-font="name" :style="{ 'font-family': name }">{{
              name
            }}</span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
    <command-button
      :enable-tooltip="enableTooltip"
      :tooltip="t('editor.extensions.FontType.tooltip')"
      :readonly="isCodeViewMode"
      icon="font-family"
    />
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { Editor, getMarkAttributes } from '@tiptap/vue-3';
import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
import CommandButton from './CommandButton.vue';

export default defineComponent({
  name: 'FontFamilyDropdown',

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
    fontFamilies() {
      const fontFamilyOptions = this.editor.extensionManager.extensions.find(
        (e) => e.name === 'fontFamily'
      )!.options;
      return fontFamilyOptions.fontFamilyMap;
    },

    activeFontFamily() {
      return getMarkAttributes(this.editor.state, 'textStyle').fontFamily || '';
    },
  },

  methods: {
    toggleFontType(name: string) {
      if (name === this.activeFontFamily) {
        this.editor.commands.unsetFontFamily();
      } else {
        this.editor.commands.setFontFamily(name);
      }
    },
  },
});
</script>
