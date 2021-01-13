import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/store'
  },
  {
    path: '/ebook',
    component: () => import('../views/ebook/index'),
    children: [
      {
        path: ':fileName',
        component: () => import('../components/ebook/EbookReader')
      }
    ]
  },
  {
    path: '/store',
    component: () => import('../views/store/index'),
    redirect: '/store/home',
    children: [
      {
        path: 'home',
        component: () => import('../views/store/StoreHome')
      },
      {
        path: 'detail',
        component: () => import('../views/detail/bookDetail')
      },
      {
        path: 'list',
        component: () => import('../views/store/StoreList')
      },
      {
        path: 'shelf',
        component: () => import('../views/shelf/storeShelf')
      },
      {
        path: 'category',
        component: () => import('../views/store/StoreCategory')
      },
      {
        path: 'speaking',
        component: () => import('../views/store/StoreSpeaking')
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
