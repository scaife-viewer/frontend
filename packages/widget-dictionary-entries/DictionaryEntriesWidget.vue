<template>
  <div class="dictionary-entries-widget">
    <!-- TODO: Select the dictionary -->
    <DictionaryEntry v-if="entryUrn" :entryUrn="entryUrn" />
    <DictionaryEntries v-else />
  </div>
</template>

<script>
  import DictionaryEntry from './DictionaryEntry.vue';
  import DictionaryEntries from './DictionaryEntries.vue';
  // import WidgetControls from './WidgetControls.vue';

  export default {
    scaifeConfig: {
      displayName: 'Dictionary Entries',
      portalTarget: 'dictionary-entries-widget-controls',
    },
    components: {
      DictionaryEntry,
      DictionaryEntries,
    },
    computed: {
      entryUrn() {
        // TODO: Namespace URL args
        return this.$route.query.entryUrn;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dictionary-entries-widget {
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
  }
</style>
