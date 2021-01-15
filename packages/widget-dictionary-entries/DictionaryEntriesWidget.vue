<template>
  <div class="dictionary-entries" :key="urn.absolute">
    <LoaderBall v-if="$apollo.queries.entries.loading" />
    <EmptyMessage v-else-if="entries.length === 0" />
    <template v-else>
      <DictionaryEntry
        v-for="entry in entries"
        :key="entry.id"
        :entry="entry"
        :selected-entries="selectedEntries"
        @select="onSelect"
      />
    </template>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { LoaderBall, EmptyMessage } from '@scaife-viewer/common';
  import {
    MODULE_NS,
    SELECT_DICTIONARY_ENTRIES,
    CLEAR_DICTIONARY_ENTRIES,
  } from '@scaife-viewer/store';

  import DictionaryEntry from './DictionaryEntry.vue';

  export default {
    scaifeConfig: {
      displayName: 'Dictionary Entries',
    },
    data() {
      return {
        entries: [],
      };
    },
    components: {
      LoaderBall,
      EmptyMessage,
      DictionaryEntry,
    },
    methods: {
      // TODO: Consider refactoring with NamedEntitiesWidget
      onSelect(entry) {
        if (this.selectedEntries.filter(id => entry.id === id).length > 0) {
          this.$store.dispatch(`${MODULE_NS}/${CLEAR_DICTIONARY_ENTRIES}`);
        } else {
          this.$store.dispatch(`${MODULE_NS}/${SELECT_DICTIONARY_ENTRIES}`, {
            entries: [entry.id],
          });
        }
      },
    },
    computed: {
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      selectedEntries() {
        return this.$store.state[MODULE_NS].selectedDictionaryEntries;
      },
    },
    apollo: {
      entries: {
        // TODO: Select dictionary
        // TODO: make data conditional on actually selected entries
        query: gql`
          query DictionaryEntries($urn: String!) {
            dictionaryEntries(reference: $urn) {
              edges {
                node {
                  id
                  headword
                  urn
                  data
                }
              }
            }
          }
        `,
        variables() {
          return { urn: this.urn.absolute };
        },
        update(data) {
          return data.dictionaryEntries.edges.map(e => e.node);
        },
        skip() {
          return this.urn === null;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dictionary-entries {
    margin: 0 2rem;
    font-size: 12px;
    width: calc(100% - 4rem);
  }
</style>
