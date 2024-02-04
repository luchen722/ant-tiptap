import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import ElementTiptap from 'element-tiptap';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);
app.use(Antd);

app.use(ElementTiptap);

app.mount('#app');
