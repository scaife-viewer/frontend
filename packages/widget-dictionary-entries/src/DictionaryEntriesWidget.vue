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
      selectedDictionaryUrn() {
        return this.$store.getters[`${MODULE_NS}/selectedDictionaryUrn`];
      },
      dictionaryEntriesMode() {
        return this.$store.getters[`${MODULE_NS}/dictionaryEntriesMode`];
      },
      preferEntryMatchingSelectedDictionary() {
        return this.selectedDictionaryUrn && this.dictionaryEntriesMode;
      },
      candidateLemmaEntries() {
        const hasLemmaEntries =
          this.lemmaEntries && this.lemmaEntries.length > 0;
        if (hasLemmaEntries) {
          let matchingEntries = [];
          if (this.selectedDictionaryUrn) {
            matchingEntries = this.lemmaEntries.filter(
              entry => entry.dictionary.urn === this.selectedDictionaryUrn,
            );
          }
          return matchingEntries.length > 0
            ? matchingEntries
            : this.lemmaEntries;
        }
        return [];
      },
      lemmaEntryURN() {
        return this.candidateLemmaEntries.length > 0
          ? this.candidateLemmaEntries[0].urn
          : null;
      },
      resolveUsingNormalizedLemmas() {
        const fallback = false;
        const config = this.$scaife.config.dictionaryEntries;
        return config ? config.resolveUsingNormalizedLemmas : fallback;
      },
    },
    apollo: {
      lemmaEntries: {
        // TODO: Make the widget configurable to
        // query for entries with citations and use
        // this hint in candidateLemmaEntries
        // TODO: Tweak query to include dictionary.urn
        // only if `dictionaryEntriesMode` is true
        query: gql`
          query DictionaryEntries($lemma: String!, $normalizeLemmas: Boolean!) {
            dictionaryEntries(
              lemma: $lemma
              normalizeLemmas: $normalizeLemmas
            ) {
              edges {
                node {
                  id
                  urn
                  dictionary {
                    id
                    urn
                  }
                }
              }
            }
          }
        `,
        variables() {
          return {
            lemma: `${this.lemmas[0]}`,
            normalizeLemmas: this.resolveUsingNormalizedLemmas,
          };
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
