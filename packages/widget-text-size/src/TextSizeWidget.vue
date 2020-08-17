<template>
  <div class="text-size-widget u-widget">
    <TextSize :value="textSize" @input="changeTextSize" size="xs" />{{ ' ' }}
    <TextSize :value="textSize" @input="changeTextSize" size="sm" />{{ ' ' }}
    <TextSize :value="textSize" @input="changeTextSize" size="md" />{{ ' ' }}
    <TextSize :value="textSize" @input="changeTextSize" size="lg" />{{ ' ' }}
    <TextSize :value="textSize" @input="changeTextSize" size="xl" />
  </div>
</template>

<script>
  import {
    MODULE_NS,
    SET_TEXT_SIZE,
    SET_TEXT_WIDTH,
  } from '@scaife-viewer/store';
  import TextSize from './TextSize.vue';

  export default {
    name: 'TextSizeWidget',
    components: { TextSize },
    scaifeConfig: {
      displayName: 'Text Size',
    },
    computed: {
      textSize() {
        return this.$store.state[MODULE_NS].readerTextSize;
      },
    },
    methods: {
      changeTextSize(size) {
        this.$store.dispatch(`${MODULE_NS}/${SET_TEXT_SIZE}`, { size });
        this.$store.dispatch(`${MODULE_NS}/${SET_TEXT_WIDTH}`, {
          width: 'normal',
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .text-size-widget {
    flex: 1;
  }
</style>
