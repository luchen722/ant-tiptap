<template>
  <a-dropdown :disabled="isCodeViewMode" trigger="click" placement="bottom">
    <template #overlay>
      <a-menu @click="(item) => toggleHeading(item.key)">
        <a-menu-item v-for="level in levels" :key="level">
          <div
            :class="[
              {
                'el-tiptap-dropdown-menu__item--active':
                  level > 0
                    ? editor.isActive('heading', {
                        level,
                      })
                    : editor.isActive('paragraph'),
              },
              'el-tiptap-dropdown-menu__item',
            ]"
          >
            <template v-if="level > 0">
              <component :is="'h' + level" data-item-type="heading">
                {{ t('editor.extensions.Heading.buttons.heading') }} {{ level }}
              </component>
            </template>
            <span v-else>{{
              t('editor.extensions.Heading.buttons.paragraph')
            }}</span>
          </div>
        </a-menu-item>
      </a-menu>
    </template>
    <command-button
      :enable-tooltip="enableTooltip"
      :is-active="editor.isActive('heading')"
      :tooltip="t('editor.extensions.Heading.tooltip')"
      :disabled="isCodeViewMode"
      icon="heading"
    />
  </a-dropdown>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import type { Level } from '@tiptap/extension-heading';
import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
import { Editor } from '@tiptap/core';
import CommandButton from './CommandButton.vue';

export default defineComponent({
  name: 'HeadingDropdown',

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

    levels: {
      type: Array,
      required: true,
    },
  },

  setup() {
    const t = inject('t');
    const enableTooltip = inject('enableTooltip', true);
    const isCodeViewMode = inject('isCodeViewMode', false);

    return { t, enableTooltip, isCodeViewMode };
  },

  methods: {
    toggleHeading(level: Level) {
      if (level > 0) {
        this.editor.commands.toggleHeading({ level });
      } else {
        this.editor.commands.setParagraph();
      }
    },
  },
});
</script>
