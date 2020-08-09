import Vue from 'vue';
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';

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

import { SkeletonPlugin } from '@scaife-viewer/skeleton';
import { DefaultModeReader, DISPLAY_MODE_DEFAULT } from '@scaife-viewer/widget-reader';

import App from './App.vue';
import store from './store';

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
const client = new ApolloClient({
  uri:
    process.env.VUE_APP_ATLAS_GRAPHQL_ENDPOINT ||
    'https://explorehomer-atlas-dev.scaife-viewer.org/graphql/',
});
const apolloProvider = new VueApollo({
  defaultClient: client,
});

new Vue({
  store,
  apolloProvider,
  render: (h) => h(App), // eslint-disable-line arrow-parens
}).$mount("#app");
