import Vue from 'vue';
import Vuex from 'vuex';

import { createStore as skeletonCreateStore } from '@scaife-viewer/skeleton';

Vue.use(Vuex);

const skeletonStore = skeletonCreateStore();

export default new Vuex.Store({
  state: {},
  getters: {
    urn: () => null,
  },
  mutations: {},
  actions: {},
  modules: {
    [skeletonStore.namespace]: skeletonStore.store,
  },
});
