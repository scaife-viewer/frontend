<template>
  <div class="dictionary-entries">
    <LoaderBall v-if="$apollo.queries.entries.loading" />
    <EmptyMessage v-else-if="entries.length === 0" />
    <template v-else>
      <Lookahead
        placeholder="Filter LGO entries"
        :reducer="lookaheadReducer"
        :data="entries"
        @filter-data="onFilter"
      />
      <div
        v-for="entry in filteredEntries"
        :key="entry.id"
        :title="entry.urn"
        class="dictionary-entry"
      >
        <div class="headword" @click.prevent="entrySelected(entry)">
          <span>
            {{ entry.headword }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  // TODO: Consider refactoring this component with portions
  // of NamedEntitiesWidget
  import gql from 'graphql-tag';
  import { LoaderBall, Lookahead, EmptyMessage } from '@scaife-viewer/common';
  import { MODULE_NS } from '@scaife-viewer/store';

  export default {
    scaifeConfig: {
      displayName: 'Dictionary Entries',
    },
    data() {
      return {
        entries: [],
        filteredEntries: [],
      };
    },
    components: {
      LoaderBall,
      Lookahead,
      EmptyMessage,
    },
    methods: {
      entrySelected(entry) {
        const query = {
          ...this.$route.query,
        };

        if (this.$route.query.entyrUrn === entry.urn) {
          delete query.entryUrn;
        } else {
          query.entryUrn = entry.urn;
        }
        this.$router.replace({ query });
      },
      onFilter(data) {
        this.filteredEntries = data;
      },
      lookaheadReducer(data, query) {
        return data.filter(entry =>
          entry.headword.toLowerCase().includes(query.toLowerCase()),
        );
      },
    },
    watch: {
      entries: {
        immediate: true,
        handler() {
          this.filteredEntries = this.entries;
        },
      },
    },
    computed: {
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
    },
    apollo: {
      entries: {
        // TODO: Pass the selected dictionary
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
          return { urn: `${this.passage}` };
        },
        update(data) {
          return data.dictionaryEntries.edges.map(e => e.node);
        },
        skip() {
          return this.passage === null;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dictionary-entry {
    margin: 0.375rem 0;
  }
  .headword {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: var(--sv-widget-dictionary-entries-headword-text-color, #343a40);
    cursor: pointer;
    &:hover {
      font-weight: 600;
    }
  }
</style>
