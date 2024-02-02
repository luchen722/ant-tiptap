import { Plugin } from 'vue';
import ATiptap from '@/components/ATiptap.vue';

const ATiptapPlugin: Plugin = {
  install(app) {
    app.component('a-tiptap', ATiptap);
  },
};

export * from '@/extensions';

export { ATiptapPlugin, ATiptap };

export default ATiptapPlugin;
