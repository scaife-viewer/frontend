<template>
  <div class="embed-widget">
    <a href @click.prevent="onCopy"> <icon name="copy" />Copy embed URL </a>
    <p v-if="copied">
      Copied embed URL to clipboard!
    </p>
  </div>
</template>

<script>
  import { EMBED_MODE } from '@scaife-viewer/store';

  export default {
    name: 'EmbedWidget',
    scaifeConfig: {
      displayName: 'Embed',
    },
    data() {
      return {
        copied: false,
      };
    },
    methods: {
      getReaderUrl() {
        const readerUrl = this.$router.resolve({
          name: 'reader',
          params: this.$route.params,
          query: {
            [EMBED_MODE]: 'y',
            ...this.$route.query,
          },
        });
        return `${window.location.origin}${readerUrl.href}`;
      },
      async onCopy() {
        navigator.clipboard.writeText(this.getReaderUrl());
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 5000);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .embed-widget {
    justify-content: flex-start;
    width: 100%;
  }
</style>
