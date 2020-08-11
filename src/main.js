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
} from '@fortawesome/free-solid-svg-icons';

import {
  DISPLAY_MODE_SENTENCE_ALIGNMENTS,
  DISPLAY_MODE_FOLIO,
  DISPLAY_MODE_INTERLINEAR,
  DISPLAY_MODE_METRICAL,
  DISPLAY_MODE_NAMED_ENTITIES,
  DISPLAY_MODE_DEFAULT,
 } from '@scaife-viewer/store';
import { SkeletonPlugin } from '@scaife-viewer/skeleton';

import { DefaultModeReader } from '@scaife-viewer/widget-reader';

import AlignmentsModeReader from '@scaife-viewer/reader-alignments-mode';
import ImageModeReader from '@scaife-viewer/reader-image-mode';
import NamedEntitiesModeReader from '@scaife-viewer/reader-named-entities-mode';
import MetricalModeReader from '@scaife-viewer/reader-metrical-mode';
import InterlinearModeReader from '@scaife-viewer/reader-interlinear-mode';

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
    entityMap: {
      accessToken: 'pk.eyJ1IjoicGFsdG1hbiIsImEiOiJja2JpNDVpbmUwOGF1MnJwZm91c3VybDVrIn0.KRcXBGtiUWFXkp2uaE5LLw',
      mapStyle: 'mapbox://styles/paltman/ckbi4thqt156y1ijz5wldui14',
    },
    readerComponents: {
      [DISPLAY_MODE_SENTENCE_ALIGNMENTS]: AlignmentsModeReader,
      [DISPLAY_MODE_FOLIO]: ImageModeReader,
      [DISPLAY_MODE_NAMED_ENTITIES]: NamedEntitiesModeReader,
      [DISPLAY_MODE_METRICAL]: MetricalModeReader,
      [DISPLAY_MODE_INTERLINEAR]: InterlinearModeReader,
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
}).$mount('#app');
