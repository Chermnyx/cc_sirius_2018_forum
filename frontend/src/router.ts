import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IndexView',
      component: () => import('@/views/IndexView.vue'),
    },
    {
      path: '/login',
      name: 'LoginView',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/my_profile',
      name: 'MyProfileView',
      component: () => import('@/views/MyProfileView.vue'),
    },
    {
      path: '/thread/:_id',
      name: 'ThreadView',
      props: true,
      component: () => import('@/views/ThreadView.vue'),
    },
  ],
});
