<template>
  <div class="el-tiptap-editor__wrapper">
    <a-tiptap
      :extensions="extensions"
      :locale="zh"
      :output="'html'"
      v-model:content="content"
      :charCountMax="10000"
      placeholder="Write something ..."
    />
    <div class="preview-mobile" v-html="content"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  CodeView,
  Color,
  Document,
  FontFamily,
  FontSize,
  FormatClear,
  Fullscreen,
  HardBreak,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Iframe,
  Image,
  ImportWord,
  Indent,
  Italic,
  LineHeight,
  Link,
  OrderedList,
  Paragraph,
  Print,
  SelectAll,
  Strike,
  Table,
  TaskList,
  Text,
  TextAlign,
  TextIndent,
  Underline,
} from 'element-tiptap';
import zh from '@/i18n/locales/zh';
import codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css'; // import base style
import 'codemirror/mode/xml/xml.js'; // language
import 'codemirror/addon/selection/active-line.js'; // require active-line.js
import 'codemirror/addon/edit/closetag.js'; // autoCloseTags

const extensions = [
  Document,
  FormatClear,
  Text,
  Paragraph,
  Heading.configure({ level: 5 }),
  Bold.configure({ bubble: true }),
  Underline.configure({ bubble: true }),
  Italic.configure({ bubble: true }),
  Strike.configure({ bubble: true }),
  Table.configure({
    resizable: true,
    lastColumnResizable: true,
  }),
  Code,
  Color.configure({ bubble: true }),
  Link.configure({ bubble: true }),
  Image.configure({}),
  Blockquote,
  TextAlign.configure({ bubble: true }),
  LineHeight.configure({ bubble: true }),
  BulletList.configure({ bubble: true }),
  OrderedList.configure({ bubble: true }),
  TaskList,
  Indent,
  TextIndent,
  Iframe,
  CodeBlock,
  HardBreak,
  Highlight,
  FontFamily,
  FontSize,
  Print,
  SelectAll,
  HorizontalRule.configure({ bubble: true }),
  CodeView.configure({
    codemirror,
    codemirrorOptions: {
      styleActiveLine: true,
      autoCloseTags: true,
    },
  }),
  Fullscreen,
  History,
  ImportWord,
];

const content = ref(
  '',
);
</script>

<style lang="scss">
.el-tiptap-editor__wrapper {
  padding-bottom: 24px;
}

.preview-mobile {
  width: 375px;
  height: 667px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin: 12px auto;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
