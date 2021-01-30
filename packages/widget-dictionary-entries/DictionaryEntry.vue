<template>
  <div v-if="entry" class="dictionary-entry" :key="entry.id">
    <!-- TODO: breadcrumb beneath the dictionary name -->
    <div class="headword">
      <span>
        {{ entry.headword }}
      </span>
      <span class="clear-entry" @click.prevent="clearEntry">x</span>
    </div>

    <!-- TODO: Math to help with sticky "toggle" -->
    <!-- TODO: Float headword too? -->
    <Portal to="dictionary-entries-widget-controls">
      <div class="portal-content">
        <Controls />
      </div>
    </Portal>

    <div class="dictionary-entry-body" :key="entry.id">
      <!-- TODO: Use a tighter follow-on query here to reduce payload size -->
      <div
        class="dictionary-entry-content"
        v-if="entry.data.content"
        v-html="entry.data.content"
      />
      <LoaderBall v-if="$apollo.queries.senses.loading" />
      <Sense v-else v-for="sense in senses" :key="sense.id" :sense="sense" />
    </div>
  </div>
  <LoaderBall v-else-if="$apollo.queries.entries.loading" />
  <EmptyMessage v-else> No entry found for urn "{{ entryUrn }}"</EmptyMessage>
</template>

<script>
  import gql from 'graphql-tag';

  import { MODULE_NS } from '@scaife-viewer/store';
  import { LoaderBall, EmptyMessage } from '@scaife-viewer/common';
  import { Portal } from 'portal-vue';

  import Sense from './Sense.vue';
  import Controls from './Controls.vue';

  export default {
    props: {
      entryUrn: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        senses: [],
        entries: [],
      };
    },
    components: {
      EmptyMessage,
      LoaderBall,
      Sense,
      Portal,
      Controls,
    },
    methods: {
      clearEntry() {
        const query = {
          ...this.$route.query,
          entryUrn: undefined,
        };
        this.$router.replace({ query });
      },
    },
    computed: {
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      entry() {
        return this.entries.length ? this.entries[0] : null;
      },
    },
    apollo: {
      senses: {
        // TODO: Denorm citations further (smaller payload)
        // TODO: Filter for relevant senses
        query: gql`
          query Senses($entryId: ID!) {
            senses(entry: $entryId) {
              edges {
                node {
                  id
                  label
                  depth
                  definition
                  citations {
                    edges {
                      node {
                        id
                        ref
                        quote
                        passageUrn
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables() {
          // TODO: Allow the user to toggle the reference filter;
          // If the reference filter is applied, we probalby also need to show other senses
          return { entryId: this.entry.id };
        },
        update(data) {
          return data.senses.edges.map(e => e.node);
        },
        skip() {
          return !this.entry;
        },
      },
      entries: {
        // TODO: Select dictionary
        // TODO: make data conditional on actually selected entries
        query: gql`
          query DictionaryEntries($urn: String!) {
            dictionaryEntries(urn: $urn) {
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
          return { urn: this.entryUrn };
        },
        update(data) {
          return data.dictionaryEntries.edges.map(e => e.node);
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
  .dictionary-entry.selected {
    background: var(
      --sv-widget-dictionary-entries-selected-background-color,
      #f8f9fa
    );
    margin-left: -10px;
    padding: 3px 7px;
    border-left: 3px solid
      var(--sv-widget-dictionary-entries-selected-border-color, #343a40);
    .dictionary-entry-content {
      color: var(
        --sv-widget-dictionary-entries-selected-content-text-color,
        #495057
      );
    }
  }
  .dictionary-entry {
    // TODO: refactor
    margin: 0.375rem 0;
  }
  // TODO: refactor
  .headword {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: var(--sv-widget-dictionary-entries-headword-text-color, #343a40);
    font-weight: 600;
    .clear-entry {
      cursor: pointer;
    }
  }
</style>
