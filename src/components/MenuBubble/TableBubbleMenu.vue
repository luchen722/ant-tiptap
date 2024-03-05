<template>
  <div class="table-bubble-menu">
    <table-popover :editor="editor" />

    <edit-table-prop-command-button :editor="editor" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Editor } from '@tiptap/vue-3';
import EditTablePropCommandButton from '@/components/MenuCommands/TablePopover/EditTablePropCommandButton.vue';
import TablePopover from '@/components/MenuCommands/TablePopover/index.vue';

export default defineComponent({
  name: 'TableBubbleMenu',
  components: {
    TablePopover,
    EditTablePropCommandButton,
  },
  props: {
    editor: {
      type: Editor,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
.table-bubble-menu {
  display: flex;
}
</style>
