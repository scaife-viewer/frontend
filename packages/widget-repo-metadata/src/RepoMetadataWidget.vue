<template>
  <div class="repo-metadata-widget">
    <RepoMetadata :passage="passage" />
  </div>
</template>

<script>
  import { MODULE_NS } from '@scaife-viewer/store';
  import RepoMetadata from './RepoMetadata.vue';

  /**
   * Widget used to display information / link to
   * the source repository for a given text.
   */
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
    },
  };
</script>

<style lang="scss" scoped>
  .repo-metadata-widget {
    justify-content: flex-start;
    width: 100%;
  }
</style>
