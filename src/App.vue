<template>
  <div id="app">
    <FixedSkeleton v-if="metaLoaded" :left-widgets="left" :right-widgets="right" :main-widget="main" />
    <LoaderBall v-else />
  </div>
</template>

<script>
  import FixedSkeleton from '@scaife-viewer/skeleton';
  import ReaderWidget from '@scaife-viewer/widget-reader';
  import TextSizeWidget from '@scaife-viewer/widget-text-size';
  import TextWidthWidget from '@scaife-viewer/widget-text-width';

  import { MODULE_NS, FETCH_METADATA, FETCH_LIBRARY } from '@scaife-viewer/store';
  import { LoaderBall } from '@scaife-viewer/common';

  export default {
    components: { FixedSkeleton, LoaderBall },
    beforeCreate() {
      if (!this.$route.query.urn) {
        // load the first version returned from ATLAS
        this.$store.dispatch(`${MODULE_NS}/${FETCH_METADATA}`);
      }
      this.$store.dispatch(`${MODULE_NS}/${FETCH_LIBRARY}`);
    },
    computed: {
      left() {
        return [TextSizeWidget];
      },
      right() {
        return [TextWidthWidget];
      },
      main() {
        return ReaderWidget;
      },
      metaLoaded() {
        return this.$store.state[MODULE_NS].libraryTree !== null;
          // && this.$store.state[MODULE_NS].metadata !== null;
      }
    }
  };
</script>

<style lang="scss">
  @import url(https://fonts.googleapis.com/css?family=Noto+Serif:400,400i,700,700i&subset=greek,greek-ext,latin-ext);
  @import url(https://fonts.googleapis.com/css?family=Noto+Sans:400,700);

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
</style>
