<template>
  <div id="app">
    <FixedSkeleton :left-widgets="left" :right-widgets="right" :main-widget="main" />
  </div>
</template>

<script>
  import FixedSkeleton from '@scaife-viewer/skeleton';
  import ReaderWidget from '@scaife-viewer/widget-reader';
  import TextSizeWidget from '@scaife-viewer/widget-text-size';
  import TextWidthWidget from '@scaife-viewer/widget-text-width';

  export default {
    components: { FixedSkeleton },
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
