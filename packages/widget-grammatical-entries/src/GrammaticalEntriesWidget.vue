<template>
  <div class="grammatical-entries" :key="urn.absolute">
    <LoaderBall v-if="$apollo.queries.entries.loading" />
    <EmptyMessage v-else-if="entries.length === 0" />
    <template v-else>
      <GrammaticalEntry
        v-for="entry in filteredEntries"
        :key="entry.id"
        :entry="entry"
        :selected-entries="selectedEntries"
        @select="onSelect"
      />
      <!-- TODO: Attribution tied to collection of selected entry -->
      <Attribution v-if="showShamsianAttribution">
        <hr />
        From the
        <a href="https://github.com/farnoosh-shamsian/Didakta" target="_blank"
          >Didakta Modular Grammar</a
        >
        by
        <a href="https://orcid.org/0000-0003-3743-4278" target="_blank"
          >Farnoosh Shamsian</a
        >
      </Attribution>
      <!-- TODO: Select collection -->
    </template>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { Attribution, LoaderBall, EmptyMessage } from '@scaife-viewer/common';
  import {
    MODULE_NS,
    SELECT_GRAMMATICAL_ENTRIES,
    CLEAR_GRAMMATICAL_ENTRIES,
  } from '@scaife-viewer/store';

  import GrammaticalEntry from './GrammaticalEntry.vue';

  export default {
    scaifeConfig: {
      displayName: 'Grammatical Entries',
    },
    data() {
      return {
        entries: [],
        filteredEntries: [],
      };
    },
    components: {
      Attribution,
      LoaderBall,
      EmptyMessage,
      GrammaticalEntry,
    },
    methods: {
      onSelect(entry) {
        if (this.selectedEntries.filter(id => entry.id === id).length > 0) {
          this.$store.dispatch(`${MODULE_NS}/${CLEAR_GRAMMATICAL_ENTRIES}`);
        } else {
          this.$store.dispatch(`${MODULE_NS}/${SELECT_GRAMMATICAL_ENTRIES}`, {
            entries: [entry.id],
          });
        }
      },
    },
    watch: {
      entries: {
        immediate: true,
        handler(newValue) {
          this.filteredEntries = newValue;
        },
      },
    },
    computed: {
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      selectedEntries() {
        return this.$store.state[MODULE_NS].selectedGrammaticalEntries;
      },
      selectedToken() {
        return this.$store.state[MODULE_NS].selectedToken;
      },
      showShamsianAttribution() {
        // FIXME: Refactor to load attribution from the
        // GrammaticalEntryCollection metadata
        // FIXME: URN
        /* eslint-disable max-len */
        const didaktaUrn =
          'urn:cite2:beyond-tranlsation:grammatical_entry_collection.atlas_v1:didakta_shamsian';
        /* eslint-enable max-len */
        return (
          this.entries.length > 0 &&
          this.entries[0].collection.urn === didaktaUrn
        );
      },
    },
    apollo: {
      entries: {
        query: gql`
          query GrammaticalEntries($urn: String!) {
            grammaticalEntries(reference: $urn) {
              edges {
                node {
                  id
                  label
                  data
                  collection {
                    urn
                  }
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.urn.absolute };
        },
        update(data) {
          return data.grammaticalEntries.edges
            .map(e => e.node)
            .sort((a, b) => a.label.localeCompare(b.label));
        },
        skip() {
          return this.urn === null;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .grammatical-entries {
    margin: 0 2rem;
    font-size: 12px;
    width: calc(100% - 4rem);
  }
</style>
