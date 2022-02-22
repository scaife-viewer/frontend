<template>
  <router-link :to="destinationPassage" :class="{ selected }">
    {{ textPartUrn.reference }}
  </router-link>
</template>

<script>
  import URN from '@scaife-viewer/common';

  export default {
    props: ['token', 'passage'],
    computed: {
      textPartUrn() {
        return new URN(this.token.textPartUrn);
      },
      destinationPassage() {
        // TODO: Persist lemma selection across page loads
        // also impact Word and ReaderToken selections
        return {
          name: this.$route.name,
          params: { urn: `${this.textPartUrn}` },
          query: this.$route.query,
        };
      },
      selected() {
        return this.textPartUrn.absolute === this.passage.absolute;
      },
    },
  };
</script>
