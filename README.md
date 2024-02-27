## Base
[tiptap](https://github.com/ueberdosis/tiptap)
[Element-Tiptap](https://github.com/Leecason/element-tiptap)

## 📔 Languages

English | [简体中文](./README_ZH.md)

## 📦 Installation

### NPM

```shell
yarn add ant-tiptap
```

Or

```shell
npm install --save ant-tiptap
```

#### Install plugin

```js
import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import AntTiptapPlugin from 'ant-tiptap';

const app = createApp(App);

// use Antd's plugin
app.use(Antd);
// use this package's plugin
app.use(AntTiptapPlugin);
// Now you register `'a-tiptap'` component globally.

app.mount('#app');
```

_Or_

#### Partial import

```vue
<template>
  <a-tiptap ...></a-tiptap>
</template>

<script setup>
import { AntTiptap } from 'ant-tiptap';
</script>
```

## 🚀 Usage

```vue
<template>
  <a-tiptap v-model:content="content" :extensions="extensions" />
</template>

<script setup>
import { ref } from 'vue';
import {
  // necessary extensions
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

// editor extensions
// they will be added to menubar and bubble menu by the order you declare.
const extensions = [
  Doc,
  Text,
  Paragraph,
  Heading.configure({ level: 5 }),
  Bold.configure({ bubble: true }), // render command-button in bubble menu.
  Underline.configure({ bubble: true, menubar: false }), // render command-button in bubble menu but not in menubar.
  Italic,
  Strike,
  BulletList,
  OrderedList,
];

// editor's content
const content = ref(`
  <h1>Heading</h1>
  <p>This Editor is awesome!</p>
`);
</script>
```

## 📔 Props

### extensions

Type: `Array`

You can use the necessary extensions. The corresponding command-buttons will be added by declaring the order of the extension.

All available extensions:

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

You can find all extensions docs [here](https://github.com/Leecason/element-tiptap/issues/107).

You can customize the extension. See [Custom extensions](https://tiptap.dev/guide/custom-extensions).

### placeholder

Type: `string`

Default: `''`

When editor is empty, placeholder will display.

```html
<el-tiptap placeholder="Write something …" />
```

### content

Type: `string`

Default: `''`

Editor's content

```html
<el-tiptap :content="content" @onUpdate="onEditorUpdate" />
```

or Use `'v-model'`

```html
<a-tiptap v-model:content="content" />
```

### output

Type: `string`

Default: `'html'`

Output can be defined to `'html'` or `'json'`.

```html
<a-tiptap output="json" />
```

further reading: [prosemirror data structure](https://prosemirror.net/docs/guide/#doc)

### readonly

Type: `boolean`

Default: `false`

```html
<a-tiptap readonly />
```

when `readonly` is `true`, editor is not editable.

### spellcheck

Type: `boolean`

Default: `false`

```html
<a-tiptap spellcheck> </a-tiptap>
```

Whether the content is spellcheck enabled.

### width, height

Type: `string | number`

A string value with unit or a simple value (the default unit is **`px`**)：

```html
<a-tiptap :width="700" height="100%"> </a-tiptap>
```

The above example will be converted to:

```css
width: 700px;
height: 100%;
```

### enableCharCount

Type: `boolean`

Default: `true`

Enables or disables the display of the character counter.

### tooltip

Type: `boolean`

Default: `true`

Control if tooltips are shown when getting with mouse over the buttons from the toolbar.

### locale

Specifies the editor i18n language.

```js
<template>
  <a-tiptap :locale="en"></a-tiptap>
</template>

<script setup>
import { AntTiptap } from 'ant-tiptap';
import en from 'ant-tiptap/lib/locales/en';
</script>
```

Available languages:

- `en`(default)
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

Welcome contribution.

## 👽 Events

### onCreate

```vue
<template>
  <a-tiptap @onCreate="onCreate" />
</template>

<script setup>
/**
 * the tiptap editor instance
 * see https://tiptap.dev/api/editor
 */
const onCreate = ({ editor }) => {
  // ...
};
</script>
```

### onTransaction, onFocus, onBlur, onDestroy

The same as `onCreate`

## 🏗 Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## 📝 Changelog

[Changelog](https://github.com/Leecason/element-tiptap/blob/master/CHANGELOG.md)

## 📄 License

[MIT](https://github.com/Leecason/element-tiptap/blob/master/LICENSE)
