<template>
  <div class="metadata-widget">
    <Metadata v-if="metadata" :metadata="metadata" :version-urn="versionUrn" />
  </div>
</template>

<script>
  import { MODULE_NS } from '@scaife-viewer/store';
  import Metadata from './Metadata.vue';

  export default {
    name: 'MetadataWidget',
    components: {
      Metadata,
    },
    scaifeConfig: {
      displayName: 'Metadata',
    },
    computed: {
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      versionUrn() {
        return this.passage.version;
      },
      metadata() {
        return this.$store.getters[`${MODULE_NS}/metadata`];
      },
    },
  };
</script>

<style lang="scss" scoped>
  .metadata-widget {
    justify-content: flex-start;
    width: 100%;
  }
</style>
