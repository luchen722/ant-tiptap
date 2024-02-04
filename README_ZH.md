## 📔 选择语言

[English](./README.md) | 简体中文

## 🎄 Demo

👉[https://leecason.github.io/element-tiptap](https://leecason.github.io/element-tiptap)

👾[Code Sandbox](https://codesandbox.io/s/element-tiptap-bwlnj)

## 📦 安装

### 通过 NPM

```shell
yarn add ant-tiptap
```

或者

```shell
npm install --save ant-tiptap
```

#### 安装插件

```js
import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import AntTiptapPlugin from 'ant-tiptap';

// 安装 Antd 插件
app.use(Antd);
// 安装 ant-tiptap 插件
app.use(AntTiptapPlugin);
// 现在你已经在全局注册了 `a-tiptap` 组件。

app.mount('#app');
```

_或者_

#### 局部引入

```vue
<template>
  <a-tiptap ...></a-tiptap>
</template>

<script setup>
import { AntTiptap } from 'element-tiptap';
</script>
```

## 🚀 用法

```vue
<template>
  <a-tiptap v-model:content="content" :extensions="extensions" />
</template>

<script setup>
import { ref } from 'vue';
import {
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  BulletList,
  OrderedList,
} from 'element-tiptap';

// 编辑器的 extensions
// 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
const extensions = [
  Doc,
  Text,
  Paragraph,
  Heading.configure({ level: 5 }),
  Bold.configure({ bubble: true }), // 在气泡菜单中渲染菜单按钮
  Underline.configure({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
  Italic,
  Strike,
  BulletList,
  OrderedList,
];

// 编辑器的内容
const content = ref(`
  <h1>Heading</h1>
  <p>This Editor is awesome!</p>
`);
</script>
```

## 📔 Props

### 扩展 extensions

类型: `Array`

你可以只使用需要的 extension，对应的菜单按钮将会按照你声明的顺序被添加。

所有可用的 extensions:

- `Doc`
- `Text`
- `Paragraph`
- `Heading`
- `Bold`
- `Italic`
- `Strike`
- `Underline`
- `Link`
- `Image`
- `Iframe`
- `CodeBlock`
- `Blockquote`
- `BulletList`
- `OrderedList`
- `TaskList`
- `TextAlign`
- `Indent`
- `LineHeight`
- `HorizontalRule`
- `HardBreak`
- `History`
- `Table`
- `FormatClear`
- `Color`
- `Highlight`
- `Print`
- `Fullscreen`
- `SelectAll`
- `FontFamily`
- `FontSize`
- `CodeView`

[查看](https://github.com/Leecason/element-tiptap/issues/107)所有 extensions 的文档

你可以自定义 extension. 查看 [Custom extensions](https://tiptap.dev/guide/custom-extensions).

### 占位符 placeholder

类型: `string`

默认值: `''`

当编辑器没有内容的时候，将会显示 placeholder。

```html
<a-tiptap placeholder="Write something …" />
```

### 内容 content

类型: `string`

默认值: `''`

编辑器的内容

```html
<a-tiptap :content="content" @onUpdate="onEditorUpdate" />
```

或者使用 `'v-model'`

```html
<a-tiptap v-model:content="content" />
```

### 输出 output

类型: `string`

默认值: `'html'`

可被定义为 `'html'`(默认) 或者 `'json'`.

```html
<a-tiptap output="json" />
```

进一步了解: [prosemirror 数据结构](https://prosemirror.net/docs/guide/#doc)

### readonly

类型: `boolean`

默认值: `false`

```html
<a-tiptap readonly />
```

当 `readonly` 为 `true`, 编辑器不可编辑。

### spellcheck

类型: `boolean`

默认值: 插件 `spellcheck` 配置项的值

```html
<a-tiptap spellcheck> </a-tiptap>
```

编辑器内容是否开启拼写检查。

### width, height

类型: `string | number`

带单位的字符串值，无单位的值会将 **`px`** 作为单位:

```html
<a-tiptap :width="700" height="100%"> </a-tiptap>
```

上例会被转换为:

```css
width: 700px;
height: 100%;
```

### showMenubar

类型: `boolean`

默认值: `true`

是否显示 menubar

### enableCharCount

类型: `boolean`

默认值: `true`

是否显示字数统计

### tooltip

类型: `boolean`

默认值: `true`

鼠标移到按钮上时是否显示 tooltip

### locale

指定编辑器国际化语言

```js
<template>
  <a-tiptap :locale="zh"></a-tiptap>
</template>

<script setup>
import { AntTiptap } from 'ant-tiptap';
import zh from 'ant-tiptap/lib/locales/zh';
</script>
```

可用的语言:

- `en`(默认)
- `zh`
- `pl` by @FurtakM
- `ru` by @baitkul
- `de` by @Thesicstar
- `ko` by @Hotbrains
- `es` by @koas
- `zh_tw` by @eric0324
- `fr` by @LPABelgium
- `pt_br` by @valterleonardo
- `nl` by @Arne-Jan
- `he` by @shovalPMS

欢迎贡献更多的语言.

## 👽 事件 Events

### onCreate

```vue
<template>
  <a-tiptap @onCreate="onCreate" />
</template>

<script setup>
/**
 * tiptap editor 实例
 * 阅读 https://tiptap.scrumpy.io/docs/guide/editor.html
 */
const onCreate = ({ editor }) => {
  // ...
};
</script>
```

### onTransaction, onFocus, onBlur, onDestroy

用法与 `init` 相同
