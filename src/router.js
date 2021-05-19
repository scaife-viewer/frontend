/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import Router from 'vue-router';

import App from './App.vue';
import ExploreHomer from './ExploreHomer.vue';
import Search from './Search.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '',
  routes: [
    { path: '/', component: App, name: 'home' },
    { path: '/search', component: Search, name: 'search' },
    { path: '/explore-homer/:urn?', component: ExploreHomer, name: 'reader' },
  ],
});
