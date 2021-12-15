<template>
  <div class="dictionary-entries-widget">
    <!-- TODO: Allow site developers or users to specify
    dictionary -->
    <DictionaryEntry v-if="entryUrn" :entryUrn="entryUrn" />
    <DictionaryEntries v-else :placeholder="placeholder" />
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import { MODULE_NS } from '@scaife-viewer/store';
  import DictionaryEntry from './DictionaryEntry.vue';
  import DictionaryEntries from './DictionaryEntries.vue';

  export default {
    props: {
      // TODO: Rework using slots or $scaife.config
      placeholder: {
        type: String,
        default: 'Filter entries',
      },
    },
    scaifeConfig: {
      displayName: 'Dictionary Entries',
      portalTarget: 'dictionary-entries-widget-controls',
    },
    components: {
      DictionaryEntry,
      DictionaryEntries,
    },
    watch: {
      lemmaEntryURN: {
        handler(value) {
          if (this.$route.query.entryUrn === value) {
            return;
          }
          const query = {
            ...this.$route.query,
            entryUrn: value || undefined,
          };
          this.$router.replace({ query });
        },
      },
    },
    computed: {
      entryUrn() {
        // TODO: Add namespacing for widget URL query params
        return this.$route.query.entryUrn;
      },
      lemmas() {
        return this.$store.getters[`${MODULE_NS}/selectedLemmas`];
      },
      lemmaEntryURN() {
        return this.lemmaEntries && this.lemmaEntries.length > 0
          ? this.lemmaEntries[0].urn
          : null;
      },
    },
    apollo: {
      lemmaEntries: {
        // TODO: Pass the configured dictionary
        // and possibly add $scaife config value for also
        // filtering against reference
        query: gql`
          query DictionaryEntries($lemma: String!) {
            dictionaryEntries(lemma: $lemma, first: 1) {
              edges {
                node {
                  id
                  urn
                }
              }
            }
          }
        `,
        variables() {
          return { lemma: `${this.lemmas[0]}` };
        },
        update(data) {
          return data.dictionaryEntries.edges.map(e => e.node);
        },
        skip() {
          const condition = this.lemmas ? this.lemmas.length < 1 : true;
          return condition;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dictionary-entries-widget {
    flex-direction: column;
    justify-content: flex-start;
    min-width: 0;
    width: 100%;
  }
</style>
