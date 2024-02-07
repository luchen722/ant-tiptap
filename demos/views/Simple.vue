<template>
  <div class="el-tiptap-editor__wrapper">
    <a-tiptap
      :extensions="extensions"
      :locale="zh"
      v-model:content="content"
      placeholder="Write something ..."
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import {
  Text,
  Document,
  Paragraph,
  Heading,
  Blockquote,
  CodeBlock,
  BulletList,
  OrderedList,
  Image,
  TaskList,
  Table,
  Iframe,
  Bold,
  Underline,
  Italic,
  Strike,
  Link,
  Color,
  Highlight,
  FontFamily,
  FontSize,
  Code,
  HardBreak,
  HorizontalRule,
  History,
  TextAlign,
  Indent,
  LineHeight,
  FormatClear,
  Fullscreen,
  Print,
  SelectAll,
  CodeView,
  TextIndent,
  ImportWord
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
  Table,
  Code,
  Color,
  Link.configure({ bubble: true }),
  Image.configure({
    uploadRequest: (file) => {
      console.log(file);
      // 这里应该返回一个Promise
      return new Promise((resolve) => {
        resolve('https://picsum.photos/200/200?t=' + Date.now() + Math.random());
      });
    }
  }),
  Blockquote,
  TextAlign,
  LineHeight,
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
  ImportWord
];

const content = ref(
  ''
);
</script>
