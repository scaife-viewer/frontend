<template>
  <div class="dictionary-entry-container">
    <div v-if="entry" class="dictionary-entry" :key="entry.id">
      <Portal to="dictionary-entries-widget-controls">
        <div class="portal-content">
          <Controls :headword="entry.headword" @clear="clearEntry" />
        </div>
      </Portal>

      <div class="dictionary-entry-body" :key="entry.id">
        <!-- TODO: Use a tighter follow-on query here to reduce payload size -->
        <div
          class="dictionary-entry-content"
          v-if="entry.data.content"
          v-html="entry.data.content"
        />
        <div class="senses">
          <LoaderBall v-if="$apollo.queries.senses.loading" />
          <div class="sense-list" v-else>
            <div
              class="sense-list-item"
              v-for="treeNode in entry.senseTree"
              :key="treeNode.id"
            >
              <!-- FIXME: Determine why we needed senseForNode for
              Cunliffe but not LGO -->
              <Sense
                v-if="senses.length > 0 && senseForNode(senses, treeNode)"
                :treeNode="treeNode"
                :senses="senses"
                :sense="senseForNode(senses, treeNode)"
                :filteredSenses="filteredSenses"
              />
            </div>
          </div>
        </div>
        <template v-if="selectDictionaries">
          <div class="dictionary-label-divider" />
          <CustomSelect
            v-if="siblingEntryValues.length > 0"
            class="sibling-entry-select"
            v-model="selectedEntryValue"
            :options="siblingEntryValues"
            placeholder="Select an alignment..."
          />
          <Attribution v-else>
            {{ entry.dictionary.label }}
          </Attribution>
        </template>
      </div>
    </div>
    <LoaderBall v-else-if="$apollo.queries.entries.loading" />
    <template v-else>
      <EmptyMessage>
        No entry found for urn
        <span class="missing-urn" :title="entryUrn">"{{ entryUrn }}"</span>
      </EmptyMessage>
      <a class="show-all-entries" href="#" @click.prevent="clearEntry">
        Show all entries
      </a>
    </template>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  import {
    MODULE_NS,
    SET_SENSE_EXPANSION,
    SENSE_EXPANSION_PASSAGE,
    SENSE_EXPANSION_EXPANDED,
    SENSE_EXPANSION_COLLAPSED,
    SENSE_EXPANSION_MANUAL,
  } from '@scaife-viewer/store';
  import {
    Attribution,
    CustomSelect,
    LoaderBall,
    EmptyMessage,
  } from '@scaife-viewer/common';
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
        passageSenseUrns: [],
        filteredSenses: [],
        selectedEntryValue: null,
      };
    },
    watch: {
      entry() {
        this.selectedEntryValue = {
          title: this.dictionarySelectionTitle(this.entry),
          value: this.entry.urn,
        };
      },
      selectedEntryValue(value) {
        const newUrn = value.value;
        if (newUrn !== this.entry.urn) {
          this.changeEntry(newUrn);
        }
      },
      urn() {
        this.$store.dispatch(`${MODULE_NS}/${SET_SENSE_EXPANSION}`, {
          value: SENSE_EXPANSION_PASSAGE,
        });
      },
      senseExpansion() {
        this.updateSenses();
      },
      senses() {
        this.updateSenses();
      },
      passageSenseUrns: {
        immediate: false,
        handler() {
          if (this.expandPassageSenses) {
            this.updateSenses();
          }
        },
      },
    },
    components: {
      Attribution,
      EmptyMessage,
      LoaderBall,
      Sense,
      Portal,
      Controls,
      CustomSelect,
    },
    methods: {
      clearEntry() {
        return this.changeEntry(undefined);
      },
      changeEntry(entryUrn) {
        const query = {
          ...this.$route.query,
          entryUrn,
        };
        this.$router.replace({ query });
      },
      updateSenses() {
        const value = this.senseExpansion;
        const passageHasSenses = this.passageSenseUrns.length > 0;
        if (this.expandPassageSenses && passageHasSenses) {
          this.filteredSenses = this.senses.filter(
            sense => this.passageSenseUrns.indexOf(sense.urn) > -1,
          );
        } else if (value === SENSE_EXPANSION_EXPANDED) {
          this.filteredSenses = this.senses;
        } else if (value === SENSE_EXPANSION_COLLAPSED) {
          this.filteredSenses = [];
        } else if (value === SENSE_EXPANSION_MANUAL) {
          // NOTE: this is a no-op
        }
      },
      senseForNode(senses, node) {
        const matches = senses.filter(sense => sense.urn === node.id);
        return matches.length > -1 ? matches[0] : null;
      },
      dictionarySelectionTitle(entry) {
        return `${entry.headword} :: ${entry.dictionary.label}`;
      },
    },
    computed: {
      passage() {
        return this.$store.getters[`${MODULE_NS}/passage`];
      },
      entry() {
        return this.entries.length ? this.entries[0] : null;
      },
      senseExpansion() {
        return this.$store.state[`${MODULE_NS}`].senseExpansion;
      },
      expandPassageSenses() {
        return this.senseExpansion === SENSE_EXPANSION_PASSAGE;
      },
      siblingEntryValues() {
        if (!this.siblings) {
          return [];
        }
        return this.siblings
          .filter(sibling => sibling.urn !== this.entryUrn)
          .map(sibling => {
            const title = this.dictionarySelectionTitle(sibling);
            return { title, value: sibling.urn };
          });
      },
      selectDictionaries() {
        const fallback = true;
        const config = this.$scaife.config.dictionaryEntries;
        return config ? config.selectDictionaries : fallback;
      }
    },
    apollo: {
      // NOTE: this query gets all possible senses and everything needed
      // to display them; we could be "pickier" about its contents and nested
      // citation queries.
      // NOTE: Also, consider a `tree` struct to override the nested indentation
      // in Sense.veu
      senses: {
        // TODO: Denorm citations further (smaller payload)
        // TODO: Filter for relevant senses
        query: gql`
          query Senses($entryId: ID!) {
            senses(entry: $entryId) {
              edges {
                node {
                  id
                  urn
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
          return {
            entryId: this.entry.id,
          };
        },
        update(data) {
          return data.senses.edges.map(e => e.node);
        },
        skip() {
          return !this.entry;
        },
      },
      passageSenseUrns: {
        // TODO: Denorm citations further (smaller payload)
        // TODO: Filter for relevant senses
        query: gql`
          query Senses($entryId: ID!, $passageUrn: String!) {
            senses(entry: $entryId, reference: $passageUrn) {
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
          return {
            entryId: this.entry.id,
            passageUrn: `${this.passage}`,
          };
        },
        update(data) {
          return data.senses.edges.map(e => e.node.urn);
        },
        skip() {
          return !this.entry || this.senses.length === 0;
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
                  senseTree
                  data
                  dictionary {
                    id
                    label
                  }
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
      siblings: {
        // NOTE: This query uses the normalized lemma (to mirror)
        // resolveUsingLemmas on the `DictionaryEntries` component.
        // Logeion in particular seems to have more "healing";
        // for our purposes, we're just looking at the normalized version
        // (not excluding marks)
        query: gql`
          query Siblings($lemma: String!) {
            dictionaryEntries(lemma: $lemma, normalizeLemmas: false) {
              edges {
                node {
                  id
                  urn
                  headword
                  dictionary {
                    id
                    label
                  }
                }
              }
            }
          }
        `,
        // TODO: Lemmas not populated
        variables() {
          return { lemma: this.entry.headword.normalize('NFKC') };
        },
        update(data) {
          return data.dictionaryEntries.edges.map(e => e.node);
        },
        skip() {
          return !this.entry;
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
    margin: 0.375em 0;
    font-family: var(--sv-widget-dictionary-entries-font-family, 'Noto Serif');
  }
  // FIXME: Document BI change for LGO
  .dictionary-entry-body {
    font-size: var(--sv-widget-dictionary-entries-font-size, 14px);
  }
  .senses {
    font-size: 12px;
  }
  .empty-message {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  a.show-all-entries {
    font-size: var(--sv-empty-message-font-size, 14px);
  }
  .sibling-entry-select {
    font-size: 12px;
  }
  .dictionary-label-divider {
    margin-top: 0.5em;
    border-top: 1px solid #868e96;
  }
  // FIXME: Centralize styles
  // (possibly with a style include and scoped selectors)
  ::v-deep .depth-1 {
    margin-left: 0.3em;
  }
  ::v-deep .depth-2 {
    margin-left: 0.6em;
  }
  ::v-deep .depth-3 {
    margin-left: 0.9em;
  }
  ::v-deep .depth-4 {
    margin-left: 1.2em;
  }
  ::v-deep .depth-5 {
    margin-left: 1.5em;
  }
  ::v-deep .depth-6 {
    margin-left: 1.8em;
  }
  ::v-deep .depth-7 {
    margin-left: 2.1em;
  }
</style>
