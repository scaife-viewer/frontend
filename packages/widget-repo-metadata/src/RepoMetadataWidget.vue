<template>
  <div class="repo-metadata-widget">
    <RepoMetadata :version-urn="versionUrn" />
  </div>
</template>

<script>
  import { MODULE_NS } from '@scaife-viewer/store';
  import RepoMetadata from './RepoMetadata.vue';

  export default {
    name: 'RepoMetadataWidget',
    components: {
      RepoMetadata,
    },
    scaifeConfig: {
      displayName: 'Repo Metadata',
    },
    computed: {
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      versionUrn() {
        return this.passage.version;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .repo-metadata-widget {
    justify-content: flex-start;
    width: 100%;
  }
</style>
