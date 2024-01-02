/* eslint-disable import/no-extraneous-dependencies */
import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { sync } from 'vuex-router-sync';

import {
  DISPLAY_MODE_ALIGNMENTS,
  DISPLAY_MODE_FOLIO,
  DISPLAY_MODE_INTERLINEAR,
  DISPLAY_MODE_METRICAL,
  DISPLAY_MODE_DICTIONARY_ENTRIES,
  DISPLAY_MODE_NAMED_ENTITIES,
  DISPLAY_MODE_COMMENTARIES,
  DISPLAY_MODE_TEXTUAL_NOTES,
  DISPLAY_MODE_SYNTAX_TREES,
  DISPLAY_MODE_GRAMMATICAL_ENTRIES,
  DISPLAY_MODE_FALLBACK,
  DISPLAY_MODE_DEFAULT,
} from '@scaife-viewer/store';
import { SkeletonPlugin } from '@scaife-viewer/skeleton';

import { DefaultModeReader } from '@scaife-viewer/widget-reader';

import AlignmentsModeReader from '@scaife-viewer/reader-alignments-mode';
import ImageModeReader, {
  iconMap as imageModeReaderIconMap,
} from '@scaife-viewer/reader-image-mode';
// eslint-disable-next-line max-len
import DictionaryEntriesModeReader from '@scaife-viewer/reader-dictionary-entries-mode';

import CommentariesModeReader from '@scaife-viewer/reader-commentaries-mode';

import NamedEntitiesModeReader, {
  iconMap as namedEntitesReaderIconMap,
} from '@scaife-viewer/reader-named-entities-mode';
// eslint-disable-next-line max-len
import GrammaticalEntriesModeReader from '@scaife-viewer/reader-grammatical-entries-mode';
import FallbackModeReader from '@scaife-viewer/reader-tei-fallback-mode';

import MetricalModeReader from '@scaife-viewer/reader-metrical-mode';
import InterlinearModeReader from '@scaife-viewer/reader-interlinear-mode';
import SyntaxTreesModeReader from '@scaife-viewer/reader-syntax-trees-mode';

import { iconMap as commonIconMap } from '@scaife-viewer/common';
import { iconMap as audioIconMap } from '@scaife-viewer/widget-audio';
import { iconMap as neIconMap } from '@scaife-viewer/widget-named-entities';
import { iconMap as deIconMap } from '@scaife-viewer/widget-dictionary-entries';
import { iconMap as tocIconMap } from '@scaife-viewer/widget-toc';

import App from './App.vue';
import store, { apolloProvider } from './store';
import router from './router';

sync(store, router);

Vue.use(SkeletonPlugin, {
  iconMap: {
    ...commonIconMap,
    ...audioIconMap,
    ...neIconMap,
    ...deIconMap,
    ...tocIconMap,
    ...namedEntitesReaderIconMap,
    ...imageModeReaderIconMap,
  },
  config: {
    endpoints: {
      // FIXME: GraphQL
      tocEndpoint: 'http://localhost:8000',
    },
    entityMap: {
      accessToken:
        // eslint-disable-next-line max-len
        'pk.eyJ1IjoicGFsdG1hbiIsImEiOiJja2JpNDVpbmUwOGF1MnJwZm91c3VybDVrIn0.KRcXBGtiUWFXkp2uaE5LLw',
      mapStyle: 'mapbox://styles/paltman/ckbi4thqt156y1ijz5wldui14',
    },
    readerComponents: {
      [DISPLAY_MODE_DEFAULT]: DefaultModeReader,
      [DISPLAY_MODE_INTERLINEAR]: InterlinearModeReader,
      [DISPLAY_MODE_FOLIO]: ImageModeReader,
      [DISPLAY_MODE_METRICAL]: MetricalModeReader,
      [DISPLAY_MODE_DICTIONARY_ENTRIES]: DictionaryEntriesModeReader,
      [DISPLAY_MODE_NAMED_ENTITIES]: NamedEntitiesModeReader,
      [DISPLAY_MODE_COMMENTARIES]: CommentariesModeReader,
      // TODO: Add TextualNotesModeReader
      [DISPLAY_MODE_TEXTUAL_NOTES]: CommentariesModeReader,
      [DISPLAY_MODE_ALIGNMENTS]: AlignmentsModeReader,
      [DISPLAY_MODE_SYNTAX_TREES]: SyntaxTreesModeReader,
      [DISPLAY_MODE_GRAMMATICAL_ENTRIES]: GrammaticalEntriesModeReader,
      [DISPLAY_MODE_FALLBACK]: FallbackModeReader,
    },
    citationSchemeMap: {
      book: 'Books',
    },
    dictionaryEntries: {
      showCitationResolutionHint: true,
      resolveUsingNormalizedLemmas: false,
      selectDictionaries: true,
    },
    pageTitle: title => `SV Demo | ${title}`,
  },
});
Vue.use(VueApollo);

new Vue({
  store,
  router,
  apolloProvider,
  render: h => h(App), // eslint-disable-line arrow-parens
}).$mount('#app');
