<template>
  <div id="app">
    <FixedSkeleton
      v-if="metaLoaded"
      :left-widgets="left"
      :right-widgets="right"
      :main-widget="main"
    />
    <LoaderBall v-else />
  </div>
</template>

<script>
  /* eslint-disable import/no-extraneous-dependencies */
  import FixedSkeleton from '@scaife-viewer/skeleton';

  import ReaderWidget from '@scaife-viewer/widget-reader';
  import RepoMetadataWidget from '@scaife-viewer/widget-repo-metadata';
  import MetadataWidget from '@scaife-viewer/widget-metadata';
  // FIXME: Restore once we've synchronized ATLAS branches
  // eslint-disable-next-line max-len
  // import PassageCitationTOCWidget from '@scaife-viewer/widget-passage-citation-toc';
  import PassageReferenceWidget from '@scaife-viewer/widget-passage-reference';
  import PassageAncestorsWidget from '@scaife-viewer/widget-passage-ancestors';
  import PassageSiblingsWidget from '@scaife-viewer/widget-passage-siblings';
  import PassageChildrenWidget from '@scaife-viewer/widget-passage-children';
  import LibraryWidget from '@scaife-viewer/widget-library';
  import TokenAnnotationWidget from '@scaife-viewer/widget-token-annotations';
  import NamedEntitiesWidget from '@scaife-viewer/widget-named-entities';
  // eslint-disable-next-line max-len
  import DictionaryEntriesWidget from '@scaife-viewer/widget-dictionary-entries';
  import DisplayModeWidget from '@scaife-viewer/widget-display-mode';
  import ScholiaWidget from '@scaife-viewer/widget-scholia';
  import AudioWidget from '@scaife-viewer/widget-audio';
  import WordListWidget from '@scaife-viewer/widget-word-list';
  import NewAlexandriaWidget from '@scaife-viewer/widget-new-alexandria';
  import TextSizeWidget from '@scaife-viewer/widget-text-size';
  import TextWidthWidget from '@scaife-viewer/widget-text-width';

  import {
    MODULE_NS,
    FETCH_METADATA,
    FETCH_LIBRARY,
  } from '@scaife-viewer/store';
  import { LoaderBall } from '@scaife-viewer/common';

  export default {
    components: { FixedSkeleton, LoaderBall },
    beforeCreate() {
      if (!this.$route.params.urn) {
        // load the first version returned from ATLAS
        this.$store.dispatch(`${MODULE_NS}/${FETCH_METADATA}`);
      }
      this.$store.dispatch(`${MODULE_NS}/${FETCH_LIBRARY}`);
    },
    computed: {
      left() {
        return [
          LibraryWidget,
          PassageReferenceWidget,
          // FIXME: Restore once we've synchronized ATLAS branches
          // PassageCitationTOCWidget,
          PassageAncestorsWidget,
          PassageSiblingsWidget,
          PassageChildrenWidget,
        ];
      },
      right() {
        return [
          RepoMetadataWidget,
          MetadataWidget,
          TextSizeWidget,
          TextWidthWidget,
          AudioWidget,
          DisplayModeWidget,
          NamedEntitiesWidget,
          DictionaryEntriesWidget,
          TokenAnnotationWidget,
          WordListWidget,
          NewAlexandriaWidget,
          ScholiaWidget,
        ];
      },
      main() {
        return ReaderWidget;
      },
      metaLoaded() {
        return this.$store.state[MODULE_NS].libraryTree !== null;
        // && this.$store.state[MODULE_NS].metadata !== null;
      },
    },
  };
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Noto+Serif:400,400i,700,700i&subset=greek,greek-ext,latin-ext');
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans:400,700');

  html,
  body {
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: 'Noto Sans', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .body {
    display: flex;
    justify-content: center;
  }
  .form-control {
    // TODO: package this better
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    border-radius: 0.2rem;
    width: 100%;
    border: 1px solid #ced4da;
  }
</style>
