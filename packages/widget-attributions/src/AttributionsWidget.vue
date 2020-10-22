<template>
  <div class="attributions-widget">
    <Attributions :version-urn="versionUrn" />
  </div>
</template>

<script>
  // TODO: Determine other patterns for this type of widget;
  // e.g., when do we have a widget wrapping another component
  // Can we also re-use / inherit from metadata styles?
  import { MODULE_NS } from '@scaife-viewer/store';
  import Attributions from './Attributions.vue';

  export default {
    name: 'AttributionsWidget',
    components: {
      Attributions,
    },
    scaifeConfig: {
      displayName: 'Attributions',
    },
    computed: {
      passage() {
        // FIXME: Add a conditional for SV 1 vs SV 2 behavior
        // return this.$store.getters[`${MODULE_NS}/passage`]; // SV 2
        return this.$store.getters['reader/passage']; // SV 1
      },
      versionUrn() {
        // FIXME: Add a conditional for SV 1 vs SV 2 behavior
        // return this.passage.version;  // SV 2
        return this.passage ? `${this.passage.metadata.text.urn}:` : ''; // SV 1
      },
    },
  };
</script>

<style lang="scss" scoped>
  .attributions-widget {
    justify-content: flex-start;
    width: 100%;
  }
</style>
