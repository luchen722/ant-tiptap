<template>
  <div class="el-tiptap-editor__wrapper">
    <a-tiptap :extensions="textExtensions" content="Text Extensions" />

    <a-tiptap
      :extensions="paragraphExtensions"
      content="Paragraph Extensions"
    />

    <a-tiptap
      :extensions="richAndToolsExtensions"
      content="Rich And Tools Extensions"
    />
  </div>
</template>

<script setup>
import {
  Document,
  Text,
  Paragraph,
  // text extensions
  Bold,
  Underline,
  Italic,
  Strike,
  Code,
  FontFamily,
  FontSize,
  Color,
  Highlight,
  FormatClear,
  // paragraph extensions
  Heading,
  BulletList,
  OrderedList,
  TaskList,
  TextAlign,
  LineHeight,
  Indent,
  Blockquote,
  CodeBlock,
  // rich and tools extensions
  Link,
  Image,
  Table,
  Iframe,
  HorizontalRule,
  Fullscreen,
  Print,
  SelectAll,
  History,
  CodeView,
} from 'element-tiptap';

import codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css'; // import base style
import 'codemirror/mode/xml/xml.js'; // language
import 'codemirror/addon/selection/active-line.js'; // require active-line.js
import 'codemirror/addon/edit/closetag.js'; // autoCloseTags

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const textExtensions = [
  Document,
  Text,
  Paragraph,
  Bold.configure({ bubble: true }),
  Underline.configure({ bubble: true }),
  Italic.configure({ bubble: true }),
  Strike.configure({ bubble: true }),
  Code,
  FontFamily.configure({
    fontFamilyMap: ['inter']
  }),
  FontSize.configure({
    fontSizes: [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100]
  }),
  Color.configure({ bubble: true }),
  Highlight.configure({ bubble: true }),
  FormatClear,
  History,
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const paragraphExtensions = [
  Document,
  Text,
  Paragraph,
  Heading.configure({ level: 5, levels: [1, 2, 3, 4, 5] }),
  BulletList,
  OrderedList,
  TaskList,
  TextAlign,
  LineHeight.configure({
    LineHeights: [1, 1.15, 1.3, 1.5, 1.65, 2, 2.2, 2.5]
  }),
  Indent,
  Blockquote,
  CodeBlock,
  History,
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const richAndToolsExtensions = [
  Document,
  Text,
  Paragraph,
  Link,
  Image,
  Iframe,
  Table.configure({ resizable: true }),
  HorizontalRule,
  Print,
  SelectAll,
  Fullscreen,
  CodeView.configure({
    codemirror,
    codemirrorOptions: {
      styleActiveLine: true,
      autoCloseTags: true,
    },
  }),
  History,
];
</script>
