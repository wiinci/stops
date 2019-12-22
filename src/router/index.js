import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    // {
    //     path: "/",
    //     name: "Marta",
    //     component: () => import("@/components/Marta")
    // },
    // {
    //   path: '/',
    //   name: 'Transit',
    //   component: () => import('@/components/Transit'),
    // },
    {
      path: '/',
      name: 'Start',
      component: () => import('@/components/Start'),
    },
    {
      path: '/zip/:zip',
      name: 'Zip',
      components: {
        default: () => import('@/components/Location'),
        // schedule: () => import('@/components/Schedule'),
      },
      props: {
        default: true,
        // schedule: false,
      },
    },
    {
      path: '/gps',
      name: 'Gps',
      components: {
        default: () => import('@/components/Location'),
        // schedule: () => import('@/components/Schedule'),
      },
      props: {
        default: false,
        // schedule: false,
      },
    },
    {
      path: '/bus/:route',
      name: 'Bus',
      component: () => import('@/components/Bus'),
    },
    {
      path: '/train/:line',
      name: 'Train',
      component: () => import('@/components/Train'),
    },
  ],
});
