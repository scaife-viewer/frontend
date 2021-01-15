<template>
  <div class="dictionary-entries" :key="urn.absolute">
    <LoaderBall v-if="$apollo.queries.entries.loading" />
    <EmptyMessage v-else-if="entries.length === 0" />
    <template v-else>
      <DictionaryEntry
        v-for="entry in entries"
        :key="entry.id"
        :entry="entry"
      />
    </template>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import { LoaderBall, EmptyMessage } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

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
    computed: {
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
    },
    apollo: {
      entries: {
        // TODO: Select dictionary
        query: gql`
          query DictionaryEntries($urn: String!) {
            dictionaryEntries(reference: $urn) {
              edges {
                node {
                  id
                  headword
                  urn
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
