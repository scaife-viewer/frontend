import Vue from 'vue';
import Router from 'vue-router';

import App from './App.vue';
import ExploreHomer from './ExploreHomer.vue';

Vue.use(Router);

export default new Router({ mode: 'history', base: '', routes: [
  { path: '/', component: App, name: 'home' },
  { path: '/explore-homer/:urn?', component: ExploreHomer, name: 'reader' },
] });
