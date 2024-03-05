import { createRouter, createWebHashHistory } from 'vue-router';

const Index = () => import('../views/Index.vue');
const Simple = () => import('../views/Simple.vue');

const routes = [
  {
    path: '/',
    component: Index,
    children: [
      {
        name: 'Simple',
        path: '/',
        component: Simple,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
