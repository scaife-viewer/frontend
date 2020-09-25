import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { sync } from 'vuex-router-sync';

import {
  DISPLAY_MODE_ALIGNMENTS,
  DISPLAY_MODE_FOLIO,
  DISPLAY_MODE_INTERLINEAR,
  DISPLAY_MODE_METRICAL,
  DISPLAY_MODE_NAMED_ENTITIES,
  DISPLAY_MODE_SYNTAX_TREES,
  DISPLAY_MODE_DEFAULT,
} from "@scaife-viewer/store";
import { SkeletonPlugin } from '@scaife-viewer/skeleton';

import { DefaultModeReader } from '@scaife-viewer/widget-reader';

import AlignmentsModeReader from '../packages/reader-alignments-mode/src';
import ImageModeReader from '@scaife-viewer/reader-image-mode';
import NamedEntitiesModeReader from '@scaife-viewer/reader-named-entities-mode';
import MetricalModeReader from '@scaife-viewer/reader-metrical-mode';
import InterlinearModeReader from '@scaife-viewer/reader-interlinear-mode';
import SyntaxTreesModeReader from "@scaife-viewer/reader-syntax-trees-mode";

import { iconMap as commonIconMap } from "@scaife-viewer/common";
import { iconMap as audioIconMap } from "@scaife-viewer/widget-audio";
import { iconMap as namedEntitiesIconMap } from "@scaife-viewer/widget-named-entities";
import { iconMap as imageModeReaderIconMap } from "@scaife-viewer/reader-image-mode";
import { iconMap as namedEntitesReaderIconMap } from '@scaife-viewer/reader-named-entities-mode';

import App from './App.vue';
import store, { apolloProvider } from './store';
import router from './router';

sync(store, router);

Vue.use(SkeletonPlugin, {
  iconMap: {
    ...commonIconMap,
    ...audioIconMap,
    ...namedEntitiesIconMap,
    ...namedEntitesReaderIconMap,
    ...imageModeReaderIconMap,
  },
  config: {
    entityMap: {
      accessToken:
        "pk.eyJ1IjoicGFsdG1hbiIsImEiOiJja2JpNDVpbmUwOGF1MnJwZm91c3VybDVrIn0.KRcXBGtiUWFXkp2uaE5LLw",
      mapStyle: "mapbox://styles/paltman/ckbi4thqt156y1ijz5wldui14",
    },
    readerComponents: {
      [DISPLAY_MODE_ALIGNMENTS]: AlignmentsModeReader,
      [DISPLAY_MODE_FOLIO]: ImageModeReader,
      [DISPLAY_MODE_NAMED_ENTITIES]: NamedEntitiesModeReader,
      [DISPLAY_MODE_METRICAL]: MetricalModeReader,
      [DISPLAY_MODE_INTERLINEAR]: InterlinearModeReader,
      [DISPLAY_MODE_SYNTAX_TREES]: SyntaxTreesModeReader,
      [DISPLAY_MODE_DEFAULT]: DefaultModeReader,
    },
    pageTitle: title => `SV Demo | ${title}`,
  },
});
Vue.use(VueApollo);

new Vue({
  store,
  router,
  apolloProvider,
  render: (h) => h(App), // eslint-disable-line arrow-parens
}).$mount('#app');
