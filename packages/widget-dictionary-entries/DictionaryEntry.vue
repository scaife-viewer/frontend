<template>
  <div :title="entry.urn" class="dictionary-entry" :class="{ selected }">
    <div class="headword" @click.prevent="$emit('select', entry)">
      <span>
        {{ entry.headword }}
      </span>
      <span v-if="selected">x</span>
    </div>
    <div class="dictionary-entry-body" v-if="selected">
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
</template>

<script>
  import gql from 'graphql-tag';

  import { MODULE_NS } from '@scaife-viewer/store';

  import Sense from './Sense.vue';

  export default {
    props: {
      entry: {
        type: Object,
        required: true,
      },
      selectedEntries: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        senses: [],
      };
    },
    components: {
      Sense,
    },
    computed: {
      urn() {
        return this.$store.getters[`${MODULE_NS}/urn`];
      },
      selected() {
        return (
          this.selectedEntries.filter(id => this.entry.id === id).length > 0
        );
      },
    },
    apollo: {
      senses: {
        // TODO: Denorm citations further (smaller payload)
        query: gql`
          query Senses($entryId: ID!, $urn: String!) {
            senses(entry: $entryId, reference: $urn) {
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
          return { entryId: this.entry.id, urn: this.urn.absolute };
        },
        update(data) {
          return data.senses.edges.map(e => e.node);
        },
        skip() {
          return !this.selected || this.entry === null;
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
    margin: 0.375rem 0;
  }
  .headword {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: var(--sv-widget-dictionary-entries-headword-text-color, #343a40);
    cursor: pointer;
    &:hover {
      font-weight: 600;
    }
  }
</style>
