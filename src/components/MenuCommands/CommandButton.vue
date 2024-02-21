<template>
  <div :title="tooltip" :class="commandButtonClass" @mousedown.prevent @click="onClick">
    <v-icon :name="icon" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { noop } from '@/utils/shared';
import VIcon from '../Icon/Icon.vue';

export default defineComponent({
  components: {
    VIcon,
  },
  props: {
    editor: {
      type: Object
    },
    icon: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    tooltip: {
      type: String,
      required: true,
    },

    enableTooltip: {
      type: Boolean,
      required: true,
    },

    command: {
      type: Function,
      default: noop,
    },

    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },

  computed: {
    commandButtonClass(): object {
      return {
        'el-tiptap-editor__command-button': true,
        'el-tiptap-editor__command-button--active': this.isActive,
        'el-tiptap-editor__command-button--readonly': this.readonly || this.disabled,
      };
    },
  },

  methods: {
    onClick() {
      if (!this.readonly || !this.disabled) this.command();
    },
  },
});
</script>
