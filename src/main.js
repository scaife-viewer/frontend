import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { sync } from 'vuex-router-sync';

import {
  faChevronLeft,
  faChevronDown,
  faChevronRight,
  faVolumeUp,
  faUser,
  faMapMarkerAlt,
  faGripLines,
  faGripLinesVertical,
  faAlignLeft,
  faBookOpen,
  faSearchMinus,
  faSearchPlus,
  faHome,
  faWindowMaximize,
} from "@fortawesome/free-solid-svg-icons";

import { DISPLAY_MODE_DEFAULT } from '@scaife-viewer/store';
import { SkeletonPlugin } from '@scaife-viewer/skeleton';
import { DefaultModeReader } from '@scaife-viewer/widget-reader';

import App from './App.vue';
import store, { apolloProvider } from './store';
import router from './router';

sync(store, router);

const iconMap = [
  faChevronLeft,
  faChevronDown,
  faChevronRight,
  faVolumeUp,
  faUser,
  faMapMarkerAlt,
  faGripLines,
  faGripLinesVertical,
  faAlignLeft,
  faBookOpen,
  faSearchMinus,
  faSearchPlus,
  faHome,
  faWindowMaximize,
].reduce((map, obj) => {
  return {
    ...map,
    [obj.iconName]: obj,
  };
}, {});

Vue.use(SkeletonPlugin, {
  iconMap,
  config: {
    readerComponents: {
      [DISPLAY_MODE_DEFAULT]: DefaultModeReader,
    },
  },
});
Vue.use(VueApollo);

new Vue({
  store,
  router,
  apolloProvider,
  render: (h) => h(App), // eslint-disable-line arrow-parens
}).$mount("#app");
