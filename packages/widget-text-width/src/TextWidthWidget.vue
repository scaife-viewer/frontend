<template>
  <div class="text-width-widget u-widget">
    <TextWidth :value="textWidth" @input="changeTextWidth" width="narrow" />
    <TextWidth :value="textWidth" @input="changeTextWidth" width="normal" />
    <TextWidth :value="textWidth" @input="changeTextWidth" width="wide" />
    <TextWidth :value="textWidth" @input="changeTextWidth" width="full" />
  </div>
</template>

<script>
  import { MODULE_NS, SET_TEXT_WIDTH } from '@scaife-viewer/store';
  import TextWidth from './TextWidth.vue';

  export default {
    name: 'TextWidthWidget',
    components: { TextWidth },
    scaifeConfig: {
      displayName: 'Text Width',
    },
    computed: {
      textWidth() {
        return this.$store.state[MODULE_NS].readerTextWidth;
      },
    },
    methods: {
      changeTextWidth(width) {
        this.$store.dispatch(`${MODULE_NS}/${SET_TEXT_WIDTH}`, { width });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .text-width-widget {
    margin: 0 2em;
    flex: 1;
  }
</style>
